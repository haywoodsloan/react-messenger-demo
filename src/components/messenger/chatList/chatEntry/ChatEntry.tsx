import classNames from 'classnames';

import Avatar from 'src/components/core/avatar';
import colors from 'src/styles/colors.module.scss';
import fonts from 'src/styles/fonts.module.scss';
import layout from 'src/styles/layout.module.scss';

import styles from './ChatEntry.module.scss';

export default function ChatEntry() {
  return (
    <button className={styles.container}>
      <div className={classNames(styles.avatar, layout.largeMarginHorizontal)}>
        <Avatar />
      </div>
      <div className={styles.text}>
        <div className={classNames(styles.title, layout.smallMarginBottom)}>
          <span
            className={classNames(
              styles.name,
              layout.truncateTextEllipsis,
              layout.mediumMarginRight,
              fonts.semiBoldStyle
            )}
          >
            Sloan Haywood
          </span>
          <span
            className={classNames(
              styles.date,
              layout.mediumMarginRight,
              colors.textSecondary,
              fonts.smallSize
            )}
          >
            Fri
          </span>
        </div>
        <div
          className={classNames(
            colors.textSecondary,
            layout.truncateTextEllipsis
          )}
        >
          You: Hello World!
        </div>
      </div>
    </button>
  );
}
