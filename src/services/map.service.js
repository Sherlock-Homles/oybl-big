import { action, runInAction, toJS } from 'mobx';
import { MapStore } from '../stores/map.store';
import delay from '../utils/delay';
import { get } from '../fetch';
import { backendServerUrl } from '../constant';
// import { trim } from 'zrender/lib/core/util';
import {
  ignoreAddress,
  EUCoords,
  osakaCoord,
  busanCoord,
  teheranCoord,
  outCoordsList,
} from './constant';

const baseUrl = `${backendServerUrl}/trainRun`;

export class MapService {
  constructor() {
    this.mapStore = new MapStore();
  }
  @action
  handleShift() {
    this.mapStore.track = !this.mapStore.track;
  }
  @action
  handlePoints(
    lineArr,
    handleLineArr,
    handleAddressArr,
    handleDashedLine,
    handleArrowLine,
    handleImpAddress
  ) {
    [
      ...lineArr,
      // ...handleLineArr,
      // ...handleAddressArr,
      // ...handleDashedLine,
      ...handleArrowLine,
      // handleImpAddress,
    ].forEach(item => {
      ['start', 'end'].forEach(k => {
        const { location: name, lat, lon } = item[k];
        !this.mapStore.points[name] &&
          (this.mapStore.points[name] = {
            lat,
            lon,
            name: name,
            show: false,
          });
      });
    });
  }
  @action
  handleOn() {
    this.mapStore.track = true;
  }
  @action
  handleOut() {
    this.mapStore.track = false;
  }
  //存储地图chart对象
  @action
  saveMapChart(chart) {
    this.mapStore.mapChart = chart;
  }

  /**
   * 适用于默认首页、故事1、故事2、故事3
   * @param {*} params
   */
  @action
  async fetchWorldMap01(params) {
    try {
      let url = `${baseUrl}/home/map`;
      const fetchType = params.type; // 故事地图类型
      if (fetchType === 'runInfo') {
        url = `${baseUrl}/run/map`;
      } else if (fetchType === 'routeDistribute') {
        url = `${baseUrl}/line/map`;
      } else if (fetchType === 'goodsDensity') {
        url = `${baseUrl}/density/map`;
      }
      const result = await get(url, params);
      runInAction(() => {
        if (result.success) {
          let handleLineArr = []; // 用于接收实线表示的路线
          let handleAddressArr = []; // 用于接收坐标点
          let handleDashedLine = []; // 用于接收虚线表示的路线
          let handleArrowLine = []; // 用于接收箭头表示的路线
          let handleImpAddress = []; //用于接收重点表示的坐标点

          let dataInfoArr = result.data;
          // 首页的map数据结构
          if (fetchType === 'homeMap') {
            dataInfoArr.forEach(lineDataItem => {
              const lineArr = lineDataItem.line;
              if (lineArr && lineArr.length > 0) {
                this.handlePoints(
                  lineArr,
                  handleLineArr,
                  handleAddressArr,
                  handleDashedLine,
                  handleArrowLine,
                  handleImpAddress
                );
                handleMapData(
                  lineDataItem.name,
                  lineArr,
                  handleLineArr,
                  handleAddressArr,
                  handleDashedLine,
                  handleArrowLine,
                  handleImpAddress
                );
              }
            });
          } else if (fetchType === 'runInfo') {
            // 第一个故事的map数据结构
            if (dataInfoArr.length > 0) {
              dataInfoArr.forEach(dataItem => {
                dataItem.route.forEach(lineDataItem => {
                  const lineArr = lineDataItem.line;
                  if (lineArr && lineArr.length > 0) {
                    handleMapData(
                      lineDataItem.name,
                      lineArr,
                      handleLineArr,
                      handleAddressArr,
                      handleDashedLine,
                      handleArrowLine,
                      handleImpAddress
                    );
                  }
                });
              });
              const title = dataInfoArr[0].title;
              // 保存title到store里
              this.mapStore.event = title;
            }
          } else {
            if (fetchType === 'goodsDensity') {
              // 第三个故事的map数据结构
              dataInfoArr = result.data.routes;
              // 线路信息---地图下方
              this.mapStore.mapLineInfo = result.data.info;
            }
            // 第二个故事的map数据结构
            dataInfoArr.length &&
              handleMapData(
                '',
                dataInfoArr,
                handleLineArr,
                handleAddressArr,
                handleDashedLine,
                handleArrowLine,
                handleImpAddress
              );
          }

          const EuCityCoords = fetchType === 'homeMap' ? EUCoords : [];

          const startArr = [
            {
              name: '山东',
              value: [117.120095, 36.6512],
              label: {
                show: true,
                formatter: '{b}',
                position: 'right',
                fontSize: 20,
                color: '#fe3100',
              },
            },
            {
              name: '仁川',
              value: [126.37, 37.28],
              label: {
                show: true,
                formatter: '{b}',
                position: 'right',
                fontSize: 18,
                color: 'black',
              },
            },
            {
              name: '东京',
              value: [139.46, 35.42],
              label: {
                show: true,
                formatter: '{b}',
                position: 'right',
                fontSize: 18,
                color: 'black',
              },
            },
          ];

          // 每个地区的设备告警数量
          var showList = [
            {
              name: '杜伊斯堡',
              value: 11670,
              arrivalDays: 17,
            },
            {
              name: '莫斯科',
              value: 9588,
              arrivalDays: 14,
            },
            {
              name: '明斯克',
              value: 10118,
              arrivalDays: 15,
            },
            {
              name: '塔什干',
              value: 6038,
              arrivalDays: 10,
            },
            {
              name: '河内',
              value: 3163,
              arrivalDays: 5,
            },
            {
              name: '乌兰巴托',
              value: 2162,
              arrivalDays: 9,
            },
          ];
          const handleAddressObj = {};
          handleAddressArr.forEach(item => {
            handleAddressObj[item.name] = item.value;
          });
          var convertData = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
              var geoCoord = handleAddressObj[data[i].name];
              if (geoCoord) {
                res.push({
                  name: data[i].name,
                  value: geoCoord.concat(data[i].value),
                });
              }
            }
            // 有数据的地区的名称和value值
            return res;
          };

          /**韩国/日本线路的终点 */
          const end = {
            name: '青岛',
            value: [119.3, 35.35],
            label: {
              show: true,
              // distance: 10,
              formatter: '{b}',
              position: 'right',
              fontSize: 12,
              textStyle: {
                color: 'black',
              },
            },
          };

          /**
           * 在[总列表]中排除的点:
           * 例如出境口岸,需要重点表示的点,
           * 需要特殊表示的点等.对于这些数据进行单独处理
           */
          const lis = [
            '山东',
            '汉堡',
            '塔什干',
            '阿拉山口',
            '霍尔果斯',
            '二连浩特',
            '满洲里',
            '凭祥',
            '磨憨',
            '莫斯科',
            '河内',
          ];
          /**在[重要列表]中排除的点 */
          const lis2 = ['山东'];

          const others = handleAddressArr.filter(item => !lis.includes(item.name));
          const impAddress = handleImpAddress.filter(item => !lis2.includes(item.name));
          const newSeries = [];
          const seriesArr = [
            // 山东线路
            {
              handleLineArr: handleLineArr,
              start: startArr[0],
              others: others.concat(EuCityCoords).concat(teheranCoord),
              handleDashedLine: handleDashedLine,
              handleImpAddress: impAddress,
            },
            // 韩国线路
            {
              handleLineArr: [
                {
                  coords: [[126.37, 37.28], [119.3, 35.35]],
                  name: '中亚',
                },
                {
                  coords: [[129.02, 35.05], [119.3, 35.35]],
                  name: '中亚',
                },
              ],
              start: startArr[1],
              others: [end, busanCoord],
            },
            // 日本线路
            {
              handleLineArr: [
                {
                  coords: [[139.46, 35.42], [135.31, 34.41]],
                  name: '中亚',
                },
                {
                  coords: [[135.31, 34.41], [119.3, 35.35]],
                  name: '中亚',
                },
              ],
              start: startArr[2],
              others: [end, osakaCoord],
            },
          ];

          /**出境口岸地点 */
          const outAddress = ['阿拉山口', '霍尔果斯', '满洲里', '二连浩特', '凭祥', '磨憨'];

          /**获取本次显示哪几个出境口岸 */
          const outCoordsListTemp = handleAddressArr
            .filter(item => outAddress.includes(item.name))
            .map(item => item.name);

          /**最终要显示的出境口岸点 */
          const outCoordsListAim = outCoordsList.filter(item => {
            return outCoordsListTemp.includes(item.name.trim());
          });

          const normalRippleCoords = [
            {
              name: '河内',
              value: [105.83416, 21.027764],
              label: {
                show: true,
                distance: 2,
                formatter: '{b}',
                position: 'right',
                fontSize: 12,
                textStyle: {
                  color: 'black',
                },
              },
            },
            {
              name: '莫斯科',
              value: [37.6173, 55.755826],
              label: {
                show: true,
                distance: 2,
                formatter: '{b}',
                position: 'bottom',
                fontSize: 12,
                textStyle: {
                  color: 'black',
                },
              },
              itemStyle: {
                show: true,
                color: '#fe3100',
              },
            },
          ];

          // 将出境口岸和境内箭头指向山东的路线
          // 及特殊处理的点添加到地图中
          newSeries.push(
            // 出境口岸点
            {
              type: 'effectScatter',
              coordinateSystem: 'geo',
              showEffectOn: 'render',
              zlevel: 3,
              symbol: 'circle',
              symbolSize: 11,
              rippleEffect: {
                brushType: 'stroke',
                period: 0,
                scale: 3,
              },
              itemStyle: {
                show: true,
                color: '#26eee7',
              },
              data: outCoordsListAim,
            },
            // 普通表示坐标点,向外辐射
            {
              type: 'effectScatter',
              coordinateSystem: 'geo',
              showEffectOn: 'render',
              zlevel: 3,
              symbol: 'circle',
              symbolSize: 8,
              rippleEffect: {
                brushType: 'stroke',
                period: 15,
                scale: 30,
                color: '#fe3100',
              },
              itemStyle: {
                show: true,
                color: '#35D003',
              },
              data: normalRippleCoords,
            },
            // 箭头指示的路线
            {
              type: 'lines',
              coordinateSystem: 'geo',
              symbol: 'none',
              effect: {
                // 控制动画效果
                show: true,
                symbol: 'arrow', // 动画的类型 -- 箭头
                period: 1.5,
                delay: 100,
                trailLength: 0,
                symbolSize: 6, // 大小
                color: 'rgba(255,255,255,0.5)',
              },
              lineStyle: {
                color: '#ffffff',
                width: '2',
                curveness: '0.1',
              },
              data: handleArrowLine,
            }
          );
          seriesArr.forEach((item, index) => {
            newSeries.push(
              /*实线*/
              {
                type: 'lines',
                coordinateSystem: 'geo',
                symbol: 'none',
                effect: {
                  show: true,
                  symbol: 'roundRect',
                  period: 1.5,
                  delay: 100,
                  trailLength: 0,
                  symbolSize: 6,
                  color: 'rgba(255,255,255,0.3)',
                },
                lineStyle: {
                  color: item.others === end ? '#b7eefd' : '#ffffff',
                  width: '3',
                  curveness: '0.1',
                },

                data: item.handleLineArr,
              },

              // //火车图标
              // {
              //   type: 'scatter',
              //   name: 'trainIcon',
              //   coordinateSystem: 'geo',
              //   showEffectOn: 'render',
              //   zlevel: 3,
              //   symbol: `image://${require('../assets/lightTrain5.png')}`,
              //   symbolSize: 26,
              //   data: [[100, 42.36]],
              //   // data: item.handleLineArr.slice(0, 4).map(({ coords }) => {
              //   //   return [(coords[0][0] + coords[1][0]) / 2, (coords[0][1] + coords[1][1]) / 2];
              //   // }),
              // },
              // {
              //   type: 'lines',
              //   coordinateSystem: 'geo',
              //   symbol: 'none',
              //   effect: {
              //     show: true,
              //     period: 50,
              //     symbol: `image://${require('../assets/trains.png')}`,
              //     delay: 100,
              //     trailLength: 0,
              //     symbolSize: 25,
              //   },

              //   lineStyle: {
              //     color: item.others === end ? '#b7eefd' : '#ffffff',
              //     width: '3',
              //     curveness: '0.1',
              //   },

              //   data: item.handleLineArr,
              // },
              /*虚线*/
              {
                type: 'lines',
                coordinateSystem: 'geo',
                symbol: 'none',
                effect: {
                  show: true,
                  symbol: 'roundRect',
                  period: 1.5,
                  delay: 100,
                  trailLength: 0,
                  symbolSize: 6,
                  color: 'rgba(255,255,255,0.5)',
                },
                lineStyle: {
                  color: '#ffffff',
                  width: '3',
                  curveness: '0.1',
                  type: 'dashed',
                },
                data: item.handleDashedLine,
              },

              /*重点表示的点*/
              {
                type: 'effectScatter',
                coordinateSystem: 'geo',
                showEffectOn: 'render',
                zlevel: 3,
                symbol: 'circle',
                symbolSize: 18,
                rippleEffect: {
                  brushType: 'stroke',
                  period: 16,
                  scale: 22,
                  color: '#fe3100',
                },
                itemStyle: {
                  show: true,
                  color: '#f60000',
                },
                data: item.handleImpAddress,
              },
              /*终点*/
              {
                type: 'effectScatter',
                coordinateSystem: 'geo',
                showEffectOn: 'render',
                zlevel: 3,
                symbol: 'circle',
                symbolSize: 8,
                rippleEffect: {
                  brushType: 'stroke',
                  period: 0,
                  scale: 3,
                },
                itemStyle: {
                  show: true,
                  color: '#35D003',
                },
                data: item.others,
              },

              /*起点*/
              {
                type: 'effectScatter',
                coordinateSystem: 'geo',
                showEffectOn: 'render',
                zlevel: 3,
                symbol: 'circle',
                symbolSize: item.start.name !== '山东' ? 16 : 20,
                rippleEffect: {
                  brushType: 'stroke',
                  period: item.start.name !== '山东' ? 3 : 15,
                  scale: item.start.name !== '山东' ? 2 : 20,
                },
                label: {
                  show: true,
                  formatter: '{b}',
                  position: 'right',
                  fontSize: 20,
                  color: '#fe3100',
                },
                itemStyle: {
                  show: true,
                  color: item.start.name !== '山东' ? '#f60000' : '#fe6000',
                },
                data: [item.start],
              },
              // 绘制地图上旗帜形状的提示信息
              {
                name: '点',
                type: 'scatter',
                coordinateSystem: 'geo',
                hoverAnimation: false,
                legendHoverLink: false,
                symbol: `image://${require('../assets/flag.png')}`,
                symbolOffset: ['45%', '-45%'],
                symbolSize: 80,
                label: {
                  show: true,
                  color: '#fff',
                  padding: [5, 0, 15, 3],
                  // label样式定义
                  rich: {
                    lineStyle: {
                      color: 'rgba(255, 255, 255, 0.4)',
                    },
                    timeStyle: {
                      lineHeight: 18,
                      color: 'rgba(255, 255, 255, 0.4)',
                    },
                  },
                  formatter: ({ name }) => {
                    const { value, arrivalDays } = showList.find(item => item.name === name) || {};
                    return (
                      '{lineStyle|运输距离: \n' +
                      value +
                      '公里}\n{timeStyle|时长: 约' +
                      arrivalDays +
                      '天}'
                    );
                  },
                },
                zlevel: 6,
                data: convertData(showList),
              }
            );
          });
          this.mapStore.mapOptions = {
            backgroundColor: 'transparent',
            // 添加数据提示---黄建停 2019/7/3
            // tooltip: {
            //   trigger: 'item',
            //   backgroundColor: 'transparent',
            //   formatter: function(params) {
            //     if (params.componentSubType === 'effectScatter') {
            //       var html = '<div style="position:relative">运输距离: ' + 1000 + '公里<br/>';
            //       html += '到货时长: ' + 18 + '天<br/>';
            //       html += '通关时长: ' + 3 + '天<br/>';
            //       html +=
            //         "<img style='width:200px;height:150px;position:absolute;top:-20px;left:-65px' src='" +
            //         require('../assets/coordinate.png') +
            //         "'/></div>";
            //       return html;
            //     }
            //   },
            //   position: point => [point[0], point[1] - 105],
            // },
            geo: {
              type: 'map',
              map: 'world',
              roam: false,
              zoom: 2.1,
              center: [68.617733, 43.792818],
              itemStyle: {
                areaColor: '#019ffb',
              },
            },
            series: newSeries,
          };
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * 适用于故事4、故事5、故事6
   * @param {*} params
   */
  @action
  async fetchWorldMap02(params) {
    let result;
    try {
      let url = `${baseUrl}/source/map`;
      const fetchType = params.type; // 故事地图类型
      if (fetchType === 'goodsDistribution') {
        url = `${baseUrl}/goods/map`;
      } else if (fetchType === 'industryDistribution') {
        url = `${baseUrl}/industry/map`;
      }
      result = await get(url, params);

      // 默认起点设置为山东
      const geoCoordMap = { 山东: [117.120095, 36.6512] };
      const dataList = result.data;
      if (dataList && dataList.length) {
        dataList.forEach(item => {
          geoCoordMap[item.name] = {
            trainName: item.train_name,
            coords: [item.lon, item.lat],
          };
        });
      }
      runInAction(() => {
        this.mapStore.mapOptions = {
          backgroundColor: 'transparent',
          geo: {
            type: 'map',
            map: 'world',
            roam: false,
            zoom: 0.6,
            center: [87.617733, 43.792818],
            itemStyle: {
              areaColor: '#019ffb',
            },
          },
          series: [
            {
              type: 'lines',
              zlevel: 2,
              effect: {
                show: true,
                period: 2,
                trailLength: 0.2,
                color: '#db9982',
                symbolSize: 8,
              },
              label: {
                show: true,
                position: 'middle',
                formatter: '{b}',
              },
              lineStyle: {
                color: '#a6c84c',
                width: 2,
                opacity: 0.4,
                curveness: 0.2,
              },
              data: formatGCData(geoCoordMap, '山东'),
            },
            {
              type: 'effectScatter',
              coordinateSystem: 'geo',
              showEffectOn: 'render',
              zlevel: 3,
              symbol: 'circle',
              symbolSize: 10,
              rippleEffect: {
                brushType: 'stroke',
                period: 5,
                scale: 7,
              },
              itemStyle: {
                normal: {
                  show: true,
                  color: 'yellow',
                },
              },
              data: formatVData(geoCoordMap, '山东'),
            },
            {
              type: 'effectScatter',
              coordinateSystem: 'geo',
              showEffectOn: 'render',
              zlevel: 3,
              symbol: 'circle',
              symbolSize: 30,
              rippleEffect: {
                brushType: 'stroke',
                period: 3,
                scale: 2,
              },
              label: {
                show: true,
                formatter: '{b}',
                position: 'right',
                fontSize: 20,
                color: '#fe3100',
              },
              itemStyle: {
                show: true,
                color: '#fe3100',
              },
              data: [
                {
                  name: '山东',
                  value: [117.120095, 36.6512],
                },
              ],
            },
          ],
        };
      });
    } catch (err) {
      console.log(err);
    }
    return result;
  }

  /**
   * 适用于故事6
   * @param {*} params
   */
  @action
  fetchWorldMap03(params) {
    this.mapStore.mapOptions = {};
  }

  /**
   * 清除世界地图options---黄建停 2019/7/3
   * @param {*} params
   */
  @action
  fetchClearWorldMapOptions(params) {
    this.mapStore.mapOptions = {
      backgroundColor: 'transparent',
      geo: {
        type: 'map',
        map: 'world',
      },
      series: [
        {
          type: 'lines',
          data: [],
        },
        {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: [],
        },
      ],
    };
  }

  /**
   * 山东省地图---黄建停 2019/7/3
   * @param {*} data
   */
  @action
  fetchshandongMap(data, city) {
    const geoCoordMap = {
      济南市: [117.121225, 36.66466],
      菏泽市: [115.480656, 35.23375],
      济宁市: [116.59, 35.38],
      德州市: [116.39, 37.45],
      聊城市: [115.97, 36.45],
      泰安市: [117.13, 36.18],
      临沂市: [118.35, 35.05],
      淄博市: [118.05, 36.78],
      枣庄市: [117.57, 34.86],
      滨州市: [118.03, 37.36],
      潍坊市: [119.1, 36.62],
      东营市: [118.49, 37.46],
      青岛市: [120.3, 36.62],
      烟台市: [120.9, 37.32],
      威海市: [122.1, 37.2],
      日照市: [119.1, 35.62],
      莱芜市: [117.7, 36.28],
    };
    const citys = Object.keys(geoCoordMap);
    citys.forEach(city => {
      if (!data.find(item => item.name === city)) {
        data.push({
          name: city,
          value: 0,
        });
      }
    });
    var convertData = function (data) {
      var res = [];
      for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value),
          });
        }
      }
      return res;
    };
    const option = {
      animationDuration: function (idx) {
        // 越往后的数据延迟越大
        return idx * 50;
      },
      animationEasing: 'elasticOut',
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          if (typeof params.value[2] === 'undefined') {
            return params.name + ' : ' + params.value;
          } else {
            return params.name + ' : ' + params.value[2] + '列';
          }
        },
      },
      geo: {
        show: true,
        map: '山东',
        label: {
          normal: {
            show: false,
            fontSize: 18,
          },
          emphasis: {
            show: false,
          },
        },
        roam: false,
        itemStyle: {
          normal: {
            areaColor: '#019ffb',
            borderColor: '#3fdaff',
            borderWidth: 2,
          },
        },
      },
      series: [
        {
          name: 'light',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: convertData(data),
          symbolSize: function (val) {
            // return val[2] / 5;
            return val[2] ? 15 : 0; // 默认显示的一样大
          },
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              show: false,
              fontSize: 16,
            },
            emphasis: {
              show: true,
            },
          },
          itemStyle: {
            normal: {
              color: '#fe3100',
            },
          },
          animationDelay: function (idx) {
            return idx * 200;
          },
        },
        {
          type: 'map',
          map: '山东',
          label: {
            normal: {
              show: true,
              fontSize: 18,
              align: 'center',
            },
            emphasis: {
              show: false,
            },
          },
          roam: false,
          itemStyle: {
            normal: {
              areaColor: '#019ffb',
              borderColor: '#3fdaff',
              borderWidth: 2,
            },
          },
          data,
          animationDelay: function (idx) {
            return idx * 200;
          },
        },
        {
          name: '选中',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: convertData(data.filter(item => item.name === city)),
          symbolSize: function (val) {
            return val[2] ? 25 : 0;
          },
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke',
          },
          hoverAnimation: true,
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              show: false,
            },
          },
          itemStyle: {
            normal: {
              color: '#fe3100',
              shadowBlur: 10,
              shadowColor: '#05C3F9',
            },
          },
          zlevel: 1,
          animationDelay: function (idx) {
            return idx * 1000;
          },
        },
      ],
    };
    runInAction(() => {
      this.mapStore.mapOptions = option;
    });
  }
}

function formatGCData(geoMap, srcName) {
  const targetGeoData = [];
  Object.entries(geoMap).forEach(([name, value]) => {
    if (name !== srcName) {
      targetGeoData.push({
        name: value.trainName,
        coords: [geoMap[srcName], value.coords],
      });
    }
  });
  return targetGeoData;
}

function formatVData(geoMap, srcName) {
  const vGeoData = [];
  Object.entries(geoMap).forEach(([name, value]) => {
    if (name !== srcName) {
      vGeoData.push({
        name,
        value: value.coords,
        label: {
          show: true,
          formatter: '{b}',
          position: changeLabelPosition(name),
          distance: 0,
          fontSize: 14,
          textStyle: {
            color: 'black',
          },
        },
      });
    }
  });
  return vGeoData;
}

/**
 * 处理后台返回的数据
 * @param {string} lineName 线路名称
 * @param {[]} lineArr 返回数据的数组
 * @param {[]} handleLineArr 线路数组（实线）
 * @param {[]} handleAddressArr 坐标点的数组
 * @param {[]} handleDashedLine 线路数组（虚线）
 * @param {[]} handleArrowLine 线路数组（箭头）
 * @param {[]} handleImpAddress 重点表示的点
 */
function handleMapData(
  lineName,
  lineArr,
  handleLineArr,
  handleAddressArr,
  handleDashedLine,
  handleArrowLine,
  handleImpAddress
) {
  lineArr.forEach((item, index) => {
    if (lineName === '境内') {
      // 境内数据指向山东使用箭头
      // 添加到箭头列表
      handleArrowLine.push({
        name: lineName,
        coords: [[item.start.lon, item.start.lat], [item.end.lon, item.end.lat]],
      });
    } else if (item.line_type === 1) {
      // type为1 要用虚线绘制
      handleDashedLine.push({
        name: lineName,
        coords: [[item.start.lon, item.start.lat], [item.end.lon, item.end.lat]],
      });
    } else {
      // type为0 和 其他的用普通实线绘制
      handleLineArr.push({
        name: lineName,
        coords: [[item.start.lon, item.start.lat], [item.end.lon, item.end.lat]],
      });
    }

    /**添加重点显示的点 */
    if (
      handleImpAddress.findIndex(ele => ele.name === item.start.location) === -1 &&
      item.start.type === 1
    ) {
      handleImpAddress.push({
        name: item.start.location,
        value: [item.start.lon, item.start.lat],
        label: {
          show: true,
          formatter: '{b}',
          position: changeLabelPosition(item.start.location),
          distance: 0,
          fontSize: 16,
          textStyle: {
            color: 'black',
            fontWeight: 'bold',
          },
        },
      });
    }
    if (
      handleImpAddress.findIndex(ele => ele.name === item.end.location) === -1 &&
      item.end.type === 1
    ) {
      handleImpAddress.push({
        name: item.end.location,
        value: [item.end.lon, item.end.lat],
        label: {
          show: true,
          formatter: '{b}',
          position: changeLabelPosition(item.end.location),
          distance: 0,
          fontSize: 16,
          textStyle: {
            color: 'black',
            fontWeight: 'bold',
          },
        },
      });
    }
    /**end */

    if (handleAddressArr.findIndex(ele => ele.name === item.start.location) === -1) {
      handleAddressArr.push({
        name: item.start.location,
        value: [item.start.lon, item.start.lat],
        label: {
          show: !ignoreAddress.includes(item.start.location),
          formatter: '{b}',
          position: changeLabelPosition(item.start.location),
          distance: 0,
          fontSize: 12,
          textStyle: {
            color: 'black',
          },
        },
      });
    }
    if (handleAddressArr.findIndex(ele => ele.name === item.end.location) === -1) {
      handleAddressArr.push({
        name: item.end.location,
        value: [item.end.lon, item.end.lat],
        label: {
          show: !ignoreAddress.includes(item.end.location),
          formatter: '{b}',
          position: changeLabelPosition(item.end.location),
          distance: 0,
          fontSize: 12,
          textStyle: {
            color: 'black',
          },
        },
      });
    }
  });
}

/**
 * 按照地点的名字调整名字的位置（上下左右）
 * @param {string} locationName 地名
 * @return {"top" | "bottom" | "right" | "left"} 相对坐标的位置
 */
function changeLabelPosition(locationName) {
  switch (locationName) {
    case '梅杰涅':
      return 'top';
    case '阿克套':
      return 'top';
    case '乌鲁木齐':
      return 'right';
    case '马拉舍维奇':
      return 'right';
    case '华沙':
      return 'left';
    case '希姆肯特':
      return 'top';
    case '帕盖吉艾':
      return 'right';
    case '明斯克':
      return 'right';
    case '布拉格':
      return 'right';
    case '布拉迪斯拉发':
      return 'left';
    case '埃迪尔内':
      return 'left';
    case '布加勒斯特':
      return 'right';
    case '伊斯坦布尔':
      return 'bottom';
    case '索菲亚':
      return 'left';
    case '第比利斯':
      return 'top';
    case '北京':
      return 'top';
    case '河北':
      return 'left';
    case '天津':
      return 'right';
    case '乌兰乌德':
      return 'bottom';
    case '安热罗苏真斯克':
      return 'top';
    case '叶卡捷琳堡':
      return 'bottom';
    case '秋明':
      return 'top';
    case '罗兹':
      return 'top';
    case '阿拉山口':
      return 'top';
    case '凭祥':
      return 'right';
    case '吉隆坡':
    case '赤塔':
      return 'right';
    case '克列希哈':
    case '切尔尼科夫卡':
    case '阿斯塔纳':
    case '沃尔西诺':
    case '热特苏':
    case '塔什干':
      return 'left';
    case '塔拉兹':
    case '塞拉姆':
      return 'top';

    case '梅杰乌':
      return 'top';
    case '丘库尔赛':
    case '谢尔盖利':
    case '伊尔库茨克':
    case '霍尔果斯':
      return 'top';
    case '阿拉木图':
      return 'right';
    case '吉扎克':
    case '乌尔根奇':
    case '磨憨':
      return 'left';

    case '比什凯克':
    case '汉堡':
      return 'bottom';
    case '安集延-北':
    case '乌卢格别克':
    case '阿汉加兰':
      return 'right';
    case '杜伊斯堡':
      return [8, 8];

    default:
      return 'bottom';
  }
}
