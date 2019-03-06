import React from 'react';
import { Modal, Button, Icon, message, Alert } from 'antd';
import ajax from '../../../common/ajax';
import { fundStatus } from '../config/AllStatus';
import LimitModal from './LimitModal';
import MobileModal from './MobileModal';


const Settings = React.createClass({
  getInitialState() {
    return {
      isShowTip: false,
      isShowLimit: false,
      isShowMobile: false,
      isError: false,
      pointBalance: '',
      warningStatus: 'enough',
      receivePhones: [],
      warningLimit: '',
      isDebt: false,
      checkType: 'check',
      actNum: '',
    };
  },

  componentDidMount() {
    this.getPoints();
    this.warnQuery();
    this.debtQuery();
    this.activityNumQuery();
  },

  getPoints() {
    const self = this;
    ajax({
      url: '/promo/kbsettle/getPoints.json',
      method: 'get',
      type: 'json',
      success: (res) => {
        if (res.status === 'success') {
          self.setState({
            pointBalance: res.pointBalance,
            warningStatus: res.warningStatus,
          });
        }
      },
      error: () => {
        self.setState({
          isError: true,
        });
        message.error('获取集分宝信息失败, 请刷新');
      },
    });
  },

  warnQuery() {
    const self = this;
    ajax({
      url: '/promo/kbsettle/warnQuery.json',
      method: 'get',
      type: 'json',
      success: (res) => {
        if (res.status === 'success') {
          self.setState({
            receivePhones: res.receivePhones,
            warningLimit: res.warningLimit,
          });
        }
      },
      error: (res) => {
        message.error(res.errorMsg || '获取预警规则失败');
      },
    });
  },

  debtQuery() {
    const self = this;
    ajax({
      url: '/promo/kbsettle/debtQuery.json',
      method: 'get',
      type: 'json',
      success: (res) => {
        if (res.status === 'success') {
          if (res.isDebt) {
            self.setState({
              isDebt: true,
            });
          }
        }
      },
      error: (res) => {
        message.error(res.errorMsg || '获取欠款信息失败');
      },
    });
  },

  activityNumQuery() {
    const self = this;

    ajax({
      url: '/promo/kbsettle/activityNumQuery.json',
      method: 'get',
      type: 'json',
      success: (res) => {
        if (res.status === 'success') {
          self.setState({
            actNum: res.activityCount,
          });
        }
      },
      error: (res) => {
        message.error(res.errorMsg || '获取活动数量失败');
      },
    });
  },

  showMobile(type) {
    this.setState({
      isShowMobile: true,
      checkType: type,
    });
  },

  render() {
    const { pointBalance, warningStatus, warningLimit, receivePhones, isDebt, actNum, isError } = this.state;

    return (
      <div className="settlement">
        <h2 className="kb-page-title">
          营销资金自动结算
          <div className="tip">
            本服务由集分宝提供支持, 您可以到集分宝官方网站<a href="https://jf.alipay.com/aop/grantQuery.htm">查看资金变动明细</a>
          </div>
        </h2>
        <div className="kb-detail-main">
          {
            isDebt ? (<Alert message={(
                <p><Icon type="exclamation-circle" className="ant-alert-icon"/>您的账户已产生待结算欠款，请尽快充值。</p>
            )} type="error"/>) : null
          }

          <div className="left-side">
            <p className="balance">集分宝账户余额</p>

            { isError ? <p className="error-balance">查询余额失败</p> : <p className="money-wrap"><span className="money highlight">{pointBalance}</span>元</p>}


            <div className="status-wrap">
              <span>（当前{actNum}个活动进行中）</span>
              { !isError && <span>
                <span className={'status ' + fundStatus[warningStatus].color}>{fundStatus[warningStatus].text}</span>
                <Icon type="question-circle-o" onClick={() => {
                  this.setState({
                    isShowTip: true,
                  });
                }}/>
              </span> }

              <Modal
                  visible={this.state.isShowTip}
                  width={535}
                  footer={[]}
                  onOk={() => {
                    this.setState({
                      isShowTip: false,
                    });
                  }}
                  onCancel={() => {
                    this.setState({
                      isShowTip: false,
                    });
                  }}
              >
              <p>资金状态类型</p>
                <div style={{textAlign: 'center'}}>
                  <img style={{
                    display: 'inline-block',
                  }} src="https://zos.alipayobjects.com/rmsportal/nHAytVeThkVLuFq.png" width={425} alt=""/>
                </div>
              </Modal>
            </div>

            <div className="operate">
              <Button type="primary" size="large" className="operate-btn charge-btn"><a href="https://jf.alipay.com/aop/purchase.htm" target="_blank">立即充值</a></Button>
              { /* <Button type="ghost" size="large" className="operate-btn">申请开票</Button> */ }
            </div>
          </div>
          <div className="right-side">
            <div className="inner">
              <h4>账户余额预警设置</h4>
              <p>在活动进行期间，账户余额小于预警额度时，将触发预警通知</p>
              <ul className="items">
                <li>
                  <span className="label">预警额度:</span>
                  <div className="list-item">
                    <span className="highlight">{warningLimit}</span>元
                    <span className="modify clickable" onClick={() => {
                      this.setState({
                        isShowLimit: true,
                      });
                    }}>修改</span>
                    <LimitModal
                      show={this.state.isShowLimit}
                      initData={warningLimit}
                      update={() => {
                        this.getPoints();
                        this.warnQuery();
                      }}
                      onCancel={() => {
                        this.setState({
                          isShowLimit: false,
                        });
                      }}
                    />
                  </div>
                </li>
                <li>
                  <span className="label">预警时间:</span>
                  <div className="list-item">每天(结算日) 08：00</div>
                </li>
                <li>
                  <span className="label">预警通知:</span>
                  <div className="list-item">
                    <p className="item">1. 商家中心消息</p>
                    <p className="item">
                      <span style={{marginRight: 10}}>2. 手机短信</span>
                      <span className="clickable" onClick={() => {this.showMobile('check');}}>查看</span> | <span className="clickable" onClick={() => {this.showMobile('modify');}}>修改</span>
                    </p>
                    <MobileModal
                        show={this.state.isShowMobile}
                        initData={receivePhones}
                        type={this.state.checkType}
                        update={this.warnQuery}
                        onCancel={ () => {
                          this.setState({
                            isShowMobile: false,
                          });
                        }}
                    />
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default Settings;
