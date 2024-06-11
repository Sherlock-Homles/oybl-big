import React from 'react';
import * as echarts from 'echarts/lib/echarts';
import { observer, inject } from 'mobx-react';
import CommonContainer from '../CommonContainer';
import CustomModal from '../CustomModal';
import { STORY_NAME } from '../../../constant';
import { deepEqual } from '../../../utils/diff';
import styles from './index.css';

@inject('storyService', 'mapService')
@observer
export default class GoodsDistributionChart extends React.Component {
  state = {
    modalTitle: '',
  };

  closeModal = () => {
    this.props.storyService.handleShowModal(false);
  };

  // 获取cityValue lineValue
  getCityLineValue = () => {
    const { cityName, lineValue, freightDistribution } = this.props.storyService.storyStore;
    const cityData = freightDistribution.find(item => item.name === cityName) || {};
    return {
      cityValue: cityData.city_value,
      lineValue,
    };
  };

  // 请求 top10 右侧弹框数据
  getFastSellDistribution = async params => {
    const { cityValue, lineValue } = this.getCityLineValue();
    await this.props.storyService.fetchGetFastSellDistribution({
      lineValue,
      cityValue,
      ...params,
    });
    this.props.storyService.changeStory(STORY_NAME[7]);
    this.props.storyService.handleShowModal(true);
  };

  // 货品点击事件
  distributionBarItemClick = ({ data: { category_value, name }, data }) => {
    // 暂时隐藏
    // const {
    //   goodsDistribution,
    // } = this.props.storyService.storyStore;
    // const index = +name - 1;
    // this.props.mapService.fetchWorldMap02({
    //   type: 'industryDistribution',
    //   name: goodsDistribution[index].name,
    // });
    if (!category_value) {
      return;
    }
    const { cityValue, lineValue } = this.getCityLineValue();
    //选择具体城市后不可弹窗--0611
    if (cityValue) {
      return;
    }
    this.setState({
      modalTitle: `各城市${name}分布图`,
    });
    this.getFastSellDistribution({
      category: category_value,
    });
  };

  // 货主点击事件
  ownerBarItemClick = ({ data: { name }, data }) => {
    const { topTenType } = this.props.storyService.storyStore;
    const { cityValue, lineValue } = this.getCityLineValue();
    this.setState({
      modalTitle: `${name}各物品分布图`,
    });
    const params = {};
    switch (topTenType) {
      case 'owner':
        // params.ownerName = name;
        params.owner = name;
        break;
      case 'provincialkeys':
        params.ownerName = name;
        params.lineValue = '';
        params.cityValue = '';
        break;
      case 'goodsSource':
        params.sourceUnit = name;
        break;
      default:
        break;
    }
    this.getFastSellDistribution(params);
  };

  async componentDidMount() {
    this.chart01 = echarts.init(document.getElementById('goodsDistribution1'));
    this.chart02 = echarts.init(document.getElementById('goodsDistribution2'));
    await this.props.storyService.fetchGetGoodsDistribution();
    const {
      goodsDistributionOption01,
      goodsDistributionOption02,
    } = this.props.storyService.storyStore;
    this.chart01.setOption(goodsDistributionOption01);
    this.chart02.setOption(goodsDistributionOption02);
    this.chart01.on('click', 'series.bar', this.distributionBarItemClick);
    this.chart02.on('click', 'series.bar', this.distributionBarItemClick);
  }

  componentWillReceiveProps(nextProps) {
    const { topTenType } = nextProps;
    if (!deepEqual(nextProps.options01, this.props.options01)) {
      this.chart01.setOption(nextProps.options01, true);
      if (topTenType === 'goods') {
        // 解绑事件
        this.chart01.off('click', this.ownerBarItemClick);
        this.chart01.on('click', 'series.bar', this.distributionBarItemClick);
      } else {
        this.chart01.off('click', this.distributionBarItemClick);
        this.chart01.on('click', 'series.bar', this.ownerBarItemClick);
      }
    }
    if (!deepEqual(nextProps.options02, this.props.options02)) {
      this.chart02.setOption(nextProps.options02, true);
      if (topTenType === 'goods') {
        this.chart02.off('click', this.ownerBarItemClick);
        this.chart02.on('click', 'series.bar', this.distributionBarItemClick);
      } else {
        this.chart02.off('click', this.distributionBarItemClick);
        this.chart02.on('click', 'series.bar', this.ownerBarItemClick);
      }
    }
  }

  componentWillUnmount() {
    this.props.storyService.handleShowModal(false);
  }

  render() {
    const { currentStory, showModal, lineName } = this.props.storyService.storyStore;
    return (
      <div className={styles.goodContent}>
        <div id="goodsDistribution1" style={{ width: '100%', height: '100%', float: 'left' }} />
        <div id="goodsDistribution2" style={{ width: '100%', height: '100%', float: 'right' }} />
        <CustomModal
          isOpen={showModal}
          closeModal={this.closeModal}
          currentStory={currentStory}
          modalTitle={this.state.modalTitle}
        />
      </div>
    );
  }
}
