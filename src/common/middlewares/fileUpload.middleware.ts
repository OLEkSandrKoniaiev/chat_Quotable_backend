import { Request, Response, NextFunction } from 'express';
import { FileService } from '../services/file.service';

export const handleAvatarUpload = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }
  try {
    const avatarUrl = await FileService.saveAvatarCloudinary(req.file);
    req.body.avatarUrl = avatarUrl;
    next();
  } catch (error) {
    next(error);
  }
};
