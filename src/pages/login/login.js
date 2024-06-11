/*
 * @文件描述: 登录页面
 * @公司: thundersdata
 * @作者: 黄建停
 * @Date: 2020-04-09 17:51:27
 * @LastEditors: 王翠娇
 * @LastEditTime: 2021-08-18 18:27:18
 */

import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { observer, inject } from 'mobx-react';
import router from 'umi/router';
import { saveToken } from '@/utils/user.js';
import styles from './index.css';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: {
    offset: 2,
    span: 22,
  },
};

@inject('userService')
@observer
class Login extends React.Component {
  state = {
    loading: false,
  };

  render() {
    const onFinish = async values => {
      this.setState({ loading: true });
      const result = await this.props.userService.fetchUserLogin(values);
      this.setState({ loading: false });
      if (result) {
        saveToken(result?.data?.access_token);
        router.push('/home');
      }
    };

    const onFinishFailed = errorInfo => {};

    return (
      <div className={styles.loginWrap}>
        <div className={styles.img} />
        <div className={styles.loginContent}>
          <strong className={styles.title}>中欧班列（齐鲁号）智慧调度中心</strong>
          <div className={styles.loginForm}>
            <strong className={styles.title2}>登录</strong>

            <Form
              {...layout}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="账号:"
                name="username"
                rules={[{ required: true, message: '请输入账号!' }]}
                style={{ fontSize: '28px' }}
              >
                <Input className={styles.loginInput} />
              </Form.Item>
              <Form.Item
                label="密码:"
                name="password"
                rules={[
                  {
                    required: true,
                    message: '请输入密码!',
                  },
                ]}
                style={{ fontSize: '28px' }}
              >
                <Input.Password className={styles.loginInput} />
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Checkbox>记住密码</Checkbox>
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={this.state.loading}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
