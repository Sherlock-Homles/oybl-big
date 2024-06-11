import React from 'react';
import ReactModal from 'react-modal';
import { observer, inject } from 'mobx-react';
import CommonContainer from '../CommonContainer';
import TrainMonthlyChart from '../TrainMonthlyChart';
import styles from './index.css';
import ModalChart from '../ModalChart';
import { STORY_NAME } from '../../../constant';

function getParent() {
  return document.querySelector('#left');
}

@inject('storyService')
@observer
export default class CustomModal extends React.Component {
  generateTitle = currentStory => {
    switch (currentStory) {
      case STORY_NAME[1]:
        return '开行情况';
      case STORY_NAME[2]:
        return '路线分布';
      case STORY_NAME[3]:
        return '线路货运密度';
      case STORY_NAME[4]:
        return `${new Date().getFullYear()}年各市开行情况`;
      case STORY_NAME[5]:
        return '货物品类-TOP10';
      case STORY_NAME[6]:
        return '跨境电商';
      case STORY_NAME[7]:
        return this.props.modalTitle;
    }
  };

  render() {
    const { fastSellDistributionOption } = this.props.storyService.storyStore;
    const title = this.generateTitle(this.props.currentStory);
    return (
      <ReactModal
        style={{
          overlay: {
            position: 'absolute',
            // top: '56px', 暂时隐藏----黄建停 2019/7/2
            top: '735px',
            // left: '24px', 暂时隐藏----黄建停 2019/7/2
            left: '984px',
            // width: '962px', 暂时隐藏----黄建停 2019/7/2
            // width: '1060px',
            // height: '1005px', 暂时隐藏----黄建停 2019/7/2
            height: '324px',
            background: 'rgba(11, 33, 79, 0.85)',
          },
          content: {
            // width: '800px', 暂时隐藏---黄建停 2019/7/3
            width: '960px',
            // height: '545px', 暂时隐藏----黄建停 2019/7/3
            height: '324px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: 0,
            border: '1px solid #0063a2',
            background: '#122d61',
            position: 'relative',
            overflow: 'initial',
            padding: 0,
            right: 0,
          },
        }}
        ariaHideApp={false}
        isOpen={this.props.isOpen}
        onRequestClose={this.props.closeModal}
        onAfterClose={this.clear}
        closeTimeoutMS={100}
        overlayClassName={`ReactModal__Overlay ${
          this.props.isOpen ? 'animated zoomIn fast' : 'animated zoomOut fast'
        }`}
      >
        <div className={styles.close} onClick={this.props.closeModal}>
          X
        </div>
        <div className="leftTop" />
        <div className="leftBottom" />
        <div className="rightTop" />
        <div className="rightBottom" />
        <div className={styles.content}>
          <div className={styles.title}>
            <img src={require('../../../assets/arrow-right.png')} />
            <div className={styles.text}>{title}</div>
          </div>
          <ModalChart currentStory={this.props.currentStory} options={fastSellDistributionOption} />
        </div>
      </ReactModal>
    );
  }
}
