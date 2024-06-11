import { observable } from 'mobx';

export class RightInfoStore {
  /**热点新闻 */
  @observable
  hotNews = [];

  /**新闻详情 */
  @observable
  newDetail = {};

  /**月季年货量*/
  @observable
  commodityNum = [];

  /**异常事件 */
  @observable
  exceptionInfo = [];

  /**多式联运 */
  @observable
  multiTransport = [];

  /**多式联运 */
  @observable
  financeInfo = [];

  /**班列计划 */
  @observable
  trainPlanInfo = [];

  /**运踪 */
  @observable
  trackInfo = [];

  @observable
  isHover = false;

  @observable
  filterName = '';

  @observable
  allTracks = [];

  @observable
  filterTracks = [];

  @observable
  recordIndex = 0;

  @observable
  newPoints = [];

  @observable
  visible = false;

  @observable
  trainCode = '';
  @observable
  trackButton = '地图';
  @observable
  trackByTrainCodeInfoList = [];
  @observable
  transportList = [];
}
