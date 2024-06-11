import React, { Fragment } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import * as echarts from 'echarts/lib/echarts';
import '../../../map/shandong';
import 'echarts/map/js/world';
// import 'echarts/map/js/province/shandong';
import { deepEqual } from '../../../utils/diff';

@inject('mapService', 'storyService', 'rightInfoService')
@observer
class WorldMap extends React.Component {
  state = {
    animateClass: '',
  };

  /**地图地点变更 */
  changeCity = name => {
    const { freightDistribution } = this.props.storyService.storyStore;
    const freightDistributionData = toJS(freightDistribution);
    freightDistributionData.forEach(item => {
      item.name = `${item.name}市`;
      if (item.name === name) {
        item.selected = true;
      }
    });
    const city = name.replace('市', '');
    this.props.storyService.changeCityName(city);
    this.props.mapService.fetchshandongMap(freightDistributionData, name);
  };

  // 重新获取其他story的数据
  getOtherStoryData = (cityValue, lineValue) => {
    this.props.storyService.handleShowModal(false);
    this.props.storyService.fetchGoodsShipmentSituation({ cityValue, lineValue });
    this.props.storyService.fetchGetFreightDistribution({ cityValue, lineValue });
    const { topTenType } = this.props.storyService.storyStore;
    this.props.storyService.fetchGetGoodsDistribution({ cityValue, lineValue }, topTenType);
  };

  // chart添加点击事件
  addClickEvn = () => {
    this.chart.on('click', 'series.map', ({ name }) => {
      const { freightDistribution, lineName, lineValue } = this.props.storyService.storyStore;
      const city = name.replace('市', '');
      const cityData = freightDistribution.find(item => item.name === city);
      const cityValue = cityData ? cityData.city_value : '';
      if (!cityValue) return;
      this.changeCity(name);
      this.getOtherStoryData(cityValue, lineValue);
    });
  };
  // 小火车鼠标悬浮
  addHoverEvn = () => {
    this.chart.on('mouseover', 'series.scatter', ({ seriesName, name }) => {
      if (seriesName === 'trainIcon') {
        this.props.mapService.handleOn();
        this.props.rightInfoService.handleHover(true, name);
        this.props.rightInfoService.changeTrains();
        this.props.rightInfoService.iconChange();
      }
    });
    this.chart.on('mouseout', 'series.scatter', ({ seriesName }) => {
      if (seriesName === 'trainIcon') {
        // this.props.mapService.handleOut();
        this.props.rightInfoService.handleHover(false);
        this.props.rightInfoService.changeTrains();
        this.props.rightInfoService.iconChange();
        // this.props.rightInfoService.pointsFilter('');
      }
    });
  };

  componentDidMount() {
    this.chart = echarts.init(document.getElementById('chart'));
    // 展示默认地图背景
    // this.chart.setOption(this.props.options);
    this.addClickEvn();
    this.addHoverEvn();
    this.props.mapService.saveMapChart(this.chart);
  }

  componentWillReceiveProps(nextProps) {
    if (!deepEqual(nextProps.options, this.props.options)) {
      this.setState({
        animateClass: 'zoomIn',
      });
      this.chart.clear();
    }
    this.chart.setOption(nextProps.options, true);
  }

  render() {
    return (
      <React.Fragment>
        <div
          id="chart"
          style={{ height: '100%', width: '100%' }}
          className={`animated ${this.state.animateClass}`}
          onAnimationEnd={() => {
            this.setState({
              animateClass: '',
            });
          }}
        />
      </React.Fragment>
    );
  }
}
export default WorldMap;
