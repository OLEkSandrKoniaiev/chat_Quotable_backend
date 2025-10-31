import express from 'express';

import { messageController } from './message.controller';
import { protect } from '../../common/middlewares/auth.middleware';
import { validateRequest } from '../../common/middlewares/validateRequest.middleware';
import { updateMessageSchema } from './messages.validation';

const router = express.Router();

router.get('/:id', protect, messageController.getById);
router.put('/:id', protect, validateRequest(updateMessageSchema), messageController.update);
router.delete('/:id', protect, messageController.delete);

export default router;
