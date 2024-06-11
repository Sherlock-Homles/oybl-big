import { action, runInAction } from 'mobx';
import { UserStore } from '../stores/user.store';
import { post, getWithToken, messageFail } from '../fetch';
import { backendServerUrl } from '../constant';

export class UserService {
  constructor() {
    this.userStore = new UserStore();
  }

  /**用户登录 */
  @action
  fetchUserLogin = async params => {
    try {
      const result = await post(
        `${backendServerUrl.replace('/screen', '')}/basic/user/login`,
        params
      );
      return result;
    } catch (err) {
      messageFail(err.message);
    }
  };

  /**获取用户信息 */
  fetchUserGetInfo = async params => {
    let result;
    try {
      result = await getWithToken(`${backendServerUrl.replace('/screen', '')}/basic/user/info`);
      runInAction(() => {
        if (result.success) {
          this.userStore.userInfo = result.data;
        }
      });
    } catch (err) {
      console.log(err);
    }
    return result;
  };
}
