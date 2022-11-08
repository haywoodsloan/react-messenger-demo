import classNames from 'classnames';

import colors from 'src/styles/colors.module.scss';

import styles from './Avatar.module.scss';

export default function Avatar() {
  return (
    <div className={classNames(styles.container, colors.fillSecondary)}>X</div>
  );
}
