import express from 'express';
import multer from 'multer';

import { userController } from './user.controller';
import { handleMulterError } from '../../common/middlewares/multer.middleware';
import { handleAvatarUpload } from '../../common/middlewares/fileUpload.middleware';
import { protect } from '../../common/middlewares/auth.middleware';
import { validateRequest } from '../../common/middlewares/validateRequest.middleware';
import { createUserSchema, loginUserSchema, updateUserSchema } from './user.validation';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post(
  '/register',
  upload.single('avatarUrl'),
  handleMulterError,
  handleAvatarUpload,
  validateRequest(createUserSchema),
  userController.create,
);
router.post('/login', validateRequest(loginUserSchema), userController.login);
router.get('/', protect, userController.getAll);
router.get('/:id', protect, userController.getById);
router.put(
  '/:id',
  protect,
  upload.single('avatarUrl'),
  handleMulterError,
  handleAvatarUpload,
  validateRequest(updateUserSchema),
  userController.update,
);

export default router;
