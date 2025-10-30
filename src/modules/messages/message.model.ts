import mongoose, { Document, Schema } from 'mongoose';
import { IChatDocument } from '../chats/chat.model';
import { IMessage } from './message.interfaces';

export interface IMessageDocument extends IMessage, Document {
  chatId: IChatDocument['_id'];
}

const MessageSchema = new Schema<IMessageDocument>(
  {
    sender: {
      type: String,
      enum: ['user', 'bot'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    chatId: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const MessageModel = mongoose.model<IMessageDocument>('Message', MessageSchema);
