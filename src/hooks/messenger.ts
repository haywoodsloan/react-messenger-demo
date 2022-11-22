import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

export function useChatsByUserId(userId?: string) {
  const dispatch = useAppDispatch();
  const chatStatus = useAppSelector(selectChatStatus);
  const lastUserId = useAppSelector(selectLastUserIdForChats);

  useEffect(() => {
    if (chatStatus !== 'loading' && userId && lastUserId !== userId) {
      dispatch(fetchChatsByUserId(userId));
    }
  }, [userId, lastUserId, chatStatus, dispatch]);

  return useAppSelector((state) =>
    userId ? selectChatsByUserId(state, userId) : []
  );
}

export function useLiveChatsByUserId(userId?: string) {
  const dispatch = useAppDispatch();
  const chatStatus = useAppSelector(selectChatStatus);

  useEffect(() => {
    if (chatStatus !== 'loading' && userId) {
      // TODO subscribe to a realtime API
    }
  }, [userId, chatStatus, dispatch]);

  return useChatsByUserId(userId);
}

export function useMessagesById(messageIds: string[]) {
  const dispatch = useAppDispatch();
  const messageStatus = useAppSelector(selectMessageStatus);
  const messages = useAppSelector((state) =>
    messageIds.length ? selectMessagesById(state, messageIds) : []
  );

  useEffect(() => {
    if (messageStatus !== 'loading' && messageIds.length) {
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
    if (messageStatus !== 'loading' && messageIds.length) {
      // TODO subscribe to a realtime API
    }
  }, [messageIds, messageStatus, dispatch]);

  return useMessagesById(messageIds);
}

export function useMessagesByChatId(chatId?: string) {
  const dispatch = useAppDispatch();
  const messageStatus = useAppSelector(selectMessageStatus);
  const lastChatId = useAppSelector(selectLastChatIdForMessages);
  const navigate = useNavigate();

  // Messages are only requested by chat id in the chat view component
  // If we fail to fetch assume an invalid chat was specified and redirect to the base messenger
  useEffect(() => {
    if (messageStatus !== 'loading' && chatId && lastChatId !== chatId) {
      dispatch(fetchMessagesByChatId(chatId))
        .unwrap()
        .catch(() => navigate('/messenger'));
    }
  }, [chatId, lastChatId, messageStatus, dispatch]);

  return useAppSelector((state) =>
    chatId ? selectMessagesByChatId(state, chatId) : []
  );
}

export function useLiveMessagesByChatId(chatId?: string) {
  const dispatch = useAppDispatch();
  const messageStatus = useAppSelector(selectMessageStatus);

  useEffect(() => {
    if (messageStatus !== 'loading' && chatId) {
      // TODO subscribe to a realtime API
    }
  }, [dispatch, chatId, messageStatus]);

  return useMessagesByChatId(chatId);
}
