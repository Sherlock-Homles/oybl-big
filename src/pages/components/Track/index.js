import React from 'react';
import { observer, inject } from 'mobx-react';
import styles from './index.css';
import CommonContainer from '../CommonContainer';
import { TRACK_KINDS } from '../../../constant';

@inject('rightInfoService', 'mapService')
@observer
class Track extends React.Component {
  state = {
    select: 'go',
    currentIndex: 0,
    recordIndex: 0,
  };
  async componentDidMount() {
    await this.props.rightInfoService.fetchTrackInfo(TRACK_KINDS[this.state.select].param);
    this.props.rightInfoService.iconChange();
  }
  componentDidUpdate() {
    if (!this.props.rightInfoService.rightInfoStore.isHover) {
      this.timerStart();
    } else {
      this.timer && this.timerStop();
    }
  }
  componentWillUnmount() {
    this.timerStop();
  }
  hover = async (label, code) => {
    const { rightInfoService } = this.props;
    await rightInfoService.setFilterName(label);
    const tracks = [...rightInfoService.rightInfoStore.trackInfo];
    tracks.length && !!code && (tracks.find(({ trainKey }) => trainKey === code).orange = true);
    rightInfoService.setTrackInfo(tracks);
    this.timerStop();
    rightInfoService.changeTrains();
  };
  hoverOut = async item => {
    const { rightInfoService } = this.props;
    await rightInfoService.setFilterName('');
    const tracks = [...rightInfoService.rightInfoStore.trackInfo];
    tracks.length &&
      !!item &&
      (tracks.find(({ trainKey }) => trainKey === item.trainKey).orange = false);
    rightInfoService.setTrackInfo(tracks);
    this.timerStart();
    rightInfoService.changeTrains();
  };
  timerStop = () => {
    clearInterval(this.timer);
  };
  timerStart = () => {
    const { allTracks, recordIndex } = this.props.rightInfoService.rightInfoStore;
    this.timer && this.timerStop();
    this.timer = setInterval(() => {
      this.props.rightInfoService.setRecordIndex(
        recordIndex < allTracks.length - 1 ? recordIndex + 1 : 0
      );
    }, 3000);
  };
  switchTopTen = (select, currentIndex) => {
    this.setState(
      {
        recordIndex: 0,
        currentIndex,
        select,
      },
      async () => {
        await this.props.rightInfoService.fetchTrackInfo(TRACK_KINDS[this.state.select].param);
        this.props.rightInfoService.iconChange();
      }
    );
  };
  //查看轨迹
  handleView = async trainCode => {
    await this.props.rightInfoService.setTrackCode(trainCode);
    await this.props.rightInfoService.fetchListByTrainCode(trainCode);
    this.props.rightInfoService.setTrackModalVisible(true);
  };

  record = item => {
    return item ? (
      <>
        <div className={styles.tit}>
          <div className={styles.left}>
            <span className={item.orange ? styles.green : styles.white}>
              {/* {item.startStationName} */}
              {item.startStation}
            </span>

            <img className={styles.img} src={require('@/assets/jiantou.png')} alt="" />
            <span className={item.orange ? styles.green : styles.white}>
              {/* {item.externalStationName} */}
              {item.externalStation}
            </span>
          </div>
          <div className={styles.right}>班列号：[{item.trainCode}]</div>
          {/* <Button type="primary" ghost onClick={() => this.handleView(item.trainCode)}>
            查看轨迹
          </Button> */}
        </div>
        <div className={styles.lines}>
          {/* <div className={styles.underLine}></div>
          <div className={styles.arrived}>
            <div className={styles.info} style={{ color: '#00B8FF' }}>
              <span>{item.startStationName}</span>
            </div>
          </div>
          <div className={styles.arrived}>
            <div className={styles.info} style={{ color: '#00B8FF' }}>
              <span>{item.portStationName}</span>
            </div>
          </div>
          <div className={styles.arrived}>
            <div className={styles.info} style={{ color: '#00B8FF' }}>
              <span>{item.externalStationName}</span>
            </div>
          </div> */}

          <div className={styles.progress} style={{ width: item.journeyPercent + '%' }}></div>
          <div className={styles.underLine}></div>
          {item.stations.map((station, id) => (
            // <div key={id} className={station.arrived ? styles.arrived : styles.dot}>
            <div key={id} className={styles.arrived}>
              {/* <div className={styles.info} style={{ color: station.arrived ? '#00B8FF' : '#fff' }}> */}
              <div className={styles.info} style={{ color: '#00B8FF' }}>
                <span>{station.name}</span>
                <span>{station.date}</span>
              </div>
            </div>
          ))}
        </div>
      </>
    ) : (
      undefined
    );
  };

  render() {
    const { currentIndex } = this.state;
    const {
      isHover,
      trackInfo,
      allTracks,
      recordIndex,
    } = this.props.rightInfoService.rightInfoStore;
    const list = allTracks.map(i => i.trainCode);
    const newList = [...new Set(list)];
    return (
      // <div
      //   onMouseEnter={this.onTest}
      //   onMouseLeave={e => this.onOut(e, currentIndex)}
      //   style={{ backgroundColor: 'red', width: '100px', height: '100px' }}
      // ></div>
      <>
        <div
          className={styles.top}
          // onMouseEnter={() =>
          //   this.hover(allTracks[recordIndex]?.label, allTracks[recordIndex]?.trainKey)
          // }
          // onMouseLeave={e => this.hoverOut(allTracks[recordIndex], e)}
        >
          <CommonContainer
            title={`中欧班列（齐鲁号）运行动态(在途${newList.length}列)`}
            showTitleRight
            titleRight={
              <div className={styles.exceptionButs}>
                {Object.keys(TRACK_KINDS).map((item, index) => (
                  <span
                    key={index}
                    className={styles.button}
                    onClick={() => this.switchTopTen(item, index)}
                    style={{ color: index === currentIndex ? '#00b9fd' : 'white' }}
                  >
                    {TRACK_KINDS[item].btText}
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
            }
          >
            {/* {this.record(isHover ? filterTracks[recordIndex] : allTracks[recordIndex], isHover)} */}
            {this.record(trackInfo[recordIndex], isHover)}
          </CommonContainer>
        </div>
        {/* {(isHover ? filterTracks : allTracks)trackInfo */}
        {/* 新 */}
        {/* {trackInfo.slice(recordIndex + 1, recordIndex + 5).map((item, key) => ( */}
        {/* 旧 */}
        {allTracks.slice(recordIndex + 1, recordIndex + 5).map((item, key) => (
          <div
            className={styles.wrap}
            key={key}
            onMouseEnter={() => this.hover(item.label, item.trainKey)}
            onMouseLeave={e => this.hoverOut(item, e)}
          >
            <div className="leftTop" />
            <div className="leftBottom" />
            <div className="rightTop" />
            <div className="rightBottom" />
            {this.record(item)}
          </div>
        ))}
      </>
    );
  }
}

export default Track;
