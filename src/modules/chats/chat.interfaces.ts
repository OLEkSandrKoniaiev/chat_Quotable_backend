export interface IChat {
  firstName: string;
  lastName: string;

  // optimization for UI
  lastMessage: string;
  lastMessageTimestamp: Date;
  unreadCount: number;
}
