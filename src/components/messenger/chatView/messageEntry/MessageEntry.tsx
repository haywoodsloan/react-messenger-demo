import classNames from 'classnames';

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
        layout.largePadding,
        layout.extraLargeMarginHorizontal,
        clusterEnd ? layout.extraLargeMarginBottom : layout.smallMarginBottom,
        {
          [styles.fromSelf]: fromSelf,
          [styles.clusterEnd]: clusterEnd,
          [styles.clusterStart]: clusterStart,
        }
      )}
    >
      <span>Hey</span>
      <div
        className={classNames(
          styles.date,
          colors.textSecondary,
          fonts.extraSmallSize,
          layout.mediumMarginTop
        )}
      >
        10:00 AM, Nov 11
      </div>
    </div>
  );
}
