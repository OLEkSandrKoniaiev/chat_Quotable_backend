export interface IChat {
  firstName: string;
  lastName: string;

  // optimization for UI
  lastMessage: string;
  lastMessageTimestamp: Date;
  unreadCount: number;
}

export interface IChatCreateDTO {
  firstName: string;
  lastName?: string;
}

export interface IChatUpdateDTO {
  firstName?: string;
  lastName?: string;
}
