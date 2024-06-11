/*
 * @文件描述: 行业分布散点图
 * @公司: thundersdata
 * @作者: 陈杰
 * @Date: 2018-12-29 21:09:17
 * @LastEditors: 陈杰
 * @LastEditTime: 2019-01-15 17:23:09
 */
import React from 'react';
import * as echarts from 'echarts/lib/echarts';
import { observer, inject } from 'mobx-react';

@inject('mapService', 'storyService')
@observer
export default class IndustryDistributionChart extends React.Component {
  async componentDidMount() {
    this.chart = echarts.init(document.getElementById('industryDistribution'));
    await this.props.storyService.fetchGetIndustryDistribution();
    const { industryDistributionOption } = this.props.storyService.storyStore;
    this.chart.setOption(industryDistributionOption);
  }
  render() {
    return <div id="industryDistribution" style={{ width: '100%', height: '100%' }} />;
  }
}
