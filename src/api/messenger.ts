/*
 * Mock methods for getting/updating chats and messages
 * Normally this would be actual fetch/API calls
 */
import moment from 'moment';

import {
  Chat,
  ChatUpdateDTO,
  Message,
  MessageAddDTO,
  User,
} from 'src/types/api';
import {
  randomBool,
  randomFirstName,
  randomInt,
  randomLastName,
  randomMessageText,
  randomSample,
  randomUUID,
} from 'src/utilities/random';

// The time in milliseconds to delay responses from the mock API
const mockDelay = 150;

const mockChats: Chat[] = [];
const mockUsers: User[] = [];
const mockMessages: Message[] = [];

export function getChatsByUserId(userId: string) {
  console.log('Fetching chats for:', userId);
  return new Promise<Chat[]>((resolve) => {
    if (!mockChats.length) {
      seedChats(userId);
    }

    setTimeout(() => {
      resolve(mockChats);
    }, mockDelay);
  });
}

export function patchChat(updatedChat: ChatUpdateDTO) {
  console.log('Patching chat:', updatedChat.chatId);
  return new Promise<ChatUpdateDTO>((resolve, reject) => {
    const existingChat = mockChats.find((c) => c.chatId === updatedChat.chatId);

    if (!existingChat) {
      reject(new Error('The chat to update does not exist'));
      return;
    }

    setTimeout(() => {
      Object.assign(existingChat, updatedChat);
      resolve(updatedChat);
    }, mockDelay);
  });
}

export function getUsersById(userIds: string[]) {
  console.log('Fetching users:', userIds);
  return new Promise<User[]>((resolve, reject) => {
    const existingIds = new Set(mockUsers.map((u) => u.userId));
    if (userIds.some((id) => !existingIds.has(id))) {
      reject(new Error('One of the requested users does not exists'));
      return;
    }

    setTimeout(() => {
      const userIdSet = new Set(userIds);
      resolve(mockUsers.filter((u) => userIdSet.has(u.userId)));
    }, mockDelay);
  });
}

export function getMessagesById(messageIds: string[]) {
  console.log('Fetching messages:', messageIds);
  return new Promise<Message[]>((resolve, reject) => {
    const existingIds = new Set(mockMessages.map((m) => m.messageId));
    if (messageIds.some((id) => !existingIds.has(id))) {
      reject(new Error('One of the requested messages does not exist'));
      return;
    }

    setTimeout(() => {
      const messageIdSet = new Set(messageIds);
      resolve(mockMessages.filter((m) => messageIdSet.has(m.messageId)));
    }, mockDelay);
  });
}

export function getMessagesByChatId(chatId: string) {
  console.log('Fetching messages for chat:', chatId);
  return new Promise<Message[]>((resolve, reject) => {
    const chat = mockChats.find((c) => c.chatId === chatId);
    if (!chat) {
      reject(
        new Error('Messages were requested for a chat that does not exist')
      );
      return;
    }

    const existingCount = mockMessages.reduce((count, message) => {
      if (message.chatId === chatId) {
        count++;
      }
      return count;
    }, 0);

    if (existingCount < 5) {
      seedChatHistory(chat);
    }

    setTimeout(() => {
      resolve(mockMessages.filter((m) => m.chatId === chatId));
    }, mockDelay);
  });
}

export function postMessage(message: MessageAddDTO) {
  console.log('Posting a new message to chat:', message.chatId);
  return new Promise<Message>((resolve, reject) => {
    const chat = mockChats.find((c) => c.chatId === message.chatId);
    if (!chat) {
      reject(new Error('Adding a message to a chat that does not exist'));
      return;
    }

    const response: Message = {
      ...message,
      messageId: randomUUID(),
      isRead: true,
      sentAt: moment.utc().format(),
    };

    setTimeout(() => {
      chat.lastMessageId = response.messageId;
      mockMessages.push(response);
      resolve(response);
    }, mockDelay);
  });
}

function seedChats(userId: string) {
  const chatCount = randomInt(5, 15);

  for (let i = 0; i < chatCount; i++) {
    const chatId = randomUUID();
    const lastMessageId = randomUUID();
    const otherUserId = randomUUID();
    const participantIds = [userId, otherUserId];

    mockChats.push({
      chatId,
      participantIds,
      lastMessageId,
    });

    mockMessages.push({
      chatId,
      messageId: lastMessageId,
      content: randomMessageText(),
      senderId: randomSample(participantIds),
      sentAt: moment().subtract(randomInt(0, 2), 'days').toJSON(),
      isRead: randomBool(),
    });

    mockUsers.push({
      userId: otherUserId,
      firstName: randomFirstName(),
      lastName: randomLastName(),
    });
  }
}

function seedChatHistory(chat: Chat) {
  const oldestDatetime = mockMessages.reduce((datetime, message) => {
    if (message.chatId === chat.chatId) {
      const messageDateTime = moment(message.sentAt);
      if (messageDateTime.isBefore(datetime)) {
        return messageDateTime;
      }
    }
    return datetime;
  }, moment());

  const clusterCount = randomInt(1, 4);
  for (let i = 0; i < clusterCount; i++) {
    oldestDatetime.subtract(randomInt(1, 3), 'days');
    const senderId = randomSample(chat.participantIds);
    const messageCount = randomInt(1, 4);

    for (let j = 0; j < messageCount; j++) {
      mockMessages.push({
        chatId: chat.chatId,
        content: randomMessageText(),
        isRead: true,
        messageId: randomUUID(),
        senderId,
        sentAt: oldestDatetime.toJSON(),
      });
      oldestDatetime.subtract(1, 'minute');
    }
  }
}
