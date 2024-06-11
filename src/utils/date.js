import moment from 'moment';

/**
 * 根据传入的日期和格式，返回格式化之后的日期
 * @param {*}} date
 * @param {*} format
 */
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return '';
  return moment(date).format(format);
};

/**
 * @功能描述: 获取两个日期之间所有的月份
 * @参数: start：开始日期 如'2018-11'
 * @参数: end：结束日期 如'2019-04'
 * @返回值: ["2018-11", "2019-00", "2019-01", "2019-02", "2019-03", "2019-04"]
 */
export const getMonthBetweenDate = function(start, end) {
  const monthList = [];
  let temp = start;
  while (moment(temp) <= moment(end)) {
    monthList.push(formatDate(temp, 'YYYY-MM'));
    temp = moment(temp).add(1, 'months');
  }
  return monthList;
};
