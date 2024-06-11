import lscache from 'lscache';
import router from 'umi/router';

/**
 * 保存和操作用户登录信息
 * @class User
 */

export const saveToken = accessToken => {
  lscache.set('accessToken', accessToken, 60 * 24 * 15);
};

export const getToken = () => {
  return lscache.get('accessToken');
};

/**判断是否登录 */
export const isLogin = () => {
  return !!getToken();
};

/**退出登录 */
export const logout = () => {
  sessionStorage.removeItem('store');
  lscache.remove('accessToken');
  router.push('/');
};
