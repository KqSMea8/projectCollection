import React from 'react';
import './Index.less';
import { message, Spin } from 'antd';
import IntroView from './IntroView';
import Settings from './Settings';
import ajax from '../../../common/ajax';

const Index = React.createClass({
  getInitialState() {
    return {
      showDetail: false,
      established: true,
    };
  },

  componentDidMount() {
    this.init();
  },

  init() {
    ajax({
      url: '/promo/kbsettle/openStatus.json',
      method: 'get',
      type: 'json',
      success: (res) => {
        if (res.status === 'success') {
          this.setState({
            showDetail: true,
            established: res.openStatus,
          });
        } else {
          message.error(res.resultMsg || '获取积分信息失败');
        }
      },
    });
  },

  render() {
    const { showDetail, established } = this.state;

    if (showDetail) {
      return (
        established ? <Settings /> : <IntroView />
      );
    }

    return (
      <div className="loading-wrap">
        <Spin size="large" />
      </div>
    );
  },
});

export default Index;
