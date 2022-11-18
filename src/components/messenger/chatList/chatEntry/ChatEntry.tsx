import classNames from 'classnames';
import { MouseEventHandler, useMemo } from 'react';

import Avatar from 'src/components/core/avatar';
import { useAppSelector } from 'src/hooks/store';
import { selectChatById } from 'src/store/messenger/chats';
import { selectMessageById } from 'src/store/messenger/messages';
import {
  selectActiveUserId,
  selectUserById,
  selectUsersById,
} from 'src/store/profiles/users';
import colors from 'src/styles/colors.module.scss';
import fonts from 'src/styles/fonts.module.scss';
import layout from 'src/styles/layout.module.scss';

import styles from './ChatEntry.module.scss';

interface Props {
  chatId: string;
  isSelected: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function ChatEntry({ chatId, isSelected, onClick }: Props) {
  const chat = useAppSelector((state) => selectChatById(state, chatId));
  const activeUserId = useAppSelector(selectActiveUserId);

  const message = useAppSelector((state) =>
    chat ? selectMessageById(state, chat.lastMessageId) : undefined
  );

  const otherUserIds = chat?.participantIds.filter((id) => id !== activeUserId);
  const otherUsers = useAppSelector((state) =>
    otherUserIds ? selectUsersById(state, otherUserIds) : undefined
  );

  const chatName = useMemo(
    () => otherUsers?.map((u) => `${u.firstName} ${u.lastName}`).join(', '),
    [otherUsers]
  );

  const senderName = useAppSelector((state) => {
    if (!message) {
      return;
    }

    return message.senderId !== activeUserId
      ? selectUserById(state, message.senderId)?.firstName
      : 'You';
  });

  const messagePreview = useMemo(
    () => `${senderName}: ${message?.content}`,
    [senderName, message]
  );

  const isUnread = useMemo(
    () => !message?.readBy.includes(activeUserId),
    [message]
  );

  // Bail out if any of the necessary data isn't available yet
  if (!chat || !message || otherUserIds?.length !== otherUsers?.length) {
    return null;
  }

  return (
    <button
      className={classNames(styles.container, {
        [styles.selected]: isSelected,
      })}
      onClick={onClick}
    >
      <div className={classNames(styles.avatar, layout.largeMarginHorizontal)}>
        <Avatar userIds={otherUserIds ?? []} />
      </div>
      <div className={styles.text}>
        <div className={classNames(styles.title, layout.smallMarginBottom)}>
          <span
            className={classNames(
              styles.name,
              layout.truncateTextEllipsis,
              layout.mediumMarginRight,
              isUnread ? fonts.boldStyle : fonts.semiBoldStyle
            )}
          >
            {chatName}
          </span>
          <span
            className={classNames(
              styles.date,
              layout.mediumMarginRight,
              fonts.smallSize,
              {
                [fonts.semiBoldStyle]: isUnread,
                [colors.textSecondary]: !isUnread,
              }
            )}
          >
            Fri
          </span>
        </div>
        <div
          className={classNames(
            layout.truncateTextEllipsis,
            layout.mediumMarginRight,
            {
              [fonts.semiBoldStyle]: isUnread,
              [colors.textSecondary]: !isUnread,
            }
          )}
        >
          {messagePreview}
        </div>
      </div>
    </button>
  );
}
