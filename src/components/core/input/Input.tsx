import classNames from 'classnames';
import lineHeight from 'line-height';
import { ChangeEventHandler, useEffect, useRef } from 'react';

import colors from 'src/styles/colors.module.scss';
import layout from 'src/styles/layout.module.scss';

import styles from './Input.module.scss';

interface Props {
  className?: string;
  maxLines?: number;
  placeholder?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
}

export default function Input({
  className,
  placeholder,
  value,
  onChange,
  maxLines = 5,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  let baseLineHeight: number;
  let verticalPadding: number;

  const setAutoHeight = () => {
    if (!containerRef.current || !textAreaRef.current) {
      return;
    }

    if (!baseLineHeight) {
      baseLineHeight = lineHeight(containerRef.current);
    }

    if (!verticalPadding) {
      const computedStyles = getComputedStyle(textAreaRef.current);
      verticalPadding =
        parseInt(computedStyles.paddingBottom) +
        parseInt(computedStyles.paddingTop);
    }

    textAreaRef.current.style.height = '0';
    textAreaRef.current.style.overflowY = 'hidden';
    const typeableHeight = textAreaRef.current.scrollHeight - verticalPadding;
    const lineCount = typeableHeight / baseLineHeight;

    if (lineCount > maxLines) {
      textAreaRef.current.style.overflowY = 'auto';
      textAreaRef.current.style.height = `${maxLines * baseLineHeight}px`;
    } else {
      textAreaRef.current.style.height = `${lineCount * baseLineHeight}px`;
    }
  };

  // in case the fonts aren't loaded yet
  // re-calc the height when they are
  document.fonts.ready.then(setAutoHeight);
  useEffect(setAutoHeight, [value]);

  return (
    <div
      ref={containerRef}
      className={classNames(
        className,
        styles.container,
        layout.largePaddingHorizontal,
        colors.fillSecondary
      )}
    >
      <textarea
        ref={textAreaRef}
        className={classNames(
          styles.textArea,
          colors.fillSecondary,
          colors.textTertiary,
          layout.largePaddingVertical
        )}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={1}
      />
    </div>
  );
}
