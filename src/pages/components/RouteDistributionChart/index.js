/*
 * @文件描述:
 * @公司: thundersdata
 * @作者: 黄建停
 * @Date: 2019-03-02 15:24:54
 * @LastEditors: 黄建停
 * @LastEditTime: 2019-03-02 15:24:54
 */
/*
 * @文件描述: 路线分布饼图
 * @公司: thundersdata
 * @作者: 陈杰
 * @Date: 2018-12-29 21:08:36
 * @LastEditors: 黄建停
 * @LastEditTime: 2019-08-26 17:12:52
 */
import React from 'react';
import { toJS } from 'mobx';
import * as echarts from 'echarts/lib/echarts';
import { observer, inject } from 'mobx-react';
import { deepEqual } from '../../../utils/diff';

@inject('storyService', 'mapService')
@observer
export default class RouteDistributionChart extends React.Component {
  /**
   * @功能描述: 重新渲染地图
   * @参数: cityValue:城市value,lineValue:线路value,lineName:城市名称
   * @返回值:
   */
  renderMap = async (cityValue, lineValue, lineName) => {
    await this.props.storyService.fetchGetFreightDistribution({
      lineValue,
      cityValue,
    });
    const { cityName, freightDistribution } = this.props.storyService.storyStore;
    const freightDistributionData = toJS(freightDistribution);
    freightDistributionData.forEach(item => {
      item.name = `${item.name}市`;
      if (item.name === `${cityName}市`) {
        item.selected = true;
      }
    });
    // 重新获取地图
    if (cityName) {
      this.props.mapService.fetchshandongMap(freightDistributionData, `${cityName}市`);
    } else {
      this.props.mapService.fetchWorldMap01({
        type: 'routeDistribute',
        name: lineName,
      });
    }
  };

  /**
   * @功能描述: 重新获取其他story的数据
   * @参数: cityValue:城市value,lineValue:线路value
   * @返回值:
   */
  getOtherStoryData = (cityValue, lineValue) => {
    this.props.storyService.fetchGoodsShipmentSituation({ lineValue, cityValue });
    const { topTenType } = this.props.storyService.storyStore;
    this.props.storyService.fetchGetGoodsDistribution({ lineValue, cityValue }, topTenType);
  };

  // 暂时添加---黄建停 2019/7/2
  addClickEvn = () => {
    this.chart.on('click', 'series', async ({ name, value, data: { lineNameValue } }) => {
      const lineName = name.split(':')[0];
      this.props.storyService.changeLineName(lineName);
      this.props.storyService.handleShowModal(false);
      // 重新获取其他story的数据
      const { cityName, freightDistribution } = this.props.storyService.storyStore;
      const cityData = freightDistribution.find(item => item.name === cityName);
      const cityValue = cityData ? cityData.city_value : '';
      this.getOtherStoryData(cityValue, lineNameValue);
      this.renderMap(cityValue, lineNameValue, lineName);
    });
  };

  async componentDidMount() {
    this.chart = echarts.init(document.getElementById('routeDistribution'));
    await this.props.storyService.fetchGetRouteDistribute();
    const { routeDistributeOption } = this.props.storyService.storyStore;
    this.chart.setOption(routeDistributeOption);

    this.addClickEvn();
  }

  componentWillReceiveProps(nextProps) {
    if (!deepEqual(nextProps.options, this.props.options)) {
      this.chart.setOption(nextProps.options, true);
    }
  }

  componentWillUnmount() {
    this.props.storyService.changeLineName('');
  }
  render() {
    return <div id="routeDistribution" style={{ width: '100%', height: '100%' }} />;
  }
}
