/*
 * @文件描述:
 * @公司: thundersdata
 * @作者: 王翠娇
 * @Date: 2020-06-08 10:14:50
 * @LastEditors: 王翠娇
 * @LastEditTime: 2022-01-11 09:56:20
 */
import { observable, computed } from 'mobx';

export class MapStore {
  @observable
  mapOptions = {
    backgroundColor: 'transparent',
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
  };
  // 线路信息
  @observable
  mapLineInfo = {};

  // 事件
  @observable
  event = '';

  //运踪是否显示
  @observable
  track = true;

  //首页 坐标点
  @observable
  points = {
    霍尔果斯: { lat: 44.213941, show: false, lon: 80.411271, name: '霍尔果斯' },
    石家庄: { lat: 37.895659, show: false, lon: 114.904221, name: '石家庄' },
    塔什干: { lat: 41.299496, show: false, lon: 69.240073, name: '塔什干' },
    乌鲁木齐: { lat: 43.825592, show: false, lon: 87.616848, name: '乌鲁木齐' },
    阿腾科里: { lat: 42.5, show: false, lon: 74.5, name: '阿腾科里' },
    石乌: { lat: 40, show: false, lon: 100.5, name: '石乌' },
    北京: { lat: 39.9042, show: false, lon: 116.407396, name: '北京' },
    乌兰察布: { lat: 40.997919, show: false, lon: 113.148092, name: '乌兰察布' },
    二连浩特: { lat: 43.653169, show: false, lon: 111.977943, name: '二连浩特' },
    凭祥: { lat: 22.094484, show: true, lon: 106.766293, name: '凭祥' },
    扎门乌德: { lat: 43.835509, show: false, lon: 111.68831, name: '扎门乌德' },
    沃尔西诺: { lat: 55.227092, show: false, lon: 33.64147, name: '沃尔西诺' },
    锦州: { lat: 41.10463, show: false, lon: 121.131449, name: '锦州' },
    齐齐哈尔: { lat: 47.359002, show: false, lon: 123.924569, name: '齐齐哈尔' },
    满洲里: { lat: 49.597841, show: false, lon: 117.378529, name: '满洲里' },
    布拉格: { lat: 41.19, show: false, lon: 96.48, name: '布拉格' },
    后贝加尔斯克: { lat: 49.3905, show: false, lon: 117.1937, name: '后贝加尔斯克' },
  };

  @computed
  get filterPoints() {
    return Object.keys(this.points)
      .map(key => this.points[key])
      .filter(({ show }) => show)
      .map(({ lat, lon, name }) => {
        return {
          name,
          value: [lon, lat],
        };
      });
  }
  @observable
  mapChart = {};
}
