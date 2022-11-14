import classNames from 'classnames';
import getLineHeight from 'line-height';
import {
  ChangeEventHandler,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

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

  const [lineHeight, setLineHeight] = useState(0);
  const [verticalPadding, setVerticalPadding] = useState(0);

  useEffect(() => {
    if (textAreaRef.current) {
      const computedStyles = getComputedStyle(textAreaRef.current);
      setVerticalPadding(
        parseInt(computedStyles.paddingBottom) +
          parseInt(computedStyles.paddingTop)
      );
    }

    const updateLineHeight = () => {
      if (containerRef.current) {
        setLineHeight(getLineHeight(containerRef.current));
      }
    };

    updateLineHeight();
    document.fonts.addEventListener('loadingdone', updateLineHeight);

    return () => {
      document.fonts.removeEventListener('loadingdone', updateLineHeight);
    };
  }, []);

  useLayoutEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = '0';
      textAreaRef.current.style.overflowY = 'hidden';

      const coreHeight = textAreaRef.current.scrollHeight - verticalPadding;
      const lineCount = coreHeight / lineHeight;

      if (lineCount > maxLines) {
        textAreaRef.current.style.overflowY = 'auto';
        textAreaRef.current.style.height = `${maxLines * lineHeight}px`;
      } else {
        textAreaRef.current.style.height = `${lineCount * lineHeight}px`;
      }
    }
  }, [value, lineHeight, verticalPadding]);

  return (
    <div
      ref={containerRef}
      className={classNames(
        className,
        styles.container,
        layout.extraLargePaddingHorizontal,
        colors.fillSecondary
      )}
    >
      <textarea
        ref={textAreaRef}
        className={classNames(
          styles.textArea,
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
