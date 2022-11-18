/*
 * Normally this would be auto generated from something like an OpenApi definition.
 * For demo purposes data types are just mocked here.
 */

/**
 * A chat conversation the current user is a participant in.
 */
export interface Chat {
  /** The ID of this chat */
  chatId: string;

  /** The users in the chat */
  participantIds: string[];

  /** The ID of the last message in the chat */
  lastMessageId: string;
}

/**
 * Data transfer object for updating a chat.
 * Only the last message ID can change.
 */
export type ChatUpdateDTO = Pick<Chat, 'chatId' | 'lastMessageId'>;

/**
 * A user that is participant in one of the chats
 */
export interface User {
  /** The ID of this user */
  userId: string;

  /** The user's first name */
  firstName: string;

  /** The user's last name */
  lastName: string;
}

/**
 * A message sent to a chat.
 */
export interface Message {
  /** The ID of this message */
  messageId: string;

  /** The chat this message is associated with */
  chatId: string;

  /** The ID of the user who sent the message */
  senderId: string;

  /** The datetime when the message was sent */
  sentAt: string;

  /** The text content of the message */
  content: string;

  /** The IDs for the users who have read this message */
  readBy: string[];
}

/**
 * Data transfer object for adding a message.
 * Omits messageId, readBy, and sentAt as the API will return this.
 */
export type MessageAddDTO = Omit<Message, 'messageId' | 'readBy' | 'sentAt'>;

/**
 * Data transfer object for updating a message.
 * Can only update the readBy field.
 */
export type MessageUpdateDTO = Pick<Message, 'messageId' | 'readBy'>;
