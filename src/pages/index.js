import React from 'react';
import styles from './index.css';
import LeftPanel from './components/LeftPanel';
import WorldMap from './components/WorldMap';
import Indicators from './components/Indicators';
import ExceptionChart from './components/ExceptionChart';
import HotNews from './components/HotNews';
import TrainPlan from './components/TrainPlan';
import TransportAndService from './components/TransportAndService';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import * as _ from 'lodash';
import LineInfo from './components/LineInfo';
import { STORY_NAME } from '../constant';
import SubTitle from './components/SubTitle';
import Track from './components/Track';
import { Button } from 'antd';
import { logout, isLogin } from '@/utils/user';
import router from 'umi/router';
import TrackModal from './components/TrackModal';

@inject('userService', 'mapService', 'storyService', 'rightInfoService')
@observer
class Homepage extends React.Component {
  state = {
    track: false,
  };
  async componentDidMount() {
    //登录拦截
    if (isLogin()) {
      await this.props.userService.fetchUserGetInfo();
    } else {
      router.push('/');
    }

    await this.props.mapService.fetchWorldMap01({
      type: 'homeMap',
      name: '中亚',
    });
    await this.props.rightInfoService.fetchTrackInfo('去');
    this.props.rightInfoService.changeTrains();
  }
  handleShift = () => {
    this.props.mapService.handleShift();
  };

  render() {
    const { currentStory } = this.props.storyService.storyStore;
    const { event, track } = this.props.mapService.mapStore;

    const mapOptions = toJS(this.props.mapService.mapStore.mapOptions);
    const mapLineInfo = toJS(this.props.mapService.mapStore.mapLineInfo);
    return (
      <div className={styles.dashboard}>
        <div id="left" className={styles.left}>
          {/* 6个故事 */}
          <LeftPanel />
        </div>
        <div className={styles.center}>
          <div className={styles.header}>
            <Indicators />
          </div>
          <WorldMap options={mapOptions} />
          {[STORY_NAME[3]].includes(currentStory) && !_.isEmpty(mapLineInfo) && (
            <div className={styles.bottom}>
              <LineInfo mapLineInfo={mapLineInfo} />
            </div>
          )}
          {currentStory === STORY_NAME[1] && event !== '' && <SubTitle text={event} />}
          <img
            className={styles.shift}
            onClick={this.handleShift}
            src={require('@/assets/shift.png')}
            alt=""
          />
          <div className={styles.showRoute} onClick={this.handleShift}></div>
        </div>
        <div className={styles.right}>
          <Button
            onClick={logout}
            type="link"
            style={{
              color: 'white',
              fontSize: '20px',
              position: 'absolute',
              top: '0px',
              right: '100px',
              flex: 2,
            }}
          >
            退出
          </Button>
          {track ? (
            <>
              <Track />
              <TrackModal />
            </>
          ) : (
            <>
              <HotNews />
              <ExceptionChart />
              <TransportAndService />
              <TrainPlan />
            </>
          )}
        </div>
      </div>
    );
  }
}
export default Homepage;
