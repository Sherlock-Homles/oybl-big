import React from 'react';
import { observer, inject } from 'mobx-react';
import styles from './index.css';

const year = new Date().getFullYear();

@inject('titleService')
@observer
class Indicators extends React.Component {
  componentDidMount() {
    this.props.titleService.fetchGetTitleInfo();
    this.props.titleService.fetchGetYearTitleInfo({ year });
  }
  render() {
    const { titleInfo, yearTitleInfo } = this.props.titleService.titleStore;
    return (
      <>
        <div className={styles.indicatorsWrap}>
          <div className={styles.indicatorsLeft}>{`${year}年`}</div>
          <div className={styles.indicators}>
            <div className={styles.indicator}>
              <div className={styles.label}>主要站点</div>
              <div className={styles.value}>5</div>
            </div>
            <div className={styles.indicator}>
              <div className={styles.label}>开行列数（列）</div>
              {/* <div className={styles.value}>{yearTitleInfo.setOutTrain}</div> */}
              <div className={styles.value}>916</div>
            </div>
            <div className={styles.indicator}>
              <div className={styles.label}>货运量（TEU）</div>
              {/* <div className={styles.value}>{yearTitleInfo.boxCount}</div> */}
              <div className={styles.value}>75148</div>
            </div>
            <div className={styles.indicator}>
              <div className={styles.label}>业务流水（万元）</div>
              <div className={styles.value}>{yearTitleInfo.businessAmount}</div>
            </div>
            <div className={styles.indicator}>
              <div className={styles.label}>回程率（%）</div>
              {/* <div className={styles.value}>
                {(yearTitleInfo.returnRate && (yearTitleInfo.returnRate * 100).toFixed(2)) || 0}
              </div> */}
              <div className={styles.value}>47.38</div>
            </div>
            <div className={styles.indicator}>
              <div className={styles.label}>重箱率（%）</div>
              <div className={styles.value}>100</div>
            </div>
          </div>
          <div className={styles.indicatorsRight}></div>
        </div>
        <div className={styles.indicatorsWrap}>
          <div className={styles.indicatorsLeft}>累计</div>
          <div className={styles.indicators}>
            <div className={styles.indicator}>
              <div className={styles.label}>主要站点</div>
              <div className={styles.value}>5</div>
            </div>
            <div className={styles.indicator}>
              <div className={styles.label}>开行列数（列）</div>
              {/* <div className={styles.value}>{titleInfo.setOutTrain}</div> */}
              <div className={styles.value}>9999</div>
            </div>
            <div className={styles.indicator}>
              <div className={styles.label}>货运量（TEU）</div>
              {/* <div className={styles.value}>{titleInfo.boxCount}</div> */}
              <div className={styles.value}>761052</div>
            </div>
            <div className={styles.indicator}>
              <div className={styles.label}>业务流水（万元）</div>
              <div className={styles.value}>{titleInfo.businessAmount}</div>
            </div>
            <div className={styles.indicator}>
              <div className={styles.label}>回程率（%）</div>
              {/* <div className={styles.value}>
                {(titleInfo.returnRate && (titleInfo.returnRate * 100).toFixed(2)) || 0}
              </div> */}
              <div className={styles.value}>36.91</div>
            </div>
            <div className={styles.indicator}>
              <div className={styles.label}>重箱率（%）</div>
              <div className={styles.value}>100</div>
            </div>
          </div>
          <div className={styles.indicatorsRight}></div>
        </div>
      </>
    );
  }
}
export default Indicators;
