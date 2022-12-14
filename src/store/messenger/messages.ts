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

const isPendingAction = isPending(
  fetchMessagesById,
  fetchMessagesByChatId,
  sendNewMessage,
  sendMessageUpdates
);

const isFulfilledAction = isFulfilled(
  fetchMessagesById,
  fetchMessagesByChatId,
  sendNewMessage,
  sendMessageUpdates
);

const isRejectedAction = isRejected(
  fetchMessagesById,
  fetchMessagesByChatId,
  sendNewMessage,
  sendMessageUpdates
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
    setMessage(state, action: PayloadAction<Message>) {
      messageAdapter.setOne(state, action.payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMessagesById.fulfilled, (state, action) => {
        messageAdapter.setMany(state, action.payload);
      })
      .addCase(fetchMessagesByChatId.fulfilled, (state, action) => {
        // Remove all message from the specified chat and
        // replace them with the data from the new request
        messageAdapter.removeMany(
          state,
          state.ids.filter(
            (id) => state.entities[id]?.chatId === action.meta.arg
          )
        );
        messageAdapter.setMany(state, action.payload);
        state.lastChatId = action.meta.arg;
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

export const { setMessage } = messageSlice.actions;

export const selectMessageStatus = (state: RootState) => state.messages.status;

export const selectLastChatIdForMessages = (state: RootState) =>
  state.messages.lastChatId;

export const {
  selectAll: selectAllMessages,
  selectById: selectMessageById,
  selectEntities: selectMessageEntities,
} = messageAdapter.getSelectors<RootState>((state) => state.messages);

export const selectMessagesByChatId = createSelector(
  [selectAllMessages, (_, chatId: string) => chatId],
  (messages, chatId) => messages.filter((m) => m.chatId === chatId)
);

export const selectMessagesById = createSelector(
  [selectMessageEntities, (_, messageIds: string[]) => messageIds],
  (messages, messageIds) =>
    messageIds.flatMap((id) => {
      const message = messages[id];
      return message ? [message] : [];
    })
);

export default messageSlice.reducer;
