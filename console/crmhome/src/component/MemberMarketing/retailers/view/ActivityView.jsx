import React, {PropTypes} from 'react';
import {Breadcrumb, message, Modal, Row, Col, Button} from 'antd';
import {retailersActivityType, retailersActivityStatus, retailersDeliveryChannels} from '../../config/AllStatus';
import { getValueFromQueryString } from '../../../../common/utils';

import ajax from '../../../../common/ajax';

const RetailersActivityView = React.createClass({
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
      isKbserv: false,
      showSKUCodeModal: false,
    };
  },

  componentDidMount() {
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
    const { params } = this.props;

    ajax({
      url: getValueFromQueryString('fromSource') === 'KB_SERVICE' ? '/promo/koubei/merchant/detail.json' : '/promo/merchant/detail.json',
      method: 'get',
      type: 'json',
      data: {
        campaignId: params.campId,
      },
      success: (res) => {
        if (res.status === 'success') {
          this.setState({
            detail: res,
            isKbserv: res.isKbservLogin,
          });

          if (res.discountForm.crowdId) {
            this.fetchNum(res.discountForm.crowdId);
          }
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
          message.error(res.errorMsg || '获取人数失败.');
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
          url: '/promo/merchant/offline.json',
          method: 'get',
          data: {
            campaignId: campId,
          },
          type: 'json',
          success: (req) => {
            if (req.status === 'success') {
              message.success('下架成功');

              self.fetch();
            } else {
              message.error(req.errorMsg);
            }
          },
        });
      },
    });
  },

  handleOperate(type, event) {
    const self = this;
    event.preventDefault();

    let api;
    const { campId } = self.props.params;
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
        campId: campId,
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

  crowdRestrictionView(crowdRestriction) {
    if (!crowdRestriction) { return null; }

    if (crowdRestriction === 'MEMBER_CARD') {
      return <span>领卡会员</span>;
    } else if (crowdRestriction === 'NEW_MEMBER_PROMO') {
      return <span style={{color: '#f60'}}>从未到该商家消费的新客</span>;
    }

    return <span style={{ marginLeft: 10 }}>选定会员{this.state.crowdNum.memberMerchantGroupCount}, 占比{this.state.crowdNum.memberMerchantGroupRatio}</span>;
  },

  /*eslint-disable */
  render() {
    /*eslint-enable */
    const isGenericIndustry = window.APP.isGenericIndustry === 'true';
    const isKbserv = this.state.isKbserv;
    const { discountForm, allowOffline, allowConfirm, allowModifyConfirm, allowOfflineConfirm } = this.state.detail;

    if (discountForm) {
      let limit;
      if (discountForm.itemDiscountType === 'RATE' || discountForm.itemDiscountType === 'REDUCETO') {
        limit = (discountForm.minItemNum === 0 && discountForm.maxDiscountItemNum === 0) ? '不限制' : '同一件商品满' + discountForm.minItemNum + '件可享受优惠，且该商品最高优惠' + discountForm.maxDiscountItemNum + '件';
      } else {
        limit = discountForm.minimumAmount ? '满' + discountForm.minimumAmount + '元可用' : '不限制';
      }

      let discountDisplay;
      if (discountForm.itemDiscountType === 'RATE') {
        discountDisplay = discountForm.rate + '折';
      } else if (discountForm.itemDiscountType === 'REDUCETO') {
        discountDisplay = '减至' + discountForm.reduceToPrice + '元';
      } else {
        discountDisplay = '立减' + discountForm.couponValue + '元';
      }
      let modalTop = 100;
      if (window.top !== window) {
        modalTop = window.top.scrollY - 100;
      }

      const filteredChannels = (discountForm.deliveryChannels || []).filter((item) => retailersDeliveryChannels[item] &&
        retailersDeliveryChannels[item].img !== '');


      return (
        <div className="kb-groups-view">
          { isKbserv === false && <h2 className="kb-page-title">营销管理</h2>}
          <div className="app-detail-content-padding">
            <Breadcrumb separator=">">
              <Breadcrumb.Item>管理</Breadcrumb.Item>
              <Breadcrumb.Item>查看营销活动</Breadcrumb.Item>
            </Breadcrumb>

            <div className="kb-detail-main">
              <div className="coupon-info">
                <img src={discountForm.deliveryChannelImgUrl} />
                <div className="coupon-detail">
                  <h4>{discountForm.campaignName}
                    <span className={'status ' + retailersActivityStatus[discountForm.displayStatus].color}>
                      {retailersActivityStatus[discountForm.displayStatus].text}
                    </span>
                  </h4>
                  <p>{discountForm.deliveryChannelSlogan}</p>
                  <p>{discountForm.startTime} ~{discountForm.endTime}</p>
                  <p style={{ marginTop: 10 }}>
                    <span style={{ color: '#ff6600', fontWeight: 'bold' }}>{discountForm.crowdName}</span>
                    {discountForm.crowdRestriction && this.crowdRestrictionView(discountForm.crowdRestriction)}
                  </p>
                </div>
              </div>

              <p className="sub-title">优惠券设置</p>
              <table className="kb-detail-table-6">
                <tbody>
                  <tr>
                    <td className="kb-detail-table-label">券种类</td>
                    <td>{retailersActivityType[discountForm.itemDiscountType]}</td>
                    <td className="kb-detail-table-label">商品名称</td>
                    <td>{discountForm.subject}</td>
                    <td className="kb-detail-table-label">品牌名称</td>
                    <td>{discountForm.brandName}</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">券logo</td>
                    <td>
                      <img src={discountForm.logoFixUrl}/>
                    </td>
                    <td className="kb-detail-table-label">商品详情文案</td>
                    <td>{discountForm.activityName}</td>
                    <td className="kb-detail-table-label">商品详情图片</td>
                    <td>
                      { discountForm.activityImgs.map((item, i) => {
                        return (
                          <img key={i} src={item}/>
                        );
                      }) }
                    </td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">更多商品详情</td>
                    <td colSpan="5">{!isGenericIndustry && discountForm.activityLink}</td>
                  </tr>
                </tbody>
              </table>

              <p className="sub-title">优惠券设置</p>
              <table className="kb-detail-table-6">
                <tbody>
                <tr>
                  <td className="kb-detail-table-label">
                    { discountForm.itemDiscountType === 'RATE' ? '折扣力度' : '优惠方式'}
                  </td>
                  <td>
                    { discountDisplay }
                  </td>
                  <td className="kb-detail-table-label">商品编码</td>
                  <td>
                    <a href="#" onClick={(e) => { e.preventDefault(); this.setState({ showSKUCodeModal: true }); }}>查看</a>
                    <Modal title="商品编码"
                      visible={this.state.showSKUCodeModal}
                      onCancel={() => { this.setState({ showSKUCodeModal: false }); }}
                      footer={null}
                    >
                      <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                        {
                          !isGenericIndustry && (discountForm.goodsIds || []).map((item, i) => {
                            return (
                              <p key={i}>{item}</p>
                            );
                          })
                        }
                      </div>
                    </Modal>
                  </td>
                  <td className="kb-detail-table-label">参与限制</td>
                  <td>{discountForm.receiveLimited ? discountForm.receiveLimited : '不限制'}</td>
                </tr>
                <tr>
                  <td className="kb-detail-table-label">每日参与限制</td>
                  <td>{discountForm.dayReceiveLimited ? discountForm.dayReceiveLimited : '不限制'}</td>
                  <td className="kb-detail-table-label">使用条件</td>
                  <td>{!isGenericIndustry ? limit : ''}</td>
                  <td className="kb-detail-table-label">券有效期</td>
                  <td>{
                    discountForm.validTimeType === 'RELATIVE' ?
                        <span>领取后{discountForm.validPeriod}日内有效</span> :
                        <span>{discountForm.validTimeFrom} - {discountForm.validTimeTo}</span>
                    }
                    </td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label" >发放总量</td>
                    <td>{discountForm.budgetAmount ? discountForm.budgetAmount : '不限制'}</td>
                    <td className="kb-detail-table-label">使用说明</td>
                    <td>
                      {
                        discountForm.descList && discountForm.descList.map((item, i) => {
                          return (
                            <p key={i}>{item}</p>
                          );
                        })
                      }
                    </td>
                    <td className="kb-detail-table-label">券适用门店</td>
                    <td colSpan="5">
                      { discountForm.cityShop && discountForm.cityShop.length > 0 ? (
                        <div>
                          {discountForm.shop.length}家门店
                          <span onClick={this.showShopList} style={{ color: '#2db7f5', marginLeft: 10, cursor: 'pointer' }}>查看</span>

                          <Modal title={'券适用门店'}
                            style={{ top: modalTop }}
                            visible={this.state.showShopListModal}
                            onCancel={this.onCancel}
                            footer={null}>
                            <div className="check-shop-list">
                              {
                                discountForm.cityShop.map((item, key) => {
                                  return (
                                    <dl key={key}>
                                      <dt>{item.cityName}</dt>
                                      {
                                        item.shops.map((shop, i) => {
                                          return (
                                            <dd key={i}>{shop.name}</dd>
                                          );
                                        })
                                      }
                                    </dl>
                                  );
                                })
                              }
                            </div>
                          </Modal>
                        </div>
                      ) : null }
                    </td>
                  </tr>
                </tbody>
              </table>

              { discountForm.deliveryChannels ? (
                <div>
                  <p className="sub-title">投放渠道</p>
                  <table className="kb-detail-table-6">
                    <tbody>
                      <tr>
                        <td className="kb-detail-table-label">投放渠道</td>
                        <td style={{ width: 'auto' }}>
                          {
                            filteredChannels.map((item, i) => {
                              return (
                                <span key={i}>{item === 'SHOP_DETAIL' && !discountForm.crowdId ? '店铺详情页'
                                  : retailersDeliveryChannels[item].label}
                                  {retailersDeliveryChannels[item] && i !== filteredChannels.length - 1 ? ', ' : null}
                                </span>
                              );
                            })
                          }
                          {
                            filteredChannels.length > 0 ?
                              <div style={{ display: 'inline-block', marginLeft: 10 }}>
                                {
                                  filteredChannels.every((item) => {
                                    return item === 'SHOP_DETAIL';
                                  }) && !discountForm.crowdId ? null : <a href="#" onClick={this.showPreview}>预览</a>
                                }
                                <Modal ref="modal"
                                  style={{ top: modalTop }}
                                  visible={this.state.showPreviewModal}
                                  onCancel={this.closePreview}
                                  title="投放渠道预览"
                                  width="800"
                                  footer={[]}>
                                  <Row type="flex" justify="space-around">
                                    {
                                      (!discountForm.crowdId ? discountForm.deliveryChannels.filter((item) => item !== 'SHOP_DETAIL') :
                                        discountForm.deliveryChannels).map((item, index) => {
                                          if (retailersDeliveryChannels[item].img !== '') {
                                            return (<Col key={index} span="7">
                                              {retailersDeliveryChannels[item].label}
                                              <img width="100%" src={retailersDeliveryChannels[item].img}/>
                                            </Col>);
                                          }
                                          return (<Col key={index} span="7">
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
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>) : null}
            </div>

            <div className="view-bottom">
              {
                allowOffline ? (
                  <Button type="primary" size="large" onClick={this.handleOffLine}>下架</Button>
                ) : null
              }
              {
                allowConfirm || allowModifyConfirm || allowOfflineConfirm ? (
                  <Button type="primary" size="large" style={{ marginRight: 10 }} onClick={this.handleOperate.bind(this, 'agree') }>通过</Button>
                ) : null
              }
              {
                allowConfirm || allowModifyConfirm || allowOfflineConfirm ? (
                  <Button type="primary" size="large" onClick={this.handleOperate.bind(this, 'reject') }>驳回</Button>
                ) : null
              }
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

export default RetailersActivityView;
