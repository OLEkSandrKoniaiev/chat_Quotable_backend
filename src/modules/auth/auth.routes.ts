import { Router } from 'express';
import { passport } from '../../config/passport.config';
import { AuthController } from './auth.controller';

const router = Router();

router.get('/google', AuthController.googleLogin);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  AuthController.googleCallback,
);

export default router;
