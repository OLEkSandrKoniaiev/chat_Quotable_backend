import passport from 'passport';
import { Request, Response } from 'express';
import { IUserDocument } from '../users/user.model';
import { AuthService } from './auth.service';
import { dotenvConfig } from '../../config/dotenv.config';

export class AuthController {
  static googleLogin = passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  });

  static googleCallback(req: Request, res: Response) {
    const user = req.user as IUserDocument;

    const token = AuthService.generateToken(user._id as string);

    const frontendUrl = dotenvConfig.FRONTEND_URL || 'http://localhost:4173';

    res.redirect(`${frontendUrl}/auth/success?token=${token}`);
  }
}
