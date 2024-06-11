import axios from 'axios';
import qs from 'qs';
import { getToken, logout } from '@/utils/user';
import { message } from 'antd';

const TIME_OUT = 10000;
export const ERR_CODE = {
  timeout: -TIME_OUT,
  notFound: 404,
  networkError: 500,
};

/*
  请求头为application/json
*/
const jsonInstance = axios.create({
  // timeout: TIME_OUT,
  headers: { 'Content-Type': 'application/json' },
  transformResponse: [
    function(data) {
      return JSON.parse(data);
    },
  ],
});
/*
  普通post请求
*/
const postInstance = axios.create({
  // timeout: TIME_OUT,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  transformResponse: [
    function(resp) {
      return JSON.parse(resp);
    },
  ],
});

// 重新包装一下，使得超时的err有response
function handleError(error) {
  const { response } = error;
  let errorMsg = '';
  if (response) {
    // token到期
    if (response.data.code === 40001) {
      logout();
      return response.data;
    }
    switch (response.status) {
      case 400:
        // errorMsg = `请求接口${response.data.path}报错，请检查参数是否合法`;
        errorMsg = response.data.message;
        break;
      case 500:
      case 501:
      case 502:
        errorMsg = response.data.message || '服务器内部错误';
        break;
    }
    return Promise.reject({
      code: response.status,
      success: false,
      data: null,
      message: errorMsg,
    });
  }
  return Promise.reject({
    code: 50000,
    success: false,
    message: '对不起，服务出错了',
  });
}

const errHandler = err => {
  if (err.message === 'Request failed with status code 404') {
    throw {
      success: false,
      code: ERR_CODE.notFound,
      msg: '接口404',
    };
  }
  if (err.message === 'Network Error') {
    throw {
      success: false,
      code: ERR_CODE.networkError,
      msg: '网络错误',
    };
  }
  throw err;
};

/*
  get请求，参数：params
*/
export const get = (url, params) => {
  let urlStr = url;
  if (params && Object.keys(params).length > 0) {
    urlStr += `?`;
    const notEmptyParams = {};
    for (let i in params) {
      if (params[i] !== 0 && params[i]) {
        notEmptyParams[i] = params[i];
      }
    }
    urlStr += qs.stringify(notEmptyParams);
  }
  return jsonInstance
    .get(urlStr)
    .then(response => response.data)
    .catch(errHandler);
};
/**get请求带token */
export const getWithToken = (url, params) => {
  let urlStr = url;
  if (params && Object.keys(params).length > 0) {
    urlStr += `?`;
    const notEmptyParams = {};
    for (let i in params) {
      if (params[i] !== 0 && params[i]) {
        notEmptyParams[i] = params[i];
      }
    }
    urlStr += qs.stringify(notEmptyParams);
  }
  return jsonInstance
    .get(urlStr, { headers: { accessToken: getToken() } })
    .then(response => response.data)
    .catch(errHandler);
};

/*
  post请求
*/
export const post = (url, params) => {
  const urlStr = `${url}?`;
  return postInstance
    .post(urlStr, qs.stringify(params))
    .then(response => response.data)
    .catch(handleError);
};

/*
  登录post请求
*/
export const authPost = (url, params) => {
  return postInstance
    .post(url, qs.stringify(params))
    .then(response => response.data)
    .catch(errHandler);
};

/*
  请求头为application/json的post请求
*/
export const jsonPost = (url, params) => {
  const urlStr = `${url}?`;
  return jsonInstance
    .post(urlStr, JSON.stringify(params))
    .then(response => response.data)
    .catch(errHandler);
};

//
export function messageFail(msg) {
  message.error(msg || '服务调用失败，请联系管理员');
}
