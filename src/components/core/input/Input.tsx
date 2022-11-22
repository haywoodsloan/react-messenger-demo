import classNames from 'classnames';
import getLineHeight from 'line-height';
import {
  ChangeEventHandler,
  KeyboardEventHandler,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import useResizeObserver from 'use-resize-observer';

import colors from 'src/styles/colors.module.scss';
import layout from 'src/styles/layout.module.scss';

import styles from './Input.module.scss';

type ParentRef = HTMLTextAreaElement | null;

interface Props {
  className?: string;
  maxLines?: number;
  placeholder?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>;
}

export default forwardRef<ParentRef, Props>(function Input(
  { className, placeholder, value, onChange, maxLines = 5, onKeyDown },
  parentRef
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Because we need a local reference to the textarea too
  // We use an imperative handle to share the local ref with the parent
  useImperativeHandle<ParentRef, ParentRef>(
    parentRef,
    () => textAreaRef.current,
    [parentRef]
  );

  const [lineHeight, setLineHeight] = useState(0);
  const [verticalPadding, setVerticalPadding] = useState(0);

  // Get the initial line height and vertical padding on mount
  // Listen for font loading events to double check if line height changed
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

  // Adjust the height of the text area to fit the
  // current scroll height up to the max number of lines
  const { width } = useResizeObserver({ ref: textAreaRef });
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
  }, [value, width, lineHeight, verticalPadding]);

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
        onKeyDown={onKeyDown}
        rows={1}
      />
    </div>
  );
});
