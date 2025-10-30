import mongoose, { Document, Schema } from 'mongoose';
import { IChat } from './chat.interfaces';
import { MessageModel } from '../messages/message.model';
import { FileService } from '../../common/services/file.service';

export interface IChatDocument extends IChat, Document {}

const ChatSchema = new Schema<IChatDocument>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: false,
    },
    avatarUrl: {
      type: String,
      required: false,
    },
    lastMessage: {
      type: String,
      required: false,
    },
    lastMessageTimestamp: {
      type: Date,
      required: false,
    },
    unreadCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_, ret) => {
        return ret;
      },
    },
  },
);

ChatSchema.pre('deleteOne', { document: false, query: true }, async function () {
  const filter = this.getFilter();
  const chatId = filter._id;

  if (chatId) {
    const chatToDelete = await this.model.findOne(filter);
    await Promise.all([
      MessageModel.deleteMany({ chatId: chatId }),

      (async () => {
        if (chatToDelete?.avatarUrl) {
          await FileService.deleteAvatarCloudinary(chatToDelete.avatarUrl);
        }
      })(),
    ]);
  }
});

export const ChatModel = mongoose.model<IChatDocument>('Chat', ChatSchema);
