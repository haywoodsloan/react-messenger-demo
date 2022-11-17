import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';

import chatReducer from './messenger/chats';
import messageReducer from './messenger/messages';
import userReducer from './profiles/users';

export const store = configureStore({
  reducer: {
    chats: chatReducer,
    users: userReducer,
    messages: messageReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
