import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

export const handleMulterError = (e: unknown, req: Request, res: Response, next: NextFunction) => {
  if (e instanceof multer.MulterError) {
    if (e.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Only one avatar file is allowed.' });
    }
    return res.status(400).json({ error: e.message });
  } else if (e) {
    console.error('Unexpected file upload error:', e);
    return res.status(500).json({ error: 'An unexpected error occurred during file upload.' });
  }
  next();
};
