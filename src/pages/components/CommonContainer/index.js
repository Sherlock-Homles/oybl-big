import React from 'react';
import styles from './index.css';

const CommonContainer = props => (
  <div className={styles.container}>
    <div className="leftTop" />
    <div className="leftBottom" />
    <div className="rightTop" />
    <div className="rightBottom" />
    <div className={styles.title} onClick={props.onClick}>
      <div className={styles.titleLeft}>
        <img src={require('../../../assets/arrow-right.png')} />
        <div className={styles.text}>{props.title}</div>
      </div>
      {props.showTitleRight && props.titleRight}
    </div>
    <div className={styles.chart}>{props.children}</div>
  </div>
);
export default CommonContainer;
