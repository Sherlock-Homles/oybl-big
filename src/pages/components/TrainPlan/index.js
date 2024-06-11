/*
 * @文件描述:
 * @公司: thundersdata
 * @作者: 王翠娇
 * @Date: 2020-06-08 10:14:50
 * @LastEditors: 王翠娇
 * @LastEditTime: 2021-12-01 15:23:54
 */
import React from 'react';
import { observer, inject } from 'mobx-react';
import styles from './index.css';
import { RAF } from '../../../utils/RAF';

const colors = ['#fe8a00', '#00b9fd', '#183b74', '#d48265', '#91c7ae'];

@inject('rightInfoService')
@observer
class TrainPlan extends React.Component {
  componentDidMount() {
    this.props.rightInfoService.fetchGetTrainPlanInfo();

    this.raf = new RAF();
    const box = document.getElementById('box2');
    const con = document.getElementById('con2');
    this.raf.setInterval(() => {
      if (box.scrollTop >= con.scrollHeight) {
        box.scrollTop = 0;
      } else {
        box.scrollTop = box.scrollTop + 2;
      }
    }, 50);
  }

  render() {
    const { trainPlanInfo } = this.props.rightInfoService.rightInfoStore;
    return (
      <div className={styles.plan}>
        <div className="leftTop" />
        <div className="leftBottom" />
        <div className="rightTop" />
        <div className="rightBottom" />

        <div className={styles.title}>班列计划</div>
        <div className={styles.box} id="box2">
          <ul id="con2">
            {trainPlanInfo.map((contentItem, index) => (
              <li className={styles.planItem} key={index}>
                <div
                  style={{
                    color: '#ffffff',
                    width: '22px',
                    textAlign: 'center',
                    lineHeight: '22px',
                    backgroundColor: '#00a1fe',
                  }}
                >
                  {++index}
                </div>
                <div className={styles.content}>{contentItem.content}</div>
              </li>
            ))}
          </ul>
          <ul>
            {trainPlanInfo.map((contentItem, index) => (
              <li className={styles.planItem} key={index}>
                <div
                  style={{
                    color: '#ffffff',
                    width: '22px',
                    textAlign: 'center',
                    lineHeight: '22px',
                    backgroundColor: '#00a1fe',
                  }}
                >
                  {++index}
                </div>
                <div className={styles.content}>{contentItem.content}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
export default TrainPlan;
