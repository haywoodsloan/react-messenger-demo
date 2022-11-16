/*
 * Normally this would be auto generated from something like an OpenApi definition.
 * For demo purposes data types are just mocked here.
 */

/** A chat conversation the current user is a participant in */
export interface Chat {
  /** The ID of this chat */
  chatId: string;

  /** The other user in the chat */
  participantId: string;

  /** The ID of the last message in the chat */
  lastMessageId: string;
}

/** Data transfer object for updating a chat */
export type ChatUpdateDTO = Partial<Chat> & Pick<Chat, 'chatId'>;
