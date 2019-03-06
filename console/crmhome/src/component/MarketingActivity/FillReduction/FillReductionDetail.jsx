import React from 'react';
import { message, Spin, Row, Button, Breadcrumb, Col, Modal } from 'antd';
import ajax from '../../../common/ajax';
import { customLocation, getMerchantId, formatAvailableVoucherTime, formatForbiddenVoucherTime } from '../../../common/utils';
import { format} from '../../../common/dateUtils';

const GoodDetail = React.createClass({
  getInitialState() {
    return {
      detail: {},
      loading: true,
      showShopListModal: false,
    };
  },

  componentWillMount() {
    if (this.props.params.campId) {
      this.fetch();
    }
  },

  onCancel() {
    this.setState({
      showShopListModal: false,
    });
  },

// 提交上架
  onClickAdded() {
    const params = {campId: this.props.params.campId};
    ajax({
      url: `/goods/itempromo/agreePromotion.json`,
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'true') {
          message.success('上架成功', 3);
          customLocation('/goods/itempromo/activityList.htm');
        } else {
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
      error: (result) => {
        message.error(result.errorMsg, 3);
      },
    });
  },

  fetch() {
    const params = {
      campaignId: this.props.params.campId,
      op_merchant_id: getMerchantId(),
    };
    ajax({
      url: '/promo/merchant/detail.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'success') {
          this.setState({
            loading: false,
            detail: result,
          });
        } else {
          this.setState({ loading: false });
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
      error: () => {
        this.setState({ loading: false });
      },
    });
  },

  showShopList() {
    this.setState({
      showShopListModal: true,
    });
  },

  cancelShopListModal() {
    this.setState({
      shopListModal: false,
    });
  },


// 返回修改
  rejectPromotion() {
    ajax({
      url: '/goods/itempromo/rejectPromotion.json',
      method: 'post',
      data: {
        campId: this.props.params.campId,
      },
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status === 'true') {
          if ( this.props.location && this.props.location.query && this.props.location.query.redirecturl ) {// 分佣跳转逻辑
            window.location.href = this.props.location.query.redirecturl;  // eslint-disable-line no-location-assign
          } else {
            message.success('拒绝成功', 3);
            customLocation('/goods/itempromo/activityList.htm');
          }
        } else {
          // self.setState({loading: false});
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
    });
  },

// 下架
  handleOffLine(event) {
    event.preventDefault();

    const campId = this.props.params.campId;

    Modal.confirm({
      title: '下架活动提示:',
      content: '下架后活动将立即结束, 已发出的券在有限期内依然可以用, 是否继续?',
      onOk() {
        ajax({
          url: '/goods/itempromo/offlineCampaign.json',
          method: 'get',
          data: {
            campId: campId,
          },
          type: 'json',
          success: (req) => {
            if (req.status === 'succeed') {
              message.success('下架成功', 3);
              customLocation('/goods/itempromo/activityList.htm');
            } else {
              message.error(req.errorMsg);
            }
          },
        });
      },
    });
  },
  /* eslint-disable complexity */
  render() {
  /* eslint-disable complexity */
    const { detail, loading} = this.state;
    const discountForm = detail.discountForm || {};
    const {allowOffline, allowConfirm} = detail;
    let modalTop = 100;
    if (window.top !== window) {
      modalTop = window.top.scrollY - 100;
    }

    const PayChannelMap = {
      USE_NO_LIMIT: '不限制',
      USE_ON_CURRENT_PAY_CHANNEL: '限储值卡付款可享',
      NOT_ALLOWED_USE: '储值卡付款不可享',
    };

    // 新增支付渠道限制字段
    let limitRule = '';
    if (discountForm.limitRule) {
      limitRule = PayChannelMap[discountForm.limitRule];
    }

    return (<div className="kb-groups-view">
      {
        loading && <Row style={{ textAlign: 'center', marginTop: 80 }}><Spin /></Row>
      }
      {
        !loading && (
          <div>
            <div className="app-detail-header">
              <Breadcrumb separator=">">
                <Breadcrumb.Item><a href="">活动管理</a></Breadcrumb.Item>
                <Breadcrumb.Item>查看详情</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className="kb-detail-main">
              <div className="coupon-info">
                {discountForm.deliveryChannelImgUrl ? <img src={discountForm.deliveryChannelImgUrl} /> : null}
                <div className="coupon-detail">
                    <h4>{discountForm.campaignName} <span className="status"></span></h4>
                    <p>{discountForm.deliveryChannelSlogan}</p>
                    <p>{discountForm.startTime} ~ {discountForm.endTime}</p>
                    {discountForm.autoDelayFlag === 'Y' && <p>已设置自动续期</p>}
                    <div style={{marginTop: 10}}>
                      <span style={{color: '#ff6600', fontWeight: 'bold'}}>{discountForm.crowdName}</span>
                      {!discountForm.crowdId ? <div>不限人群</div> : <div>
                        {discountForm.crowdRestriction && discountForm.crowdRestriction === 'NEW_MEMBER_PROMO' ? <span style={{color: '#f60'}}>从未到该商家消费的新客</span> : <span style={{marginLeft: 10}}>选定会员{this.state.crowdNum.memberMerchantGroupCount}, 占比{this.state.crowdNum.memberMerchantGroupRatio}</span>}
                      </div>}
                  </div>
                </div>
              </div>
              <h3 className="kb-page-sub-title">基本信息</h3>
              <table className="kb-detail-table-6">
                <tbody>
                  <tr>
                    <td className="kb-detail-table-label">券类型</td>
                    <td>每满减</td>
                    <td className="kb-detail-table-label">券名称</td>
                    <td>{discountForm.subject}</td>
                    <td className="kb-detail-table-label">优惠方式</td>
                    <td>每消费满{discountForm.perConsumeAmount}立减{discountForm.perDiscountAmount}元，最高优惠{discountForm.maxDiscountAmount}元</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">适用门店</td>
                    <td>
                      {discountForm.shop ? discountForm.shop.length : ''} 家门店
                      <a onClick={this.showShopList}>查看</a>
                        <Modal title={'券适用门店'}
                               style={{top: modalTop}}
                               visible={this.state.showShopListModal}
                               onCancel={this.onCancel}
                               footer={[]}>
                          <div className="check-shop-list">
                            {
                              discountForm.cityShop && discountForm.cityShop.map((item, key) => {
                                return (
                                  <dl key={`city${key}`}>
                                    <dt>{item.cityName}</dt>
                                    {
                                      item.shops.map((shop, i) => {
                                        return (
                                          <dd key={`shop${i}`}>{shop.name}</dd>
                                        );
                                      })
                                    }
                                  </dl>
                                );
                              })
                            }
                          </div>
                        </Modal>
                    </td>
                    <td className="kb-detail-table-label">品牌名称</td>
                    <td>{discountForm.brandName}</td>
                    <td className="kb-detail-table-label">券log</td>
                    <td>
                      <a>
                        <img src={discountForm.logoFixUrl && discountForm.logoFixUrl.replace('&amp;', '&')} />
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">发放总量</td>
                    <td>{discountForm.budgetAmount ? discountForm.budgetAmount : '不限制'}</td>
                    <td className="kb-detail-table-label">上架时间</td>
                    <td>{discountForm.startTime ? <span>{format( new Date(discountForm.startTime))} - {format( new Date(discountForm.endTime))}</span> : null}</td>
                    <td className="kb-detail-table-label">使用方式</td>
                    <td>{{'REAL_TIME_SEND': '无需用户领取', 'DIRECT_SEND': '需要用户领取'}[discountForm.activityType] || ''}</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">券有效期</td>
                    <td>
                      {
                        discountForm.validTimeType === 'RELATIVE' ?
                            <span>领取后{discountForm.validPeriod}日内有效</span> :
                            <span>{discountForm.validTimeFrom} - {discountForm.validTimeTo}</span>
                        }
                    </td>
                    <td className="kb-detail-table-label">自动续期</td>
                    <td>{discountForm.autoDelayFlag === 'Y' ? '已设置自动续期' : '未设置'}</td>
                    <td className="kb-detail-table-label"></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>

              <h3 className="kb-page-sub-title">规则设置</h3>
                <table className="kb-detail-table-6">
                  <tbody>
                    <tr>
                      <td className="kb-detail-table-label">使用时段</td>
                      <td>{discountForm.availableTimes && (discountForm.availableTimes.length !== 0) ? formatAvailableVoucherTime(discountForm.availableTimes) : '不限制'}</td>
                      <td className="kb-detail-table-label">不可用日期</td>
                      <td>{discountForm.forbiddenTime ? formatForbiddenVoucherTime(discountForm.forbiddenTime) : '不限制'}</td>
                      <td className="kb-detail-table-label">领取限制</td>
                      <td>{discountForm.receiveLimited ? `${discountForm.receiveLimited}次` : '不限制'}</td>
                    </tr>
                    <tr>
                      <td className="kb-detail-table-label">每日领取限制</td>
                      <td>{discountForm.dayReceiveLimited ? `${discountForm.dayReceiveLimited}次` : '不限制'}</td>
                      <td className="kb-detail-table-label">领取人群限制</td>
                      <td>
                        {!discountForm.crowdId ? <div>不限人群</div> : <div>
                          {discountForm.crowdRestriction && discountForm.crowdRestriction === 'NEW_MEMBER_PROMO' ? <span style={{color: '#f60'}}>从未到该商家消费的新客</span> : <span style={{marginLeft: 10}}>选定会员{this.state.crowdNum.memberMerchantGroupCount}, 占比{this.state.crowdNum.memberMerchantGroupRatio}</span>}
                        </div>}
                      </td>
                      <td className="kb-detail-table-label">支付渠道限制</td>
                      <td>{limitRule ? limitRule : null}</td>
                    </tr>
                    <tr>
                      <td className="kb-detail-table-label">是否允许转增</td>
                      <td>{discountForm.donateFlag ? '是' : '否'}</td>
                      <td className="kb-detail-table-label">
                        <p>是否在口碑门店</p>
                        <p>露出</p>
                      </td>
                      <td>{discountForm.koubeiChannelDisplay ? '是' : '否'}</td>
                      <td className="kb-detail-table-label"></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>

              <h3 className="kb-page-sub-title">其他设置</h3>
              <table className="kb-detail-table-2">
                <tbody>
                  <tr>
                    <td className="kb-detail-table-label">备注</td>
                    <td>{discountForm.voucherNote}</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">使用须知</td>
                    <td>
                      {
                        discountForm.descList && discountForm.descList.map((item, i) => {
                          return (
                            <p key={`desc${i}`}>{item}</p>
                          );
                        })
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
            <Row>
                {
                  allowConfirm && <Col span={8} offset={2} style={{textAlign: 'center'}}>
                    <Button type="primary" style={{marginRight: '10px'}} onClick={this.onClickAdded}>确认上架</Button>
                    <Button style={{marginRight: '10px'}} onClick={this.rejectPromotion}>返回修改</Button>
                  </Col>
                }
                {
                  allowOffline && <Col span={8} offset={2} style={{textAlign: 'center'}}>
                      <Button type="primary" style={{marginRight: '10px'}} onClick={this.handleOffLine}>下架</Button>
                      </Col>
                }

              </Row>
            </div>
          </div>
        )
      }
    </div>
    );
  },

});

export default GoodDetail;
