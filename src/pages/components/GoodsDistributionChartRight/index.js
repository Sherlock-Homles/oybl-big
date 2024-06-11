import React from 'react';
import * as echarts from 'echarts/lib/echarts';
import { observer, inject } from 'mobx-react';

@inject('storyService')
@observer
export default class GoodsDistributionChartRight extends React.Component {
  async componentDidMount() {
    this.chart = echarts.init(document.getElementById('goodsDistributionRight'));
    await this.props.storyService.fetchGetGoodsDistribution();
    const  goodsDistributionOptionRight  = this.props.storyService.storyStore.goodsDistributionOptionRight;
    this.chart.setOption(goodsDistributionOptionRight );
  }
  render() {
    return <div id="goodsDistributionRight" style={{ width: '50%', height: '100%',float:'right' }} />;
  }
}
