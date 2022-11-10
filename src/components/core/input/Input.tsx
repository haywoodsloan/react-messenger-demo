import classNames from 'classnames';

import colors from 'src/styles/colors.module.scss';
import layout from 'src/styles/layout.module.scss';

import styles from './Input.module.scss';

interface Props {
  className?: string;
  placeholder?: string;
}

export default function Input({ className, placeholder }: Props) {
  return (
    <div
      className={classNames(
        className,
        styles.container,
        layout.largePaddingHorizontal,
        colors.fillSecondary
      )}
    >
      <textarea
        className={classNames(
          styles.textArea,
          colors.fillSecondary,
          colors.textTertiary,
          layout.largePaddingVertical
        )}
        placeholder={placeholder}
      />
    </div>
  );
}
