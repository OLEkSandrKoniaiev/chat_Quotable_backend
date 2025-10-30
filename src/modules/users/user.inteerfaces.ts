export interface IUser {
  email: string;

  // profile part
  firstName: string;
  lastName: string;
  avatarUrl?: string;

  // auth
  password: string;
  googleId: string;
}

export interface IUserCreateDTO {
  email: string;
  firstName: string;
  lastName?: string;
  avatarUrl?: string;
  password: string;
}

export interface IUserCreateOAuthDTO {
  email: string;
  firstName: string;
  lastName?: string;
  avatarUrl?: string;
  googleId: string;
}

export interface IUserUpdateDTO {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}
