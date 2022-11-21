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

import { getUsersById } from 'src/api/messenger';
import { RootState } from 'src/store';
import { User } from 'src/types/api';

interface BaseUserState {
  status: 'init' | 'loading' | 'loaded' | 'failed';
  activeUserId: string;
}

export const fetchUsersById = createAsyncThunk(
  'users/fetchByIds',
  async (userIds: string[]) => await getUsersById(userIds)
);

const isPendingAction = isPending(fetchUsersById);
const isFulfilledAction = isFulfilled(fetchUsersById);
const isRejectedAction = isRejected(fetchUsersById);

const userAdapter = createEntityAdapter<User>({
  selectId: (user) => user.userId,
});

const initialState = userAdapter.getInitialState<BaseUserState>({
  // Normally the active user ID would be set from the login response
  activeUserId: 'self',
  status: 'init',
});

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    upsertUser(state, action: PayloadAction<User>) {
      userAdapter.upsertOne(state, action.payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUsersById.fulfilled, (state, action) => {
        userAdapter.upsertMany(state, action.payload);
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

export const { upsertUser: updateUser } = userSlice.actions;

export const selectUserStatus = (state: RootState) => state.users.status;

export const selectActiveUserId = (state: RootState) =>
  state.users.activeUserId;

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectEntities: selectUserEntities,
} = userAdapter.getSelectors<RootState>((state) => state.users);

export const selectUsersById = createSelector(
  [selectUserEntities, (_, userIds: string[]) => userIds],
  (users, userIds) =>
    userIds.flatMap((id) => {
      const user = users[id];
      return user ? [user] : [];
    })
);

export default userSlice.reducer;
