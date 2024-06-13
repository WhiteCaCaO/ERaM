import React from 'react';
import styles from './CustomChatStyle.module.css'; // CSS 모듈을 임포트합니다.

function InputToolbox({ children }) {
  return <div className={styles.inputToolbox}>{children}</div>;
}

export default InputToolbox;
