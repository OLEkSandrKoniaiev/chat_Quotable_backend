import { ChatModel, IChatDocument } from './chat.model';
import { IChatCreateDTO, IChatUpdateDTO } from './chat.interfaces';

class ChatRepository {
  async findAll(): Promise<IChatDocument[]> {
    return ChatModel.find().sort({ lastMessageTimestamp: -1 });
  }

  async search(query: string): Promise<IChatDocument[]> {
    const searchRegex = new RegExp(query, 'i'); // 'i' - insensitive case

    return ChatModel.find({
      $or: [{ firstName: { $regex: searchRegex } }, { lastName: { $regex: searchRegex } }],
    }).sort({ lastMessageTimestamp: -1 });
  }

  async findById(id: string): Promise<IChatDocument | null> {
    return ChatModel.findById(id);
  }

  async create(dto: IChatCreateDTO): Promise<IChatDocument> {
    const newChat = new ChatModel(dto);
    return await newChat.save();
  }

  async updateById(id: string, dto: IChatUpdateDTO): Promise<IChatDocument | null> {
    return ChatModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async deleteById(id: string): Promise<boolean> {
    // ChatSchema has a Mongoose middleware that deletes all messages before deleting the chat
    const result = await ChatModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  // --- Special methods for specific logic ---

  async updateLastMessage(id: string, messageContent: string, timestamp: Date): Promise<void> {
    await ChatModel.updateOne(
      { _id: id },
      {
        $set: {
          lastMessage: messageContent,
          lastMessageTimestamp: timestamp,
        },
      },
    );
  }

  async incrementUnread(id: string): Promise<void> {
    await ChatModel.updateOne({ _id: id }, { $inc: { unreadCount: 1 } });
  }

  async resetUnread(id: string): Promise<void> {
    await ChatModel.updateOne({ _id: id }, { $set: { unreadCount: 0 } });
  }
}

export const chatRepository = new ChatRepository();
