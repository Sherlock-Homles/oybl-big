import React from 'react';
import { observer, inject } from 'mobx-react';

import { Scrollbars } from 'react-custom-scrollbars';

import styles from './index.css';
import { RAF } from '../../../utils/RAF';

@inject('rightInfoService')
@observer
class HotNews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: 'none',
      contentArr: [],
      slide: 'none',
    };
    this.timerId = 0;
    this.raf = new RAF();
    this.timer = 0;
  }

  //定时器回调
  setIntervalCb = () => {
    const newContent = document.getElementById('newContent');
    const newContentTwo = document.getElementById('newContentTwo');
    if (newContent.clientHeight > newContent.parentNode.clientHeight) {
      newContentTwo.innerHTML = newContent.innerHTML;
    }
    const newContentWrap = newContent.parentNode;
    let Timer = setInterval(() => {
      if (newContentWrap.scrollTop >= newContent.scrollHeight) {
        newContentWrap.scrollTop = 0;
      } else {
        newContentWrap.scrollTop++;
      }
    }, 50);

    return Timer;
  };
  //点击打开详情页
  showNewDetail = async newID => {
    // 暂时禁止查看详情
    return
    await this.props.rightInfoService.fetchGetNewDetail({ newsId: newID });
    const { newDetail } = this.props.rightInfoService.rightInfoStore;
    const newsContent = newDetail.content.substr(5, newDetail.content.length - 11);

    const s = newsContent.replace(/<p>/g, '');

    const contentArr = s.split('</p>');

    this.setState({
      show: 'block',
      slide: 'block',
      contentArr,
    });

    this.timerId = this.setIntervalCb();
  };

  /*鼠标移入停止定时器*/
  stop = () => {
    const newContentTwo = document.getElementById('newContentTwo');
    newContentTwo.innerHTML = '';
    clearInterval(this.timerId);
  };
  /*鼠标移出开始定时器*/
  up = () => {
    this.timerId = this.setIntervalCb();
  };

  /*关闭详情页*/
  hideNewDetail = () => {
    clearInterval(this.timerId);
    this.setState({
      show: 'none',
      slide: 'none',
    });
  };
  //停止新闻列表的滑动
  stopSlide = () => {
    this.raf.clearInterval(this.timer);
  };
  //开始新闻列表的滑动
  startSlide = () => {
    const con = document.getElementById('con');
    const box = con.parentNode;
    this.timer = this.raf.setInterval(() => {
      if (box.scrollTop >= con.scrollHeight) {
        box.scrollTop = 0;
      } else {
        box.scrollTop = box.scrollTop + 2;
      }
    }, 50);
  };

  componentDidMount() {
    this.props.rightInfoService.fetchGetHotNews();

    const con = document.getElementById('con');
    const box = con.parentNode;
    this.timer = this.raf.setInterval(() => {
      if (box.scrollTop >= con.scrollHeight) {
        box.scrollTop = 0;
      } else {
        box.scrollTop = box.scrollTop + 2;
      }
    }, 50);
  }

  render() {
    const { hotNews, newDetail } = this.props.rightInfoService.rightInfoStore; // hotNews暂无数据
    const { show, contentArr, slide } = this.state;
    return (
      <div className={styles.news}>
        <div className="leftTop" />
        <div className="leftBottom" />
        <div className="rightTop" />
        <div className="rightBottom" />
        <div className={styles.newsTitle}>热点新闻</div>
        <div
          id="box"
          className={styles.box}
          onMouseEnter={this.stopSlide}
          onMouseLeave={this.startSlide}
        >
          <Scrollbars
            style={{ height: 660 }}
            renderTrackVertical={props => <div {...props} className={styles.trackVertical} />}
          >
            <ul id="con">
              {hotNews.map((contentItem, index) => (
                <li className={styles.newsItem} key={index}>
                  <span
                    className={styles.prefix}
                    onClick={() => this.showNewDetail(contentItem.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {`[${contentItem.title}]`}
                  </span>
                  <span className={styles.content}>- {contentItem.description}</span>
                </li>
              ))}
            </ul>
            <ul>
              {hotNews.map((contentItem, index) => (
                <li className={styles.newsItem} key={index}>
                  <span
                    className={styles.prefix}
                    onClick={() => this.showNewDetail(contentItem.id)}
                  >
                    {contentItem.title}
                  </span>
                  <span className={styles.content}> - {contentItem.description}</span>
                </li>
              ))}
            </ul>
          </Scrollbars>
        </div>
        {/*热点新闻详情显示*/}
        <div className={styles.newDetailWrap} style={{ display: show }}>
          <div className={styles.detailBg}>
            <div className={styles.left} onClick={this.hideNewDetail} />
            {/*热点新闻详情内容*/}
            <div className={styles.contentImg} />
            <div className={styles.newDetail} id="newDetail">
              <div className={styles.newTitle}>{newDetail.title}</div>
              <div className={styles.date}>
                <span>中欧班列（齐鲁号）</span>
                <span>{newDetail.publishedAt}</span>
              </div>
              {/*新聞内容*/}
              <div
                className={styles.newContentWrap}
                id="newContentWrap"
                onMouseEnter={this.stop}
                onMouseLeave={this.up}
                style={{ height: 640 }}
              >
                <Scrollbars
                  style={{ height: '100%' }}
                  renderTrackVertical={props => <div {...props} className={styles.trackVertical} />}
                >
                  <ul className={styles.newContent} id="newContent">
                    {contentArr.map((item, index) => {
                      if (item.indexOf('<img') !== -1) {
                        return <li key={index} dangerouslySetInnerHTML={{ __html: item }} />;
                      } else if (item.indexOf('<iframe' !== -1)) {
                        return <li key={index} dangerouslySetInnerHTML={{ __html: item }} />;
                      } else {
                        return <li key={index}>{item.trim()}</li>;
                      }
                    })}
                  </ul>
                  <ul className={styles.newContent} id="newContentTwo" style={{ display: slide }} />
                </Scrollbars>
              </div>
            </div>

            <div className={styles.right} onClick={this.hideNewDetail} />
          </div>
        </div>
      </div>
    );
  }
}

export default HotNews;
