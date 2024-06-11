import React from 'react';
import { observer, inject } from 'mobx-react';
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import styles from './index.css';

@inject('rightInfoService')
@observer
class VASChart extends React.Component {
  async componentDidMount() {
    await this.props.rightInfoService.fetchGetFinanceInfo();
    const { financeInfo } = this.props.rightInfoService.rightInfoStore;

    this.chart = echarts.init(document.getElementById('vas'));
    this.chart.setOption({
      title: {
        text: '增值业务',
        x: 'center',
        top: 5,
        textStyle: {
          fontSize: 20,
          color: '#00b9fd',
        },
      },
      tooltip: {
        trigger: 'item',
      },
      radar: {
        radius: '60%',
        center: ['50%', '55%'],
        axisLine: {
          lineStyle: {
            color: '#00b9fd',
          },
        },
        splitLine: {
          lineStyle: {
            color: '#00b9fd',
          },
        },
        splitArea: {
          areaStyle: {
            color: 'transparent',
          },
        },
        indicator:
          (financeInfo.length > 0 &&
            financeInfo.map(item => {
              item.max = 80;
              item.color = '#ffffff';
              return item;
            })) ||
          [],
      },
      series: [
        {
          name: '增值业务',
          type: 'radar',
          label: {
            position: 'outside',
          },
          data: [
            {
              value:
                (financeInfo.length > 0 &&
                  financeInfo.map(item => (item.value * 100).toFixed(2))) ||
                [],
              name: '业务看板',
            },
          ],
          label: {
            color: '#ffffff',
          },
          lineStyle: {
            color: '#fe8a00',
            opacity: 0.8,
          },
          itemStyle: {
            color: '#ffffff',
            borderColor: '#fe8a00',
          },
          areaStyle: {
            color: '#fe8a00',
            opacity: 0.5,
          },
        },
      ],
    });
  }

  render() {
    return <div id="vas" className={styles.vas} />;
  }
}
export default VASChart;
