// export const backendServerUrl = 'http://high-speed.thundersdata.com'; // 线上 Server地址
// export const backendServerUrl = 'http://data.gateway.gswl.thundersdata.com/screen'; // 线上 Server地址

// export const backendServerUrl = 'http://oybl.gateway.gswl.thundersdata.com/screen'; //欧亚班列域名
export const backendServerUrl = 'http://oybl.gateway.oybl.thundersdata.com:1480/screen'; //迁移后欧亚班列域名

export const START_ANIMATION_TIMEOUT = 20000; // 启动动画的延时时长

export const STORY_INTERVAL = 5000; // 每个故事里面的单个播放间隔

export const STORY_NAME = Object.freeze({
  1: 'TrainMonthlyChart',
  2: 'RouteDistributionChart',
  3: 'GoodsDensityChart',
  4: 'FreightDistributionChart',
  5: 'GoodsDistributionChartLeft',
  6: 'IndustryDistributionChart',
  7: 'FastSellDistributionChart',
});

export const TOP_TEN = Object.freeze({
  goods: {
    title: '货物品类-TOP10',
    btText: '货品',
    url: '/home/industry/distribute',
  },
  owner: {
    title: '货主排行-TOP10',
    btText: '货主',
    // url: '/home/owner/distribute',
    url: '/home/findAgency/TeuTop', //按发运时间统计teu
  },
  // provincialkeys: {
  //   title: '省内重点服务企业',
  //   btText: '省重',
  //   url: '/home/importantCompany/goods',
  // },
  // goodsSource: {
  //   title: '货源组织单位',
  //   btText: '货源',
  //   url: '/home/sourceCompany/goods',
  // },
});

export const TOP_TEN_FAST_SELL = Object.freeze({
  goods: '/trainRun/category/city/distribute',
  // owner: '/home/owner/category/distribute',
  owner: '/home/findAgency/TeuTopDesc',
  provincialkeys: '/home/sourceCompany/category',
  goodsSource: '/home/sourceCompany/category',
});

export const TRACK_KINDS = Object.freeze({
  go: {
    btText: '去程',
    param: '去',
  },
  back: {
    btText: '回程',
    param: '回',
  },
});

export const TRACK_CODE = [
  'startStation',
  'passStation1',
  'portStation',
  'passStation2',
  'passStation3',
  'passStation4',
  'passStation5',
  'externalStation',
];

// export const LABEL = {
//   霍尔果斯: '霍尔果斯',
//   塔什干: '塔什干',
//   乌鲁木齐: '乌鲁木齐',
//   阿腾科里: '阿腾科里',
//   丘库尔赛: '塔什干',
//   北京: '北京',
//   乌兰察布: '乌兰察布',
//   二连浩特: '二连浩特',
//   沃罗滕斯克: '沃尔西诺',
//   库帕夫纳: '沃尔西诺',
//   谢利亚季诺: '沃尔西诺',
//   布洛奇纳亚: '沃尔西诺',
//   '斯博尔纳亚-煤': '沃尔西诺',
//   霍夫里诺: '沃尔西诺',
//   沃尔西诺: '沃尔西诺',
//   科利亚季奇: '沃尔西诺',
//   '布达佩斯-基科托': '沃尔西诺',
//   杜伊斯堡: '沃尔西诺',
//   汉堡: '沃尔西诺',
//   锦州: '锦州',
//   齐齐哈尔: '齐齐哈尔',
//   满洲里: '满洲里',
//   布拉格: '布拉格',
//   后贝加尔斯克: '后贝加尔斯克',
// };
