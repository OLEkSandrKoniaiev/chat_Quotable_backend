import { Request, Response } from 'express';
import { chatRepository } from './chat.repository';
import { IChatCreateDTO, IChatUpdateDTO } from './chat.interfaces';
import { FileService } from '../../common/services/file.service';

class ChatController {
  async create(req: Request, res: Response) {
    try {
      const userId = req._user!._id as string;
      const dto = req.body as IChatCreateDTO;

      const newChat = await chatRepository.create(userId, dto);

      return res.status(201).json(newChat);
    } catch (e: unknown) {
      console.error('Error in ChatController.create:', e);
      return res.status(500).json({ error: 'Something went wrong.' });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const userId = req._user!._id as string;
      const { q } = req.query;
      let chats;

      if (q && typeof q === 'string') {
        chats = await chatRepository.search(userId, q);
      } else {
        chats = await chatRepository.findAll(userId);
      }

      return res.status(200).json(chats);
    } catch (e: unknown) {
      console.error('Error in ChatController.getAll:', e);
      return res.status(500).json({ error: 'Something went wrong.' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const userId = req._user!._id as string;
      const { id: chatId } = req.params;

      const chat = await chatRepository.findById(userId, chatId);

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

  async update(req: Request, res: Response) {
    try {
      const userId = req._user!._id as string;
      const { id: chatId } = req.params;
      const dto = req.body as IChatUpdateDTO;

      const chatBeforeUpdate = await chatRepository.findById(userId, chatId);
      if (!chatBeforeUpdate) {
        return res.status(404).json({ error: 'Chat not found.' });
      }
      const oldAvatarUrl = chatBeforeUpdate.avatarUrl;

      const updatedChat = await chatRepository.updateById(userId, chatId, dto);
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

  async delete(req: Request, res: Response) {
    try {
      const userId = req._user!._id as string;
      const { id: chatId } = req.params;

      const success = await chatRepository.deleteById(userId, chatId);

      if (!success) {
        return res.status(404).json({ error: 'Chat not found.' });
      }

      return res.status(204).send(); // 204 No Content
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid Chat ID format.' });
      }
      console.error('Error in ChatController.delete:', e);
      return res.status(500).json({ error: 'Something went wrong.' });
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      const userId = req._user!._id as string;
      const { id: chatId } = req.params;

      const success = await chatRepository.resetUnread(userId, chatId);

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

export const chatController = new ChatController();
