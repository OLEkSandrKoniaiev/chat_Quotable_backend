import axios from 'axios';
import https from 'https';

import { messageRepository } from '../../modules/messages/message.repository';
import { chatRepository } from '../../modules/chats/chat.repository';

const API_BASE_URL = 'https://api.quotable.io';
const RANDOM_QUOTE_URL = `${API_BASE_URL}/random`;

const FALLBACK_QUOTE = "Sorry, I can't find the quote right now. Please try again later.";

// const httpsAgent = new https.Agent({
//   rejectUnauthorized: false,
// });

class QuotableService {
  public generateBotResponse(userId: string, chatId: string): void {
    setTimeout(async () => {
      let quoteContent: string;

      try {
        const response = await axios.get(RANDOM_QUOTE_URL, {
          params: {
            maxLength: 100,
          },
          // httpsAgent: httpsAgent,
        });

        if (response.data?.content) {
          quoteContent = response.data.content;
        } else {
          throw new Error('Invalid API response structure');
        }
      } catch (apiError: unknown) {
        console.error(`[QuotableService] API Error for chatId ${chatId}:`, apiError);
        quoteContent = FALLBACK_QUOTE;
      }

      try {
        const dto = {
          content: quoteContent,
          sender: 'bot' as const,
        };

        const newMessage = await messageRepository.create(chatId, dto);

        await chatRepository.updateLastMessage(userId, chatId, newMessage.content, new Date());
        await chatRepository.incrementUnread(userId, chatId);
      } catch (dbError: unknown) {
        console.error(`[QuotableService] DB Save Error for chatId ${chatId}:`, dbError);
      }
    }, 3000);
  }
}

export const quotableService = new QuotableService();
