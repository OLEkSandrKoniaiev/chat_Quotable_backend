import { Request, Response } from 'express';
import { ChatRepository } from './chat.repository';
import { IChatCreateDTO, IChatUpdateDTO } from './chat.interfaces';
import { FileService } from '../../common/services/file.service';

export class ChatController {
  static async create(req: Request, res: Response) {
    try {
      const dto = req.body as IChatCreateDTO;

      const newChat = await ChatRepository.create(dto);

      return res.status(201).json(newChat);
    } catch (e: unknown) {
      console.error('Error in ChatController.create:', e);
      return res.status(500).json({ error: 'Something went wrong.' });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const { q } = req.query;
      let chats;

      if (q && typeof q === 'string') {
        chats = await ChatRepository.search(q);
      } else {
        chats = await ChatRepository.findAll();
      }

      return res.status(200).json(chats);
    } catch (e: unknown) {
      console.error('Error in ChatController.getAll:', e);
      return res.status(500).json({ error: 'Something went wrong.' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const chat = await ChatRepository.findById(id);

      if (!chat) {
        return res.status(404).json({ error: 'Chat not found.' });
      }

      return res.status(200).json(chat);
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid Chat ID format.' });
      }
      console.error('Error in ChatController.getById:', e);
      return res.status(500).json({ error: 'Something went wrong.' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dto = req.body as IChatUpdateDTO;

      const chatBeforeUpdate = await ChatRepository.findById(id);
      if (!chatBeforeUpdate) {
        return res.status(404).json({ error: 'Chat not found.' });
      }
      const oldAvatarUrl = chatBeforeUpdate.avatarUrl;

      const updatedChat = await ChatRepository.updateById(id, dto);
      if (!updatedChat) {
        return res.status(404).json({ error: 'Chat not found after update.' });
      }

      if (dto.avatarUrl && oldAvatarUrl) {
        FileService.deleteAvatarCloudinary(oldAvatarUrl).catch((err) => {
          console.error('Failed to delete old avatar:', err);
        });
      }

      return res.status(200).json(updatedChat);
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid Chat ID format.' });
      }
      console.error('Error in ChatController.update:', e);
      return res.status(500).json({ error: 'Something went wrong.' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = await ChatRepository.deleteById(id);

      if (!success) {
        return res.status(404).json({ error: 'Chat not found.' });
      }

      return res.status(204).send();
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid Chat ID format.' });
      }
      console.error('Error in ChatController.delete:', e);
      return res.status(500).json({ error: 'Something went wrong.' });
    }
  }
}
