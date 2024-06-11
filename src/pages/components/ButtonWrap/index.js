import React from 'react';
import { observer, inject } from 'mobx-react';
import styles from './index.css';

const btns = ['地图', '表格'];

@inject('rightInfoService')
@observer
class ButtonWrap extends React.Component {
  state = {
    btnIndex: 0,
  };
  componentDidMount() {
    this.props.rightInfoService.setTrackButton('地图');
  }
  handleSwitchBtn = (item, index) => {
    this.setState({ btnIndex: index });
    this.props.rightInfoService.setTrackButton(item);
  };
  render() {
    const { btnIndex } = this.state;
    console.log('btnIndex', btnIndex);
    return (
      <div className={styles.wrap}>
        {btns.map((item, index) => (
          <button
            className={styles.button}
            key={index}
            style={{
              color: index === btnIndex ? '#00b9fd' : 'white',
            }}
            onClick={() => this.handleSwitchBtn(item, index)}
          >
            <div
              style={{
                display: index === btnIndex ? 'block' : 'none',
              }}
            >
              <div className={`${styles.angle} ${styles.topLeft}`} />
              <div className={`${styles.angle} ${styles.topRight}`} />
              <div className={`${styles.angle} ${styles.bottomLeft}`} />
              <div className={`${styles.angle} ${styles.bottomRight}`} />
            </div>
            {item}
          </button>
        ))}
      </div>
    );
  }
}

export default ButtonWrap;
