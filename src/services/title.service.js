import { action, runInAction } from 'mobx';
import { TitleStore } from '../stores/title.store';
import { get } from '../fetch';
import { backendServerUrl } from '../constant';

export class TitleService {
  constructor() {
    this.titleStore = new TitleStore();
  }

  /**
   * 班列计划
   * @param {*}
   */
  @action
  fetchGetTitleInfo = async params => {
    let result;
    try {
      result = await get(`${backendServerUrl}/home/train/run/statistics`, params);
      runInAction(() => {
        if (result.success) {
          this.titleStore.titleInfo = result.data;
        }
      });
    } catch (err) {
      console.log(err);
    }
    return result;
  };

  /**
   * 年度班列计划
   * @param {*}
   */
  @action
  fetchGetYearTitleInfo = async params => {
    let result;
    try {
      result = await get(`${backendServerUrl}/home/train/run/statistics`, params);
      runInAction(() => {
        if (result.success) {
          this.titleStore.yearTitleInfo = result.data;
        }
      });
    } catch (err) {
      console.log(err);
    }
    return result;
  };
}
