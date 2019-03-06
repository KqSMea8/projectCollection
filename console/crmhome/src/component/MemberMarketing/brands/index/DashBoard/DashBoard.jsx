import React from 'react';
import DashItem from '../../../common/DashItem';
import ajax from '../../../../../common/ajax';

const DashBoard = React.createClass({
  getInitialState() {
    return {
      dash: null,
      showModal: false,
    };
  },

  componentDidMount() {
    this.fetchData();
  },

  onCancel() {
    this.setState({
      showModal: false,
    });
  },

  showNewModal() {
    this.setState({
      showModal: true,
    });
  },

  fetchData() {
    ajax({
      url: '/promo/brand/memberBrandSum.json',
      method: 'get',
      type: 'json',
      success: (res) => {
        if (res.status === 'success') {
          this.setState({
            dash: res.memberBrandSum,
          });
        }
      },
    });
  },

  dealPromData(promoInfo) {
    return [{
      mainNum: promoInfo.today_used_user_cnt,
      mainInfo: '今日核券会员数(人)',
      subArr: [{
        'info': '历史总核券会员数(人)',
        'num': promoInfo.total_used_user_cnt,
      }],
    }, {
      mainNum: promoInfo.today_taken_user_cnt,
      mainInfo: '今日领券会员数(人)',
      subArr: [{
        'info': '历史总领券会员数(人)',
        'num': promoInfo.total_taken_user_cnt,
      }],
    }, {
      mainNum: promoInfo.today_taken_cnt,
      mainInfo: '今日会员领券总数(张)',
      subArr: [{
        'info': '今日会员核券数(张)',
        'num': promoInfo.today_used_cnt,
      }],
    }];
  },

  render() {
    const { dash } = this.state;

    return (
      <div className="index-dashboard-wrap">
        <h3 className="kb-form-sub-title">
          <div className="kb-form-sub-title-icon" ></div>
          <span className="kb-form-sub-title-text">我的运营数据</span>
        </h3>

        { dash ?
        <div className="index-dashboard-container">
          <DashItem items={this.dealPromData(dash)} />
        </div> : <div className="index-dashboard-container" style={{padding: 20, textAlign: 'center'}}>
          暂无运营数据
        </div> }
      </div>
    );
  },
});

export default DashBoard;
