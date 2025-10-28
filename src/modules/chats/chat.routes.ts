import express from 'express';
import { ChatController } from './chat.controller';
import { MessageController } from '../messages/message.controller';

const router = express.Router();

router.get('/', ChatController.getAll);
router.post('/', ChatController.create);
router.get('/:id', ChatController.getById);
router.put('/:id', ChatController.update);
router.delete('/:id', ChatController.delete);

router.get('/:chatId/messages', MessageController.getAllByChatId);
router.post('/:chatId/messages', MessageController.create);

export default router;
