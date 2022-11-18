import { useState } from 'react';

import styles from './Messenger.module.scss';
import ChatList from './chatList';
import ChatView from './chatView';

export default function Messenger() {
  const [selectedChatId, setSelectedChatId] = useState('');

  return (
    <div className={styles.container}>
      <div className={styles.convoList}>
        <ChatList
          selectedChatId={selectedChatId}
          setSelectedChatId={setSelectedChatId}
        />
      </div>
      <div className={styles.convoView}>
        <ChatView selectedChatId={selectedChatId} />
      </div>
    </div>
  );
}
