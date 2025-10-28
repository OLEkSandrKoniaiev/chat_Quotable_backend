export interface IUser {
  email: string;

  // profile part
  firstName: string;
  lastName: string;
  avatarUrl: string;

  // auth
  password: string;
  googleId: string;
}
