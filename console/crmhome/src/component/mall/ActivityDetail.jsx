import React from 'react';
import { Breadcrumb, message, Button, Modal, Row, Col } from 'antd';
import Agree from './common/Agree';
import DiscountLayout from './common/DiscountCouponDetail';
import MoneyLayout from './common/MoneyCouponDetail';
import ajax from '../../common/ajax';
import { getValueFromQueryString } from '../../common/utils';
import StatusTag from './common/StatusTag';
import ShopListModal from './common/ShopListModal';
import { serverStringToDate } from '../../common/dateUtils';
import { retailersDeliveryChannels } from '../MemberMarketing/config/AllStatus';

const ButtonGroup = Button.Group;
const modalConfirm = Modal.confirm;

const MallActivityView = React.createClass({
  getInitialState() {
    return {
      currentCouponIndex: 0,  //  所选Coupon索引
      coupons: [],
      detail: {},
      showPreview: false,
      showShopList2: false,
      rejectDisabled: false,
      hideButtons: false,
      rejectOfflineDisabled: false,
      agreeOfflineDisabled: false,
    };
  },

  componentWillMount() {
    if (this.props.params.campId) {
      this.fetch();
    }
  },

  toggleShopList2(e) {
    e.preventDefault();
    this.setState({ showShopList2: !this.state.showShopList2 });
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
          this.setState({
            coupons: res.discountForm && res.discountForm.vouchers && res.discountForm.vouchers.length ?
              res.discountForm.vouchers : [res.discountForm],
            detail: res.discountForm,
          });
        } else {
          message.error(res.errorMsg || '获取券信息失败');
        }
      },
    });
  },

  togglePreview(e) {
    e.preventDefault();
    this.setState({
      showPreview: !this.state.showPreview,
    });
  },

  switchCoupon(i) {
    this.setState({ currentCouponIndex: i });
  },

  agree() {
    const self = this;
    const agreeAjax = () => {
      const url = window.APP.ownUrl + '/goods/itempromo/agreePromotion.json';
      ajax({
        url: url,
        method: 'post',
        data: {
          campId: self.props.params.campId,
        },
        type: 'json',
        success: (res) => {
          if (res.status === 'true') {
            self.setState({ confirmed: true, hideButtons: true });
            message.success(res.resultMsg);
            self.fetch();
          } else {
            message.error(res.resultMsg || '确认参加失败');
          }
        },
      });
    };
    modalConfirm({
      title: '确认参加活动',
      onOk: agreeAjax,
      onCancel() { },
    });
  },
  agreeOffline() {
    const self = this;
    const agreeAjax = () => {
      const url = window.APP.ownUrl + '/goods/itempromo/agreePromoOffline.json';
      ajax({
        url: url,
        method: 'post',
        data: {
          campId: self.props.params.campId,
        },
        type: 'json',
        success: (res) => {
          if (res.status === 'true') {
            self.setState({ agreeOfflineDisabled: true, hideButtons: true });
            message.success(res.resultMsg);
            self.fetch();
          } else {
            message.error(res.resultMsg || '下架确认失败');
          }
        },
      });
    };
    modalConfirm({
      title: '确认下架活动',
      onOk: agreeAjax,
      onCancel() { },
    });
  },

  reject() {
    const self = this;
    const rejectAjax = () => {
      const url = window.APP.ownUrl + '/goods/itempromo/rejectPromotion.json';
      ajax({
        url,
        method: 'post',
        data: {
          campId: self.props.params.campId,
        },
        type: 'json',
        success: (res) => {
          if (res.status === 'true') {
            self.setState({ rejectDisabled: true, hideButtons: true });
            message.success(res.resultMsg);
            self.fetch();
          } else {
            message.error(res.resultMsg || '驳回活动失败');
          }
        },
      });
    };
    modalConfirm({
      title: '你是否确认驳回活动',
      onOk: rejectAjax,
      onCancel() { },
    });
  },
  rejectOffline() {
    const self = this;
    const rejectAjax = () => {
      const url = window.APP.ownUrl + '/goods/itempromo/rejectPromoOffline.json';
      ajax({
        url,
        method: 'post',
        data: {
          campId: self.props.params.campId,
        },
        type: 'json',
        success: (res) => {
          if (res.status === 'true') {
            self.setState({ rejectOfflineDisabled: true, hideButtons: true });
            message.success(res.resultMsg);
            self.fetch();
          } else {
            message.error(res.resultMsg || '驳回下架失败');
          }
        },
      });
    };
    modalConfirm({
      title: '你是否确认驳回下架',
      onOk: rejectAjax,
      onCancel() { },
    });
  },
  /*eslint-disable */
  render() {
    /*eslint-enable */
    const discountForm = this.state.coupons[this.state.currentCouponIndex];
    const detail = this.state.detail;
    if (!discountForm) return <div />;

    let disableConfirm = false;
    if (detail.recruit) {
      if (detail.recruit.endTime) {
        const date = serverStringToDate(detail.recruit.endTime);
        if (date < Date.now()) {
          disableConfirm = true;
        }
      }
      if (detail.recruit.startTime) {
        const date = serverStringToDate(detail.recruit.startTime);
        if (date > Date.now()) {
          disableConfirm = true;
        }
      }
    }

    const couponButtons = this.state.coupons.map((coupon, i) => {
      return (
        <Button onClick={this.switchCoupon.bind(this, i) } key={i}
          type={this.state.currentCouponIndex === i ? 'primary' : 'ghost'}
          >{coupon.subject}</Button>
      );
    }, this);

    let modalTop = 100;
    if (window.top !== window) {
      modalTop = window.top.scrollY - 100;
    }
    const filteredChannels = (discountForm.deliveryChannels || []).filter((item) => retailersDeliveryChannels[item] &&
      retailersDeliveryChannels[item].img !== '');
    const defaultImgs = ['https://zos.alipayobjects.com/rmsportal/cxnTetydUujNhpY.png',
      'https://zos.alipayobjects.com/rmsportal/YTKmarqkOBjPaSC.png'].map((url) => {
        return <img width="100%" src={url} />;
      });
    return (
      <div className="kb-groups-view">
        <h2 className="kb-page-title">活动详情</h2>
        <div className="app-detail-content-padding">
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              首页
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              活动详情
            </Breadcrumb.Item>
          </Breadcrumb>

          <div className="kb-detail-main">
            <div className="coupon-info">
              <div className="coupon-detail">
                <h4>
                  {detail.campaignName}
                  <StatusTag status={detail.displayStatus} />
                </h4>
                <p>{detail.deliveryChannelSlogan}</p>
                <p style={{ color: 'black' }}>{detail.startTime} ~{detail.endTime}</p>
                <p style={{ marginTop: 10 }}>
                  <span style={{ color: '#ff6600', fontWeight: 'bold' }}>{detail.crowdName}</span>
                  <span>参与限制{detail.receiveLimited}次/人  发放总量{detail.budgetAmount}张</span>
                </p>
              </div>
            </div>

            <p className="sub-title">
              优惠券设置
            </p>
            {
              (couponButtons.length > 1) ?
                <ButtonGroup style={{ margin: '0 0 10px 0' }}>
                  {couponButtons}
                </ButtonGroup>
                : null
            }
            <div>
              {
                discountForm.itemDiscountType === 'MONEY' ? <MoneyLayout data={discountForm} />
                  : <DiscountLayout data={discountForm} />
              }
            </div>

            <div>
              <p className="sub-title">投放渠道</p>
              <table className="kb-detail-table-6">
                <tbody>
                  <tr>
                    <td className="kb-detail-table-label">投放渠道</td>
                    <td style={{ width: 'auto' }}>
                      {
                        filteredChannels.length > 0 ?
                          filteredChannels.map((item, i) => {
                            if (retailersDeliveryChannels[item].img !== '') {
                              return (/** 商圈没有【专属优惠券】渠道，所以不需要判断专属人群 */
                                <span key={i}>{
                                  item === 'SHOP_DETAIL' ? '门店详情页，购物中心首页' :
                                    retailersDeliveryChannels[item].label}
                                  {retailersDeliveryChannels[item] && i !== filteredChannels.length - 1 ? ', ' : null}
                                </span>
                              );
                            }
                          }) : '门店详情页，购物中心首页'
                      }
                      <div style={{ display: 'inline-block', marginLeft: 10 }}>
                        <a href="#" onClick={this.togglePreview}>预览</a>
                        <Modal ref="modal"
                          visible={this.state.showPreview}
                          onCancel={this.togglePreview}
                          title="投放渠道预览"
                          width="800"
                          footer={[]}>
                          <Row type="flex" justify="space-around">
                            {
                              filteredChannels.length ?
                                filteredChannels.map((item, index) => {
                                  if (retailersDeliveryChannels[item].img !== '') {
                                    return (<Col key={index} span="7">
                                      {item === 'SHOP_DETAIL' ? '门店详情页，购物中心首页' : retailersDeliveryChannels[item].label}
                                      {
                                        item === 'SHOP_DETAIL' ? defaultImgs : <img width="100%" src={retailersDeliveryChannels[item].img}/>
                                      }
                                    </Col>);
                                  }
                                }) : <Col span="7">{defaultImgs}</Col>
                            }
                          </Row>
                        </Modal>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <p className="sub-title">创建须知</p>
              <table className="kb-detail-table-6">
                <tbody>
                  <tr>
                    <td className="kb-detail-table-label">参与门店</td>
                    <td style={{ width: 'auto' }}>
                      {
                        discountForm.shop && discountForm.shop.length ?
                          <span>{discountForm.shop.length} 家门店 <a href="#" onClick={this.toggleShopList2}>查看</a></span>
                          : null
                      }
                      <ShopListModal
                        title={'参与门店'}
                        visible={this.state.showShopList2}
                        onCancel={this.toggleShopList2}
                        style={{ top: modalTop }}
                        data={discountForm.shop}
                        />
                    </td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label">商户确认截止时间</td>
                    <td style={{ width: 'auto' }}>{detail.recruit && detail.recruit.endTime}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <hr style={{ backgroundColor: '#eee', height: 1, border: 'none', margin: '30px 3% 15px 3%' }} />
          <div style={{ padding: '15px 12%' }}>
            {
              (!this.state.hideButtons && detail.displayStatus === 'CAMP_CONFIRM') ? <Agree onConfirm={this.agree} disable={disableConfirm}
                onReject={this.reject} okText="确认活动"
                rejectTitle="驳回活动"
                rejectDisabled={this.state.rejectDisabled}
                /> : null
            }
            {
              !this.state.hideButtons && detail.auditStatus === 'AUDITING' && detail.displayStatus === 'CAMP_CLOSING' ? <Agree onConfirm={this.agreeOffline}
                onReject={this.rejectOffline} okText="确认下架" rejectTitle="驳回下架"
                disable={this.state.agreeOfflineDisabled} rejectDisabled={this.state.rejectOfflineDisabled}
                /> : null
            }
          </div>
        </div>
      </div>
    );
  },
});

export default MallActivityView;
