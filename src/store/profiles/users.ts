import {
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
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
      .addCase(fetchUsersById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsersById.fulfilled, (state, action) => {
        state.status = 'loaded';
        userAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchUsersById.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { upsertUser: updateUser } = userSlice.actions;

export const selectUserStatus = (state: RootState) => state.users.status;

export const selectActiveUserId = (state: RootState) =>
  state.users.activeUserId;

export const { selectAll: selectAllUsers, selectById: selectUserById } =
  userAdapter.getSelectors<RootState>((state) => state.users);

export const selectUsersById = createSelector(
  [selectAllUsers, (_, userIds: string[]) => userIds],
  (users, userIds) => {
    const userIdSet = new Set(userIds);
    return users.filter((u) => userIdSet.has(u.userId));
  }
);

export default userSlice.reducer;
