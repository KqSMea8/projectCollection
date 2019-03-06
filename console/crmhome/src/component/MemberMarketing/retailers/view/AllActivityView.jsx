import React, {PropTypes} from 'react';
import {Breadcrumb, message, Modal, Row, Col, Button, Alert} from 'antd';
import { DetailTable } from 'hermes-react';
import {retailersDeliveryChannels} from '../../config/AllStatus';
import ajax from '../../../../common/ajax';
import {formatAvailableVoucherTime, formatForbiddenVoucherTime, getValueFromQueryString, customLocation} from '../../../../common/utils';


const AllActivityView = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    return {
      showPreviewModal: false,
      showShopListModal: false,
      detail: {}, // 优惠券数据
      crowdNum: {
        memberMerchantGroupCount: 0,
        memberMerchantGroupRatio: '0%',
      },
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

  fetch() {
    let url = window.APP.ownUrl + '/promo/merchant/detail.json';
    if (getValueFromQueryString('fromSource') === 'KB_SERVICE') {
      url = window.APP.ownUrl + '/promo/koubei/merchant/detail.json';
    }
    ajax({
      url: url,
      method: 'get',
      type: 'json',
      data: {
        campaignId: this.props.params.campId,
      },
      success: (res) => {
        if (res.status === 'success') {
          if (res.discountForm.crowdId) {
            this.fetchNum(res.discountForm.crowdId);
          }
          this.setState({
            detail: res,
          });
        } else {
          message.error(res.errorMsg || '获取券信息失败');
        }
      },
    });
  },

  fetchNum(crowdId) {
    ajax({
      url: '/promo/merchant/memberMerchantBatchSum.json',
      method: 'get',
      data: {
        crowdGroupId: crowdId,
        needStatistics: 1,
      },
      type: 'json',
      success: (res) => {
        if (res.status === 'success') {
          this.setState({
            crowdNum: res.data,
          });
        } else {
          message.error(res.errorMsg || '获取人数失败');
        }
      },
    });
  },

  showPreview(event) {
    event.preventDefault();
    this.setState({
      showPreviewModal: true,
    });
  },

  closePreview() {
    this.setState({
      showPreviewModal: false,
    });
  },

  showShopList() {
    this.setState({
      showShopListModal: true,
    });
  },

  handleOffLine(event) {
    const self = this;
    event.preventDefault();

    const { campId } = self.props.params;

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
              if (window.top !== window && window.top.location.hash.indexOf('#/catering/detail') === 0) {
                window.top.postMessage(JSON.stringify({ action: 'goback' }), '*');
              } else {
                customLocation('/goods/itempromo/activityList.htm');
              }
            } else {
              message.error(req.errorMsg);
            }
          },
        });
      },
    });
  },

  confirmBtn(_key) {
    const self = this;
    console.log(_key);
    let confirmUrl = '';
    switch (_key) {
    case 'allowConfirm':
      confirmUrl = '/goods/itempromo/agreePromotion.json';
      break;
    case 'allowModifyConfirm':
      confirmUrl = '/goods/itempromo/agreePromoModify.json';
      break;
    case 'allowOfflineConfirm':
      confirmUrl = '/goods/itempromo/agreePromoOffline.json';
      break;
    default:
      break;
    }
    // confirm ajax
    self.setState({
      loading: true,
    });
    ajax({
      url: confirmUrl,
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
          message.success('确认成功', 3);
          if ( this.props.location && this.props.location.query && this.props.location.query.redirecturl) {// 分佣跳转逻辑
            window.location.href = this.props.location.query.redirecturl;  // eslint-disable-line no-location-assign
          } else {
            customLocation('/goods/itempromo/activityList.htm');
          }
        } else {
          self.setState({loading: false});
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
    });
  },

  rejectBtn(_key) {
    const self = this;
    console.log(_key);
    let rejectUrl = '';
    switch (_key) {
    case 'allowReject':
      rejectUrl = '/goods/itempromo/rejectPromotion.json';
      break;
    case 'allowModifyReject':
      rejectUrl = '/goods/itempromo/rejectPromoModify.json';
      break;
    case 'allowOfflineReject':
      rejectUrl = '/goods/itempromo/rejectPromoOffline.json';
      break;
    default:
      break;
    }
    // reject ajax
    self.setState({
      loading: true,
    });
    ajax({
      url: rejectUrl,
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
          self.setState({loading: false});
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
    });
  },

  dataSource() {
    let modalTop = 100;
    if (window.top !== window) {
      modalTop = window.top.scrollY;
    }
    const { discountForm, isRetail } = this.state.detail;

    const allowUseUserGroupObj = {
      0: '全部用户',
      3: '新客用户',
      2: '生日用户',
      4: '领卡会员', // 新增会员卡用户
    };

    if (!discountForm) {
      return { allowUseUserGroupObj };
    }

    const IS_PER_FULL_CUT = discountForm.itemDiscountType === 'PER_FULL_CUT';
    const hasValid = discountForm && discountForm.activityType !== 'REAL_TIME_SEND';

    const filteredChannels = (discountForm.deliveryChannels || []).filter((item) => retailersDeliveryChannels[item] &&
      retailersDeliveryChannels[item].img !== '' ||
      (item === 'QR_CODE' && discountForm.deliveryResult && discountForm.deliveryResult[item]) ||
      (item === 'SHORT_LINK' && discountForm.deliveryResult && discountForm.deliveryResult[item])
    ); // 投放渠道预览需要展示 img，所以在这里排除掉 img 没有的渠道。

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
    // 券种类
    let itemDiscountType = null;
    switch (discountForm.itemDiscountType) {
    case 'MONEY':
      itemDiscountType = '全场代金券';
      break;
    case 'RATE':
      itemDiscountType = '折扣券';
      break;
    case 'PER_FULL_CUT':
      itemDiscountType = '每满减券';
      break;
    case 'EXCHANGE':
      itemDiscountType = '兑换券';
      break;
    case 'REDUCETO':
      itemDiscountType = '立减到券';
      break;
    case 'SINGLE_DISCOUNT':
      itemDiscountType = '单品折扣券';
      break;
    default:
      itemDiscountType = '';
    }

    const couponDataSource = ['券种类', '券名称', '品牌名称', '券logo', '折扣率', '券面额', '使用条件',
      '优惠力度', '最高优惠', '使用方式', '每个用户总参与', '每个用户每天参与',
      '券有效期', '券适用门店', '发放总量', '每日发放上限', '领取即时生效', '领取当日可用', '券可用时段', '不可用日期',
      '支付渠道限制', '是否与其他单品优惠券叠加', '使用人群限制', '指定生日日期', '是否允许转赠',
      '是否在口碑门店露出', '备注', '使用说明']
    /* eslint-disable complexity */
    .map(label => {
      const rtn = { label };
      if (label === '券种类') {
        rtn.value = itemDiscountType;
      } else if (label === '券名称') {
        rtn.value = discountForm.subject;
      } else if (label === '品牌名称') {
        rtn.value = discountForm.brandName;
      } else if (label === '券logo') {
        rtn.value = <img src={discountForm.logoFixUrl}/>;
      } else if (label === '折扣率') {
        rtn.value = `${discountForm.rate}折`;
        rtn.isSkipped = IS_PER_FULL_CUT || discountForm.itemDiscountType !== 'RATE';
      } else if (label === '券面额') {
        rtn.value = `${discountForm.couponValue}元`;
        rtn.isSkipped = IS_PER_FULL_CUT || discountForm.itemDiscountType === 'RATE';
      } else if (label === '使用条件') {
        rtn.value = discountForm.minimumAmount ? `满${discountForm.minimumAmount}元可用` : '不限制';
        rtn.isSkipped = IS_PER_FULL_CUT;
      } else if (label === '优惠力度') {
        rtn.value = `每消费满${discountForm.perConsumeAmount}立减${discountForm.perDiscountAmount}元`;
        rtn.isSkipped = !IS_PER_FULL_CUT;
      } else if (label === '最高优惠') {
        rtn.value = discountForm.maxDiscountAmount ? `${discountForm.maxDiscountAmount}元` : '不限制';
        rtn.isSkipped = !IS_PER_FULL_CUT;
      } else if (label === '使用方式') {
        rtn.value = {'REAL_TIME_SEND': '无需用户领取', 'DIRECT_SEND': '需要用户领取'}[discountForm.activityType] || '';
      } else if (label === '每个用户总参与') {
        rtn.value = discountForm.receiveLimited ? `${discountForm.receiveLimited}次` : '不限制';
      } else if (label === '每个用户每天参与') {
        rtn.value = discountForm.dayReceiveLimited ? `${discountForm.dayReceiveLimited}次` : '不限制';
      } else if (label === '券有效期') {
        rtn.value = discountForm.validTimeType === 'RELATIVE' ?
          <span>领取后{discountForm.validPeriod}日内有效</span> :
          <span>{discountForm.validTimeFrom} - {discountForm.validTimeTo}</span>;
        rtn.isSkipped = !hasValid;
      } else if (label === '券适用门店') {
        rtn.value = (
          <div>
            {discountForm.shop.length}家门店
            <span onClick={this.showShopList} style={{color: '#2db7f5', marginLeft: 10, cursor: 'pointer'}}>查看</span>
            <Modal title={'券适用门店'}
                  style={{top: modalTop}}
                  visible={this.state.showShopListModal}
                  onCancel={this.onCancel}
                  footer={[]}>
              <div className="check-shop-list">
                {
                  discountForm.cityShop.map((item, key) => {
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
          </div>);
      } else if (label === '发放总量') {
        rtn.value = discountForm.budgetAmount ? discountForm.budgetAmount : '不限制';
      } else if (label === '每日发放上限') {
        rtn.value = (!discountForm.dayAvailableNum || +discountForm.dayAvailableNum === 999999999) ? '不限制' : discountForm.dayAvailableNum;
        rtn.isSkipped = discountForm.activityType === 'REAL_TIME_SEND';
      } else if (label === '领取即时生效') {
        rtn.value = discountForm.activityType !== 'REAL_TIME_SEND' ? <div>{(discountForm.actived === '0' || !discountForm.actived) ? '是' : '否'}</div> : null;
        rtn.isSkipped = !hasValid || discountForm.activityType !== 'DIRECT_SEND';
      } else if (label === '领取当日可用') {
        rtn.value = discountForm.activityType !== 'REAL_TIME_SEND' ? <div>{(discountForm.actived === '0' || !discountForm.actived) ? '是' : '否'}</div> : null;
        rtn.isSkipped = !hasValid || discountForm.activityType === 'DIRECT_SEND';
      } else if (label === '券可用时段') {
        rtn.value = (discountForm.availableTimes.length !== 0) ? formatAvailableVoucherTime(discountForm.availableTimes) : '不限制';
      } else if (label === '不可用日期') {
        rtn.value = discountForm.forbiddenTime ? formatForbiddenVoucherTime(discountForm.forbiddenTime) : '不限制';
      } else if (label === '支付渠道限制') {
        rtn.value = limitRule;
        rtn.isSkipped = !IS_PER_FULL_CUT && !limitRule;
      } else if (label === '是否与其他单品优惠券叠加') {
        rtn.value = discountForm.multiUseMode === 'MULTI_USE_WITH_SINGLE' ? '叠加' : '不叠加';
        rtn.isSkipped = IS_PER_FULL_CUT || !isRetail;
      } else if (label === '使用人群限制') {
        rtn.value = allowUseUserGroupObj[discountForm.allowUseUserGroup];
        rtn.isSkipped = IS_PER_FULL_CUT || !discountForm.allowUseUserGroup;
      } else if (label === '指定生日日期') {
        rtn.value = `${discountForm.birthDateFrom} ~ ${discountForm.birthDateTo} 日期范围内用户可享`;
        rtn.isSkipped = IS_PER_FULL_CUT || !discountForm.birthDateFrom;
      } else if (label === '是否允许转赠') {
        rtn.value = discountForm.donateFlag === '1' ? '是' : '否';
        rtn.isSkipped = discountForm.activityType !== 'DIRECT_SEND';
      } else if (label === '是否在口碑门店露出') {
        rtn.value = discountForm.koubeiChannelDisplay ? '是' : '否';
        rtn.isSkipped = !IS_PER_FULL_CUT;
      } else if (label === '备注') {
        rtn.value = discountForm.voucherNote;
      } else if (label === '使用说明') {
        rtn.value = discountForm.descList && discountForm.descList.map((item, i) => {
          return (
            <p key={`desc${i}`}>{item}</p>
          );
        });
      }
      return rtn;
    });
    const deliveryChannelsDataSource = discountForm.deliveryChannels ?
    ['投放渠道']
    .map(label => {
      const rtn = { label };
      if (label === '投放渠道') {
        rtn.colSpan = 5;
        rtn.value = (
          <div>
            {
              filteredChannels.map((item, i) => {
                return (
                  <span key={`chanel${i}`}>{item === 'SHOP_DETAIL' && !discountForm.crowdId ? '店铺详情页'
                    : retailersDeliveryChannels[item].label}
                    {retailersDeliveryChannels[item] && i !== filteredChannels.length - 1 ? ', ' : null}
                  </span>
                );
              })
            }
            {
              filteredChannels.length > 0 ?
                <div style={{display: 'inline-block', marginLeft: 10}}>
                {
                  filteredChannels.every((item) => {
                    return item === 'SHOP_DETAIL';
                  }) && !discountForm.crowdId ? null : <a href="#" onClick={this.showPreview}>预览</a>
                }
                <Modal ref="modal"
                        visible={this.state.showPreviewModal}
                        onCancel={this.closePreview}
                        title="投放渠道预览"
                        width="800"
                        style={{top: modalTop}}
                        footer={[]}>
                  <Row type="flex" justify="space-between">
                    {
                      discountForm.deliveryChannels.map((item, index) => {
                        if (retailersDeliveryChannels[item].img !== '') {
                          return (<Col key={`delivery${index}`} span="7">
                            {retailersDeliveryChannels[item].label}
                            <img width="100%" src={retailersDeliveryChannels[item].img}/>
                          </Col>);
                        }
                        return (<Col key={`delivery${index}`} span="7">
                          {discountForm.deliveryResult && retailersDeliveryChannels[item].label}
                          {
                            (item === 'QR_CODE' && discountForm.deliveryResult) && <img width="100%" src={discountForm.deliveryResult[item]}/>
                          }
                          {
                            (item === 'SHORT_LINK' && discountForm.deliveryResult) && <p>{discountForm.deliveryResult[item]}</p>
                          }
                        </Col>);
                      })
                    }
                  </Row>
                </Modal>
              </div> : null
            }
          </div>
        );
      }
      return rtn;
    }) : null;
    return { allowUseUserGroupObj, couponDataSource, deliveryChannelsDataSource };
  },

  /* eslint-disable complexity */
  render() {
    /* eslint-disable complexity */
    const { discountForm, allowOffline, allowConfirm, allowModifyConfirm, allowOfflineConfirm } = this.state.detail;
    if (discountForm) {
      const isNotIframe = window.top === window;
      const { allowUseUserGroupObj, couponDataSource, deliveryChannelsDataSource } = this.dataSource();

      // 如果值为 MEMBER_CARD ，代表领卡会员
      const crowdRestrictionMap = {
        NEW_MEMBER_PROMO: <span style={{color: '#f60'}}>从未到该商家消费的新客</span>,
        // MEMBER_CARD: <span style={{color: '#f60'}}>领卡会员</span>,
      };

      return (
        <div className="kb-groups-view">
          {isNotIframe && <h2 className="kb-page-title">营销管理</h2>}
          <div className="app-detail-content-padding">
            {isNotIframe && <Breadcrumb separator=">">
              <Breadcrumb.Item>管理</Breadcrumb.Item>
              <Breadcrumb.Item>查看营销活动</Breadcrumb.Item>
            </Breadcrumb>}

            <div className="kb-detail-main">
              {
                discountForm.offlineReason && <Row><Col><Alert message="活动下架"
                  description={discountForm.offlineReason}
                  type="info"
                  showIcon /></Col></Row>
              }
              <div className="coupon-info">
                {discountForm.deliveryChannelImgUrl ? <img src={discountForm.deliveryChannelImgUrl} /> : null}
                <div className="coupon-detail">
                  <h4>{discountForm.campaignName} <span className="status"></span></h4>
                  <p>{discountForm.deliveryChannelSlogan}</p>
                  <p>{discountForm.startTime} ~ {discountForm.endTime}</p>
                  {discountForm.autoDelayFlag === 'Y' && <p>已设置自动续期</p>}
                  <p style={{marginTop: 10}}>
                    <span style={{color: '#ff6600', fontWeight: 'bold'}}>{discountForm.crowdName}</span>
                    {
                      !discountForm.crowdId ?
                        <div>{discountForm.allowUseUserGroup ? allowUseUserGroupObj[discountForm.allowUseUserGroup] : '不限人群'}</div>
                        :
                        <div>
                          {
                            discountForm.crowdRestriction && crowdRestrictionMap[discountForm.crowdRestriction]
                              ?
                              crowdRestrictionMap[discountForm.crowdRestriction]
                              :
                              <span style={{marginLeft: 10}}>选定会员{this.state.crowdNum.memberMerchantGroupCount}, 占比{this.state.crowdNum.memberMerchantGroupRatio}</span>
                          }
                        </div>
                    }
                  </p>
                </div>
              </div>

              <p className="sub-title">优惠券设置</p>
              <DetailTable
                columnCount={6}
                dataSource={couponDataSource}
                labelCellClassName="kb-detail-table-label"
                valueCellClassName="kb-detail-table-value"
                emptyCellClassName="kb-detail-table-empty"
              />

              { deliveryChannelsDataSource ? (
              <div>
                <p className="sub-title">投放渠道</p>
                <DetailTable
                  columnCount={6}
                  dataSource={deliveryChannelsDataSource}
                  labelCellClassName="kb-detail-table-label"
                  valueCellClassName="kb-detail-table-value"
                  emptyCellClassName="kb-detail-table-empty"
                />
              </div>) : null}
            </div>
            <div className="view-bottom">
              {
                allowOffline && <Button
                  style={{marginRight: '10px'}}
                  type="primary"
                  onClick={this.handleOffLine}
                >下架</Button>
              }
              {
                allowConfirm && (
                  <div>
                    <Button
                      style={{marginRight: '10px'}}
                      type="primary"
                      onClick={() => {
                        this.confirmBtn('allowConfirm');
                      }}
                    >确认</Button>
                    <Button
                      onClick={() => {
                        this.rejectBtn('allowReject');
                      }}
                    >拒绝</Button>
                  </div>
                )
              }
              {
                allowModifyConfirm && (
                  <div>
                    <Button
                      style={{marginRight: '10px'}}
                      type="primary"
                      onClick={() => {
                        this.confirmBtn('allowModifyConfirm');
                      }}
                    >确认</Button>
                    <Button
                      onClick={() => {
                        this.rejectBtn('allowModifyReject');
                      }}
                    >拒绝</Button>
                  </div>
                )
              }
              {
                allowOfflineConfirm && (
                  <div>
                    <Button
                      style={{marginRight: '10px'}}
                      type="primary"
                      onClick={() => {
                        this.confirmBtn('allowOfflineConfirm');
                      }}
                    >确认</Button>
                    <Button
                      onClick={() => {
                        this.rejectBtn('allowOfflineReject');
                      }}
                    >拒绝</Button>
                  </div>
                )
              }
            </div>
          </div>
        </div>
    ); }

    return (
        <div></div>
    );
  },
});

export default AllActivityView;
