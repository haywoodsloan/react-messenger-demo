import classNames from 'classnames';
import { useMemo } from 'react';

import { useAppSelector } from 'src/hooks/store';
import { selectUserById } from 'src/store/profiles/users';
import colors from 'src/styles/colors.module.scss';
import fonts from 'src/styles/fonts.module.scss';

import styles from './Avatar.module.scss';

interface Props {
  userIds: string[];
}

export default function Avatar({ userIds }: Props) {
  const user = useAppSelector((state) => {
    if (userIds.length > 1) {
      return;
    }

    const userId = userIds[0];
    return selectUserById(state, userId);
  });

  const text = useMemo(() => {
    return user
      ? Array.from(user.firstName)[0] + Array.from(user.lastName)[0]
      : userIds.length.toString();
  }, [user, userIds]);

  return (
    <div
      className={classNames(
        styles.container,
        colors.fillSecondary,
        colors.textTertiary,
        fonts.largeSize
      )}
      aria-hidden="true"
    >
      {text}
    </div>
  );
}
