import { action, runInAction, toJS } from 'mobx';
import { RightInfoStore } from '../stores/rightInfo.store';
import { get } from '../fetch';
import { backendServerUrl, TRACK_CODE } from '../constant';
import service from './index';
import { formatDate } from '../utils/date';
const now = new Date(formatDate(new Date())).getTime();

export class RightInfoService {
  constructor() {
    this.rightInfoStore = new RightInfoStore();
  }

  /**
   * 热点新闻
   * @param {*}
   */
  @action
  fetchGetHotNews = async params => {
    let result;
    try {
      result = await get(`${backendServerUrl}/home/news/hot`, params);
      runInAction(() => {
        if (result) {
          // this.rightInfoStore.hotNews = result.data;
          // 热点新闻改为假数据
          this.rightInfoStore.hotNews = [{
            "description": "12月28日下午，济南市政府在董家铁路货运监管场站举办山东中欧班列2023年济南第1000列发车活动。济南市政府副市长杨丽，国铁济南局集团副总经理赵红森，济南海关副关长张艺兵，国家粮食储备局山东局分党组副书记、副局长潘青出席活动，济南市口岸和物流办党组书记、主任翟立波主持活动，省政府办公厅、省发展改革委、中铁集济南分公司、济南市政府办公厅等部门单位相关负责同志参加活动。集团党委副书记、董事、总经理孙付春出席活动并致辞，党委常委、副总经理张仰进，集团综合办公室、欧亚班列公司有关负责同志参加活动。",
            "id": 92,
            "title": "孙付春出席山东中欧班列2023年济南第1000列发车活动"
          }, {
            "description": "9月25日，由山东高速集团统筹运营的“齐鲁号”中俄快线首班顺利开行，搭载110个标准集装箱出口商品车，由上合示范区发出，预计10天后抵达俄罗斯莫斯科。中俄快线全程运行时间较原有线路压缩30%以上，节省运输时效8-10天，提供了更加稳定优质的班列产品，标志着“齐鲁号”在运营模式上取得新突破，进一步畅通上合示范区通往欧洲的陆路运输国际物流大通道，为保障国际产业链供应链安全、畅通国内国际双循环、促进亚欧贸易往来注入了新动能。",
            "id": 91,
            "title": "山东高速集团助力上合示范区建设 “齐鲁号”推出中俄快线"
          }, {
            "description": "9月2日至4日，山东高速集团党委书记、董事长王其峰随山东省代表团出访哈萨克斯坦，参加在阿拉木图市举办的齐鲁号欧亚班列阿拉木图集结中心揭牌暨首班开行活动，并在阿斯塔纳举行的中国（山东）—哈萨克斯坦合作交流会暨“一带一路”倡议十周年纪念活动上与两家单位签约。",
            "id": 88,
            "title": "王其峰出席齐鲁号欧亚班列阿拉木图集结中心揭牌活动及中国（山东）—哈萨克斯坦合作交流会"
          }, {
            "description": "7月17日，在国家外汇管理局青岛市分局、上合示范区管委会的大力支持下，欧亚班列公司联合青岛农商银行胶州支行，成功落地中欧班列（齐鲁号）首笔线上仓单质押融资业务，标志着“班列+进出口企业+供应链金融”模式取得新突破。通过以企业电子仓单为质押的融资方式，有助于盘活企业资产，提高资金使用效率，缓解中小企业融资难、融资贵的问题。",
            "id": 89,
            "title": "“齐鲁号”首笔仓单质押融资业务落地青岛"
          }, {
            "description": "7月13日，由山东高速集团与济南市人民政府共同举办的中欧班列·山东省沿黄九市一体化发展大会暨首届山东省沿黄九市口岸联席会议正式开幕，副省长、省政府秘书长宋军继，济南市委副书记、市长于海田，中交协“一带一路”物流分会会长赵春雷出席会议。省发展改革委、省口岸办、青岛海关、济南海关、国铁济南局、国家粮食和物资储备局山东局相关负责同志，济南市、淄博市、东营市、济宁市、泰安市、德州市、聊城市、滨州市、菏泽市政府分管负责同志参加会议。山东高速集团党委副书记、董事李广进参加会议并致辞，欧亚班列公司党委副书记、总经理胥猛陪同活动。",
            "id": 90,
            "title": "山东高速集团联合济南市政府成功举办中欧班列·山东省沿黄九市一体化发展大会"
          }, {
            "description": "11月26日上午，胶州市人民政府举行“大干100天，抓项目争一流”项目集中签约仪式，青岛市委常委、胶州市委书记刘建军，青岛市人大常委会副主任张大勇出席活动。山东高速齐鲁号欧亚班列运营有限公司党委书记、董事长张仰进应邀代表参会企业致辞，公司党委副书记、总经理胥猛代表公司与当地政府签订山东高速齐鲁号上合经贸产业园项目合作协议。",
            "id": 87,
            "title": "中欧班列（齐鲁号）青岛集结中心项目合作协议顺利签订"
          }, {
            "description": "10月15日，在上合示范区管委会、胶州海关、中铁集装箱青岛中心站的大力支持和通力协作下，由山东高速集团统筹运营的中欧班列（齐鲁号）“铁路快通”货物专列从上合示范区青岛多式联运中心发出。本趟专列共100个标准箱，搭载了价值约230万美元的轮胎、生活用品，采用“铁路快速通关”模式报关，经霍尔果斯口岸出境，预计10天左右抵达塔吉克斯坦杜尚别。这是山东省开行的首班“铁路快通”货物专列，标志着由海关总署批准实施的“铁路快速通关”新模式在山东全面落地推行。",
            "id": 85,
            "title": "中欧班列（齐鲁号）首班“铁路快通”专列顺利发运"
          }, {
            "description": "10月12日，由山东高速集团统筹运营的中欧班列（齐鲁号）今天在青岛同时运营去、回两趟班列，吹响决战四季度的冲锋号。",
            "id": 84,
            "title": "增图定线路、拓回程货源，中欧班列（齐鲁号）助力我省经济社会高质量发展"
          }, {
            "description": "省领导拜访国铁集团会商中欧班列（齐鲁号）等有关工作",
            "id": 83,
            "title": "省领导拜访国铁集团会商中欧班列（齐鲁号）等有关工作"
          }, {
            "description": "2021年9月2日，山东高速齐鲁号国际陆港发展有限公司（以下简称“国际陆港公司”）在济南市注册成立。",
            "id": 80,
            "title": "山东高速齐鲁号国际陆港发展有限公司成立"
          }];
        }
      });
    } catch (err) {
      console.log(err);
    }
    return result;
  };

  /**
   * 新闻详情
   * @param {*}
   */
  @action
  fetchGetNewDetail = async params => {
    let result;
    try {
      result = await get(`${backendServerUrl}/home/news/detail`, params);
      runInAction(() => {
        if (result) {
          this.rightInfoStore.newDetail = result.data;
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * 月季年货量
   * @param {*}
   */
  @action
  fetchGetCommodityNum = async params => {
    let result;
    try {
      result = await get(`${backendServerUrl}/home/period/goods/distribute`, params);
      runInAction(() => {
        if (result) {
          this.rightInfoStore.commodityNum = result.data;
        }
      });
    } catch (err) {
      console.log(err);
    }
    return result;
  };

  /**
   * 异常事件
   * @param {*}
   */
  @action
  fetchGetExceptionInfo = async params => {
    let result;
    try {
      result = await get(`${backendServerUrl}/home/week/goods/distribute`, params);
      runInAction(() => {
        if (result) {
          this.rightInfoStore.exceptionInfo = result.data;
        }
      });
    } catch (err) {
      console.log(err);
    }
    return result;
  };

  /**
   * 多式联运
   * @param {*}
   */
  @action
  fetchGetMultiTransport = async params => {
    let result;
    try {
      result = await get(`${backendServerUrl}/home/multi_transport/info`, params);
      runInAction(() => {
        if (result) {
          this.rightInfoStore.multiTransport = result.data;
        }
      });
    } catch (err) {
      console.log(err);
    }
    return result;
  };

  /**
   * 增值业务
   * @param {*}
   */
  @action
  fetchGetFinanceInfo = async params => {
    let result;
    try {
      result = await get(`${backendServerUrl}/home/finance/info`, params);
      runInAction(() => {
        if (result.success) {
          this.rightInfoStore.financeInfo = result.data || [];
        } else {
          this.rightInfoStore.financeInfo = [];
        }
      });
    } catch (err) {
      runInAction(() => {
        this.rightInfoStore.financeInfo = [];
      });
    }
    return result;
  };

  /**
   * 班列计划
   * @param {*}
   */
  @action
  fetchGetTrainPlanInfo = async params => {
    let result;
    try {
      result = await get(`${backendServerUrl}/home/plan/notice`, params);
      runInAction(() => {
        if (result.success) {
          this.rightInfoStore.trainPlanInfo = result.data || [];
        } else {
          this.rightInfoStore.trainPlanInfo = [];
        }
      });
    } catch (err) {
      runInAction(() => {
        this.rightInfoStore.trainPlanInfo = [];
      });
    }
    return result;
  };
  getLastPointMap(data, points) {
    let trains = {};
    data.forEach(item => {
      if (!trains[item.trainCode]) {
        trains[item.trainCode] = points[item.externalStation] || '';
      } else if (
        trains[item.trainCode] !== '' &&
        points[item.externalStation] &&
        points[item.externalStation].lon <= trains[item.trainCode].lon
      ) {
        trains[item.trainCode] = points[item.externalStation];
      }
    });
    return trains;
  }

  getNameByReg(str) {
    return str.replace(/(^[\u4e00-\u9fa5]+).*/, '$1');
  }

  /**
   * 运踪
   * @param {*}
   */
  @action
  fetchTrackInfo = async params => {
    try {
      const { points } = service.mapService.mapStore;
      //旧
      const result = await get(`${backendServerUrl}/home/track?direction=${params}`);
      //新
      // const result = await get(`${backendServerUrl}/home/trackInfo?direction=${params}`);
      if (!result.success) throw result;
      // let trains = this.getLastPointMap(result.data, points);
      runInAction(() => {
        this.rightInfoStore.trackInfo = result.data.map((item, k) => {
          const { trainCode, portStationName } = item;
          item.trainKey = trainCode + k;
          item.label = portStationName;
          return item;
        });
        //旧
        this.rightInfoStore.trackInfo = result.data.map((item, k) => {
          const { stationList, currStation, trainCode, portStation } = item;
          item.trainKey = trainCode + k;
          item.stations = TRACK_CODE.map(key => {
            return {
              name: item[key],
              arrived: stationList.indexOf(item[currStation]) >= stationList.indexOf(item[key]),
              date: item[key + 'DateString'],
            };
          });
          const name = this.getNameByReg(item[currStation]);
          //旧
          item.label = item[currStation];
          //新
          // item.label = portStation;
          if (!!points[name]) {
            const temp = { ...points[name], name: item[currStation], show: true };
            points[item[currStation]] = temp;
          }
          return item;
        });
        //旧
        const trackInfo = this.rightInfoStore.trackInfo;
        let newTrackInfoList = []; //去除班列号重复的数组对象集合
        let hash = {};
        for (var i = 0; i < trackInfo.length; i++) {
          var elem = trackInfo[i].trainCode;
          if (!hash[elem]) {
            newTrackInfoList.push(trackInfo[i]);
            hash[elem] = true;
          }
        }
        this.setTrackInfo(newTrackInfoList);
        //新
        // this.setAllTracks(result.data || []);
      });
    } catch (err) {
      console.log('err :', err);
      runInAction(() => {
        this.rightInfoStore.trackInfo = [];
      });
    }
  };

  getTime(date) {
    return new Date(date).getTime();
  }
  @action
  handleHover(val, name = '') {
    this.rightInfoStore.isHover = val;
    this.rightInfoStore.filterName = name;
  }

  @action
  setAllTracks(arr) {
    this.rightInfoStore.allTracks = arr;
  }
  @action
  setTrackInfo(arr) {
    this.rightInfoStore.trackInfo = arr;
  }
  @action
  setFilterName(val) {
    this.rightInfoStore.filterName = val;
  }

  /**
   * 请求2020年数据
   */
  @action
  fetch2020Data = async portStationName => {
    try {
      const result = await get(`${backendServerUrl}/home/convertCount/portStation`, {
        portStationName,
      });
      if (result && result.success) {
        return result.data;
      }
    } catch (err) {
      return 0;
    }
  };

  @action
  changeTrains() {
    const {
      mapOptions: { series },
      filterPoints,
    } = service.mapService.mapStore;

    filterPoints.map(async item => {
      const num = await this.fetch2020Data(this.getNameByReg(item.name));
      this.rightInfoStore.newPoints = [...this.rightInfoStore.newPoints, { ...item, num }];
    });

    const iconSeries = {
      type: 'scatter',
      name: 'trainIcon',
      coordinateSystem: 'geo',
      showEffectOn: 'render',
      zlevel: 9,
      symbol: (_, { name }) => {
        if (name === this.rightInfoStore.filterName) {
          return `image://${require('../assets/lightTrain5.png')}`;
        }
        return `image://${require('../assets/trains.png')}`;
      },
      symbolSize: 26,
      data: filterPoints,
      label: {
        normal: {
          show: false,
          formatter: params => {
            const {
              data: { name },
            } = params;
            let num = 0;
            const obj = this.rightInfoStore.newPoints.find(item => item.name === name);
            if (obj) {
              num = obj.num;
            }
            return `2020年通过的班列数：${num}`;
          },
          position: 'top',
          backgroundColor: 'rgba(255,255,255,.9)',
          padding: [5, 10, 0, 10],
          borderRadius: 3,
          lineHeight: 32,
          color: '#000',
          fontSize: 16,
        },
        emphasis: {
          show: true,
        },
      },
    };
    if (series) {
      let trainIcon = series.find(({ name }) => name === 'trainIcon');
      trainIcon ? (trainIcon = iconSeries) : series.push(iconSeries);
    }
    service.mapService.mapStore.mapOptions.series = series;
    service.mapService.mapStore.mapChart.setOption(service.mapService.mapStore.mapOptions, true);
  }

  @action
  iconChange() {
    const { trackInfo, filterName } = this.rightInfoStore;
    if (filterName !== '') {
      let normalTracks = [],
        filterTracks = [];
      trackInfo.forEach(item => {
        runInAction(() => {
          if (item.label && filterName === item.label) {
            item.orange = true;
            filterTracks.push(item);
          } else {
            item.orange = false;
            normalTracks.push(item);
          }
        });
      });
      const concat = filterTracks.concat(normalTracks);
      runInAction(() => {
        this.rightInfoStore.allTracks = concat;
        this.rightInfoStore.filterTracks = filterTracks;
      });
    } else {
      trackInfo.map(item => {
        item.orange = false;
        return item;
      });
      this.setAllTracks(trackInfo);
    }
    this.rightInfoStore.recordIndex = 0;
  }
  @action
  setRecordIndex(val) {
    this.rightInfoStore.recordIndex = val;
  }

  //设置查看轨迹弹窗隐藏/显示
  @action
  setTrackModalVisible(visible) {
    this.rightInfoStore.visible = visible;
  }
  @action
  //获取查看轨迹的班列号
  setTrackCode(code) {
    this.rightInfoStore.trainCode = code;
  }
  @action
  //获取当前按钮显示
  setTrackButton(btn) {
    this.rightInfoStore.trackButton = btn;
  }

  //根据班列号查询运踪列表
  @action
  fetchListByTrainCode = async trainCode => {
    try {
      const result = await get(`${backendServerUrl}/home/trackInfoListByTrainCode`, {
        trainCode,
      });
      if (!result.success) throw result;
      runInAction(() => {
        this.rightInfoStore.trackByTrainCodeInfoList = result.data || [];
      });
    } catch (error) {
      console.log('err', error);
      runInAction(() => {
        this.rightInfoStore.trackByTrainCodeInfoList = [];
      });
    }
  };
  //运踪查看轨迹
  @action
  fetchTransportList = async params => {
    try {
      const result = await get(`${backendServerUrl}/home/trackDetail`, params);
      if (!result.success) throw result;
      runInAction(() => {
        this.rightInfoStore.transportList = result.data || [];
      });
      return result.data;
    } catch (error) {
      console.log('err', error);
      runInAction(() => {
        this.rightInfoStore.transportList = [];
      });
      return [];
    }
  };
}
