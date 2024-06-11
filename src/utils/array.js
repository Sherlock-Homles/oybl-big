/**
 * @功能描述: 获取数组内最大值的 最靠近的值 例如13=>20,899=>900
 * @参数: list 列表
 * @返回值: max
 */
export const getMaxNearNumber = function(list) {
  const maxNumber = Math.max(...list);
  const grayBarNumberLen = maxNumber.toString().length - 1;
  let grayBarNumber = `${+maxNumber.toString().split('')[0] + 1}`;
  new Array(grayBarNumberLen).fill('').forEach(item => (grayBarNumber += '0'));
  return +grayBarNumber;
};

/**
 * @功能描述: 获取刻度尺的最大值
 * @参数: cormax 最大值
 * @参数: cormin 最小值
 * @参数: cornumber 间隔
 * @返回值: [cormax, cormin, cornumber] 最大值 最小值 间隔
 */
export const maxScale = function(cormax, cormin = 0, cornumber = 5) {
  var corstep, tmpstep, tmpnumber, temp, extranumber;
  if (cormax <= cormin) return;
  corstep = (cormax - cormin) / cornumber;
  if (Math.pow(10, parseInt(Math.log(corstep) / Math.log(10), 10)) === corstep) {
    temp = Math.pow(10, parseInt(Math.log(corstep) / Math.log(10), 10));
  } else {
    temp = Math.pow(10, parseInt(Math.log(corstep) / Math.log(10), 10) + 1);
  }
  tmpstep = (corstep / temp).toFixed(6);
  //选取规范步长
  if (tmpstep >= 0 && tmpstep <= 0.1) {
    tmpstep = 0.1;
  } else if (tmpstep >= 0.100001 && tmpstep <= 0.2) {
    tmpstep = 0.2;
  } else if (tmpstep >= 0.200001 && tmpstep <= 0.25) {
    tmpstep = 0.25;
  } else if (tmpstep >= 0.250001 && tmpstep <= 0.5) {
    tmpstep = 0.5;
  } else {
    tmpstep = 1;
  }
  tmpstep = tmpstep * temp;
  if (parseInt(cormin / tmpstep, 10) !== cormin / tmpstep) {
    if (cormin < 0) {
      cormin = -1 * Math.ceil(Math.abs(cormin / tmpstep)) * tmpstep;
    } else {
      cormin = parseInt(Math.abs(cormin / tmpstep), 10) * tmpstep;
    }
  }
  if (parseInt(cormax / tmpstep, 10) !== cormax / tmpstep) {
    cormax = parseInt(cormax / tmpstep + 1, 10) * tmpstep;
  }
  tmpnumber = (cormax - cormin) / tmpstep;
  if (tmpnumber < cornumber) {
    extranumber = cornumber - tmpnumber;
    tmpnumber = cornumber;
    if (extranumber % 2 === 0) {
      cormax = cormax + tmpstep * parseInt(extranumber / 2, 10);
    } else {
      cormax = cormax + tmpstep * parseInt(extranumber / 2 + 1, 10);
    }
    cormin = cormin - tmpstep * parseInt(extranumber / 2, 10);
  }
  cornumber = tmpnumber;
  return [cormax, cormin, cornumber];
};
