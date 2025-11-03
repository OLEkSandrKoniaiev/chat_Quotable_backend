import { chatRepository } from '../../modules/chats/chat.repository';
import { messageRepository } from '../../modules/messages/message.repository';

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
    unreadCount: 1,
  },
  {
    firstName: 'Bot',
    lastName: 'Quotable',
    lastMessage: 'Write me anything, and I will respond with a quote.',
    unreadCount: 1,
  },
];

export const createPredefinedChats = async (userId: string): Promise<void> => {
  try {
    const chatCreationPromises = PREDEFINED_CHATS.map(async (chatDto) => {
      const newChat = await chatRepository.create(userId, {
        ...chatDto,
        lastMessageTimestamp: new Date(),
      });

      try {
        const messageDto = {
          content: chatDto.lastMessage,
          sender: 'bot' as const,
        };
        await messageRepository.create(newChat._id as string, messageDto);
      } catch (err: unknown) {
        console.error(
          `[createPredefinedChats] Failed to create message for chat ${newChat._id}:`,
          err,
        );
      }

      return newChat;
    });

    await Promise.all(chatCreationPromises);

    console.log(`Predefined chats created for user ${userId}`);
  } catch (e) {
    console.error(`Failed to create predefined chats for user ${userId}:`, e);
  }
};
