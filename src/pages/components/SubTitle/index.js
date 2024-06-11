import React from 'react';
import styles from './index.css';

const SubTitle = ({ text }) => (
  <div className={styles.subtitle}>
    <img src={require('../../../assets/triangle-left.png')} />
    <span>{text}</span>
    <img src={require('../../../assets/triangle-right.png')} />
  </div>
);
export default SubTitle;
