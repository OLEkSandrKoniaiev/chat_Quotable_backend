import mongoose from 'mongoose';
import { MessageModel, IMessageDocument } from './message.model';
import { IMessageCreateDTO, IMessageUpdateDTO } from './message.interfaces';
import {
  IPaginationOptions,
  IPaginatedResult,
} from '../../common/interfaces/pagination.interfaces';

export class MessageRepository {
  static async findByChatId(
    chatId: string,
    options: IPaginationOptions,
  ): Promise<IPaginatedResult<IMessageDocument>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      throw new Error('Invalid Chat ID');
    }

    const query = { chatId: chatId };

    const [messages, totalDocs] = await Promise.all([
      MessageModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      MessageModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalDocs / limit);

    return {
      data: messages,
      totalDocs: totalDocs,
      totalPages: totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  static async findById(id: string): Promise<IMessageDocument | null> {
    return MessageModel.findById(id);
  }

  static async create(chatId: string, dto: IMessageCreateDTO): Promise<IMessageDocument> {
    const newMessage = new MessageModel({
      ...dto,
      chatId: chatId,
    });

    return await newMessage.save();
  }

  static async updateById(id: string, dto: IMessageUpdateDTO): Promise<IMessageDocument | null> {
    return MessageModel.findByIdAndUpdate(id, dto, { new: true });
  }

  static async deleteById(id: string): Promise<boolean> {
    const result = await MessageModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}
