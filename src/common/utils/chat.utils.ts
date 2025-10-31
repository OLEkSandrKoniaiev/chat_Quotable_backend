import { chatRepository } from '../../modules/chats/chat.repository';

const PREDEFINED_CHATS = [
  {
    firstName: 'Personal',
    lastName: 'Assistant',
    lastMessage: 'Hello! I am your personal assistant. How can I help you?',
    unreadCount: 1,
  },
  {
    firstName: 'Support',
    lastName: 'Team',
    lastMessage: 'Welcome to "Chat with backend auto responce"!',
    unreadCount: 0,
  },
  {
    firstName: 'Bot',
    lastName: 'Quotable',
    lastMessage: 'Write me anything, and I will respond with a quote.',
    unreadCount: 0,
  },
];

export const createPredefinedChats = async (userId: string): Promise<void> => {
  try {
    const chatCreationPromises = PREDEFINED_CHATS.map((chatDto) => {
      return chatRepository.create(userId, {
        ...chatDto,
        lastMessageTimestamp: new Date(),
      });
    });

    await Promise.all(chatCreationPromises);

    console.log(`Predefined chats created for user ${userId}`);
  } catch (e) {
    console.error(`Failed to create predefined chats for user ${userId}:`, e);
  }
};
