import React, {PropTypes} from 'react';
import {Breadcrumb, message, Button} from 'antd';
import VoucherView from '../../common/VoucherView';
import ConsumeView from '../../common/VoucherView/consume';
import BargainView from '../../common/VoucherView/bargain';
import ShopsModal from './ShopsModal';
import DeliveryChannels from '../../common/DeliveryChannels';
import {retailersActStatusNEW, activityType} from '../../config/AllStatus';
import ajax from '../../../../common/ajax';

const ActivityView = React.createClass({
  propTypes: {
    form: PropTypes.object,
    params: PropTypes.object,
  },
  getInitialState() {
    return {
      showMerchantListModal: false,
      detail: {}, // 优惠券数据
      crowdNum: {
        memberCrowdCount: 0,
      },
    };
  },

  componentWillMount() {
    if (this.props.params.activityId) {
      this.fetch();
    }
  },

  onCancelMerchant() {
    this.setState({
      showMerchantListModal: false,
    });
  },

  getButton() {
    const {allowConfirm, allowModifyConfirm, allowOfflineConfirm} = this.state.detail;

    let operType = '';

    if (allowConfirm) {
      operType = '创建';
    } else if (allowModifyConfirm) {
      operType = '修改';
    } else if (allowOfflineConfirm) {
      operType = '下架';
    }

    return (<div className="view-bottom">
      {
        allowConfirm || allowModifyConfirm || allowOfflineConfirm ?
            (<Button type="primary" size="large" style={{ marginRight: 10 }} onClick={this.handleOperate.bind(this, 'agree') }>
              {`${operType}通过`}
            </Button>) : null
      }

      {
        allowConfirm || allowModifyConfirm || allowOfflineConfirm ?
            (<Button type="primary" size="large" style={{ marginRight: 10 }} onClick={this.handleOperate.bind(this, 'reject') }>
              {`${operType}驳回`}
            </Button>) : null
      }
    </div>);
  },

  showMerchantList() {
    this.setState({
      showMerchantListModal: true,
    });
  },

  fetch() {
    ajax({
      url: '/promo/brand/detail.json',
      method: 'get',
      type: 'json',
      data: {
        activityId: this.props.params.activityId,
      },
      success: (res) => {
        if (res.status === 'success') {
          this.setState({
            detail: res,
          });

          if (res.discountForm.crowdId) {
            this.fetchNum(res.discountForm.crowdId);
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

  fetchNum(crowdId) {
    ajax({
      url: '/promo/common/memberCrowdCount.json',
      method: 'get',
      data: {
        crowdGroupId: crowdId,
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

  handleOperate(type, event) {
    const self = this;
    event.preventDefault();

    let api;
    const {allowConfirm, allowModifyConfirm, allowOfflineConfirm} = self.state.detail;

    if (type === 'agree') {
      if (allowConfirm) {
        api = 'agreePromotion.json';
      } else if (allowModifyConfirm) {
        api = 'agreePromoModify.json';
      } else if (allowOfflineConfirm) {
        api = 'agreePromoOffline.json';
      }
    } else {
      if (allowConfirm) {
        api = 'rejectPromotion.json';
      } else if (allowModifyConfirm) {
        api = 'rejectPromoModify.json';
      } else if (allowOfflineConfirm) {
        api = 'rejectPromoOffline.json';
      }
    }

    ajax({
      url: '/goods/itempromo/' + api,
      method: 'post',
      data: {
        campId: this.props.params.activityId,
      },
      type: 'json',
      success: (req) => {
        if (req.status === 'true') {
          message.success('操作成功');

          self.fetch();
        } else {
          message.error(req.errorMsg);
        }
      },
    });
  },

  render() {
    const { discountForm } = this.state.detail;
    const confirmedMerchants = this.state.detail.confirmedMerchants || [];
    const unConfirmedMerchants = this.state.detail.unConfirmedMerchants || [];

    if (discountForm) {
      const { displayStatus } = discountForm;

      return (
          <div className="kb-groups-view">
            <h2 className="kb-page-title">营销管理</h2>
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
                        displayStatus === 'CLOSED' && discountForm.offlineReason &&
                          <span style={{marginLeft: 10, fontSize: '12px', color: '#666'}}>
                              下架原因:{discountForm.offlineReason}
                          </span>
                      }
                      {
                        discountForm.needKBSettle && <span className="status orangeLight">自动结算</span>
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

                    <p>{discountForm.startTime} - {discountForm.endTime}</p>
                    {
                      discountForm.crowdId ? <p style={{marginTop: 10}}>
                        <span style={{color: '#ff6600', fontWeight: 'bold'}}>{discountForm.crowdName}</span>
                        <span style={{marginLeft: 10}}>选定会员{this.state.crowdNum.memberCrowdCount}人</span>
                      </p> : null
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
                  (discountForm.type !== 'CONSUME_SEND' && discountForm.type !== 'BUY_ONE_SEND_ONE') && <VoucherView discountForm={discountForm} />
                }

                <p className="sub-title">商家设置</p>
                <table className="kb-detail-table-6">
                  <tbody>
                  <tr>
                    <td className="kb-detail-table-label">参与商家</td>
                    <td style={{ width: '88%'}}>
                      { (confirmedMerchants && confirmedMerchants.length > 0) || (unConfirmedMerchants && unConfirmedMerchants.length > 0) ?
                        (<div>
                          {confirmedMerchants.length + unConfirmedMerchants.length}家商户, 已确认{confirmedMerchants.length}家
                          <span onClick={this.showMerchantList}
                                style={{color: '#2db7f5', marginLeft: 10, cursor: 'pointer'}}>查看</span>
                          <ShopsModal
                            showModal={this.state.showMerchantListModal}
                            onCancel={this.onCancelMerchant}
                            confirmedMerchants={confirmedMerchants}
                            unConfirmedMerchants={unConfirmedMerchants} />
                        </div>) : null }
                    </td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">商家确认截止时间</td>
                    <td style={{ width: '88%'}}>{discountForm.confirmTime}</td>
                  </tr>
                  </tbody>
                </table>

                {
                  discountForm.type !== 'BUY_ONE_SEND_ONE' && <DeliveryChannels discountForm={discountForm} />
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
              {
                this.getButton()
              }
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
