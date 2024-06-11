import React from 'react';
import { observer, inject } from 'mobx-react';
import * as echarts from 'echarts/lib/echarts';
import styles from './index.css';

const color = ['#35d003', '#ed9d10', '#f36966', '#7f36e3', '#00b8ff'];
@inject('rightInfoService')
@observer
class TransportChart extends React.Component {
  async componentDidMount() {
    await this.props.rightInfoService.fetchGetMultiTransport();
    const { multiTransport } = this.props.rightInfoService.rightInfoStore;
    const data = [];
    multiTransport.forEach((item, index) => {
      data.push(
        {
          ...item,
          itemStyle: {
            borderColor: color[index],
            shadowColor: color[index],
          },
        },
        {
          name: '',
          value: 50,
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          itemStyle: {
            color: 'rgba(0, 0, 0, 0)',
            borderColor: 'rgba(0, 0, 0, 0)',
            borderWidth: 0,
          },
        }
      );
    });

    this.chart = echarts.init(document.getElementById('transport'));
    this.chart.setOption({
      color,
      title: {
        text: '多式联运',
        x: 'center',
        top: 5,
        textStyle: {
          color: '#00b9fd',
          fontSize: 20,
        },
      },
      series: [
        {
          type: 'pie',
          clockwise: true,
          radius: ['58%', '60%'],
          labelLine: {
            show: false,
            length: 15,
            length2: 0,
          },
          label: {
            show: true,
            position: 'outside',
            color: '#ddd',
            formatter: function({ data: { name, value, percent } }) {
              if (name !== '') {
                return (
                  '{value|' +
                  name +
                  '}\n{value|' +
                  value +
                  '}{percent|[' +
                  (percent * 100).toFixed(0) +
                  ']%}'
                );
              } else {
                return '';
              }
            },
            rich: {
              value: {
                color: '#ffffff',
                align: 'left',
                padding: [0, 5, 0, 0],
              },
              percent: {
                color: '#00a0fe',
                align: 'left',
              },
            },
          },
          itemStyle: {
            borderWidth: 5,
            shadowBlur: 5,
          },
          data,
        },
      ],
    });
  }

  render() {
    return (
      <div className={styles.wrap}>
        <div className="leftTop" />
        <div className="leftBottom" />
        <div id="transport" className={styles.transport} />
      </div>
    );
  }
}
export default TransportChart;
