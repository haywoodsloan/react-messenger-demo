import classNames from 'classnames';
import { useState } from 'react';

import Button from 'src/components/core/button';
import Input from 'src/components/core/input';
import fonts from 'src/styles/fonts.module.scss';
import layout from 'src/styles/layout.module.scss';

import styles from './ChatView.module.scss';

export default function ChatView() {
  const [message, setMessage] = useState<string>('');

  return (
    <div className={styles.container}>
      <div
        className={classNames(
          styles.banner,
          fonts.boldStyle,
          fonts.extraLargeSize
        )}
      >
        <span className={layout.extraLargeMarginLeft}>Sloan Haywood</span>
      </div>
      <div className={styles.main}></div>
      <div className={classNames(styles.footer, layout.largePadding)}>
        <Input
          className={classNames(layout.extraLargeMarginRight, styles.input)}
          placeholder="Type your message here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button text="➤ Send" />
      </div>
    </div>
  );
}
