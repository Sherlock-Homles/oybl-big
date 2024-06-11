/**只显示坐标点,不显示地名的点 */
export const ignoreAddress = [
  '梅杰涅',
  '帕盖吉艾',
  '马拉舍维奇',
  '库诺维兹',
  '布拉迪斯拉发',
  '埃迪尔内',
  '布鲁塞尔',
  '梅杰乌',
];

/**欧洲八个城市 */
export const EUCoords = [
  // {
  //   name: '阿姆斯特丹',
  //   value: [4.5332, 52.2223],
  //   label: {
  //     show: !ignoreAddress.includes('阿姆斯特丹'),
  //     formatter: '{b}',
  //     position: 'left',
  //     fontSize: 12,
  //     color: 'black',
  //   },
  // },
  {
    name: '芬洛',
    value: [6.0791654, 51.3774194],
    label: {
      show: !ignoreAddress.includes('芬洛'),
      formatter: '{b}',
      position: [-15, -12],
      fontSize: 12,
      color: 'black',
    },
  },
  {
    name: '图卢兹',
    value: [1.25, 43.36],
    label: {
      show: !ignoreAddress.includes('图卢兹'),
      formatter: '{b}',
      position: 'left',
      fontSize: 12,
      color: 'black',
    },
  },
  // {
  //   name: '卢森堡',
  //   value: [6.07, 49.36],
  //   label: {
  //     show: !ignoreAddress.includes('卢森堡'),
  //     formatter: '{b}',
  //     position: 'left',
  //     fontSize: 12,
  //     color: 'black',
  //   },
  // },
  // {
  //   name: '列日',
  //   value: [5.56, 50.64],
  //   label: {
  //     show: !ignoreAddress.includes('列日'),
  //     formatter: '{b}',
  //     position: 'left',
  //     fontSize: 12,
  //     color: 'black',
  //   },
  // },
  // {
  //   name: '米兰',
  //   value: [9.1123, 45.2751],
  //   label: {
  //     show: !ignoreAddress.includes('米兰'),
  //     formatter: '{b}',
  //     position: 'left',
  //     fontSize: 12,
  //     color: 'black',
  //   },
  // },
  // {
  //   name: '圣彼得堡',
  //   value: [30.18, 59.55],
  //   label: {
  //     show: !ignoreAddress.includes('圣彼得堡'),
  //     formatter: '{b}',
  //     position: 'left',
  //     fontSize: 12,
  //     color: 'black',
  //   },
  // },
  {
    name: '克莱佩达',
    value: [21.44, 55.684],
    label: {
      show: !ignoreAddress.includes('克莱佩达'),
      formatter: '{b}',
      position: 'left',
      fontSize: 12,
      color: 'black',
    },
  },
  // {
  //   name: '伦敦',
  //   value: [-0.13, 51.512],
  //   label: {
  //     show: !ignoreAddress.includes('伦敦'),
  //     formatter: '{b}',
  //     position: 'left',
  //     fontSize: 12,
  //     color: 'black',
  //   },
  // },
  // {
  //   name: '赫尔辛基',
  //   value: [24.942, 60.673],
  //   label: {
  //     show: !ignoreAddress.includes('赫尔辛基'),
  //     formatter: '{b}',
  //     position: 'left',
  //     fontSize: 12,
  //     color: 'black',
  //   },
  // },
];

/**五个出境口岸坐标 */
export const outCoordsList = [
  {
    name: '阿拉山口',
    value: [82.559, 45.12],
    label: {
      show: true,
      distance: 5,
      formatter: '{b}',
      position: 'right',
      fontSize: 16,
      textStyle: {
        color: 'black',
      },
    },
  },
  {
    // 利用空格向左微调label位置
    name: '霍尔果斯         ',
    value: [80.41, 44.21],
    label: {
      show: true,
      distance: 2,
      formatter: '{b}',
      position: 'top',
      fontSize: 16,
      textStyle: {
        color: 'black',
      },
    },
  },
  {
    name: '满洲里',
    value: [117.378529, 49.597841],
    label: {
      show: true,
      distance: 2,
      formatter: '{b}',
      position: 'right',
      fontSize: 16,
      textStyle: {
        color: 'black',
      },
    },
  },
  {
    name: '二连浩特',
    value: [111.977943, 43.653169],
    label: {
      show: true,
      distance: 2,
      formatter: '{b}',
      position: 'left',
      fontSize: 16,
      textStyle: {
        color: 'black',
      },
    },
  },
  {
    name: '凭祥',
    value: [106.766293, 22.094484],
    label: {
      show: true,
      distance: 2,
      formatter: '{b}',
      position: 'right',
      fontSize: 16,
      textStyle: {
        color: 'black',
      },
    },
  },
  {
    name: '磨憨',
    value: [101.683764, 21.18293],
    label: {
      show: true,
      distance: 2,
      formatter: '{b}',
      position: 'left',
      fontSize: 16,
      textStyle: {
        color: 'black',
      },
    },
  },
];

/**大阪市 */
export const osakaCoord = {
  name: '大阪',
  value: [135.31, 34.41],
  label: {
    show: true,
    formatter: '{b}',
    position: 'bottom',
    fontSize: 12,
    color: 'black',
  },
};

/**釜山市 */
export const busanCoord = {
  name: '釜山',
  value: [129.02, 35.05],
  label: {
    show: true,
    formatter: '{b}',
    position: 'right',
    fontSize: 12,
    color: 'black',
  },
};

/**德黑兰 */
export const teheranCoord = {
  name: '德黑兰',
  value: [51, 35],
  label: {
    show: true,
    formatter: '{b}',
    position: 'right',
    fontSize: 12,
    color: 'black',
  },
};
