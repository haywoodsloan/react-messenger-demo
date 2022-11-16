import classNames from 'classnames';

import Button from 'src/components/core/button';
import { useRealtimeChats } from 'src/hooks/realtime';
import fonts from 'src/styles/fonts.module.scss';
import layout from 'src/styles/layout.module.scss';

import styles from './ChatList.module.scss';
import ChatEntry from './chatEntry';

export default function ChatList() {
  const onNewMessage: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    alert('To unlock starting new chats please upgrade to premium for $99/mo!');
    event.currentTarget.blur();
  };

  const chats = useRealtimeChats('self'); // TODO get the userId from the store too

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
        {chats.map((chat) => (
          <ChatEntry key={chat.chatId} />
        ))}
      </div>
    </div>
  );
}
