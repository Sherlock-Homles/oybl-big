/*
 * @文件描述: 线路货运密度柱状图
 * @公司: thundersdata
 * @作者: 陈杰
 * @Date: 2018-12-29 21:09:29
 * @LastEditors: 陈杰
 * @LastEditTime: 2019-01-15 17:23:43
 */
import React from 'react';
import * as echarts from 'echarts/lib/echarts';
import { observer, inject } from 'mobx-react';

@inject('storyService')
@observer
export default class GoodsDensityChart extends React.Component {
  async componentDidMount() {
    this.chart = echarts.init(document.getElementById('goodsDensity'));
    await this.props.storyService.fetchGetGoodsDensity();
    const { goodsDensityOption } = this.props.storyService.storyStore;
    this.chart.setOption(goodsDensityOption);
  }
  render() {
    return <div id="goodsDensity" style={{ width: '100%', height: '100%' }} />;
  }
}
