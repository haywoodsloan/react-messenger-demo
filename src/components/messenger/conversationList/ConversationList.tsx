import styles from './ConversationList.module.scss';
import ConversationEntry from './conversationEntry';

export default function ConversationList() {
  return (
    <div className={styles.container}>
      <ConversationEntry />
      <ConversationEntry />
      <ConversationEntry />
    </div>
  );
}
