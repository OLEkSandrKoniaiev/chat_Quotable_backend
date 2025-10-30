import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../modules/users/user.model';
import { dotenvConfig } from '../../config/dotenv.config';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, dotenvConfig.JWT_SECRET) as { sub: string };

    const user = await UserModel.findById(decoded.sub).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'Not authorized, user not found' });
    }

    req.user = user;

    next();
  } catch (e) {
    console.error('Unexpected auth middleware error:', e);
    return res.status(401).json({ error: 'Not authorized, token failed' });
  }
};
