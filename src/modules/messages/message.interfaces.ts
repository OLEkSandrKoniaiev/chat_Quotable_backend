export interface IMessage {
  sender: 'user' | 'bot';
  content: string;
}

export interface IMessageCreateDTO {
  sender: 'user' | 'bot';
  content: string;
}

export interface IMessageUpdateDTO {
  content?: string;
}
