export interface IChat {
  firstName: string;
  lastName: string;
  avatarUrl?: string;

  // optimization for UI
  lastMessage: string;
  lastMessageTimestamp: Date;
  unreadCount: number;
}

export interface IChatCreateDTO {
  firstName: string;
  lastName?: string;
  avatarUrl?: string;
  lastMessage?: string;
  lastMessageTimestamp?: Date;
  unreadCount?: number;
}

export interface IChatUpdateDTO {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}
