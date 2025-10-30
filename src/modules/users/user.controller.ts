import { Request, Response } from 'express';
import { userRepository } from './user.repository';
import { IUserCreateDTO, IUserUpdateDTO } from './user.inteerfaces';
import { AuthService } from '../auth/auth.service';
import { FileService } from '../../common/services/file.service';

class UserController {
  /**
   * POST /api/users/register
   */
  async create(req: Request, res: Response) {
    try {
      const dto = req.body as IUserCreateDTO;

      const user = await userRepository.findByEmail(dto.email);
      if (user) {
        return res.status(409).json({ error: 'Email already in use.' }); // 409 - Conflict
      }

      const newUser = await userRepository.create(dto);
      const accessToken = AuthService.generateToken(newUser._id as string);

      return res.status(201).json({ user: newUser, accessToken: accessToken });
    } catch (e: unknown) {
      console.error('Error in UserController.create:', e);
      return res.status(500).json({ error: 'Something went wrong.' });
    }
  }

  /**
   * POST /api/users/login
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const user = await userRepository.findByEmailWithPassword(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials.' }); // 401 Unauthorized
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      const accessToken = AuthService.generateToken(user._id as string);

      // `toJSON` hook on the UserSchema model will automatically remove the password
      return res.status(200).json({ user: user, accessToken: accessToken });
    } catch (e: unknown) {
      console.error('Error in UserController.login:', e);
      return res.status(500).json({ error: 'Something went wrong.' });
    }
  }

  /**
   * GET /api/users
   */
  async getAll(req: Request, res: Response) {
    try {
      const { q } = req.query;

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 30;

      let users;

      if (q && typeof q === 'string') {
        users = await userRepository.search(q);
      } else {
        users = await userRepository.findAll({ page, limit });
      }

      return res.status(200).json(users);
    } catch (e: unknown) {
      console.error('Error in UserController.getAll:', e);
      return res.status(500).json({ error: 'Something went wrong.' });
    }
  }

  /**
   * GET /api/users/:userId
   */
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userRepository.findById(id);

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      return res.status(200).json(user);
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid User ID format.' });
      }
      console.error('Error in UserController.getById:', e);
      return res.status(500).json({ error: 'Something went wrong.' });
    }
  }

  /**
   * PUT /api/users/:userId
   */
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dto = req.body as IUserUpdateDTO;

      const userBeforeUpdate = await userRepository.findById(id);
      if (!userBeforeUpdate) {
        return res.status(404).json({ error: 'User not found.' });
      }
      const oldAvatarUrl = userBeforeUpdate.avatarUrl;

      const updatedUser = await userRepository.updateById(id, dto);
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found after update.' });
      }

      if (dto.avatarUrl && oldAvatarUrl) {
        FileService.deleteAvatarCloudinary(oldAvatarUrl).catch((err) => {
          console.error('Failed to delete old avatar:', err);
        });
      }

      return res.status(200).json(updatedUser);
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid User ID format.' });
      }
      console.error('Error in UserController.update:', e);
      return res.status(500).json({ error: 'Something went wrong.' });
    }
  }
}

export const userController = new UserController();
