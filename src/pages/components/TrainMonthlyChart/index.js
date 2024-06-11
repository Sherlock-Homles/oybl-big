/*
 * @文件描述: 开行情况图
 * @公司: thundersdata
 * @作者: 陈杰
 * @Date: 2018-12-29 21:08:22
 * @LastEditors: 陈杰
 * @LastEditTime: 2019-01-15 17:23:23
 */
import React from 'react';
import { observer, inject } from 'mobx-react';
import { reaction, toJS } from 'mobx';
import * as echarts from 'echarts/lib/echarts';

@inject('storyService')
@observer
export default class TrainMonthlyChart extends React.Component {
  async componentDidMount() {
    this.chart = echarts.init(document.getElementById('trainMonthly'));
    await this.props.storyService.fetchGetRunInfo();
    const { runInfoOption } = this.props.storyService.storyStore;
    this.chart.setOption(runInfoOption);
  }

  render() {
    return <div id="trainMonthly" style={{ width: '100%', height: '100%' }} />;
  }
}
