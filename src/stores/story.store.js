import { observable, computed, toJS } from 'mobx';
import { STORY_NAME } from '../constant';
import { getMaxNearNumber, maxScale } from '../utils/array';
import * as echarts from 'echarts/lib/echarts';
import * as d3 from 'd3';

export class StoryStore {
  /**正在讲的故事 */
  @observable
  currentStory = '';

  /**是否开始讲故事 */
  @observable
  startTellStory = false;

  /**开行情况 */
  @observable
  runInfo = [];

  /**路线分布 */
  @observable
  routeDistribute = [];

  /**线路货运密度 */
  @observable
  goodsDensity = [];

  /**货源分布 */
  @observable
  freightDistribution = [];

  /**货物品类TOP5 */
  @observable
  goodsDistribution = [];

  /**货主TOP5 */
  @observable
  goodsOwner = [];

  /**跨境电商 */
  @observable
  industryDistribution = [];

  /**线路名称 */
  @observable
  lineName = '';

  /**线路value */
  @computed
  get lineValue() {
    const lineObj = this.routeDistribute.find(item => item.name === this.lineName);
    return lineObj ? lineObj.line_name : '';
  }

  /**线路名称 */
  @observable
  cityName = '';

  // top10 类型
  @observable
  topTenType = 'goods';

  @computed
  get storyLength() {
    switch (this.currentStory) {
      case STORY_NAME[1]: {
        if (this.runInfo.length > 0 && this.runInfo[1] && this.runInfo[1].list) {
          return this.runInfo[1].list.length;
        }
        return 0;
      }
      case STORY_NAME[2]:
        return this.routeDistribute.length;
      case STORY_NAME[3]:
        return this.goodsDensity.length;
      case STORY_NAME[4]:
        return this.freightDistribution.length;
      case STORY_NAME[5]:
        return this.goodsDistribution.length;
      case STORY_NAME[6]:
        return this.industryDistribution.length;
      default:
        return 0;
    }
  }

  //开行情况
  @computed
  get runInfoOption() {
    const runInfo = toJS(this.runInfo);
    if (runInfo.length === 0) return {};
    runInfo[0].markLine = {
      lineStyle: {
        normal: {
          type: 'solid',
          color: '#fe9a0a',
          width: 3,
        },
      },
      data: [
        // [
        //   { name: '5%', x: '14%', y: '40%' },
        //   { x: '16%', y: '45%' },
        // ],
        [
          { name: '21.1%', x: '16%', y: '45%' },
          { x: '18%', y: '35%' },
        ],
        [
          { name: '4%', x: '21%', y: '51%' },
          { x: '23%', y: '45%' },
        ],
        [
          { name: '1.5%', x: '28%', y: '35%' },
          { x: '30%', y: '40%' },
        ],
        [
          { name: '33.5%', x: '35%', y: '20%' },
          { x: '37%', y: '43%' },
        ],
        [
          { name: '37%', x: '41%', y: '18%' },
          { x: '44%', y: '40%' },
        ],
        [
          { name: '89.4%', x: '47%', y: '50%' },
          { x: '49%', y: '25%' },
        ],
        [
          { name: '73.7%', x: '53%', y: '55%' },
          { x: '55%', y: '30%' },
        ],
        [
          { name: '6.7%', x: '60%', y: '40%' },
          { x: '62%', y: '47%' },
        ],
        [
          { name: '12.4%', x: '67%', y: '38%' },
          { x: '69%', y: '46%' },
        ],
        [
          { name: '0.5%', x: '74%', y: '32%' },
          { x: '76%', y: '36%' },
        ],
        // [
        //   { name: '92.9%', x: '78%', y: '48%' },
        //   { x: '80%', y: '28%' },
        // ],
        [
          { name: '26.5%', x: '80%', y: '26%' },
          { x: '83%', y: '33%' },
        ],
        // [
        //   { name: '0%', x: '84%', y: '38%' },
        //   { x: '88%', y: '38%' },
        // ],
        [
          { name: '27.2%', x: '87%', y: '38%' },
          { x: '89%', y: '24%' },
        ],
      ],
    };
    const xAxisData = [
      '1月',
      '2月',
      '3月',
      '4月',
      '5月',
      '6月',
      '7月',
      '8月',
      '9月',
      '10月',
      '11月',
      '12月',
    ];
    const seriesArr = [
      ...runInfo.map(item => ({
        name: item.name,
        type: 'bar',
        barWidth: '25%',
        itemStyle: {
          normal: {
            label: {
              show: true,
              position: 'top',
              color: 'white',
            },
          },
        },
        data: xAxisData.map(month => {
          // 拼装11/12/1/2这几个月份对应的数据
          const data = item.list.find(ele => ele.name === month);
          if (data) {
            return data.value;
          }
          return null;
        }),
        markLine: item.markLine || {},
      })),
    ];

    // // 同比数据
    // const allList = [];
    // runInfo.forEach(item => {
    //   allList.push(...item.list);
    // });
    //
    // // 得到同比增长率
    // const lineData = xAxisData.map((month,index) => {
    //   const matchedData = allList.filter(item => item.name === month);
    //   return (matchedData[1].value +8);
    //
    // });

    // 计算环比数据(环比表示本次统计段与相连的上次统计段之间的比较)
    // const monthData = [];
    // monthData.push(...runInfo[1].list.slice(0, 2));
    // monthData.push(...runInfo[2].list);

    // const lineData = [null];
    // for (let i = 0; i < monthData.length - 1; i++) {
    //   const laterData = monthData[i + 1];
    //   const prevData = monthData[i];
    //   const percentage =
    //     (Math.abs(laterData.value - prevData.value) / prevData.value).toFixed(2) * 100;
    //   lineData.push(percentage);
    // }
    // seriesArr.push({
    //   name: '环比',
    //   type: 'line',
    //   yAxisIndex: 1,
    //   data: lineData,
    //   lineStyle: {
    //     color: '#19c2da',
    //   },
    //   itemStyle: {
    //     color: '#ffffff',
    //     borderWidth: 5,
    //   },
    // });
    return {
      color: ['#f26666', '#0075fe', '#eee611', '#7533d6'],
      legend: {
        data: [...runInfo.map(item => item.name)],
        textStyle: {
          color: '#ffffff',
          bold: true,
        },
        top: 10,
      },
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          // params.pop();
          let tooltipContent = `<div>${params[0].name}</div>`;
          params.forEach(({ marker, seriesName, value, seriesType }) => {
            const eleValue = value ? `${value}${seriesType === 'bar' ? '列' : '%'}` : '-';
            tooltipContent += `<div>${marker}${seriesName}: ${eleValue}</div>`;
          });
          return tooltipContent;
        },
      },
      grid: {
        top: '32%',
        bottom: '10%',
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: true,
          axisPointer: {
            type: 'shadow',
          },
          axisLine: {
            lineStyle: {
              color: '#5793f3',
            },
          },
          axisLabel: {
            color: '#ffffff',
          },
          data: xAxisData,
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '发货量：列',
          min: 0,
          position: 'left',
          axisLine: {
            lineStyle: {
              color: '#5793f3',
            },
          },
          axisLabel: {
            color: '#ffffff',
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: seriesArr,
    };
  }

  @computed
  get routeDistributeOption() {
    const color = ['#db6264', '#006eff', '#eee611', '#20EE8C', '#7533d6', '#d7941a', '#d7941a'];
    const routeDistribute = toJS(this.routeDistribute);
    if (routeDistribute.length === 0) return {};
    routeDistribute.sort((a, b) => b.value - a.value);
    const total = routeDistribute.reduce((acc, curr) => (acc += curr.value), 0);
    const routeDistributeSeries = [
      {
        type: 'pie',
        clockWise: true,
        hoverAnimation: true,
        hoverOffset: 18,
        radius: ['40%', '55%'],
        center: ['40%', '50%'],
        label: {
          show: false,
          position: 'center',
        },
        labelLine: {
          show: false,
        },
        data: routeDistribute.map(item => ({
          name: `${item.name}: ${item.value}列`,
          value: item.value / total,
          lineNameValue: item.line_name,
        })),
      },
    ];
    const option = {
      color,
      legend: {
        right: '5%',
        y: 'center',
        orient: 'vertical',
        icon: 'circle',
        data: routeDistribute.map(item => `${item.name}: ${item.value}列`),
        textStyle: {
          color: '#ffffff',
        },
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'transparent',
        formatter: ({ name }) => {
          return name;
        },
        textStyle: {
          fontSize: 30,
        },
        position: [5, 5],
      },
      series: routeDistributeSeries,
    };
    return option;
  }

  @computed
  get goodsDensityOption() {
    const goodsDensity = toJS(this.goodsDensity);
    if (goodsDensity.length === 0) return {};
    const series = goodsDensity.map((item, index, arry) => {
      const data = new Array(arry.length).fill('-');
      data[index] = item.value;
      return {
        name: item.name,
        type: 'pictorialBar',
        smooth: false,
        legendHoverLink: false,
        symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
        barCategoryGap: '0%',
        label: {
          show: true,
          position: 'top',
        },
        data,
      };
    });
    const option = {
      color: ['#f26666'],
      title: {
        subtext: '定期线路发运量/线路营运长度',
        x: 'right',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: params => {
          let name, value;
          params.some(ele => {
            if (ele.value !== '-' && ele.value !== 0) {
              name = ele.name;
              value = ele.value;
              return true;
            }
          });
          return `${name}: ${value}`;
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: goodsDensity.map(item => item.name),
        axisLine: {
          lineStyle: {
            color: '#00b9fd',
          },
        },
        axisLabel: {
          rotate: -30,
          color: '#ffffff',
        },
      },
      yAxis: {
        type: 'value',
        name: '单位：箱',
        axisLine: {
          lineStyle: {
            color: '#00b9fd',
          },
        },
        axisLabel: {
          color: '#ffffff',
        },
        splitLine: {
          show: false,
        },
      },
      series,
    };
    return option;
  }

  @computed
  /*get freightDistributionOption() {
    const freightDistribution = toJS(this.freightDistribution);
    if (freightDistribution.length === 0) return {};
    const option = {
      color: [
        '#016beb',
        '#0196ed',
        '#19c2da',
        '#19e38c',
        '#32c007',
        '#98b812',
        '#d7941a',
        '#db6264',
        '#7533d6',
      ],
      legend: {
        right: '5%',
        y: 'center',
        orient: 'vertical',
        data: freightDistribution.map(item => item.name),
        textStyle: {
          color: '#ffffff',
        },
      },
      calculable: true,
      tooltip: {
        trigger: 'item',
        backgroundColor: 'transparent',
        formatter: '{b}: {c}箱',
        textStyle: {
          fontSize: 30,
        },
        position: [10, 10],
      },
      series: [
        {
          name: '半径模式',
          type: 'pie',
          selectedMode: 'single',
          selectedOffset: 20,
          radius: ['50%', '70%'],
          center: ['40%', '50%'],
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          data: freightDistribution,
        },
      ],
    };
    return option;
  }*/
  get freightDistributionOption() {
    const freightDistribution = toJS(this.freightDistribution);
    if (freightDistribution.length === 0) return {};
    const yMaxNumber = maxScale(Math.max(...freightDistribution.map(item => item.value)))[0];
    // 暂时不用
    const series = freightDistribution.map((item, index, arry) => {
      const data = new Array(arry.length).fill('-');
      data[index] = item.value;
      // data[index] = { name: item.name, value: item.value, cityValue: item.city_value };
      return {
        name: item.name,
        type: 'pictorialBar',
        smooth: false,
        legendHoverLink: false,
        symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
        barCategoryGap: '0%',
        label: {
          show: true,
          position: 'top',
        },
        data,
        itemStyle: {
          normal: {
            color: '#f26666',
          },
        },
      };
    });
    const option = {
      grid: {
        left: '3%',
        right: '5%',
        bottom: '8%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: params => {
          let name, value;
          params.some(ele => {
            if (ele.value !== '-' && ele.value !== 0) {
              name = ele.name;
              value = ele.value;
              return true;
            } else if (ele.value === 0) {
              name = ele.name;
              value = 0;
              return true;
            }
          });
          return `${name}: ${value}`;
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: freightDistribution.map(item => item.name),
        axisLine: {
          lineStyle: {
            color: '#00b9fd',
          },
        },
        axisLabel: {
          // rotate: -30,
          color: '#ffffff',
        },
      },
      yAxis: {
        type: 'value',
        name: '单位：列',
        axisLine: {
          lineStyle: {
            color: '#00b9fd',
          },
        },
        axisLabel: {
          color: '#ffffff',
        },
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          type: 'pictorialBar',
          barMaxWidth: '80%',
          label: {
            show: true,
            position: 'top',
            color: '#fff',
          },
          symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
          itemStyle: {
            normal: {
              color: '#f26666',
            },
          },
          data: freightDistribution.map(item => item.value),
        },
        {
          type: 'bar',
          barGap: '-100%',
          itemStyle: {
            color: '#fff',
            opacity: 0,
          },
          data: freightDistribution.map(item => yMaxNumber),
          z: 5,
        },
      ],
    };
    return option;
  }

  @observable
  goodsShipmentSituation = [];

  @computed
  get goodsShipmentSituationOption() {
    const goodsShipmentSituation = toJS(this.goodsShipmentSituation);
    const titleList = Object.keys(goodsShipmentSituation);

    const dateArr = [];
    titleList.forEach(title =>
      dateArr.push(...goodsShipmentSituation[title].map(item => item.date))
    );
    // 日期排序
    const dateList = Array.from(new Set(dateArr)).sort((a, b) => new Date(a) - new Date(b));
    // 补充缺失日期
    titleList.forEach(title => {
      const list = goodsShipmentSituation[title];
      const itemList = list.map(item => item.date);
      dateList.forEach(date => {
        if (itemList.indexOf(date) < 0) {
          list.push({
            date,
            value: 0,
          });
        }
      });
      goodsShipmentSituation[title] = list.sort((a, b) => new Date(a.date) - new Date(b.date));
    });

    const serieData = [];
    titleList.forEach(item => {
      const serie = {
        name: item,
        type: 'line',
        data: goodsShipmentSituation[item].map(item => item.value),
      };
      serieData.push(serie);
    });

    const option = {
      tooltip: {
        trigger: 'axis',
      },
      color: ['#db6264', '#006eff', '#eee611', '#20EE8C', '#7533d6', '#d7941a'],
      legend: {
        top: '3%',
        textStyle: { color: '#fff' },
        data: titleList,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '8%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dateList,
        axisLine: {
          lineStyle: {
            color: '#fff',
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#fff',
          },
        },
      },
      series: serieData,
    };
    return option;
  }

  @observable
  cityGoodsShipmentSituation = `${new Date().getFullYear()}年各市开行情况`;

  @computed
  get yMaxNumber() {
    return maxScale(Math.max(...this.goodsDistribution.map(item => item.value)))[0];
  }
  @computed
  get goodsDistributionOption01() {
    const goodsDistribution = toJS(this.goodsDistribution)
      .slice(0, 5)
      .reverse();
    const rank = [5, 4, 3, 2, 1];
    if (goodsDistribution === undefined || goodsDistribution.length === 0) return {};
    // const yMaxNumber = maxScale(Math.max(...goodsDistribution.map(item => item.value)), 0, 10)[0];
    new Array(rank.length - goodsDistribution.length).fill().forEach(item => rank.shift());
    // const grayBarValue = getMaxNumber(toJS(this.goodsDistribution).map(item => item.value));
    const grayBar = JSON.parse(JSON.stringify(goodsDistribution)).map(item => {
      // item.value = grayBarValue;
      item.value = this.yMaxNumber;
      return item;
    });
    const option = {
      grid: {
        top: '5%',
        bottom: '5%',
      },
      xAxis: [
        {
          show: false,
          max: function (value) {
            return value.max;
          },
        },
        {
          show: false,
        },
        {
          show: false,
        },
      ],
      yAxis: {
        type: 'category',
        axisLabel: {
          show: true,
          color: '#00C5CD',
          fontSize: 20,
          padding: [0, 5, 0, 5],
          rich: {
            label: {
              width: 20,
              height: 20,
              lineHeight: 20,
              borderRadius: 50,
              align: 'center',
              color: '#000000',
              backgroundColor: '#00bfff',
            },
          },
          formatter: value => {
            return `{label|${value}}`;
          },
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        data: rank,
      },
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          const {
            data: { name, value },
          } = params[1];
          return `${name}: ${value}TEU`;
        },
      },
      series: [
        {
          type: 'bar',
          barGap: '-100%',
          barWidth: 15, //统计条宽度
          itemStyle: {
            barBorderRadius: 20,
            color: 'rgba(102, 102, 102,0.5)',
          },
          z: 1,
          data: grayBar,
        },
        {
          type: 'bar',
          barGap: '-100%',
          barWidth: 15, //统计条宽度
          itemStyle: {
            normal: {
              barBorderRadius: 20, //统计条弧度
              color: {
                colorStops: [
                  {
                    offset: 0,
                    color: '#006eff', // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#0acdf4', // 100% 处的颜色
                  },
                ],
              },
            },
          },
          label: {
            show: false,
            textStyle: {
              color: '#fff',
            },
            position: 'insideRight',
            formatter: ({ dataIndex }) => {
              return goodsDistribution[dataIndex].value;
            },
          },
          labelLine: {
            show: false,
          },
          z: 2,
          data: goodsDistribution,
        },
        {
          show: true,
          type: 'bar',
          xAxisIndex: 1,
          barGap: '-100%',
          barWidth: 15,
          itemStyle: {
            normal: {
              color: 'transparent',
            },
          },
          label: {
            normal: {
              show: true,
              color: '#ffffff',
              position: [0, -15],
              formatter: ({ dataIndex }) => {
                return goodsDistribution[dataIndex].name;
              },
            },
          },
          data: goodsDistribution,
        },
        {
          type: 'bar',
          xAxisIndex: 2,
          barGap: '-100%',
          barWidth: 15, //统计条宽度
          itemStyle: {
            normal: {
              color: 'transparent',
            },
          },
          label: {
            normal: {
              show: true,
              color: '#ffffff',
              position: [320, -15],
              formatter: ({ dataIndex }) => {
                return goodsDistribution[dataIndex].value + 'TEU';
              },
              // offset: [290, 0],
            },
          },
          data: goodsDistribution,
        },
      ],
    };
    return option;
  }

  // 货主top5
  @computed
  get goodsOwnerOption() {
    const goodsOwner = toJS(this.goodsOwner)
      .slice(0, 5)
      .reverse();
    const rank = [5, 4, 3, 2, 1];
    if (goodsOwner === undefined || goodsOwner.length === 0) return {};
    new Array(rank.length - goodsOwner.length).fill().forEach(item => rank.shift());
    const grayBarValue = getMaxNumber(toJS(this.goodsOwner).map(item => item.value));
    const grayBar = JSON.parse(JSON.stringify(goodsOwner)).map(item => {
      item.value = grayBarValue;
      return item;
    });
    const option = {
      grid: {
        top: '5%',
        bottom: '5%',
      },
      xAxis: [
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
      ],
      yAxis: {
        type: 'category',
        axisLabel: {
          show: true,
          color: '#00C5CD',
          fontSize: 20,
          padding: [0, 5, 0, 5],
          rich: {
            label: {
              width: 20,
              height: 20,
              lineHeight: 20,
              borderRadius: 50,
              align: 'center',
              color: '#000000',
              backgroundColor: '#00bfff',
            },
          },
          formatter: value => {
            return `{label|${value}}`;
          },
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        data: rank,
      },
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          const {
            data: { name, value },
          } = params[1];
          return `${name}: ${value}TEU`;
        },
      },
      series: [
        {
          type: 'bar',
          barGap: '-100%',
          barWidth: 15, //统计条宽度
          itemStyle: {
            barBorderRadius: 20,
            color: 'rgba(102, 102, 102,0.5)',
          },
          z: 1,
          data: grayBar,
        },
        {
          type: 'bar',
          barGap: '-100%',
          barWidth: 15, //统计条宽度
          itemStyle: {
            normal: {
              barBorderRadius: 20, //统计条弧度
              color: {
                colorStops: [
                  {
                    offset: 0,
                    color: '#006eff', // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#0acdf4', // 100% 处的颜色
                  },
                ],
              },
            },
          },
          label: {
            show: false,
            textStyle: {
              color: '#fff',
            },
            position: 'insideRight',
            formatter: ({ dataIndex }) => {
              return goodsOwner[dataIndex].value;
            },
          },
          labelLine: {
            show: false,
          },
          z: 2,
          data: goodsOwner,
        },
        {
          show: true,
          type: 'bar',
          xAxisIndex: 1,
          barGap: '-100%',
          barWidth: 15,
          itemStyle: {
            normal: {
              color: 'transparent',
            },
          },
          label: {
            normal: {
              show: true,
              color: '#ffffff',
              position: [0, -15],
              formatter: ({ dataIndex }) => {
                return goodsOwner[dataIndex].name;
              },
            },
          },
          data: goodsOwner,
        },
        {
          type: 'bar',
          xAxisIndex: 2,
          barGap: '-100%',
          barWidth: 15, //统计条宽度
          itemStyle: {
            normal: {
              color: 'transparent',
            },
          },
          label: {
            normal: {
              show: true,
              color: '#ffffff',
              position: ['40%', -15],
              formatter: ({ dataIndex }) => {
                return goodsOwner[dataIndex].value + 'TEU';
              },
              offset: [200, 0],
            },
          },
          data: goodsOwner,
        },
      ],
    };
    return option;
  }

  @computed
  get goodsDistributionOption02() {
    const goodsDistribution = toJS(this.goodsDistribution)
      .slice(5)
      .reverse();
    const rank = [10, 9, 8, 7, 6];
    if (goodsDistribution === undefined || goodsDistribution.length === 0) return {};
    new Array(rank.length - goodsDistribution.length).fill().forEach(item => rank.shift());
    // const grayBarValue = getMaxNumber(toJS(this.goodsDistribution).map(item => item.value));
    const grayBar = JSON.parse(JSON.stringify(goodsDistribution)).map(item => {
      // item.value = grayBarValue;
      item.value = this.yMaxNumber;
      return item;
    });
    const option = {
      grid: {
        top: '5%',
        bottom: '5%',
      },
      xAxis: [
        {
          show: false,
          max: function (value) {
            return value.max;
          },
        },
        {
          show: false,
        },
        {
          show: false,
        },
      ],
      yAxis: {
        type: 'category',
        axisLabel: {
          show: true,
          color: '#00C5CD',
          fontSize: 20,
          padding: [0, 5, 0, 5],
          rich: {
            label: {
              width: 20,
              height: 20,
              lineHeight: 20,
              borderRadius: 50,
              align: 'center',
              color: '#000000',
              backgroundColor: '#00bfff',
            },
          },
          formatter: value => {
            return `{label|${value}}`;
          },
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        data: rank,
      },
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          const {
            data: { name, value },
          } = params[1];
          return `${name}: ${value}TEU`;
        },
      },
      series: [
        {
          type: 'bar',
          barGap: '-100%',
          barWidth: 15, //统计条宽度
          itemStyle: {
            barBorderRadius: 20,
            color: 'rgba(102, 102, 102,0.5)',
          },
          z: 1,
          data: grayBar,
        },
        {
          type: 'bar',
          barGap: '-100%',
          barWidth: 15, //统计条宽度
          itemStyle: {
            normal: {
              barBorderRadius: 20, //统计条弧度
              color: {
                colorStops: [
                  {
                    offset: 0,
                    color: '#006eff', // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#0acdf4', // 100% 处的颜色
                  },
                ],
              },
            },
          },
          label: {
            show: false,
            textStyle: {
              color: '#fff',
            },
            position: 'insideRight',
            formatter: ({ dataIndex }) => {
              return goodsDistribution[dataIndex].value;
            },
          },
          labelLine: {
            show: false,
          },
          z: 2,
          data: goodsDistribution,
        },
        {
          show: true,
          type: 'bar',
          xAxisIndex: 1,
          barGap: '-100%',
          barWidth: 15,
          itemStyle: {
            normal: {
              color: 'transparent',
            },
          },
          label: {
            normal: {
              show: true,
              color: '#fff',
              position: [0, -15],
              formatter: ({ dataIndex }) => {
                return goodsDistribution[dataIndex].name;
              },
            },
          },
          data: goodsDistribution,
        },
        {
          type: 'bar',
          xAxisIndex: 2,
          barGap: '-100%',
          barWidth: 15, //统计条宽度
          itemStyle: {
            normal: {
              color: 'transparent',
            },
          },
          label: {
            normal: {
              show: true,
              color: '#fff',
              position: [320, -15],
              formatter: ({ dataIndex }) => {
                return goodsDistribution[dataIndex].value + 'TEU';
              },
              // offset: [290, 0],
            },
          },
          data: goodsDistribution,
        },
      ],
    };
    return option;
  }

  @computed
  get goodsDistributionOption() {
    const grayBar = [200, 200, 200, 200, 200, 200, 200, 200, 200, 200];
    const rank = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

    const goodsDistribution = toJS(this.goodsDistribution).reverse();
    if (goodsDistribution === undefined || goodsDistribution.length === 0) return {};
    const option = {
      grid: {
        top: '5%',
        bottom: '5%',
      },
      xAxis: [
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
      ],
      yAxis: {
        type: 'category',
        axisLabel: {
          show: true,
          color: '#00C5CD',
          fontSize: 20,
          padding: [0, 5, 0, 5],
          rich: {
            label: {
              width: 20,
              height: 20,
              lineHeight: 20,
              borderRadius: 50,
              align: 'center',
              color: '#000000',
              backgroundColor: '#00bfff',
            },
          },
          formatter: value => {
            return `{label|${value}}`;
          },
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        data: rank,
      },
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          const {
            data: { name, value },
          } = params[1];
          return `${name}: ${value}箱`;
        },
      },
      series: [
        {
          type: 'bar',
          barGap: '-100%',
          barWidth: 15, //统计条宽度
          itemStyle: {
            barBorderRadius: 20,
            color: 'rgba(102, 102, 102,0.5)',
          },
          z: 1,
          data: grayBar,
        },
        {
          type: 'bar',
          barGap: '-100%',
          barWidth: 15, //统计条宽度
          itemStyle: {
            normal: {
              barBorderRadius: 20, //统计条弧度
              color: {
                colorStops: [
                  {
                    offset: 0,
                    color: '#006eff', // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#0acdf4', // 100% 处的颜色
                  },
                ],
              },
            },
          },
          label: {
            show: false,
            textStyle: {
              color: '#fff',
            },
            position: 'insideRight',
            formatter: ({ dataIndex }) => {
              return goodsDistribution[dataIndex].value;
            },
          },
          labelLine: {
            show: false,
          },
          z: 2,
          data: goodsDistribution,
        },
        {
          show: true,
          type: 'bar',
          xAxisIndex: 1,
          barGap: '-100%',
          barWidth: 15,
          itemStyle: {
            normal: {
              color: 'transparent',
            },
          },
          label: {
            normal: {
              show: true,
              color: '#ffffff',
              position: [0, -15],
              formatter: ({ dataIndex }) => {
                return goodsDistribution[dataIndex].name;
              },
            },
          },
          data: grayBar,
        },
        {
          type: 'bar',
          xAxisIndex: 2,
          barGap: '-100%',
          barWidth: 15, //统计条宽度
          itemStyle: {
            normal: {
              color: 'transparent',
            },
          },
          label: {
            normal: {
              show: true,
              color: '#ffffff',
              position: ['95%', -15],
              formatter: ({ dataIndex }) => {
                return goodsDistribution[dataIndex].value + '箱';
              },
            },
          },
          data: grayBar,
        },
      ],
    };
    return option;
  }

  @computed
  get industryDistributionOption() {
    const industryDistribution = toJS(this.industryDistribution);
    const data = { children: industryDistribution };
    const root = d3
      .hierarchy(data)
      .sum(function (d) {
        return d.value;
      })
      .sort(function (a, b) {
        return b.value - a.value;
      });
    d3.pack().size(this.startTellStory ? [800, 490] : [470, 310])(root);
    const nodeAll = root.descendants();
    const nodes = nodeAll.filter(function (it) {
      return it.parent;
    });
    let maxDepth = 0;
    const seriesData = nodes.map(node => {
      maxDepth = Math.max(maxDepth, node.depth);
      return {
        value: [node.value, node.depth, node.data.name, node.x, node.y, node.r],
        label: {
          show: true,
          color: '#ffffff',
          formatter: ({ value }) => {
            return `${value[2]}` + '\n' + `${value[0]}箱`;
          },
        },
      };
    });
    return {
      xAxis: {
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      series: {
        type: 'custom',
        renderItem: renderItem,
        data: seriesData,
      },
    };
  }

  // 快销品分布---黄建停 2019/7/3
  @observable
  fastSellDistribution = [];

  @computed
  get fastSellDistributionOption() {
    const fastSellDistribution = toJS(this.fastSellDistribution);
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          lineStyle: {
            color: '#fff',
          },
        },
        formatter: params => {
          const { name, value } = params[0];
          return `${name}: ${value}TEU`;
        },
      },
      grid: {
        top: '13%',
        left: '4%',
        right: '3%',
        bottom: '8%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#fff',
            },
          },
          data: fastSellDistribution.map(item => item.city || item.station_name || item.category),
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '数量（TEU）',
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#fff',
            },
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14,
            },
          },
          splitLine: {
            lineStyle: {
              color: '#57617B',
            },
          },
        },
      ],
      series: [
        {
          name: '数量',
          type: 'line',
          // smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              color: '#3deaff', // 线条颜色
              width: 3,
            },
          },
          areaStyle: {
            normal: {
              //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: 'rgba(61,234,255, 0.9)',
                  },
                  {
                    offset: 0.7,
                    color: 'rgba(61,234,255, 0)',
                  },
                ],
                false
              ),

              shadowColor: 'rgba(53,142,215, 0.9)', //阴影颜色
              shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
            },
          },
          itemStyle: {
            emphasis: {
              color: 'rgb(0,196,132)',
              borderColor: 'rgba(0,196,132,0.2)',
              extraCssText: 'box-shadow: 8px 8px 8px rgba(0, 0, 0, 1);',
              borderWidth: 10,
            },
          },
          data: fastSellDistribution.map(item => item.value || item.containerCount),
        },
      ],
    };
  }

  @observable
  showModal = false;
}

function renderItem(params, api) {
  const fillObj = {
    fillColor: 'rgba(0, 161, 254, 0.7)',
    emphasisFillColor: 'rgba(238, 157, 17, 1)',
  };
  return {
    type: 'circle',
    shape: {
      cx: api.value(3),
      cy: api.value(4),
      r: api.value(5),
    },
    z2: api.value(1) * 2,
    style: api.style({
      fill: fillObj.fillColor,
      textPosition: 'inside',
    }),
    styleEmphasis: api.style({
      fill: fillObj.emphasisFillColor,
      textPosition: 'inside',
    }),
  };
}

function getMaxNumber(list) {
  return getMaxNearNumber(list);
}
