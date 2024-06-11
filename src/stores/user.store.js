import { observable } from 'mobx';

export class UserStore {
  /**用户信息 */
  @observable
  userInfo = {};
}
