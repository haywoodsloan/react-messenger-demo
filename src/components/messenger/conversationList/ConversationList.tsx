import classNames from 'classnames';

import Button from 'src/components/core/button';
import colors from 'src/styles/colors.module.scss';
import fonts from 'src/styles/fonts.module.scss';
import layout from 'src/styles/layout.module.scss';

import styles from './ConversationList.module.scss';
import ConversationEntry from './conversationEntry';

export default function ConversationList() {
  return (
    <div className={styles.container}>
      <div className={classNames(styles.banner, layout.largePaddingLeft)}>
        <span
          className={classNames(
            fonts.extraLargeSize,
            fonts.boldStyle,
            colors.textPrimary
          )}
        >
          Messenger
        </span>
        <Button className={styles.button} text="＋New Message" />
      </div>
      <div className={styles.list}>
        <ConversationEntry />
        <ConversationEntry />
        <ConversationEntry />
        <ConversationEntry />
        <ConversationEntry />
      </div>
    </div>
  );
}
