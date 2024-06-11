import React from 'react';
import { toJS } from 'mobx';
import * as echarts from 'echarts/lib/echarts';
import { observer, inject } from 'mobx-react';
import { deepEqual } from '../../../utils/diff';

@inject('storyService', 'mapService')
@observer
export default class FreightDistributionChart extends React.Component {
  /**
   * @功能描述: 显示山东地图
   * @参数: city:城市名称
   * @返回值:
   */
  showShandongMap = city => {
    const { freightDistribution } = this.props.storyService.storyStore;
    const freightDistributionData = toJS(freightDistribution);
    freightDistributionData.forEach(item => {
      item.name = `${item.name}市`;
      if (item.name === `${city}市`) {
        item.selected = true;
      }
    });
    this.props.storyService.changeCityName(city);
    // 显示山东地图
    this.props.mapService.fetchClearWorldMapOptions();
    this.props.mapService.fetchshandongMap(freightDistributionData, `${city}市`);
  };

  /**
   * @功能描述: 切换story，从 各市开行情况 到 商品发运情况
   * @参数: cityValue:城市value,lineValue:线路value
   * @返回值:
   */
  switchMap = async (cityValue, lineValue) => {
    this.props.storyService.switchCityGoodsShipmentSituation('各类商品每月的发运情况top5');
    await this.props.storyService.fetchGoodsShipmentSituation({ cityValue, lineValue });
    this.chart.clear();
    const { goodsShipmentSituationOption } = this.props.storyService.storyStore;
    this.chart.setOption(goodsShipmentSituationOption);
    this.props.setChartRef(this.chart);
  };

  /**
   * @功能描述: 重新获取其他story的数据
   * @参数: cityValue:城市value,lineValue:线路value
   * @返回值:
   */
  getOtherStoryData = (cityValue, lineValue) => {
    this.props.storyService.handleShowModal(false);
    const { topTenType } = this.props.storyService.storyStore;
    this.props.storyService.fetchGetGoodsDistribution({ cityValue, lineValue }, topTenType);
  };

  // chart添加点击事件
  addClickEvn = () => {
    this.chart.on('click', 'series.bar', ({ name }) => {
      const { freightDistribution, lineName, lineValue } = this.props.storyService.storyStore;
      const cityData = freightDistribution.find(item => item.name === name);
      const cityValue = cityData ? cityData.city_value : '';
      if (!cityValue) return;
      if (cityData.value < 1) return;
      this.showShandongMap(name); // 例如 青岛
      this.switchMap(cityValue, lineValue);
      this.getOtherStoryData(cityValue, lineValue);
    });
  };

  async componentDidMount() {
    this.chart = echarts.init(document.getElementById('freightDistribution'));
    await this.props.storyService.fetchGetFreightDistribution();
    const { freightDistributionOption } = this.props.storyService.storyStore;
    this.chart.setOption(freightDistributionOption);
    // 暂时添加---黄建停 2019/7/3
    this.addClickEvn();
  }

  componentWillReceiveProps(nextProps) {
    const { cityGoodsShipmentSituation } = this.props.storyService.storyStore;
    if (cityGoodsShipmentSituation === '各类商品每月的发运情况top5') {
      if (!deepEqual(nextProps.optionsShipment, this.props.optionsShipment)) {
        this.chart.setOption(nextProps.optionsShipment, true);
      }
    } else {
      if (!deepEqual(nextProps.options, this.props.options)) {
        this.chart.setOption(nextProps.options, true);
      }
    }
  }

  componentWillUnmount() {
    this.chart.clear();
    this.props.storyService.switchCityGoodsShipmentSituation(
      `${new Date().getFullYear()}年各市开行情况`
    );
  }

  render() {
    return <div id="freightDistribution" style={{ width: '100%', height: '100%' }} />;
  }
}
