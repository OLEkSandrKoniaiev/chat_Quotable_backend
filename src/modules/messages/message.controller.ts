import { Request, Response } from 'express';

import { messageRepository } from './message.repository';
import { IMessageCreateDTO, IMessageUpdateDTO } from './message.interfaces';
import { quotableService } from '../../common/services/quotable.service';

class MessageController {
  /**
   * GET /api/chats/:chatId/messages?page=1&limit=30
   */
  async getAllByChatId(req: Request, res: Response) {
    try {
      const { chatId } = req.params;

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 30;

      const paginatedMessages = await messageRepository.findByChatId(chatId, {
        page,
        limit,
      });

      return res.status(200).json(paginatedMessages);
    } catch (e: unknown) {
      if (e instanceof Error && e.message === 'Invalid Chat ID') {
        return res.status(400).json({ error: e.message });
      }
      console.error('Error in MessageController.getAllByChatId:', e);
      return res.status(500).json({ error: 'Something went wrong.' });
    }
  }

  /**
   * POST /api/chats/:chatId/messages
   */
  async create(req: Request, res: Response) {
    try {
      const { chatId } = req.params;

      const { sender, content } = req.body as IMessageCreateDTO;

      const newMessage = await messageRepository.create(chatId, {
        sender,
        content,
      });

      quotableService.generateBotResponse(chatId);

      // TODO: Тут потрібно асинхронно оновити Chat.lastMessage
      // та запустити 3-секундний таймер для відповіді бота.

      return res.status(201).json(newMessage);
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid Chat ID format.' });
      }
      console.error('Error in MessageController.create:', e);
      return res.status(500).json({ error: 'Something went wrong.' });
    }
  }

  /**
   * GET /api/messages/:id
   */
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const message = await messageRepository.findById(id);

      if (!message) {
        return res.status(404).json({ error: 'Message not found.' });
      }

      return res.status(200).json(message);
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid Message ID format.' });
      }
      console.error('Error in MessageController.getById:', e);
      return res.status(500).json({ error: 'Something went wrong.' });
    }
  }

  /**
   * PUT /api/messages/:id
   */
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dto = req.body as IMessageUpdateDTO;

      const updatedMessage = await messageRepository.updateById(id, dto);

      if (!updatedMessage) {
        return res.status(404).json({ error: 'Message not found.' });
      }

      return res.status(200).json(updatedMessage);
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid Message ID format.' });
      }
      console.error('Error in MessageController.update:', e);
      return res.status(500).json({ error: 'Something went wrong.' });
    }
  }

  /**
   * DELETE /api/messages/:id
   */
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = await messageRepository.deleteById(id);

      if (!success) {
        return res.status(404).json({ error: 'Message not found.' });
      }

      return res.status(204).send();
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid Message ID format.' });
      }
      console.error('Error in MessageController.delete:', e);
      return res.status(500).json({ error: 'Something went wrong.' });
    }
  }
}

export const messageController = new MessageController();
