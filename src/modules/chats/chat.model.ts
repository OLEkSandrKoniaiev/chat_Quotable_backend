import mongoose, { Document, Schema } from 'mongoose';
import { IChat } from './chat.interfaces.ts';

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

export const ChatModel = mongoose.model<IChatDocument>('Chat', ChatSchema);
