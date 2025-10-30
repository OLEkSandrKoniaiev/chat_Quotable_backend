import { ChatModel, IChatDocument } from './chat.model';
import { IChatCreateDTO, IChatUpdateDTO } from './chat.interfaces';

class ChatRepository {
  async findAll(userId: string): Promise<IChatDocument[]> {
    return ChatModel.find({ userId: userId }).sort({ lastMessageTimestamp: -1 });
  }

  async search(userId: string, query: string): Promise<IChatDocument[]> {
    const searchRegex = new RegExp(query, 'i'); // 'i' - insensitive case

    return ChatModel.find({
      userId: userId,
      $or: [{ firstName: { $regex: searchRegex } }, { lastName: { $regex: searchRegex } }],
    }).sort({ lastMessageTimestamp: -1 });
  }

  async findById(userId: string, id: string): Promise<IChatDocument | null> {
    return ChatModel.findOne({ _id: id, userId: userId });
  }

  async create(userId: string, dto: IChatCreateDTO): Promise<IChatDocument> {
    const newChat = new ChatModel({
      ...dto,
      userId: userId,
    });
    return await newChat.save();
  }

  async updateById(userId: string, id: string, dto: IChatUpdateDTO): Promise<IChatDocument | null> {
    return ChatModel.findOneAndUpdate({ _id: id, userId: userId }, dto, { new: true });
  }

  async deleteById(userId: string, id: string): Promise<boolean> {
    // ChatSchema has a Mongoose middleware that deletes all messages before deleting the chat
    const result = await ChatModel.deleteOne({ _id: id, userId: userId });
    return result.deletedCount > 0;
  }

  // --- Special methods for specific logic ---

  async updateLastMessage(
    userId: string,
    id: string,
    messageContent: string,
    timestamp: Date,
  ): Promise<boolean> {
    const result = await ChatModel.updateOne(
      { _id: id, userId: userId },
      {
        $set: {
          lastMessage: messageContent,
          lastMessageTimestamp: timestamp,
        },
      },
    );
    return result.modifiedCount > 0;
  }

  async incrementUnread(userId: string, id: string): Promise<boolean> {
    const result = await ChatModel.updateOne(
      { _id: id, userId: userId },
      { $inc: { unreadCount: 1 } },
    );
    return result.modifiedCount > 0;
  }

  async resetUnread(userId: string, id: string): Promise<boolean> {
    const result = await ChatModel.updateOne(
      { _id: id, userId: userId },
      { $set: { unreadCount: 0 } },
    );
    return result.modifiedCount > 0;
  }
}

export const chatRepository = new ChatRepository();
