import classNames from 'classnames';

import colors from 'src/styles/colors.module.scss';
import fonts from 'src/styles/fonts.module.scss';
import layout from 'src/styles/layout.module.scss';

import styles from './Button.module.scss';

interface Props {
  className?: string;
  text: string;
}

export default function Button({ className, text }: Props) {
  return (
    <div
      className={classNames(
        className,
        styles.container,
        colors.fillSecondary,
        colors.textTertiary,
        fonts.mediumSize,
        fonts.semiBoldStyle,
        layout.mediumPadding
      )}
    >
      {text}
    </div>
  );
}
