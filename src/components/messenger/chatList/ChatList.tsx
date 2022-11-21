import classNames from 'classnames';
import moment from 'moment';
import { MouseEventHandler, useCallback, useMemo } from 'react';

import Button from 'src/components/core/button';
import { useLiveChatsByUserId, useLiveMessagesById } from 'src/hooks/messenger';
import { useLiveUsersById } from 'src/hooks/profiles';
import { useAppSelector } from 'src/hooks/store';
import { selectMessageEntities } from 'src/store/messenger/messages';
import { selectActiveUserId } from 'src/store/profiles/users';
import fonts from 'src/styles/fonts.module.scss';
import layout from 'src/styles/layout.module.scss';

import styles from './ChatList.module.scss';
import ChatEntry from './chatEntry';

interface Props {
  selectedChatId: string;
  setSelectedChatId: (id: string) => void;
}

export default function ChatList({ selectedChatId, setSelectedChatId }: Props) {
  const activeUserId = useAppSelector(selectActiveUserId);
  const chats = useLiveChatsByUserId(activeUserId);

  // The selected chat will be fetched/subscribed to in the chat view
  const unselectedChats = useMemo(
    () => chats.filter((c) => c.chatId !== selectedChatId),
    [chats, selectedChatId]
  );

  useLiveMessagesById(unselectedChats.map((c) => c.lastMessageId));
  useLiveUsersById(
    Array.from(
      new Set(unselectedChats.flatMap((c) => c.participantIds))
    ).filter((id) => id !== activeUserId)
  );

  // We need the messages to sort the chats by date,
  // but the fetching/subscribing is handled above so just use a basic selector
  const messages = useAppSelector(selectMessageEntities);
  const sortedChats = useMemo(
    () =>
      [...chats].sort((a, b) =>
        moment(messages[b.lastMessageId]?.sentAt).diff(
          messages[a.lastMessageId]?.sentAt
        )
      ),
    [chats, messages]
  );

  const onNewMessage = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      event.currentTarget.blur();
      alert(
        'To unlock starting new chats please upgrade to premium for $99/mo!'
      );
    },
    []
  );

  return (
    <div className={styles.container}>
      <div className={classNames(styles.banner, layout.largePaddingLeft)}>
        <span className={classNames(fonts.extraLargeSize, fonts.semiBoldStyle)}>
          Messenger
        </span>
        <Button
          className={styles.button}
          text="＋New Chat"
          onClick={onNewMessage}
        />
      </div>
      <div className={styles.list}>
        {useMemo(
          () =>
            sortedChats.map((chat) => (
              <ChatEntry
                key={chat.chatId}
                chatId={chat.chatId}
                isSelected={selectedChatId === chat.chatId}
                onClick={() => setSelectedChatId(chat.chatId)}
              />
            )),
          [sortedChats, selectedChatId]
        )}
      </div>
    </div>
  );
}
