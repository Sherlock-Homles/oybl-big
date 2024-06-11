import React from 'react';
import { observer, inject } from 'mobx-react';
import { VAS_BUSINESS } from './constant';
import styles from './index.css';

@inject('rightInfoService')
@observer
export default class VASDetail extends React.Component {
  state = {
    show: 'none',
    detailObj: {},
    detailShow: false,
    detailName: '',
    buttonsDetailObj: {},
  };

  componentDidMount() {
    this.props.rightInfoService.fetchGetFinanceInfo();
  }

  //点击打开详情页
  showDetail = async name => {
    this.setState(
      {
        show: 'block',
        detailObj: VAS_BUSINESS[name],
        detailName: name,
        detailShow: false,
      },
      () => {
        document.querySelector('#detailText').innerText = this.state.detailObj.content;
      }
    );
  };

  /*关闭详情页*/
  hideDetail = () => {
    this.setState({
      show: 'none',
    });
  };

  //进入详情页中的详情页（替换详情页中内容）
  showButtonDetail = async name => {
    const { detailName } = this.state;
    this.setState(
      {
        detailShow: true,
        buttonsDetailObj: VAS_BUSINESS[detailName].buttons.find(item => item.name === name),
      },
      () => {
        document.querySelector('#detailText').innerText = this.state.buttonsDetailObj.content;
      }
    );
  };

  //详情页返回按钮
  hideButtonDetail = () => {
    this.setState(
      {
        detailShow: false,
      },
      () => {
        document.querySelector('#detailText').innerText = this.state.detailObj.content;
      }
    );
  };

  render() {
    const { show, detailObj, detailShow, buttonsDetailObj } = this.state;
    const { financeInfo } = this.props.rightInfoService.rightInfoStore;
    console.log('detailObj.buttons', detailObj.buttons);
    return (
      <div className={styles.vasWrap}>
        <div className="rightTop" />
        <div className="rightBottom" />
        <div className="leftTop" />
        <div className="leftBottom" />
        <div className={styles.title}>增值业务</div>
        <div className={styles.content}>
          {financeInfo.map(
            item =>
              VAS_BUSINESS[item.name] && (
                <div
                  key={item.name}
                  className={`${styles.item} ${styles[VAS_BUSINESS[item.name].bg]}`}
                  onClick={() => this.showDetail(item.name)}
                >
                  <div className={styles.icon}>
                    <img
                      src={VAS_BUSINESS[item.name].icon || require('../../../assets/vas/icon6.png')}
                      className={styles.img}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                  <div className={styles.text}>
                    {/*<div className={styles.number}>{`${(item.value * 100).toFixed(2)}%`}</div>*/}
                    <div className={styles.type}>{item.name}</div>
                  </div>
                </div>
              )
          )}
        </div>
        {/*增值业务详情显示*/}
        <div className={styles.vasDetailWrap} style={{ display: show }}>
          <div className={styles.detailBg}>
            <div className={styles.left} onClick={this.hideDetail} />
            {/*详情内容*/}
            <div className={styles.contentImg} />
            <div className={styles.vasDetail} id="vasDetail">
              <div className={styles.vasTitle}>
                <img src={require('../../../assets/vas/gaoSu.png')}></img>
                <span>{detailObj.title}</span>
              </div>
              {detailObj.title === '供应链金融' ? (
                <div className={styles.vasContentWrap} style={{ height: 690 }}>
                  <div style={{ paddingTop: 20, height: '100%' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: '50%',
                      }}
                    >
                      <a
                        href={detailObj.imgs[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ width: '48%' }}
                      >
                        <img src={detailObj.imgs[0].src} style={{ width: '100%' }} />
                      </a>
                      <img src={detailObj.imgs[1].src} style={{ width: '48%' }} />
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        height: '50%',
                      }}
                    >
                      <div
                        id="detailText"
                        className={styles.vasContent}
                        style={{
                          overflowY: 'auto',
                          marginLeft: 40,
                          marginRight: 40,
                          marginTop: 40,
                        }}
                      ></div>
                      <div style={{ marginRight: 100 }}>
                        <img src={detailObj.imgs[2].src} style={{ height: '100%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.vasContentWrap} style={{ height: 640 }}>
                  {detailShow ? (
                    <div className={styles.imgWrap}>
                      <img src={buttonsDetailObj.img} className={styles.detailImg} />
                      <div onClick={this.hideButtonDetail} className={styles.return}>
                        返回
                      </div>
                    </div>
                  ) : (
                    <div
                      className={styles.imgWrap}
                      style={{
                        justifyContent: detailObj.title === '产业园区' ? 'space-around' : 'center',
                      }}
                    >
                      {detailObj.imgs &&
                        detailObj.imgs.map((item, index) => (
                          <img
                            key={index}
                            src={item.src || require('../../../assets/vas/icon6.png')}
                            className={styles.detailImg}
                            style={{ width: detailObj.title === '产业园区' ? '32%' : '660px' }}
                          />
                        ))}
                      <div
                        style={{
                          width: '100px',
                          height: '200px',
                          display: detailObj.buttons ? 'block' : 'none',
                        }}
                      >
                        {detailObj.buttons &&
                          detailObj.buttons.map((item, index) => (
                            <div
                              key={item.name}
                              className={styles.button}
                              onClick={() => this.showButtonDetail(item.name)}
                            >
                              {item.name}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  <div id="detailText" className={styles.vasContent}></div>
                </div>
              )}
            </div>
            <div className={styles.right} onClick={this.hideDetail} />
          </div>
        </div>
      </div>
    );
  }
}
