import React from 'react';
import styles from './index.css';

/**
 * 线路信息，位于中间部分的底部
 */
const LineInfo = props => (
  <div className={`animated fadeInUp ${styles.info}`}>
    <div className={styles.title}>{`[  ${props.mapLineInfo.name}-班列信息  ]`}</div>
    <ul className={styles.line}>
      <li className={styles.item}>
        <span className={styles.label}>起点</span>
        <span className={styles.value}>{props.mapLineInfo.start}</span>
      </li>
      <li className={styles.item}>
        <span className={styles.label}>终点</span>
        <span className={styles.value}>{props.mapLineInfo.end}</span>
      </li>
      <li className={styles.item}>
        <span className={styles.label}>经停站点数</span>
        <span className={styles.value}>{`${props.mapLineInfo.stopCount}个`}</span>
      </li>
      <li className={styles.item}>
        <span className={styles.label}>里程数</span>
        <span className={styles.value}>{`${props.mapLineInfo.distance}KM`}</span>
      </li>
      <li className={styles.item}>
        <span className={styles.label}>发车时间</span>
        <span className={styles.value}>
          {new Date(props.mapLineInfo.fristRunDate).toLocaleDateString()}
        </span>
      </li>
      {/* <li className={styles.item}>
        <span className={styles.label}>预计到达时间</span>
        <span className={styles.value}>{props.mapLineInfo.distance}</span>
      </li> */}
      <li className={styles.item}>
        <span className={styles.label}>预计运行时间</span>
        <span className={styles.value}>{`${props.mapLineInfo.days}天`}</span>
      </li>
      <li className={styles.item}>
        <span className={styles.label}>途经最高温度</span>
        <span className={styles.value}>{`${props.mapLineInfo.highestTemp}℃(${
          props.mapLineInfo.highestTempLocation
        })`}</span>
      </li>
      <li className={styles.item}>
        <span className={styles.label}>途径最低温度</span>
        <span className={styles.value}>{`${props.mapLineInfo.lowestTemp}℃(${
          props.mapLineInfo.lowestTempLocation
        })`}</span>
      </li>
    </ul>
  </div>
);
export default LineInfo;
