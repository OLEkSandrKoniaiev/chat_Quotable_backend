import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { dotenvConfig } from './dotenv.config';
import { userRepository } from '../modules/users/user.repository';
import { IUserDocument } from '../modules/users/user.model';
import { createPredefinedChats } from '../common/utils/chat.utils';

const googleStrategy = new GoogleStrategy(
  {
    clientID: dotenvConfig.GOOGLE_CLIENT_ID,
    clientSecret: dotenvConfig.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    proxy: true,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error('Email not found in Google profile'), false);
      }

      let user = await userRepository.findByGoogleId(profile.id);

      if (!user) {
        user = await userRepository.findByEmail(email);

        if (user) {
          user.googleId = profile.id;
          user.avatarUrl = user.avatarUrl || profile.photos?.[0]?.value;
          await user.save();
        }
      }

      if (!user) {
        user = await userRepository.createOAuth({
          googleId: profile.id,
          email: email,
          firstName: profile.name?.givenName || 'User',
          lastName: profile.name?.familyName,
          avatarUrl: profile.photos?.[0]?.value,
        });

        createPredefinedChats(user._id as string);
      }

      done(null, user);
    } catch (e) {
      done(e, false);
    }
  },
);

passport.use('google', googleStrategy);

passport.serializeUser((user, done) => {
  done(null, (user as IUserDocument).id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await userRepository.findById(id);
    done(null, user);
  } catch (e) {
    done(e, null);
  }
});

export { passport };
