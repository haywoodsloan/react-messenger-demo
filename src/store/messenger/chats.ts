import {
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';

import { getChats, patchChat } from 'src/api/messenger/chats';
import { RootState } from 'src/store';
import { Chat, ChatUpdateDTO } from 'src/types/api';

interface BaseChatState {
  status: 'init' | 'loading' | 'loaded' | 'failed';
}

export const fetchChatsByUserId = createAsyncThunk(
  'chats/fetchByUserId',
  async (userId: string) => await getChats(userId)
);

export const updateChat = createAsyncThunk(
  'chats/updateChat',
  async (chat: ChatUpdateDTO) => await patchChat(chat)
);

const chatAdapter = createEntityAdapter<Chat>({
  selectId: (chat) => chat.chatId,
});

const initialState = chatAdapter.getInitialState<BaseChatState>({
  status: 'init',
});

export const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    realtimeChatUpdate(state, action: PayloadAction<Chat>) {
      chatAdapter.upsertOne(state, action.payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchChatsByUserId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChatsByUserId.fulfilled, (state, action) => {
        state.status = 'loaded';
        chatAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchChatsByUserId.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(updateChat.fulfilled, (state, action) => {
        chatAdapter.updateOne(state, {
          id: action.payload.chatId,
          changes: action.payload,
        });
      });
  },
});

export const { realtimeChatUpdate } = chatSlice.actions;

export const selectChatStatus = (state: RootState) => state.chats.status;
export const { selectAll: selectAllChats, selectById: selectChatById } =
  chatAdapter.getSelectors<RootState>((state) => state.chats);

export default chatSlice.reducer;
