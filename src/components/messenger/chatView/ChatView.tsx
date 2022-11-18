import classNames from 'classnames';
import moment from 'moment';
import { useMemo, useState } from 'react';

import Button from 'src/components/core/button';
import Input from 'src/components/core/input';
import { useLiveMessagesByChatId } from 'src/hooks/messenger';
import { useLiveUsersById } from 'src/hooks/profiles';
import { useAppSelector } from 'src/hooks/store';
import { selectChatById } from 'src/store/messenger/chats';
import { selectActiveUserId } from 'src/store/profiles/users';
import fonts from 'src/styles/fonts.module.scss';
import layout from 'src/styles/layout.module.scss';

import styles from './ChatView.module.scss';
import MessageEntry from './messageEntry';

interface Props {
  selectedChatId: string;
}

export default function ChatView({ selectedChatId }: Props) {
  const [pendingMessage, setPendingMessage] = useState<string>('');
  const activeUserId = useAppSelector(selectActiveUserId);

  const chat = useAppSelector((state) => selectChatById(state, selectedChatId));

  const otherUserIds = chat?.participantIds.filter((id) => id !== activeUserId);
  const otherUsers = useLiveUsersById(otherUserIds ?? []);

  const chatName = useMemo(
    () => otherUsers?.map((u) => `${u.firstName} ${u.lastName}`).join(', '),
    [otherUsers]
  );

  const messages = useLiveMessagesByChatId(selectedChatId);
  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => moment(b.sentAt).diff(moment(a.sentAt))),
    [messages]
  );

  return (
    <div className={styles.container}>
      <div
        className={classNames(
          styles.banner,
          fonts.boldStyle,
          fonts.extraLargeSize
        )}
      >
        <span className={layout.extraLargeMarginLeft}>{chatName}</span>
      </div>
      <div
        className={classNames(
          styles.scrollWrapper,
          layout.extraLargePaddingTop
        )}
      >
        <div className={styles.main}>
          {sortedMessages.map((message, idx) => (
            <MessageEntry
              key={message.messageId}
              messageId={message.messageId}
              clusterStart={
                sortedMessages[idx + 1]?.senderId !== message.senderId
              }
              clusterEnd={
                sortedMessages[idx - 1]?.senderId !== message.senderId
              }
            />
          ))}
        </div>
      </div>
      <div className={classNames(styles.footer, layout.largePadding)}>
        <Input
          className={classNames(layout.extraLargeMarginRight, styles.input)}
          placeholder="Type your message here"
          value={pendingMessage}
          onChange={(e) => setPendingMessage(e.target.value)}
        />
        <Button text="➤ Send" />
      </div>
    </div>
  );
}
