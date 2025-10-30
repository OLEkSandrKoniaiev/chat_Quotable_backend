// import { IUserDocument } from '../../../modules/users/user.model';
import { IUser } from '../../../modules/users/user.inteerfaces';

declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
    }
  }
}

export {};
