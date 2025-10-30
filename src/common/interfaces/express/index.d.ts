import { IUserDocument } from '../../../modules/users/user.model';

declare global {
  namespace Express {
    export interface Request {
      _user?: IUserDocument;
    }
  }
}

export {};
