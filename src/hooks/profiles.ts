import { useEffect } from 'react';

import {
  fetchUsersById,
  selectUserStatus,
  selectUsersById,
} from 'src/store/profiles/users';

import { useAppDispatch, useAppSelector } from './store';

export function useUsersById(userIds: string[]) {
  const dispatch = useAppDispatch();
  const userStatus = useAppSelector(selectUserStatus);
  const users = useAppSelector((state) => selectUsersById(state, userIds));

  useEffect(() => {
    if (userStatus !== 'loading') {
      const existingUserIds = new Set(users.map((u) => u.userId));
      const missingUserIds = userIds.filter((id) => !existingUserIds.has(id));

      if (missingUserIds.length) {
        dispatch(fetchUsersById(missingUserIds));
      }
    }
  }, [userStatus, userIds, users]);

  return users;
}

export function useLiveUsersById(userIds: string[]) {
  // const dispatch = useAppDispatch();
  const userStatus = useAppSelector(selectUserStatus);

  useEffect(() => {
    if (userStatus !== 'loading') {
      // TODO subscribe to a realtime API
    }
  }, [userIds, userStatus]);

  return useUsersById(userIds);
}
