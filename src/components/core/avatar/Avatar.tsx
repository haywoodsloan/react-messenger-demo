import classNames from 'classnames';

import colors from 'src/styles/colors.module.scss';
import fonts from 'src/styles/fonts.module.scss';

import styles from './Avatar.module.scss';

export default function Avatar() {
  return (
    <div
      className={classNames(
        styles.container,
        colors.fillSecondary,
        colors.textTertiary,
        fonts.largeSize
      )}
      aria-hidden="true"
    >
      SH
    </div>
  );
}
