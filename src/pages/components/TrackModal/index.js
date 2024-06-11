import React from 'react';
import { observer, inject } from 'mobx-react';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { Form, DatePicker, Button, Select, Input, Table } from 'antd';
import { Map, Polyline, Marker, InfoWindow } from 'react-amap';
import { formatDate } from '../../../utils/date';
import styles from './index.css';
const gaodeAmapkey = '83f748fb2dce8adb8bafeb1e92d2247f';
const btns = ['地图', '表格'];

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 80,
    render: (text, record, index) => `${index + 1}`,
  },
  {
    title: '定位国家',
    dataIndex: 'countryName',
    key: 'countryName',
    width: 120,
  },
  {
    title: '所在省',
    dataIndex: 'provinceName',
    key: 'provinceName',
    width: 120,
  },
  {
    title: '所在市',
    dataIndex: 'cityName',
    key: 'cityName',
    width: 120,
  },
  {
    title: '所在县',
    dataIndex: 'countyName',
    key: 'countyName',
    width: 120,
  },
  {
    title: '定位区域类型',
    dataIndex: 'locationAreaName',
    key: 'locationAreaName',
    width: 120,
  },
  {
    title: '具体地址',
    dataIndex: 'locationSection',
    key: 'locationSection',
    width: 150,
  },
  {
    title: '经度',
    dataIndex: 'lon',
    key: 'lon',
    width: 150,
  },
  {
    title: '纬度',
    dataIndex: 'lat',
    key: 'lat',
    width: 150,
  },
  {
    title: '定位时间',
    dataIndex: 'datetime',
    key: 'datetime',
    width: 150,
  },
];

@inject('rightInfoService')
@observer
class TrackModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      btnIndex: 0,
      btnName: '地图',
      trainNumber: '',
      lockCode: '',
      mapInstance: null,
      path: [],
      markers: [],
      markersPosition: [],
      infoWindow: {
        visible: false,
        position: { longitude: '', latitude: '' },
        content: '',
      },
    };
    this.mapInstance = null;
    this.events = {
      created: instance => {
        this.mapInstance = instance;
      },
    };
  }

  //切换
  handleSwitchBtn = (item, index) => {
    this.setState({ btnIndex: index, btnName: item });
  };

  //关闭弹窗
  hideDetail = () => {
    this.props.rightInfoService.setTrackModalVisible(false);
    this.props.rightInfoService.setTrackCode('');
  };
  //根据箱号获取车号和锁号
  handleChange = val => {
    const { trackByTrainCodeInfoList } = this.props.rightInfoService.rightInfoStore;
    const data = trackByTrainCodeInfoList.find(i => i.containerCode === val);
    this.setState({
      containerCode: val,
      trainNumber: data.trainNumber,
      lockCode: data.lockCode,
    });
  };
  handleFinish = async values => {
    const [startDate, endDate] = values.date || [];
    const params = {
      lockCode: this.state.lockCode,
      startDate: startDate && formatDate(startDate),
      endDate: endDate && formatDate(endDate),
    };
    const result = await this.props.rightInfoService.fetchTransportList(params);
    if (result) {
      let path = [];
      let markersPosition = [];
      result.map(({ lon, lat, datetime, countryName, provinceName, cityName }) => {
        path.push([lon, lat]);
        markersPosition.push({
          position: { longitude: lon, latitude: lat },
          events: {
            mouseover: () => {
              this.setState({
                infoWindow: {
                  visible: true,
                  position: { longitude: lon, latitude: lat },
                  content: `<div><div>${datetime}</div><div>地点：${countryName +
                    provinceName +
                    cityName}</div></div>`,
                },
              });
            },
            mouseout: () => {
              this.setState({
                infoWindow: {
                  visible: false,
                },
              });
            },
          },
        });
      });
      this.setState({ path, markersPosition });
      setTimeout(() => {
        this.mapInstance.setFitView();
      }, 0);
    }
  };

  render() {
    const {
      visible,
      trainCode,
      trackByTrainCodeInfoList,
      transportList,
    } = this.props.rightInfoService.rightInfoStore;
    const {
      btnIndex,
      btnName,
      containerCode,
      trainNumber,
      lockCode,
      path,
      markersPosition,
      infoWindow,
    } = this.state;
    const containerList = trackByTrainCodeInfoList.map(({ containerCode }) => containerCode);

    return (
      <div className={styles.vasDetailWrap} style={{ display: visible ? 'block' : 'none' }}>
        <div className={styles.detailBg}>
          <div className={styles.left} onClick={this.hideDetail} />
          <div className={styles.buttons}>
            切换&nbsp;&nbsp;
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
          </div>
          <div className={styles.contentImg} />
          <div className={styles.vasDetail}>
            <Form className={styles.form} layout="inline" {...layout} onFinish={this.handleFinish}>
              <Form.Item label="省级班列号:">
                <Input className={styles.formItem} disabled value={trainCode} />
              </Form.Item>
              <Form.Item label="箱号:">
                <Select
                  className={styles.formItem}
                  onChange={this.handleChange}
                  value={containerCode}
                >
                  {containerList &&
                    containerList.map(i => (
                      <Select.Option key={i} value={i}>
                        {i}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item label="车号:">
                <Input className={styles.formItem} disabled value={trainNumber} />
              </Form.Item>
              <Form.Item label="锁号:">
                <Input className={styles.formItem} disabled value={lockCode} />
              </Form.Item>
              <Form.Item label="时间" name="date">
                <DatePicker.RangePicker
                  locale={locale}
                  className={styles.formItem2}
                  placeholder={['开始日期', '结束日期']}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
              </Form.Item>
            </Form>
            <div
              style={{
                width: '100%',
                height: '100%',
                display: btnName === '表格' ? 'none' : 'block',
              }}
            >
              <Map
                amapkey={gaodeAmapkey}
                events={this.events}
                zoom={11}
                plugins={['ToolBar', 'Scale']}
              >
                <Polyline
                  path={path}
                  style={{
                    strokeColor: '#3366FF',
                    strokeOpacity: 1,
                    strokeWeight: 3,
                    lineJoin: 'round',
                    lineCap: 'round',
                    zIndex: 50,
                  }}
                />
                {markersPosition.map(({ position, events }, index) => (
                  <Marker key={index} position={position} events={events} />
                ))}
                <InfoWindow
                  position={infoWindow.position}
                  visible={infoWindow.visible}
                  isCustom={false}
                  content={infoWindow.content}
                />
              </Map>
            </div>

            <Table
              style={{ display: btnName === '地图' ? 'none' : 'block' }}
              scroll={{ y: 700 }}
              className={styles.table}
              dataSource={transportList}
              columns={columns}
              pagination={false}
            />
          </div>
          <div className={styles.right} onClick={this.hideDetail} />
        </div>
      </div>
    );
  }
}

export default TrackModal;
