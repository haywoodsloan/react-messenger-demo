import classNames from 'classnames';

import Avatar from 'src/components/core/avatar';
import colors from 'src/styles/colors.module.scss';
import fonts from 'src/styles/fonts.module.scss';
import layout from 'src/styles/layout.module.scss';

import styles from './ConversationEntry.module.scss';

export default function ConversationEntry() {
  return (
    <button className={classNames(styles.divLike, styles.container)}>
      <div
        className={classNames(
          styles.avatar,
          layout.extraLargeMarginRight,
          layout.mediumMarginLeft
        )}
      >
        <Avatar />
      </div>
      <div className={styles.text}>
        <div className={classNames(styles.title, layout.smallMarginBottom)}>
          <span
            className={classNames(
              styles.name,
              layout.truncateTextEllipsis,
              layout.mediumMarginRight,
              fonts.semiBoldStyle,
              colors.textPrimary
            )}
          >
            Sloan Haywood
          </span>
          <span
            className={classNames(
              styles.date,
              layout.smallMarginRight,
              colors.textSecondary,
              fonts.smallSize
            )}
          >
            Fri
          </span>
        </div>
        <div className={colors.textSecondary}>Bottom Text</div>
      </div>
    </button>
  );
}
