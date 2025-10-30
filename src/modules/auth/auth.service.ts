import jwt from 'jsonwebtoken';
import { dotenvConfig } from '../../config/dotenv.config';

export class AuthService {
  static generateToken(userId: string): string {
    const payload = {
      sub: userId,
    };

    const secret = dotenvConfig.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in .env file');
    }

    return jwt.sign(payload, secret, {
      expiresIn: dotenvConfig.JWT_EXPIRES_IN! as `${number}h`,
    });
  }
}
