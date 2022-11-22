import { Outlet } from 'react-router-dom';

import styles from './Messenger.module.scss';
import ChatList from './chatList';

export default function Messenger() {
  return (
    <div className={styles.container}>
      <div className={styles.convoList}>
        <ChatList />
      </div>
      <div className={styles.convoView}>
        <Outlet />
      </div>
    </div>
  );
}
