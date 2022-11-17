import {
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import {
  getMessagesByChatId,
  getMessagesById,
  postMessage,
} from 'src/api/messenger';
import { RootState } from 'src/store';
import { Message, MessageAddDTO } from 'src/types/api';

interface BaseMessageState {
  status: 'init' | 'loading' | 'loaded' | 'failed';
}

export const fetchMessagesById = createAsyncThunk(
  'messages/fetchByIds',
  async (messageIds: string[]) => await getMessagesById(messageIds)
);

export const fetchMessagesByChatId = createAsyncThunk(
  'messages/fetchByChatId',
  async (chatId: string) => await getMessagesByChatId(chatId)
);

export const sendNewMessage = createAsyncThunk(
  'messages/sendNew',
  async (message: MessageAddDTO) => await postMessage(message)
);

const messageAdapter = createEntityAdapter<Message>({
  selectId: (message) => message.messageId,
});

const initialState = messageAdapter.getInitialState<BaseMessageState>({
  status: 'init',
});

export const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    upsertMessage(state, action: PayloadAction<Message>) {
      messageAdapter.upsertOne(state, action.payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMessagesById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMessagesById.fulfilled, (state, action) => {
        state.status = 'loaded';
        messageAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchMessagesById.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchMessagesByChatId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMessagesByChatId.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchMessagesByChatId.fulfilled, (state, action) => {
        state.status = 'loaded';
        messageAdapter.upsertMany(state, action.payload);
      })
      .addCase(sendNewMessage.fulfilled, (state, action) => {
        messageAdapter.addOne(state, action.payload);
      });
  },
});

export const { upsertMessage } = messageSlice.actions;
export const selectMessageStatus = (state: RootState) => state.messages.status;
export const { selectAll: selectAllMessages, selectById: selectMessageById } =
  messageAdapter.getSelectors<RootState>((state) => state.messages);
export const selectMessagesByChatId = createSelector(
  [selectAllMessages, (_, chatId: string) => chatId],
  (messages, chatId) => messages.filter((m) => m.chatId === chatId)
);
export const selectMessagesById = createSelector(
  [selectAllMessages, (_, messageIds: string[]) => messageIds],
  (messages, messageIds) => {
    const messageIdSet = new Set(messageIds);
    return messages.filter((m) => messageIdSet.has(m.messageId));
  }
);

export default messageSlice.reducer;
