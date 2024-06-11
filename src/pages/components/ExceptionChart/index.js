import React from 'react';
import { observer, inject } from 'mobx-react';
import * as echarts from 'echarts/lib/echarts';

import styles from './index.css';

@inject('rightInfoService')
@observer
class ExceptionChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      period: ['按月', '按季', '按年'],
      chartTitle: '货量走势（月）',
      currentIndex: 0,
    };
  }

  /*生成图表*/
  createChart = (chartTitle, commodityNum, seasons) => {
    this.chart = echarts.init(document.getElementById('exception'));
    this.chart.setOption({
      title: {
        text: chartTitle,
        textStyle: {
          color: '#00a0fe',
          align: 'center',
        },
        x: 'center',
        top: 5,
      },
      legend: {
        show: false,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: true,
          axisLine: {
            lineStyle: {
              color: '#0063a2',
            },
          },
          axisLabel: {
            color: '#ffffff',
          },
          data: seasons,
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '货量：箱',
          min: 0,
          position: 'left',
          axisLine: {
            lineStyle: {
              color: '#0063a2',
            },
          },
          axisLabel: {
            color: '#ffffff',
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#2a4072',
            },
          },
        },
        {
          type: 'value',
          name: '环比%',
          // min: 0,
          position: 'right',
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#5793f3',
            },
          },
          axisLabel: {
            color: '#ffffff',
          },
        },
      ],
      series: [
        {
          name: '货量',
          type: 'bar',
          yAxisIndex: 0,
          barWidth: '15%',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#f26666',
              },
              {
                offset: 1,
                color: '#ee9d11',
              },
            ]),
          },
          data: commodityNum.map(item => item.value),
        },
        {
          name: '环比',
          type: 'line',
          yAxisIndex: 1,
          symbolSize: 10,
          lineStyle: {
            color: '#00bfff',
          },
          itemStyle: {
            borderColor: '#00bfff',
            borderWidth: 1,
            color: '#ffffff',
          },
          areaStyle: {
            opacity: 0.1,
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: '#009dff',
                },
                {
                  offset: 1,
                  color: '#0acdf4',
                },
              ],
              false
            ),
          },
          data: commodityNum.map(item => (item.rate * 100).toFixed(2)),
        },
      ],
    });
  };

  /*点击切换图表*/
  toggleChart = async event => {
    //图表标题切换
    let { chartTitle } = this.state;
    const date = event.currentTarget.innerText.substr(1, 1);
    chartTitle = `货量走势（${date}）`;
    //字体颜色切换
    const index = event.currentTarget.getAttribute('tabIndex');
    //更新
    this.setState({
      chartTitle,
      currentIndex: parseInt(index, 10),
    });
    //请求数据
    let query;
    if (date === '月') query = { period: 'month' };
    if (date === '季') query = { period: 'quarter' };
    if (date === '年') query = { period: 'year' };
    await this.props.rightInfoService.fetchGetCommodityNum(query);
    let { commodityNum } = this.props.rightInfoService.rightInfoStore;

    let seasons;
    if (date === '季') {
      let season;
      seasons = commodityNum.map(item => {
        let month = item.date.substring(5);
        let year = item.date.substring(0, 4);
        if (month >= 1 && month <= 3) season = `${year}年-第一季度`;
        if (month >= 4 && month <= 6) season = `${year}年-第二季度`;
        if (month >= 7 && month <= 9) season = `${year}年-第三季度`;
        if (month >= 10 && month <= 12) season = `${year}年-第四季度`;
        return season;
      });
    } else {
      seasons = commodityNum.map(item => item.date);
    }

    this.createChart(chartTitle, commodityNum, seasons);
  };

  async componentDidMount() {
    const { chartTitle } = this.state;
    await this.props.rightInfoService.fetchGetCommodityNum({ period: 'month' });
    const { commodityNum } = this.props.rightInfoService.rightInfoStore;
    let seasons = commodityNum.map(item => item.date);
    this.createChart(chartTitle, commodityNum, seasons);
  }

  componentWillUpdate() {}

  render() {
    const { period, currentIndex } = this.state;
    return (
      <div>
        <div className={styles.wrap}>
          <div className={styles.exceptionButs}>
            {period.map((item, index) => {
              return (
                <div
                  id="button"
                  className={styles.button}
                  key={index}
                  onClick={this.toggleChart}
                  tabIndex={index}
                  style={{ color: index === currentIndex ? '#00b9fd' : 'white' }}
                >
                  {item}
                  <div
                    className={styles.mask}
                    style={{ display: index === currentIndex ? 'block' : 'none' }}
                  >
                    <div className={styles.maskLeftTop} />
                    <div className={styles.maskLeftBottom} />
                    <div className={styles.maskRightTop} />
                    <div className={styles.maskRightBottom} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="leftTop" />
          <div className="leftBottom" />
          <div className="rightTop" />
          <div className="rightBottom" />
          <div id="exception" className={styles.exception} />
        </div>
      </div>
    );
  }
}

export default ExceptionChart;
