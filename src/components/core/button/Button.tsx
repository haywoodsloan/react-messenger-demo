import classNames from 'classnames';

import colors from 'src/styles/colors.module.scss';
import fonts from 'src/styles/fonts.module.scss';
import layout from 'src/styles/layout.module.scss';

import styles from './Button.module.scss';

interface Props {
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  text: string;
}

export default function Button({ className, onClick, text }: Props) {
  return (
    <button
      className={classNames(
        className,
        styles.button,
        styles.container,
        colors.fillSecondary,
        colors.textTertiary,
        fonts.mediumSize,
        fonts.semiBoldStyle,
        layout.mediumPadding
      )}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
