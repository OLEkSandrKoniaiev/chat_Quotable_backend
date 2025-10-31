import express from 'express';
import multer from 'multer';

import { chatController } from './chat.controller';
import { messageController } from '../messages/message.controller';
import { handleMulterError } from '../../common/middlewares/multer.middleware';
import { handleAvatarUpload } from '../../common/middlewares/fileUpload.middleware';
import { protect } from '../../common/middlewares/auth.middleware';
import { validateRequest } from '../../common/middlewares/validateRequest.middleware';
import { createChatSchema, updateChatSchema } from './chat.validation';
import { createMessageSchema } from '../messages/messages.validation';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get('/', protect, chatController.getAll);
router.post(
  '/',
  protect,
  upload.single('avatarUrl'),
  handleMulterError,
  handleAvatarUpload,
  validateRequest(createChatSchema),
  chatController.create,
);
router.get('/:id', protect, chatController.getById);
router.put(
  '/:id',
  protect,
  upload.single('avatarUrl'),
  handleMulterError,
  handleAvatarUpload,
  validateRequest(updateChatSchema),
  chatController.update,
);
router.patch('/:id/read', protect, chatController.markAsRead);
router.delete('/:id', protect, chatController.delete);

router.get('/:chatId/messages', protect, messageController.getAllByChatId);
router.post(
  '/:chatId/messages',
  protect,
  validateRequest(createMessageSchema),
  messageController.create,
);

export default router;
