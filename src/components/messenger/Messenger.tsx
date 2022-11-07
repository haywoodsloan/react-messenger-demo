import styles from './Messenger.module.scss';
import ConversationList from './conversationList';
import ConversationView from './conversationView';

export default function Messenger() {
  return (
    <div className={styles.container}>
      <div className={styles.convoList}>
        <ConversationList />
      </div>
      <div className={styles.convoView}>
        <ConversationView />
      </div>
    </div>
  );
}
