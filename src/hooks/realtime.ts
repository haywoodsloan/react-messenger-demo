import { useEffect } from 'react';

import {
  fetchChatsByUserId,
  selectAllChats,
  selectChatStatus,
} from 'src/store/messenger/chats';

import { useAppDispatch, useAppSelector } from './store';

export function useRealtimeChats(userId: string) {
  const chatStatus = useAppSelector(selectChatStatus);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (chatStatus === 'init') {
      dispatch(fetchChatsByUserId(userId));
    }
  }, [chatStatus, dispatch, userId]);

  useEffect(() => {
    // TODO subscribe to a realtime API
  }, [dispatch, userId]);

  return useAppSelector(selectAllChats);
}
