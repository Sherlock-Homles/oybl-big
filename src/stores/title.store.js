import { observable } from 'mobx';

export class TitleStore {
  /**头部信息 */
  @observable
  titleInfo = {
    setOutTrain: 0,
    boxCount: 0,
    businessAmount: 0,
  };

  /** 年度 头部信息 */
  @observable
  yearTitleInfo = {
    setOutTrain: 0,
    boxCount: 0,
    businessAmount: 0,
  };
}
