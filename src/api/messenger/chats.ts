/*
 * A mock API for fetching and updating chats
 * Normally this would be actual fetch/API calls
 */
import { Chat, ChatUpdateDTO } from 'src/types/api';
import { randomInt, randomUUID } from 'src/utilities/random';

const mockChats: Chat[] = [];

export function getChats(userId: string) {
  console.log('Fetching chats for:', userId);
  return new Promise<Chat[]>((resolve) => {
    if (!mockChats.length) {
      seedChats();
    }
    setTimeout(() => {
      resolve(mockChats);
    }, 150);
  });
}

export function patchChat(updatedChat: ChatUpdateDTO) {
  return new Promise<ChatUpdateDTO>((resolve, reject) => {
    const existingChat = mockChats.find(
      ({ chatId }) => chatId === updatedChat.chatId
    );

    if (!existingChat) {
      reject(new Error('The chat to update does not exist'));
      return;
    }

    setTimeout(() => {
      Object.assign(existingChat, updatedChat);
      resolve(updatedChat);
    }, 150);
  });
}

function seedChats() {
  const chatCount = randomInt(5, 20);
  for (let i = 0; i < chatCount; i++) {
    mockChats.push({
      chatId: randomUUID(),
      participantId: randomUUID(),
      lastMessageId: randomUUID(),
    });
  }
}
