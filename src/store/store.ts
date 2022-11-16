import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';

import chatReducer from './messenger/chats';

export const store = configureStore({
  reducer: {
    chats: chatReducer,
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
