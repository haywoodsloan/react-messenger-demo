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
  MessageUpdateDTO,
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
    setTimeout(() => {
      if (!mockChats.length) {
        seedChats(userId);
      }

      resolve(mockChats);
    }, mockDelay);
  });
}

export function patchChat(updatedChat: ChatUpdateDTO) {
  console.log('Patching chat:', updatedChat.chatId);
  return new Promise<ChatUpdateDTO>((resolve, reject) => {
    setTimeout(() => {
      const existingChat = mockChats.find(
        (c) => c.chatId === updatedChat.chatId
      );

      if (!existingChat) {
        reject(new Error('The chat to update does not exist'));
        return;
      }

      Object.assign(existingChat, updatedChat);
      resolve(updatedChat);
    }, mockDelay);
  });
}

export function patchMessages(updatedMessages: MessageUpdateDTO[]) {
  console.log(
    'Patching messages:',
    updatedMessages.map((m) => m.messageId)
  );
  return new Promise<MessageUpdateDTO[]>((resolve, reject) => {
    setTimeout(() => {
      for (const updatedMessage of updatedMessages) {
        const existingMessage = mockMessages.find(
          (m) => m.messageId === updatedMessage.messageId
        );

        if (!existingMessage) {
          reject(new Error('One of the messages to update does not exist'));
          return;
        }

        Object.assign(existingMessage, updatedMessage);
      }
      resolve(updatedMessages);
    }, mockDelay);
  });
}

export function getUsersById(userIds: string[]) {
  console.log('Fetching users:', userIds);
  return new Promise<User[]>((resolve, reject) => {
    setTimeout(() => {
      const existingIds = new Set(mockUsers.map((u) => u.userId));
      if (userIds.some((id) => !existingIds.has(id))) {
        reject(new Error('One of the requested users does not exists'));
        return;
      }

      const userIdSet = new Set(userIds);
      resolve(mockUsers.filter((u) => userIdSet.has(u.userId)));
    }, mockDelay);
  });
}

export function getMessagesById(messageIds: string[]) {
  console.log('Fetching messages:', messageIds);
  return new Promise<Message[]>((resolve, reject) => {
    setTimeout(() => {
      const existingIds = new Set(mockMessages.map((m) => m.messageId));
      if (messageIds.some((id) => !existingIds.has(id))) {
        reject(new Error('One of the requested messages does not exist'));
        return;
      }

      const messageIdSet = new Set(messageIds);
      resolve(mockMessages.filter((m) => messageIdSet.has(m.messageId)));
    }, mockDelay);
  });
}

export function getMessagesByChatId(chatId: string) {
  console.log('Fetching messages for chat:', chatId);
  return new Promise<Message[]>((resolve, reject) => {
    setTimeout(() => {
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

      resolve(mockMessages.filter((m) => m.chatId === chatId));
    }, mockDelay);
  });
}

export function postMessage(message: MessageAddDTO) {
  console.log('Posting a new message to chat:', message.chatId);
  return new Promise<Message>((resolve, reject) => {
    setTimeout(() => {
      const chat = mockChats.find((c) => c.chatId === message.chatId);
      if (!chat) {
        reject(new Error('Adding a message to a chat that does not exist'));
        return;
      }

      const response: Message = {
        ...message,
        messageId: randomUUID(),
        readBy: [message.senderId],
        sentAt: moment.utc().format(),
      };

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

    const senderId = randomSample(participantIds);
    const readBy = randomBool() ? participantIds : [senderId];
    mockMessages.push({
      chatId,
      content: randomMessageText(),
      messageId: lastMessageId,
      readBy,
      senderId,
      sentAt: moment().subtract(randomInt(0, 2), 'days').toJSON(),
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

  // TODO start the first cluster with the latest message sender

  const clusterCount = randomInt(1, 4);
  for (let i = 0; i < clusterCount; i++) {
    oldestDatetime.subtract(randomInt(1, 3), 'days');
    const senderId = randomSample(chat.participantIds);
    const messageCount = randomInt(1, 4);

    for (let j = 0; j < messageCount; j++) {
      mockMessages.push({
        chatId: chat.chatId,
        content: randomMessageText(),
        readBy: chat.participantIds,
        messageId: randomUUID(),
        senderId,
        sentAt: oldestDatetime.toJSON(),
      });
      oldestDatetime.subtract(1, 'minute');
    }
  }
}
