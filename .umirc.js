/*
 * @文件描述:
 * @公司: thundersdata
 * @作者: 王翠娇
 * @Date: 2020-06-08 10:14:50
 * @LastEditors: 王翠娇
 * @LastEditTime: 2021-08-18 18:25:52
 */
// ref: https://umijs.org/config/
export default {
  outputPath: './build',
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: false,
        dva: false,
        dynamicImport: true,
        title: '中欧班列（齐鲁号）智慧调度中心',
        dll: true,
        hardSource: false,
        routes: {
          exclude: [/components/],
        },
      },
    ],
  ],
  //添加路由
  routes: [
    {
      path: '/',
      component: '../layouts/index.js',
      routes: [
        { path: '/home', component: '../pages/index.js' },
        { path: '/', component: '../pages/login/login.js' },
      ],
    },
  ],
};
