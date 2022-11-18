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
  patchMessages,
  postMessage,
} from 'src/api/messenger';
import { RootState } from 'src/store';
import { Message, MessageAddDTO, MessageUpdateDTO } from 'src/types/api';

interface BaseMessageState {
  status: 'init' | 'loading' | 'loaded' | 'failed';
  lastChatId: string;
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

export const sendMessageUpdates = createAsyncThunk(
  'messages/sendUpdates',
  async (messages: MessageUpdateDTO[]) => await patchMessages(messages)
);

const messageAdapter = createEntityAdapter<Message>({
  selectId: (message) => message.messageId,
});

const initialState = messageAdapter.getInitialState<BaseMessageState>({
  status: 'init',
  lastChatId: '',
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
        state.lastChatId = action.meta.arg;
        messageAdapter.upsertMany(state, action.payload);
      })
      .addCase(sendNewMessage.fulfilled, (state, action) => {
        messageAdapter.addOne(state, action.payload);
      })
      .addCase(sendMessageUpdates.fulfilled, (state, action) => {
        messageAdapter.updateMany(
          state,
          action.payload.map((u) => ({
            id: u.messageId,
            changes: u,
          }))
        );
      });
  },
});

export const { upsertMessage } = messageSlice.actions;

export const selectMessageStatus = (state: RootState) => state.messages.status;

export const selectLastChatIdForMessages = (state: RootState) =>
  state.messages.lastChatId;

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
