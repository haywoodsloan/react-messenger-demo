import { useEffect } from 'react';

import {
  fetchChatsByUserId,
  selectChatStatus,
  selectChatsByUserId,
  selectLastUserIdForChats,
} from 'src/store/messenger/chats';
import {
  fetchMessagesByChatId,
  fetchMessagesById,
  selectLastChatIdForMessages,
  selectMessageStatus,
  selectMessagesByChatId,
  selectMessagesById,
} from 'src/store/messenger/messages';

import { useAppDispatch, useAppSelector } from './store';

export function useChatsByUserId(userId: string) {
  const dispatch = useAppDispatch();
  const chatStatus = useAppSelector(selectChatStatus);
  const lastUserId = useAppSelector(selectLastUserIdForChats);

  useEffect(() => {
    if (chatStatus !== 'loading' && lastUserId !== userId) {
      dispatch(fetchChatsByUserId(userId));
    }
  }, [userId, lastUserId, chatStatus, dispatch]);

  return useAppSelector((state) => selectChatsByUserId(state, userId));
}

export function useLiveChatsByUserId(userId: string) {
  const dispatch = useAppDispatch();
  const chatStatus = useAppSelector(selectChatStatus);

  useEffect(() => {
    if (chatStatus !== 'loading') {
      // TODO subscribe to a realtime API
    }
  }, [userId, chatStatus, dispatch]);

  return useChatsByUserId(userId);
}

export function useMessagesById(messageIds: string[]) {
  const dispatch = useAppDispatch();
  const messageStatus = useAppSelector(selectMessageStatus);
  const messages = useAppSelector((state) =>
    selectMessagesById(state, messageIds)
  );

  useEffect(() => {
    if (messageStatus !== 'loading') {
      const existingMessageIds = new Set(messages.map((m) => m.messageId));
      const missingMessageIds = messageIds.filter(
        (id) => !existingMessageIds.has(id)
      );

      if (missingMessageIds.length) {
        dispatch(fetchMessagesById(missingMessageIds));
      }
    }
  }, [messageStatus, messageIds, messages, dispatch]);

  return messages;
}

export function useLiveMessagesById(messageIds: string[]) {
  const dispatch = useAppDispatch();
  const messageStatus = useAppSelector(selectMessageStatus);

  useEffect(() => {
    if (messageStatus !== 'loading') {
      // TODO subscribe to a realtime API
    }
  }, [messageIds, messageStatus, dispatch]);

  return useMessagesById(messageIds);
}

export function useMessagesByChatId(chatId: string) {
  const dispatch = useAppDispatch();
  const messageStatus = useAppSelector(selectMessageStatus);
  const lastChatId = useAppSelector(selectLastChatIdForMessages);

  useEffect(() => {
    if (messageStatus !== 'loading' && lastChatId !== chatId) {
      dispatch(fetchMessagesByChatId(chatId));
    }
  }, [chatId, lastChatId, messageStatus, dispatch]);

  return useAppSelector((state) => selectMessagesByChatId(state, chatId));
}

export function useLiveMessagesByChatId(chatId: string) {
  const dispatch = useAppDispatch();
  const messageStatus = useAppSelector(selectMessageStatus);

  useEffect(() => {
    if (messageStatus !== 'loading') {
      // TODO subscribe to a realtime API
    }
  }, [dispatch, chatId, messageStatus]);

  return useMessagesByChatId(chatId);
}
