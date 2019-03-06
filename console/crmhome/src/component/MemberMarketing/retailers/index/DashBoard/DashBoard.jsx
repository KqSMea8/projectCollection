import React from 'react';
import {Row, Col, Modal, Icon} from 'antd';
import DashItem from '../../../common/DashItem';
import ajax from '../../../../../common/ajax';

const introData = [
  {
    title: '今日新增会员数',
    content: '商户当天新增支付即会员人数',
  },
  {
    title: '总会员数',
    content: '商户支付即会员总人数',
  },
  {
    title: '交易二次以上会员',
    content: '同一用户在商户交易两次及以上会员人数',
  },
  {
    title: '今日消费额',
    content: '商户当天消费额（实收）',
  },
  {
    title: '总消费额',
    content: '商户今日总消费金额',
  },
  {
    title: '平均每单消费额',
    content: '商户客单价',
  },
  {
    title: '今日新增活动收益',
    content: '今日活动收益（平台活动+商户活动）',
  },
  {
    title: '总活动收益',
    content: '活动累计总收益金额',
  },
  {
    title: '当前活动数',
    content: '当前还在进行中的活动',
  },
];

const DashBoard = React.createClass({
  getInitialState() {
    return {
      activeCount: 0,
      dash: {},
      showModal: false,
    };
  },

  componentDidMount() {
    this.fetchData();
    this.fetchActiveCount();
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
      url: '/promo/merchant/memberMerchantSum.json',
      method: 'get',
      type: 'json',
      success: (res) => {
        this.setState({
          dash: res.memberMerchantSum,
        });
      },
      error: () => {

      },
    });
  },

  fetchActiveCount() {
    ajax({
      url: '/promo/common/memberActiveCount.json',
      method: 'get',
      type: 'json',
      success: (res) => {
        this.setState({
          activeCount: res.memberActiveCount,
        });
      },
      error: () => {

      },
    });
  },

  dealPromData(promoInfo, activeCount) {
    return [{
      mainNum: promoInfo.today_new_user_cnt,
      mainInfo: '今日新增会员(人)',
      moreLink: `${window.APP.mdataProd}/report/crmhome_report.htm?pageUri=campaign_user_develop`,
      subArr: [{
        'info': '总会员数(人)',
        'num': promoInfo.total_user_cnt,
      }, {
        'info': '交易二次以上会员(人)',
        'num': promoInfo.trade_cnt_ge_twice_user_cnt,
      }],
    }, {
      mainNum: promoInfo.today_trade_amt,
      mainInfo: '今日消费额(元)',
      moreLink: `${window.APP.mdataProd}/report/crmhome_report.htm?pageUri=campaign_analysis_trade_data`,
      subArr: [{
        'info': '总消费额(元)',
        'num': promoInfo.total_trade_amt,
      }, {
        'info': '平均每单消费额(元)',
        'num': promoInfo.avg_trade_amt,
      }],
    }, {
      mainNum: promoInfo.today_campaign_trade_amt,
      moreLink: `${window.APP.mdataProd}/report/crmhome_report.htm?pageUri=campaign_analysis_campaign_promo_data`,
      mainInfo: '今日新增活动收益(元)',
      subArr: [{
        'info': '总活动收益(元)',
        'num': promoInfo.todayTakenCnt,
      }, {
        'info': '当前活动数(个)',
        'num': activeCount,
      }],
    }];
  },

  render() {
    const formData = (
      <div className="row-wrapper">
        {
          introData.map((item, i) => {
            return (
              <Row key={i}>
                <Col span="18" push="6">{item.content}</Col>
                <Col span="6" pull="18">{item.title}</Col>
              </Row>
            );
          })
        }
      </div>
    );

    const { dash, activeCount } = this.state;

    let dealPromData;
    if (dash && activeCount) {
      dealPromData = this.dealPromData(dash, activeCount);
    }

    return (
      <div className="index-dashboard-wrap">
        <h3 className="kb-form-sub-title">
          <div className="kb-form-sub-title-icon" ></div>
          <span className="kb-form-sub-title-text">我的运营数据</span>
          <Icon type="question-circle-o"
                style={{position: 'absolute', right: 10, top: 6, fontSize: 16, cursor: 'pointer'}}
                onClick={this.showNewModal}
          />
          <Modal title={'数据指标说明'}
                 visible={this.state.showModal}
                 onCancel={this.onCancel}
                 maskClosable={false}
                 footer={[]}>
            {formData}
          </Modal>
        </h3>

        { dealPromData ? <div className="index-dashboard-container">
          <DashItem items={dealPromData} />
        </div> : <div className="index-dashboard-container" style={{padding: 20, textAlign: 'center'}}>
          暂无运营数据
        </div> }
      </div>
    );
  },
});

export default DashBoard;
