import express from 'express';
import { MessageController } from './message.controller';

const router = express.Router();

router.get('/:id', MessageController.getById);
router.put('/:id', MessageController.update);
router.delete('/:id', MessageController.delete);

export default router;
