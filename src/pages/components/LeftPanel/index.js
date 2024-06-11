import React from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { RAF } from '../../../utils/RAF';
import styles from './index.css';
import { START_ANIMATION_TIMEOUT, STORY_NAME, TOP_TEN } from '../../../constant';
import CommonContainer from '../CommonContainer';
import TrainMonthlyChart from '../TrainMonthlyChart';
import RouteDistributionChart from '../RouteDistributionChart';
import FreightDistributionChart from '../FreightDistributionChart';
import GoodsDistributionChart from '../GoodsDistributionChart';
import IndustryDistributionChart from '../IndustryDistributionChart';
import GoodsDensityChart from '../GoodsDensityChart';
import CustomModal from '../CustomModal';

@inject('userService', 'storyService', 'mapService')
@observer
class LeftPanel extends React.Component {
  state = {
    isOpen: false,
    topTenType: 'goods',
    currentIndex: 0,
  };

  async componentDidMount() {
    await this.props.storyService.topTenTypeChange('goods');
  }

  freightDistributionChart = null;

  closeModal = () => {
    this.setState({
      isOpen: false,
    });
  };

  /**
   * @功能描述: 返回默认显示，重置所有数据
   * @参数:
   * @返回值:
   */
  backToDefault = () => {
    this.props.storyService.changeLineName('');
    this.props.storyService.changeCityName('');
    this.props.storyService.switchCityGoodsShipmentSituation(
      `${new Date().getFullYear()}年各市开行情况`
    );
    this.props.mapService.fetchWorldMap01({
      type: 'homeMap',
      name: '中亚',
    });
    this.props.storyService.fetchGetFreightDistribution();
    this.props.storyService.topTenTypeChange('goods');
    this.setState({
      currentIndex: 0,
    });
    this.props.storyService.fetchGetGoodsDistribution();
    this.props.storyService.handleShowModal(false);
  };

  /**
   * @功能描述: 设置 各市开行情况 chart
   * @参数: chart:图表
   * @返回值:
   */
  setFreightDistributionChart = chart => {
    this.freightDistributionChart = chart;
  };

  /**
   * @功能描述: 处理 各类商品每月的发运情况top5 返回
   * @参数:
   * @返回值:
   */
  backToFreightDistribution = () => {
    const {
      freightDistributionOption,
      freightDistribution,
      emptyGoodsShipmentSituationOption,
      lineName,
      lineValue,
      topTenType,
    } = this.props.storyService.storyStore;
    if (this.freightDistributionChart) {
      this.props.storyService.fetchGetGoodsDistribution({ lineValue }, topTenType);
      this.freightDistributionChart.clear();
      this.freightDistributionChart.setOption(freightDistributionOption);
      this.props.storyService.fetchGetFreightDistribution({ lineValue });
      this.props.storyService.changeCityName('');
      this.props.storyService.switchCityGoodsShipmentSituation(
        `${new Date().getFullYear()}年各市开行情况`
      );
      this.props.storyService.handleShowModal(false);
      this.props.mapService.fetchWorldMap01({
        type: lineName ? 'routeDistribute' : 'homeMap',
        name: lineName || '中亚',
      });
    }
  };

  // 切换top10
  switchTopTen = (topTenType, index) => {
    const { lineValue, cityName, freightDistribution } = this.props.storyService.storyStore;
    this.props.storyService.topTenTypeChange(topTenType);
    const cityData = freightDistribution.find(item => item.name === cityName);
    const cityValue = cityData ? cityData.city_value : '';
    this.props.storyService.fetchGetGoodsDistribution({ cityValue, lineValue }, topTenType);
    this.props.storyService.handleShowModal(false);
    this.setState({
      // topTenType,
      currentIndex: index,
    });
  };

  render() {
    const { userInfo } = toJS(this.props.userService.userStore);
    const {
      currentStory,
      lineName,
      cityName,
      routeDistributeOption,
      cityGoodsShipmentSituation,
      freightDistributionOption,
      goodsShipmentSituationOption,
      goodsDistributionOption01,
      goodsDistributionOption02,
      // goodsOwnerOption,
      topTenType,
    } = this.props.storyService.storyStore;
    const { currentIndex } = this.state;
    let title = '';
    if (lineName) {
      title = `${lineName}`;
      if (cityName) {
        title = `${lineName}-${cityName}`;
      }
    } else {
      if (cityName) {
        title = `${cityName}`;
      }
    }
    return (
      <>
        <div className={styles.container}>
          <div className={`animated zoomIn ${styles.story}`}>
            <CommonContainer
              title={lineName ? `${lineName}-路线分布` : '路线分布'}
              showTitleRight={lineName}
              titleRight={
                <div className={styles.back}>
                  <span onClick={this.backToDefault}>返回</span>
                </div>
              }
              // 暂时隐藏---黄建停 2019/7/2
              // onClick={() => {
              //   this.props.storyService.startTellStory(true);
              //   this.props.storyService.changeStory(STORY_NAME[2]);
              //   this.setState({
              //     isOpen: true,
              //   });
              // }}
            >
              <RouteDistributionChart options={routeDistributeOption} />
            </CommonContainer>
          </div>
          <div className={`animated zoomIn ${styles.story}`}>
            <CommonContainer
              title="开行情况"
              // 暂时隐藏---黄建停 2019/7/2
              // onClick={() => {
              //   this.props.storyService.startTellStory(true);
              //   this.props.storyService.changeStory(STORY_NAME[1]);
              //   this.setState({
              //     isOpen: true,
              //   });
              // }}
            >
              <TrainMonthlyChart />
            </CommonContainer>
          </div>
          {/*<div className={`animated zoomIn ${styles.story}`}>
            <CommonContainer
              title="线路货运密度"
              onClick={() => {
                this.props.storyService.startTellStory(true);
                this.props.storyService.changeStory(STORY_NAME[3]);
                this.setState({
                  isOpen: true,
                });
              }}
            >
              <GoodsDensityChart />
            </CommonContainer>
          </div>*/}
          <div className={`animated zoomIn ${styles.story}`}>
            <CommonContainer
              title={title ? `${title}-${cityGoodsShipmentSituation}` : cityGoodsShipmentSituation}
              showTitleRight={cityGoodsShipmentSituation === '各类商品每月的发运情况top5'}
              titleRight={
                <div className={styles.back}>
                  <span onClick={this.backToFreightDistribution}>返回</span>
                </div>
              }
              // 暂时隐藏---黄建停 2019/7/2
              // onClick={() => {
              //   this.props.storyService.startTellStory(true);
              //   this.props.storyService.changeStory(STORY_NAME[4]);
              //   this.setState({
              //     isOpen: true,
              //   });
              // }}
            >
              <FreightDistributionChart
                options={freightDistributionOption}
                optionsShipment={goodsShipmentSituationOption}
                setChartRef={this.setFreightDistributionChart}
              />
            </CommonContainer>
          </div>
          <div className={`animated zoomIn ${styles.story}`}>
            <CommonContainer
              title={title ? `${title}-${TOP_TEN[topTenType].title}` : TOP_TEN[topTenType].title}
              showTitleRight
              //判断用户是否有权限，有权限的只能查看货物，无权限可以查看所有
              titleRight={
                !userInfo?.additionalAuthority?.topTenAuthority && (
                  <div className={styles.exceptionButs}>
                    {Object.keys(TOP_TEN).map((item, index) => (
                      <span
                        key={index}
                        className={styles.button}
                        onClick={() => this.switchTopTen(item, index)}
                        style={{ color: index === currentIndex ? '#00b9fd' : 'white' }}
                      >
                        {TOP_TEN[item].btText}
                        <div
                          className={styles.mask}
                          style={{ display: index === currentIndex ? 'block' : 'none' }}
                        >
                          <div className={styles.maskLeftTop} />
                          <div className={styles.maskLeftBottom} />
                          <div className={styles.maskRightTop} />
                          <div className={styles.maskRightBottom} />
                        </div>
                      </span>
                    ))}
                  </div>
                )
              }
            >
              <GoodsDistributionChart
                options01={goodsDistributionOption01}
                options02={goodsDistributionOption02}
                topTenType={topTenType}
              />
            </CommonContainer>
          </div>
          {/* <div className={`animated zoomIn ${styles.story}`}>
            <CommonContainer
              title="货物品类-TOP10"
              onClick={() => {
                this.props.storyService.startTellStory(true);
                this.props.storyService.changeStory(STORY_NAME[6]);
                this.setState({
                  isOpen: true,
                });
              }}
            >
              <IndustryDistributionChart />
            </CommonContainer>
          </div> */}
        </div>
        {/* 暂时隐藏---黄建停 2019/7/2 */}
        {/* <CustomModal
          isOpen={this.state.isOpen}
          closeModal={this.closeModal}
          currentStory={currentStory}
        /> */}
      </>
    );
  }
}

export default LeftPanel;
