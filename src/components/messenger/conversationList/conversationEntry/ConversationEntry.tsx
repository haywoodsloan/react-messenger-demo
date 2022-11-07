import styles from './ConversationEntry.module.scss';

export default function ConversationEntry() {
  return (
    <div className={styles.container}>
      <div className={styles.avatar}>X</div>
      <div className={styles.preview}>
        <div>Top Text</div>
        <div>Bottom Text</div>
      </div>
    </div>
  );
}
