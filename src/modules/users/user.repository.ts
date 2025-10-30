import { IUserDocument, UserModel } from './user.model';
import { IUserCreateDTO, IUserCreateOAuthDTO, IUserUpdateDTO } from './user.inteerfaces';
import {
  IPaginatedResult,
  IPaginationOptions,
} from '../../common/interfaces/pagination.interfaces';

class UserRepository {
  async create(dto: IUserCreateDTO): Promise<IUserDocument> {
    const newUser = new UserModel({
      ...dto,
    });
    return await newUser.save();
  }

  async createOAuth(dto: IUserCreateOAuthDTO): Promise<IUserDocument> {
    const newUser = new UserModel({
      ...dto,
    });
    return await newUser.save();
  }

  async findAll(options: IPaginationOptions): Promise<IPaginatedResult<IUserDocument>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [users, totalDocs] = await Promise.all([
      UserModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      UserModel.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalDocs / limit);

    return {
      data: users,
      totalDocs: totalDocs,
      totalPages: totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  async search(query: string): Promise<IUserDocument[]> {
    const searchRegex = new RegExp(query, 'i'); // 'i' - insensitive case

    return UserModel.find({
      $or: [{ firstName: { $regex: searchRegex } }, { lastName: { $regex: searchRegex } }],
    }).sort({ firstName: 1, lastName: 1 });
  }

  async findById(id: string): Promise<IUserDocument | null> {
    return UserModel.findById(id);
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ email });
  }

  async findByEmailWithPassword(email: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ email }).select('+password');
  }

  async findByGoogleId(googleId: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ googleId });
  }

  async updateById(id: string, dto: IUserUpdateDTO): Promise<IUserDocument | null> {
    return UserModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async deleteAvatar(id: string): Promise<IUserDocument | null> {
    return UserModel.findByIdAndUpdate(id, { $unset: { avatarUrl: 1 } }, { new: true });
  }

  async deleteById(id: string): Promise<IUserDocument | null> {
    return UserModel.findByIdAndDelete(id);
  }
}

export const userRepository = new UserRepository();
