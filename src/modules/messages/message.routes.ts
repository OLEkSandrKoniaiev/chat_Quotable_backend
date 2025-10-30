import express from 'express';

import { messageController } from './message.controller';
import { protect } from '../../common/middlewares/auth.middleware';

const router = express.Router();

router.get('/:id', protect, messageController.getById);
router.put('/:id', protect, messageController.update);
router.delete('/:id', protect, messageController.delete);

export default router;
