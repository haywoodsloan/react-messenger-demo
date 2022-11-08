import classNames from 'classnames';

import Avatar from 'src/components/core/avatar';
import colors from 'src/styles/colors.module.scss';
import fonts from 'src/styles/fonts.module.scss';
import layout from 'src/styles/layout.module.scss';

import styles from './ConversationEntry.module.scss';

export default function ConversationEntry() {
  return (
    <div className={styles.container}>
      <div
        className={classNames(
          styles.avatar,
          layout.extraLargeMarginRight,
          layout.mediumMarginLeft
        )}
      >
        <Avatar />
      </div>
      <div className={styles.preview}>
        <div
          className={classNames(
            layout.smallMarginBottom,
            fonts.semiBoldStyle,
            colors.textPrimary
          )}
        >
          Top Text
        </div>
        <div className={colors.textSecondary}>Bottom Text</div>
      </div>
    </div>
  );
}
