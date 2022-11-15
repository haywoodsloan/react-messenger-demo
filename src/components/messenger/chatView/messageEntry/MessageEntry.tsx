import classNames from 'classnames';

import Avatar from 'src/components/core/avatar';
import colors from 'src/styles/colors.module.scss';
import fonts from 'src/styles/fonts.module.scss';
import layout from 'src/styles/layout.module.scss';

import styles from './MessageEntry.module.scss';

interface Props {
  fromSelf: boolean; // TODO remove once real data is being used
  clusterStart: boolean;
  clusterEnd: boolean;
}

export default function MessageEntry({
  fromSelf,
  clusterStart,
  clusterEnd,
}: Props) {
  return (
    <div
      className={classNames(
        styles.container,
        layout.extraLargeMarginHorizontal,
        clusterEnd ? layout.extraLargeMarginBottom : layout.smallMarginBottom,
        {
          [styles.fromSelf]: fromSelf,
        }
      )}
    >
      {!fromSelf && (
        <div className={styles.avatar}>{clusterEnd && <Avatar />}</div>
      )}
      <div>
        <div
          className={classNames(styles.bubble, layout.largePadding, {
            [styles.clusterEnd]: clusterEnd,
            [styles.clusterStart]: clusterStart,
          })}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Tempus
          egestas sed sed risus pretium quam vulputate dignissim suspendisse.
        </div>
        {clusterEnd && (
          <div
            className={classNames(
              styles.date,
              colors.textSecondary,
              fonts.extraSmallSize,
              layout.smallMarginTop,
              layout.mediumMarginLeft
            )}
          >
            10:00 AM, Nov 11
          </div>
        )}
      </div>
    </div>
  );
}
