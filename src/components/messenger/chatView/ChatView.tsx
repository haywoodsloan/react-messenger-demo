import classNames from 'classnames';
import moment from 'moment';
import {
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Button from 'src/components/core/button';
import Input from 'src/components/core/input';
import { useLiveMessagesByChatId } from 'src/hooks/messenger';
import { useLiveUsersById } from 'src/hooks/profiles';
import { useAppDispatch, useAppSelector } from 'src/hooks/store';
import { selectChatById } from 'src/store/messenger/chats';
import {
  selectLastChatIdForMessages,
  sendMessageUpdates,
  sendNewMessage,
} from 'src/store/messenger/messages';
import { selectActiveUserId } from 'src/store/profiles/users';
import fonts from 'src/styles/fonts.module.scss';
import layout from 'src/styles/layout.module.scss';

import styles from './ChatView.module.scss';
import MessageEntry from './messageEntry';

type RouteParams = {
  chatId: string;
};

export default function ChatView() {
  const [pendingMessage, setPendingMessage] = useState('');
  const { chatId } = useParams<RouteParams>();

  const activeUserId = useAppSelector(selectActiveUserId);
  const chat = useAppSelector((state) =>
    chatId ? selectChatById(state, chatId) : undefined
  );

  const otherUserIds = chat?.participantIds.filter((id) => id !== activeUserId);
  const otherUsers = useLiveUsersById(otherUserIds ?? []);

  const chatName = useMemo(
    () => otherUsers?.map((u) => `${u.firstName} ${u.lastName}`).join(', '),
    [otherUsers]
  );

  const navigate = useNavigate();
  const onError = useCallback(() => navigate('/messenger'), [navigate]);

  const messages = useLiveMessagesByChatId(chatId, onError);
  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => moment(b.sentAt).diff(moment(a.sentAt))),
    [messages]
  );

  const dispatch = useAppDispatch();
  const lastChatId = useAppSelector(selectLastChatIdForMessages);

  // Mark unread messages as read once fully loaded
  useEffect(() => {
    if (!chatId || lastChatId !== chatId) {
      return;
    }

    const unreadMessages = messages.filter(
      (m) => !m.readBy.includes(activeUserId)
    );

    if (!unreadMessages.length) {
      return;
    }

    dispatch(
      sendMessageUpdates(
        unreadMessages.map((m) => ({
          messageId: m.messageId,
          readBy: [...m.readBy, activeUserId],
        }))
      )
    );
  }, [messages, lastChatId, activeUserId, dispatch]);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sendMessage = useCallback(async () => {
    if (!chatId) {
      return;
    }

    await dispatch(
      sendNewMessage({
        chatId,
        content: pendingMessage,
        senderId: activeUserId,
      })
    );

    setPendingMessage('');
    inputRef.current?.focus();
  }, [chatId, pendingMessage, activeUserId]);

  // Listen for enter key and send message unless shift is held
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
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
        <span
          className={classNames(
            layout.extraLargeMarginHorizontal,
            layout.truncateTextEllipsis
          )}
        >
          {chatName}
        </span>
      </div>
      <div
        className={classNames(
          styles.scrollWrapper,
          layout.extraLargePaddingTop
        )}
      >
        <div className={styles.main}>
          {useMemo(
            () =>
              sortedMessages.map((message, idx) => (
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
              )),
            [sortedMessages]
          )}
        </div>
      </div>
      <div className={classNames(styles.footer, layout.largePadding)}>
        <Input
          ref={inputRef}
          className={classNames(layout.extraLargeMarginRight, styles.input)}
          placeholder="Type your message here"
          value={pendingMessage}
          onChange={(e) => setPendingMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button text="➤ Send" onClick={sendMessage} />
      </div>
    </div>
  );
}
