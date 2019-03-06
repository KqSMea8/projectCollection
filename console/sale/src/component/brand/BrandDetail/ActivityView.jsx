import React, {PropTypes} from 'react';
import {Breadcrumb, message} from 'antd';
import ShopsModal from './ShopsModal';
import VoucherView from '../common/VoucherView';
import ConsumeView from '../common/consume';
import BargainView from '../common/bargain';
import ReductionView from '../common/reduction';
import DeliveryChannels from '../common/DeliveryChannels';
import {retailersActStatusNEW, activityType} from '../common/AllStatus';
import ajax from 'Utility/ajax';
import './ActivityView.less';

const ActivityView = React.createClass({
  propTypes: {
    form: PropTypes.object,
    params: PropTypes.object,
  },

  getInitialState() {
    return {
      showShopListModal: false,
      detail: {}, // 优惠券数据
      crowdNum: {
        memberCrowdCount: 0,
      },
    };
  },

  componentWillMount() {
    if (this.props.params.activityId && this.props.params.pid) {
      this.fetch();
    }
  },

  onCancelMerchant() {
    this.setState({
      showShopListModal: false,
    });
  },

  showShopList() {
    this.setState({
      showShopListModal: true,
    });
  },

  fetch() {
    ajax({
      url: window.APP.crmhomeUrl + '/promo/koubei/salesDetail.json',
      method: 'get',
      type: 'json',
      data: {
        activityId: this.props.params.activityId,
        pid: this.props.params.pid,
      },
      success: (res) => {
        if (res.status === 'success') {
          this.setState({
            detail: res,
          });

          if (res.discountForm.crowdId && this.props.params.pid) {
            this.fetchNum(res.discountForm.crowdId, this.props.params.pid);
          }
        } else {
          message.error(res.resultMsg || '获取券信息失败');
        }
      },
    });
  },

  chooseShop() {
    this.setState({
      chooseShopList: true,
    });
  },

  fetchNum(crowdId, pid) {
    ajax({
      url: window.APP.crmhomeUrl + '/promo/koubei/salesCountCrowd.json',
      method: 'get',
      data: {
        crowdGroupId: crowdId,
        pid: pid,
      },
      type: 'json',
      success: (res) => {
        if (res.status === 'success') {
          this.setState({
            crowdNum: res,
          });
        } else {
          message.error(res.errorMsg || '获取人数失败');
        }
      },
    });
  },

  render() {
    const { discountForm, confirmedMerchants, unConfirmedMerchants } = this.state.detail;

    if (discountForm) {
      const { displayStatus } = discountForm;
      const iconCss = {
        backgroundColor: '#f60',
        fontSize: '12px',
        fontWeight: 400,
        padding: '2px 6px',
        borderRadius: '4px',
        color: '#fff',
        marginLeft: 10,
      };
      return (
          <div className="kb-groups-view">
            <div className="app-detail-header">营销管理</div>
            <div className="app-detail-content-padding">
              <Breadcrumb separator=">">
                <Breadcrumb.Item>管理</Breadcrumb.Item>
                <Breadcrumb.Item>查看营销活动</Breadcrumb.Item>
              </Breadcrumb>

              <div className="kb-detail-main">
                <div className="coupon-info">
                  {
                    // 消费送 买一送一 不展示券图片
                    (discountForm.type !== 'CONSUME_SEND' && discountForm.type !== 'BUY_ONE_SEND_ONE') && <img src={discountForm.logoFixUrl}/>
                  }
                  <div className="coupon-detail">
                    <h4>{discountForm.campaignName}
                      <span className={'status ' + retailersActStatusNEW[displayStatus].color}>
                    {retailersActStatusNEW[displayStatus].text}
                    </span>
                      {
                        displayStatus === 'CLOSED' && discountForm.offlineReason ?
                            (<span style={{marginLeft: 10, fontSize: '12px', color: '#666'}}>
                        下架原因:{discountForm.offlineReason}
                      </span>) : ''
                      }
                      {
                        discountForm.needKBSettle && <span style={iconCss}>自动结算</span>
                      }
                    </h4>
                    {
                      // 消费送/买一送一 不展示券类型
                      discountForm.type !== 'CONSUME_SEND' && discountForm.type !== 'BUY_ONE_SEND_ONE' && <p>{activityType[discountForm.type]}</p>
                    }

                    {
                      discountForm.type === 'BUY_ONE_SEND_ONE' &&
                      <p>{discountForm.itemDiscountType === 'BUY_A_SEND_A' ? '买A送A' : '买A送B'} </p>
                    }

                    <p>{activityType[discountForm.type]}</p>
                    <p>{discountForm.startTime} - {discountForm.endTime}</p>
                    {discountForm.crowdId ?
                        <p style={{marginTop: 10}}>
                          <span style={{color: '#ff6600', fontWeight: 'bold'}}>{discountForm.crowdName}</span>
                          <span style={{marginLeft: 10}}>选定会员{this.state.crowdNum.memberCrowdCount}人</span>
                        </p> : ''
                    }
                  </div>
                </div>
                {
                  discountForm.type === 'CONSUME_SEND' && <ConsumeView discountForm={discountForm} />
                }

                {
                  discountForm.type === 'BUY_ONE_SEND_ONE' && <BargainView discountForm={discountForm} />
                }

                {
                  discountForm.type === 'RANDOM_REDUCE' && <ReductionView discountForm={discountForm} />
                }

                {
                  (discountForm.type !== 'CONSUME_SEND' && discountForm.type !== 'BUY_ONE_SEND_ONE' && discountForm.type !== 'RANDOM_REDUCE') && <VoucherView discountForm={discountForm} />
                }

                <p className="sub-title">商家设置</p>
                <table className="kb-detail-table-6">
                  <tbody>
                  <tr>
                    <td className="kb-detail-table-label">参与商家</td>
                    <td>
                      { (confirmedMerchants && confirmedMerchants.length > 0) || (unConfirmedMerchants && unConfirmedMerchants.length > 0 ) ?
                          (<div>
                            {confirmedMerchants.length + unConfirmedMerchants.length}家商户, 已确认{confirmedMerchants.length}家
                            <span onClick={this.showShopList}
                                  style={{color: '#2db7f5', marginLeft: 10, cursor: 'pointer'}}>查看</span>
                            <ShopsModal
                                showModal={this.state.showShopListModal}
                                onCancel={this.onCancelMerchant}
                                confirmedMerchants={confirmedMerchants}
                                unConfirmedMerchants={unConfirmedMerchants}
                                pid={this.props.params.pid}
                            />
                          </div>) : null }
                    </td>
                    <td className="kb-detail-table-label">商家确认截止时间</td>
                    <td style={{width: 'auto'}}>{discountForm.confirmTime}</td>
                  </tr>
                  </tbody>
                </table>
                <p className="sub-title">小二常用信息</p>
                <table className="kb-detail-table-6">
                  <tbody>
                  <tr>
                    <td className="kb-detail-table-label">mpc活动id</td>
                    <td>{discountForm.activityId}</td>
                    <td className="kb-detail-table-label">商品id</td>
                    <td>{discountForm.itemId}</td>
                    <td className="kb-detail-table-label">营销活动id</td>
                    <td >{discountForm.campId}</td>
                  </tr>
                  </tbody>
                </table>
                {
                  discountForm.type !== 'BUY_ONE_SEND_ONE' && discountForm.type !== 'RANDOM_REDUCE' && <DeliveryChannels discountForm={discountForm} />
                }
                <p className="sub-title">结算方式</p>
                <table className="kb-detail-table-6">
                  <tbody>
                  <tr>
                    <td className="kb-detail-table-label">结算方式</td>
                    <td style={{ width: '88%'}}>{discountForm.needKBSettle ? '资金自动结算' : '活动后与商户线下结算'}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
      );
    }

    return (
        <div></div>
    );
  },
});

export default ActivityView;
