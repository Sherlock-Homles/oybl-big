import React from 'react';
import { observer, inject } from 'mobx-react';
import { RAF } from '../../../utils/RAF';
import * as echarts from 'echarts/lib/echarts';
import { STORY_NAME, STORY_INTERVAL } from '../../../constant';
import { deepEqual } from '../../../utils/diff';
import { toJS } from 'mobx';

@inject('storyService', 'mapService')
@observer
export default class ModalChart extends React.Component {
  constructor(props) {
    super(props);
    this.raf = new RAF();
    this.state = {
      index: 0,
    };
  }
  componentDidMount() {
    this.chart = echarts.init(document.getElementById('modalChart'));
    const {
      runInfoOption,
      routeDistributeOption,
      goodsDensityOption,
      freightDistributionOption,
      goodsDistributionOption,
      industryDistributionOption,
      fastSellDistributionOption,
    } = this.props.storyService.storyStore;
    let option = {};
    switch (this.props.currentStory) {
      case STORY_NAME[1]:
        option = runInfoOption;
        break;
      case STORY_NAME[2]:
        option = routeDistributeOption;
        break;
      case STORY_NAME[3]:
        option = goodsDensityOption;
        break;
      case STORY_NAME[4]:
        option = freightDistributionOption;
        break;
      case STORY_NAME[5]:
        option = goodsDistributionOption;
        break;
      case STORY_NAME[6]:
        option = industryDistributionOption;
        break;
      case STORY_NAME[7]:
        option = fastSellDistributionOption;
        break;
    }
    this.chart.setOption(option);

    const {
      storyLength,
      runInfo,
      routeDistribute,
      goodsDensity,
      freightDistribution,
      goodsDistribution,
      industryDistribution,
    } = this.props.storyService.storyStore;
    if (this.props.currentStory === STORY_NAME[1]) {
      const allList = [];
      toJS(runInfo).forEach(item => {
        allList.push(...item.list);
      });
      this.chart.on('click', 'series', ({ seriesName, name }) => {
        const item = allList.find(ele => ele.name === name && ele.date.includes(seriesName));
        if (item) {
          this.props.mapService.fetchWorldMap01({
            type: 'runInfo',
            name: item.date,
          });
        }
      });
      // this.timer = this.raf.setInterval(() => {
      //   if (this.state.index === storyLength) {
      //     // 清除所有的高亮
      //     this.chart.dispatchAction({
      //       type: 'hideTip',
      //     });
      //     this.chart.dispatchAction({
      //       type: 'updateAxisPointer',
      //       currTrigger: 'leave',
      //     });
      //     // 将index重置
      //     this.setState({
      //       index: 0,
      //     });
      //   } else {
      //     this.chart.dispatchAction({
      //       type: 'showTip',
      //       seriesIndex: 2,
      //       dataIndex: this.state.index,
      //     });
      //     // 发送请求到后台，获取地图数据
      //     this.props.mapService.fetchWorldMap01({
      //       type: 'runInfo',
      //       name: newList[this.state.index].date,
      //     });
      //     this.setState(prevState => ({
      //       index: prevState.index + 1,
      //     }));
      //   }
      // }, STORY_INTERVAL);
    } else if (this.props.currentStory === STORY_NAME[2]) {
      this.chart.on('click', 'series', ({ name }) => {
        this.props.mapService.fetchWorldMap01({
          type: 'routeDistribute',
          name: name.split(':')[0],
        });
      });

      // this.timer = this.raf.setInterval(() => {
      //   if (this.state.index === storyLength) {
      //     // 清除所有的高亮
      //     this.chart.dispatchAction({
      //       type: 'hideTip',
      //     });
      //     this.chart.dispatchAction({
      //       type: 'downplay',
      //       seriesIndex: storyLength - 1,
      //       dataIndex: 0,
      //     });
      //     // 将index重置
      //     this.setState({
      //       index: 0,
      //     });
      //   } else {
      //     const seriesIndex = this.state.index;
      //     seriesIndex > 0 &&
      //       this.chart.dispatchAction({
      //         type: 'downplay',
      //         seriesIndex: seriesIndex - 1,
      //         dataIndex: 0,
      //       });
      //     this.chart.dispatchAction({
      //       type: 'highlight',
      //       seriesIndex,
      //       dataIndex: 0,
      //     });
      //     this.chart.dispatchAction({
      //       type: 'showTip',
      //       seriesIndex,
      //       dataIndex: 0,
      //     });

      //     this.props.mapService.fetchWorldMap01({
      //       type: 'routeDistribute',
      //       name: routeDistribute[seriesIndex].name,
      //     });
      //     this.setState(prevState => ({
      //       index: prevState.index + 1,
      //     }));
      //   }
      // }, STORY_INTERVAL);
      // } else if (this.props.currentStory === STORY_NAME[3]) {
      //   this.timer = this.raf.setInterval(() => {
      //     if (this.state.index === storyLength) {
      //       // 清除所有的高亮
      //       this.chart.dispatchAction({
      //         type: 'hideTip',
      //       });
      //       this.chart.dispatchAction({
      //         type: 'updateAxisPointer',
      //         currTrigger: 'leave',
      //       });
      //       // 将index重置
      //       this.setState({
      //         index: 0,
      //       });
      //     } else {
      //       this.chart.dispatchAction({
      //         type: 'showTip',
      //         seriesIndex: this.state.index,
      //         dataIndex: this.state.index,
      //       });
      //       this.props.mapService.fetchWorldMap01({
      //         type: 'goodsDensity',
      //         name: goodsDensity[this.state.index].name,
      //       });
      //       this.setState(prevState => ({
      //         index: prevState.index + 1,
      //       }));
      //     }
      //   }, STORY_INTERVAL);
    } else if (this.props.currentStory === STORY_NAME[4]) {
      this.chart.on('click', 'series.pictorialBar', ({ seriesName }) => {
        this.props.mapService.fetchWorldMap02({
          type: 'freightDistribution',
          name: seriesName,
        });
      });
      // this.timer = this.raf.setInterval(() => {
      //   if (this.state.index === storyLength) {
      //     // 清除所有的高亮
      //     this.chart.dispatchAction({
      //       type: 'hideTip',
      //     });
      //     this.chart.dispatchAction({
      //       type: 'pieUnSelect',
      //       seriesIndex: 0,
      //       dataIndex: storyLength - 1,
      //     });
      //     // 将index重置
      //     this.setState({
      //       index: 0,
      //     });
      //   } else {
      //     this.chart.dispatchAction({
      //       type: 'pieSelect',
      //       seriesIndex: 0,
      //       dataIndex: this.state.index,
      //     });
      //     this.chart.dispatchAction({
      //       type: 'showTip',
      //       seriesIndex: 0,
      //       dataIndex: this.state.index,
      //     });
      //     this.props.mapService.fetchWorldMap02({
      //       type: 'freightDistribution',
      //       name: freightDistribution[this.state.index].name,
      //     });
      //     this.setState(prevState => ({
      //       index: prevState.index + 1,
      //     }));
      //   }
      // }, STORY_INTERVAL);
    } else if (this.props.currentStory === STORY_NAME[5]) {
      this.chart.on('click', 'series.bar', ({ name }) => {
        const index = +name - 1;
        this.props.mapService.fetchWorldMap02({
          type: 'industryDistribution',
          name: goodsDistribution[index].name,
        });
      });
      // this.timer = this.raf.setInterval(() => {
      //   if (this.state.index === storyLength) {
      //     // 清除所有的高亮
      //     this.chart.dispatchAction({
      //       type: 'hideTip',
      //     });
      //     this.chart.dispatchAction({
      //       type: 'updateAxisPointer',
      //       currTrigger: 'leave',
      //     });
      //     // 将index重置
      //     this.setState({
      //       index: 0,
      //     });
      //   } else {
      //     this.chart.dispatchAction({
      //       type: 'showTip',
      //       seriesIndex: 1,
      //       dataIndex: 4 - this.state.index,
      //     });
      //     this.props.mapService.fetchWorldMap02({
      //       type: 'goodsDistribution',
      //       name: goodsDistribution[this.state.index].name,
      //     });
      //     this.setState(prevState => ({
      //       index: prevState.index + 1,
      //     }));
      //   }
      // }, STORY_INTERVAL);
      // } else if (this.props.currentStory === STORY_NAME[6]) {
      //   this.timer = this.raf.setInterval(() => {
      //     if (this.state.index === storyLength) {
      //       // 清除所有的高亮
      //       this.chart.dispatchAction({
      //         type: 'downplay',
      //         seriesIndex: 0,
      //       });
      //       // 将index重置
      //       this.setState({
      //         index: 0,
      //       });
      //     } else {
      //       const downplayArr = [];
      //       industryDistribution.forEach((_, index) => {
      //         if (index !== this.state.index) {
      //           downplayArr.push(index);
      //         }
      //       });
      //       this.chart.dispatchAction({
      //         type: 'downplay',
      //         seriesIndex: 0,
      //         dataIndex: downplayArr,
      //       });
      //       this.chart.dispatchAction({
      //         type: 'highlight',
      //         seriesIndex: 0,
      //         dataIndex: this.state.index,
      //       });
      //       this.props.mapService.fetchWorldMap02({
      //         type: 'industryDistribution',
      //         name: industryDistribution[this.state.index].name,
      //       });
      //       this.setState(prevState => ({
      //         index: prevState.index + 1,
      //       }));
      //     }
      //   }, STORY_INTERVAL);
    }
  }
  componentWillUnmount() {
    this.raf.clearInterval(this.timer);
    // 暂时隐藏----黄建停 2019/7/4
    // this.props.storyService.startTellStory(false);
    // this.props.storyService.changeStory('');
    // this.props.mapService.fetchWorldMap01({
    //   type: 'homeMap',
    //   name: '中亚',
    // });
  }

  componentWillReceiveProps(nextProps) {
    if (!deepEqual(nextProps.options, this.props.options)) {
      this.chart.setOption(nextProps.options, true);
    }
  }

  render() {
    return <div style={{ height: 'calc(100% - 55px)' }} id="modalChart" />;
  }
}
