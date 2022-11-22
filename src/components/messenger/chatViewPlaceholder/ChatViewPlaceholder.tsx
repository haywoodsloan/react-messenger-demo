import classNames from 'classnames';

import fonts from 'src/styles/fonts.module.scss';

import styles from './ChatViewPlaceholder.module.scss';

export default function ChatViewPlaceholder() {
  return (
    <div
      className={classNames(styles.container, fonts.largeSize, fonts.boldStyle)}
    >
      Select a chat to view its messages
    </div>
  );
}
