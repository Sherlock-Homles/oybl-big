import { action, runInAction } from 'mobx';
import { StoryStore } from '../stores/story.store';
import { get } from '../fetch';
import { backendServerUrl, TOP_TEN, TOP_TEN_FAST_SELL } from '../constant';

export class StoryService {
  constructor() {
    this.storyStore = new StoryStore();
  }

  /**
   * 切换当前的故事
   * @param {*} currentStory
   */
  @action
  changeStory(currentStory) {
    this.storyStore.currentStory = currentStory;
  }

  /**
   * 开始讲故事
   * @param {*} start
   */
  @action
  startTellStory(start) {
    this.storyStore.startTellStory = start;
  }

  /**
   * 开行情况
   * @param {*}
   */
  @action
  fetchGetRunInfo = async params => {
    try {
      this.storyStore.runInfo = [
        // {
        //   name: '2021',
        //   list: [
        //     // { date: '2021-11', name: '11月', value: 141 },
        //     // { date: '2021-12', name: '12月', value: 228 },
        //   ],
        // },
        {
          name: '2022',
          list: [
            // { date: '2022-01', name: '1月', value: 160 },
            // { date: '2022-02', name: '2月', value: 147 },
            // { date: '2022-03', name: '3月', value: 155 },
            // { date: '2022-04', name: '4月', value: 147 },
            // { date: '2022-05', name: '5月', value: 142 },
            { date: '2022-06', name: '6月', value: 151 },
            { date: '2022-07', name: '7月', value: 137 },
            { date: '2022-08', name: '8月', value: 163 },
            { date: '2022-09', name: '9月', value: 170 },
            { date: '2022-10', name: '10月', value: 185 },
            { date: '2022-11', name: '11月', value: 272 },
            { date: '2022-12', name: '12月', value: 228 },
          ],
        },
        {
          name: '2023',
          list: [
            { date: '2023-01', name: '1月', value: 152 },
            { date: '2023-02', name: '2月', value: 150 },
            { date: '2023-03', name: '3月', value: 204 },
            { date: '2023-04', name: '4月', value: 272 },
            { date: '2023-05', name: '5月', value: 289 },
            { date: '2023-06', name: '6月', value: 286 },
            { date: '2023-07', name: '7月', value: 238 },
            { date: '2023-08', name: '8月', value: 152 },
            { date: '2023-09', name: '9月', value: 149 },
            { date: '2023-10', name: '10月', value: 184 },
            { date: '2023-11', name: '11月', value: 200 },
            { date: '2023-12', name: '12月', value: 290 },
          ],
        },
        {
          name: '2024',
          list: [
            { date: '2024-01', name: '1月', value: 184 },
            { date: '2024-02', name: '2月', value: 156 },
            { date: '2024-03', name: '3月', value: 201 },
            { date: '2024-04', name: '4月', value: 181 },
            { date: '2024-05', name: '5月', value: 182 },
          ],
        },
      ];
    } catch (err) {
      runInAction(() => {
        this.storyStore.runInfo = [];
      });
    }
  };

  /**
   * 路线分布
   * @param {*}
   */
  @action
  fetchGetRouteDistribute = async params => {
    try {
      // 走接口拿的真实数据
      const result = await get(`${backendServerUrl}/home/route/distribute`, params);
      runInAction(() => {
        if (result && result.success) {
          this.storyStore.routeDistribute = result.data;
        }
      });

      // 提供假数据
      this.storyStore.routeDistribute = [
        { name: '中亚', value: 4757 },
        { name: '中欧', value: 5179 },
        { name: '南亚', value: 40 },
        { name: '中蒙', value: 23 },
      ];
    } catch (err) {
      runInAction(() => {
        this.storyStore.routeDistribute = [];
      });
    }
  };

  /**
   * 线路货运密度
   * @param {*}
   */
  @action
  fetchGetGoodsDensity = async params => {
    try {
      const result = await get(`${backendServerUrl}/home/line/goods/density`, params);
      runInAction(() => {
        if (result && result.success) {
          this.storyStore.goodsDensity = result.data;
        }
      });
    } catch (err) {
      runInAction(() => {
        this.storyStore.goodsDensity = [];
      });
    }
  };

  /**
   * 货源分布
   * @param {*}
   */
  @action
  fetchGetFreightDistribution = async params => {
    try {
      // 走接口拿真实数据
      const result = await get(`${backendServerUrl}/home/source/distribute`, params);
      runInAction(() => {
        if (result && result.success) {
          // 去除开行数量为0的记录
          const list = result.data.filter(item => {
            if (['淄博', '济宁', '枣庄', '聊城', '日照', '潍坊', '烟台'].includes(item.name))
              return null;
            return item.value !== 0;
          });
          this.storyStore.freightDistribution = list;
        }
      });

      // 提供假数据
      this.storyStore.freightDistribution = [
        { name: "济南", value: 306 },
        { name: "青岛", value: 352 },
        { name: "临沂", value: 192 },
      ];
    } catch (err) {
      runInAction(() => {
        this.storyStore.freightDistribution = [];
      });
    }
  };

  /**
   * 商品发运情况---黄建停 2019/7/3
   * @param {*}
   */
  @action
  fetchGoodsShipmentSituation = async params => {
    try {
      const result = await get(`${backendServerUrl}/home/category/month/distribute`, params);
      runInAction(() => {
        if (result && result.success) {
          this.storyStore.goodsShipmentSituation = result.data;
        }
      });
    } catch (err) {
      runInAction(() => {
        this.storyStore.goodsShipmentSituation = [];
      });
    }
  };

  /**
   * 城市商品发运情况---黄建停 2019/7/4
   * @param {*}
   */
  @action
  switchCityGoodsShipmentSituation = name => {
    this.storyStore.cityGoodsShipmentSituation = name;
  };

  /**
   * 货物品类TOP5
   * @param {*}
   */
  @action
  fetchGetGoodsDistribution = async (params, type) => {
    // if (type === 'owner') {
    //   this.storyStore.goodsDistribution = [
    //     {
    //       finalName: '康凯之冠（菏泽）贸易有限公司',
    //       name: '康凯之冠（菏泽）贸易有限公司',
    //       value: 2468,
    //     },
    //     {
    //       finalName: '海尔海外电器产业有限公司',
    //       name: '海尔海外电器产业有限公司',
    //       value: 5640,
    //     },
    //     {
    //       finalName: '中国重汽集团国际有限公司',
    //       name: '中国重汽集团国际有限公司',
    //       value: 608,
    //     },
    //     {
    //       finalName: '三角轮胎股份有限公司',
    //       name: '三角轮胎股份有限公司',
    //       value: 1772,
    //     },
    //     {
    //       finalName: '山东玲珑轮胎股份有限公司',
    //       name: '山东玲珑轮胎股份有限公司',
    //       value: 924,
    //     },
    //     {
    //       finalName: '海信（山东）冰箱有限公司',
    //       name: '海信（山东）冰箱有限公司',
    //       value: 720,
    //     },
    //     {
    //       finalName: '诸城市松源木业有限责任公司',
    //       name: '诸城市松源木业有限责任公司',
    //       value: 1760,
    //     },
    //     {
    //       finalName: '赛轮集团股份有限公司',
    //       name: '赛轮集团股份有限公司',
    //       value: 500,
    //     },
    //     {
    //       finalName: '青岛海信国际营销股份有限公司',
    //       name: '青岛海信国际营销股份有限公司',
    //       value: 660,
    //     },
    //     {
    //       finalName: '山东潍柴进出口有限公司',
    //       name: '山东潍柴进出口有限公司',
    //       value: 796,
    //     },
    //   ].sort((a, b) => b.value - a.value);
    //   return;
    // }
    try {
      const url = type ? TOP_TEN[type].url : '/home/industry/distribute';
      const result = await get(`${backendServerUrl}${url}`, params);
      runInAction(() => {
        if (result && result.success) {
          let data = [];
          if (!type || type === 'goods') {
            //货物品类top10第十条数据改为防疫物资，832TEU----1214
            // result.data[9].name = '防疫物资';
            // result.data[9].value = 1224;
            // result.data[9].category_value = '31';
            data = result.data;
          }
          if (type === 'owner') {
            result.data.map(({ owner, containerCount }) => {
              data.push({ name: owner, value: containerCount });
            });
          }
          this.storyStore.goodsDistribution = data.filter(item => item.value);
        }
      });
    } catch (err) {
      runInAction(() => {
        this.storyStore.goodsDistribution = [];
      });
    }
  };

  /**
   * 货主TOP5
   * @param {*}
   * 此接口废弃，新接口/home/findAgency/TeuTop
   */
  @action
  fetchGetGoodsOwner = async params => {
    try {
      const result = await get(`${backendServerUrl}/home/owner/distribute`, params);
      runInAction(() => {
        if (result && result.success) {
          this.storyStore.goodsOwner = result.data;
        }
      });
    } catch (err) {
      runInAction(() => {
        this.storyStore.goodsOwner = [];
      });
    }
  };

  /**
   * 更改top10类型
   */
  @action
  topTenTypeChange = async type => {
    this.storyStore.topTenType = type;
  };

  /**
   * 跨境电商
   * @param {*}
   */
  @action
  fetchGetIndustryDistribution = async params => {
    try {
      const result = await get(`${backendServerUrl}/home/industry/distribute`, params);
      runInAction(() => {
        if (result && result.success) {
          this.storyStore.industryDistribution = result.data;
        }
      });
    } catch (err) {
      runInAction(() => {
        this.storyStore.industryDistribution = [];
      });
    }
  };

  /**
   * 快销品分布
   * @param {*}
   */
  @action
  fetchGetFastSellDistribution = async params => {
    try {
      const url = `${backendServerUrl}${TOP_TEN_FAST_SELL[this.storyStore.topTenType]}`;
      const result = await get(url, params);
      runInAction(() => {
        if (result && result.success) {
          this.storyStore.fastSellDistribution = result.data;
        }
      });
      return result.data;
    } catch (err) {
      runInAction(() => {
        this.storyStore.fastSellDistribution = [];
      });
    }
  };

  /**
   * 路线名称
   * @param {*} lineName
   */
  @action
  changeLineName(lineName) {
    this.storyStore.lineName = lineName;
  }

  /**
   * 城市名称
   * @param {*} cityName
   */
  @action
  changeCityName(cityName) {
    this.storyStore.cityName = cityName;
  }

  /**
   * 弹框显示
   * @param {*} bool
   */
  @action
  handleShowModal(bool) {
    this.storyStore.showModal = bool;
  }
}
