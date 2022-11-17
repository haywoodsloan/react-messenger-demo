import { useEffect } from 'react';

import {
  fetchChatsByUserId,
  selectChatStatus,
  selectChatsByUserId,
} from 'src/store/messenger/chats';
import {
  fetchMessagesById,
  selectMessageStatus,
  selectMessagesById,
} from 'src/store/messenger/messages';

import { useAppDispatch, useAppSelector } from './store';

export function useChatsByUserId(userId: string) {
  const dispatch = useAppDispatch();
  const chatStatus = useAppSelector(selectChatStatus);

  useEffect(() => {
    if (chatStatus === 'init') {
      dispatch(fetchChatsByUserId(userId));
    }
  }, [chatStatus, dispatch, userId]);

  return useAppSelector((state) => selectChatsByUserId(state, userId));
}

export function useLiveChatsByUserId(userId: string) {
  const dispatch = useAppDispatch();
  const chatStatus = useAppSelector(selectChatStatus);

  useEffect(() => {
    if (chatStatus !== 'loading') {
      // TODO subscribe to a realtime API
    }
  }, [dispatch, userId, chatStatus]);

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
