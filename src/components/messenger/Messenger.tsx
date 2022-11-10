import styles from './Messenger.module.scss';
import ChatList from './chatList';
import ChatView from './chatView';

export default function Messenger() {
  return (
    <div className={styles.container}>
      <div className={styles.convoList}>
        <ChatList />
      </div>
      <div className={styles.convoView}>
        <ChatView />
      </div>
    </div>
  );
}
