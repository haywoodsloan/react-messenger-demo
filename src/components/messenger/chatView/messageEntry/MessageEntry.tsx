import classNames from 'classnames';
import { useMemo } from 'react';

import Avatar from 'src/components/core/avatar';
import { useAppSelector } from 'src/hooks/store';
import { selectMessageById } from 'src/store/messenger/messages';
import { selectActiveUserId } from 'src/store/profiles/users';
import colors from 'src/styles/colors.module.scss';
import fonts from 'src/styles/fonts.module.scss';
import layout from 'src/styles/layout.module.scss';
import { toAbsoluteTime } from 'src/utilities/time';

import styles from './MessageEntry.module.scss';

interface Props {
  messageId: string;
  clusterStart: boolean;
  clusterEnd: boolean;
}

export default function MessageEntry({
  messageId,
  clusterStart,
  clusterEnd,
}: Props) {
  const activeUserId = useAppSelector(selectActiveUserId);
  const message = useAppSelector((state) =>
    selectMessageById(state, messageId)
  );

  const fromSelf = message?.senderId === activeUserId;
  const datetime = useMemo(
    () => (message && clusterEnd ? toAbsoluteTime(message.sentAt) : undefined),
    [message, clusterEnd]
  );

  if (!message) {
    return null;
  }

  return (
    <div
      className={classNames(
        styles.container,
        layout.extraLargeMarginHorizontal,
        clusterEnd ? layout.extraLargeMarginBottom : layout.smallMarginBottom,
        {
          [styles.fromSelf]: fromSelf,
        }
      )}
    >
      {!fromSelf && (
        <div>{clusterEnd && <Avatar userIds={[message.senderId]} />}</div>
      )}
      <div
        className={classNames(styles.bubble, layout.largePadding, {
          [styles.clusterEnd]: clusterEnd,
          [styles.clusterStart]: clusterStart,
        })}
      >
        {message.content}
      </div>
      {!fromSelf && <div />}
      {clusterEnd && (
        <div
          className={classNames(
            styles.date,
            colors.textSecondary,
            fonts.extraSmallSize,
            layout.smallMarginTop,
            layout.mediumMarginLeft
          )}
        >
          {datetime}
        </div>
      )}
    </div>
  );
}
