import {
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';

import { getChatsByUserId, patchChat } from 'src/api/messenger';
import { RootState } from 'src/store';
import { Chat, ChatUpdateDTO } from 'src/types/api';

interface BaseChatState {
  status: 'init' | 'loading' | 'loaded' | 'failed';
  lastUserId: string;
}

export const fetchChatsByUserId = createAsyncThunk(
  'chats/fetchByUserId',
  async (userId: string) => await getChatsByUserId(userId)
);

export const sendChatUpdate = createAsyncThunk(
  'chats/sendUpdate',
  async (chat: ChatUpdateDTO) => await patchChat(chat)
);

const isPendingAction = isPending(fetchChatsByUserId, sendChatUpdate);
const isFulfilledAction = isFulfilled(fetchChatsByUserId, sendChatUpdate);
const isRejectedAction = isRejected(fetchChatsByUserId, sendChatUpdate);

const chatAdapter = createEntityAdapter<Chat>({
  selectId: (chat) => chat.chatId,
});

const initialState = chatAdapter.getInitialState<BaseChatState>({
  status: 'init',
  lastUserId: '',
});

export const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setChat(state, action: PayloadAction<Chat>) {
      chatAdapter.setOne(state, action.payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchChatsByUserId.fulfilled, (state, action) => {
        state.lastUserId = action.meta.arg;
        const idSet = new Set(action.payload.map((c) => c.chatId));

        // Remove any chats the user was participant in
        // but weren't returned from the new request
        chatAdapter.setMany(state, action.payload);
        chatAdapter.removeMany(
          state,
          state.ids.filter(
            (id) =>
              !idSet.has(id.toString()) &&
              state.entities[id]?.participantIds.includes(action.meta.arg)
          )
        );
      })
      .addCase(sendChatUpdate.fulfilled, (state, action) => {
        chatAdapter.updateOne(state, {
          id: action.payload.chatId,
          changes: action.payload,
        });
      })
      .addMatcher(isPendingAction, (state) => {
        state.status = 'loading';
      })
      .addMatcher(isFulfilledAction, (state) => {
        state.status = 'loaded';
      })
      .addMatcher(isRejectedAction, (state) => {
        state.status = 'failed';
      });
  },
});

export const { setChat } = chatSlice.actions;

export const selectChatStatus = (state: RootState) => state.chats.status;

export const selectLastUserIdForChats = (state: RootState) =>
  state.chats.lastUserId;

export const { selectAll: selectAllChats, selectById: selectChatById } =
  chatAdapter.getSelectors<RootState>((state) => state.chats);

export const selectChatsByUserId = createSelector(
  [selectAllChats, (_, userId: string) => userId],
  (chats, userId) => chats.filter((c) => c.participantIds.includes(userId))
);

export default chatSlice.reducer;
