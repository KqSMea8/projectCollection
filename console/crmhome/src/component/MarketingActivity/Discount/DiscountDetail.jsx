import React, { PropTypes, createClass } from 'react';
import { message, Modal, Breadcrumb, Row, Col, Alert, Button } from 'antd';
import ajax from '../../../common/ajax';
import { customLocation, getValueFromQueryString, formatAvailableVoucherTime, formatForbiddenVoucherTime } from '../../../common/utils';
import VoucherTitle from '../common/VoucherTitle';
import ShopListModal from '../../mall/common/ShopListModal';

function getUseCondition(voucher) {
  let useCondtion;
  if (voucher.useCondtion) {
    useCondtion = `订单满 ${voucher.useCondtion} 元可享用`;
  }
  if (voucher.maxDiscountNum) {
    useCondtion = (!useCondtion ? '' : (useCondtion + '，且'))
      + `该商品最高优惠 ${voucher.maxDiscountNum} 件`;
  }
  return useCondtion;
}

export default createClass({
  propTypes: {
    params: PropTypes.object,
  },
  getInitialState() {
    return {
      loading: true,
      data: undefined,
      isFromKb: getValueFromQueryString('fromSource') === 'KB_SERVICE',
      showShopListModal: false,
    };
  },
  componentDidMount() {
    this.fetch();
  },
  fetch() {
    if (!this.state.loading) {
      this.setState({ loading: true });
    }
    let url;
    if (!this.state.isFromKb) {
      url = `${window.APP.ownUrl}/goods/itempromo/campaignDetail.json?campId=${this.props.params.id}`;
    } else {
      url = `${window.APP.ownUrl}/goods/koubei/promotionNewCampDetail.json?campId=${this.props.params.id}`;
    }
    ajax({
      url,
      method: 'get',
      type: 'json',
      success: (res) => {
        if (!res) {
          return;
        }
        if (res.result) {
          this.setState({ loading: false, data: res.discountForm });
        } else {
          message.error(res.errorMsg || '获取数据失败', 3);
        }
      },
    });
  },
  handleOffline() {
    const self = this;
    Modal.confirm({
      title: '提示',
      content: '下架后活动将立即结束，已发出的券在有效期内依然可以使用，是否继续？',
      onOk() {
        const url = window.APP.ownUrl + '/goods/itempromo/offlineCampaign.json?campId=' + self.props.params.id;
        self.setState({
          loading: true,
        });
        ajax({
          url: url,
          method: 'get',
          type: 'json',
          success: (result) => {
            if (!result) {
              return;
            }
            if (result.result) {
              message.success('下架成功', 3);
              customLocation('/goods/itempromo/activityList.htm');
            } else {
              self.setState({loading: false});
              if (result.errorMsg) {
                message.error(result.errorMsg, 3);
              }
            }
          },
        });
      },
    });
  },
  confirmBtn(_key) {
    const self = this;
    const urlMap = {
      allowConfirm: '/goods/itempromo/agreePromotion.json',
      allowModifyConfirm: '/goods/itempromo/agreePromoModify.json',
      allowOfflineConfirm: '/goods/itempromo/agreePromoOffline.json',
    };
    const confirmUrl = urlMap[_key];
    // confirm ajax
    self.setState({
      loading: true,
    });
    ajax({
      url: confirmUrl,
      method: 'post',
      data: {
        campId: this.props.params.id,
      },
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status === 'true') {
          message.success('确认成功', 3);
          customLocation('/goods/itempromo/activityList.htm');
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
    const urlMap = {
      allowReject: '/goods/itempromo/rejectPromotion.json',
      allowModifyReject: '/goods/itempromo/rejectPromoModify.json',
      allowOfflineReject: '/goods/itempromo/rejectPromoOffline.json',
    };
    const rejectUrl = urlMap[_key];
    // reject ajax
    self.setState({
      loading: true,
    });
    ajax({
      url: rejectUrl,
      method: 'post',
      data: {
        campId: this.props.params.id,
      },
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status === 'true') {
          message.success('拒绝成功', 3);
          customLocation('/goods/itempromo/activityList.htm');
        } else {
          self.setState({loading: false});
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
    });
  },

  hideShopList() {
    this.setState({ showShopListModal: false });
  },
  showShopList() {
    this.setState({ showShopListModal: true });
  },
  render() {
    let modalTop = 100;
    if (window.top !== window) {
      modalTop = window.top.scrollY - 100;
    }
    const { data, loading, isFromKb } = this.state;
    if (!data || loading) return null;
    const voucher = data.voucherVOs[0];
    let typeLabel = '优惠方式';
    let promoType = voucher.promotionType === 'ALL_ITEM' ? '全场' : '单品';
    let promoContent = '';
    if (voucher.type === 'RATE') {
      typeLabel = '券折扣';
      if (promoType === '全场') promoType = '全场折扣';
      else promoType = '单品折扣券';
      promoContent = `${voucher.rate} 折扣`;
    } else if (voucher.type === 'MONEY') {
      typeLabel = '券面额';
      if (promoType === '全场') promoType = '全场立减';
      else promoType = '单品优惠-立减固定金额';
      promoContent = `${voucher.worthValue} 元`;
    } else if (voucher.type === 'REDUCETO') {
      typeLabel = '换购券';
      promoType = '单品优惠-减至固定金额';
      promoContent = `原价 ${voucher.originalPrice} 元，优惠价 ${voucher.worthValue} 元`;
    }
    const useCondition = getUseCondition(voucher);
    return (
      <div className="kb-groups-view">
        {!isFromKb && <h2 className="kb-page-title">活动管理</h2>}
        <div className="app-detail-content-padding">
          <Breadcrumb separator=">">
            <Breadcrumb.Item><a href="/goods/itempromo/activityList.htm">活动管理</a></Breadcrumb.Item>
            <Breadcrumb.Item><a href="/goods/itempromo/activityManage.htm">营销活动</a></Breadcrumb.Item>
            <Breadcrumb.Item>实时优惠</Breadcrumb.Item>
          </Breadcrumb>
          <div className="kb-detail-main">
          {
            data.offlineReason && <Row><Col><Alert message="活动下架"
              description={data.offlineReason} type="info" showIcon />
            </Col></Row>
          }
          </div>
          <VoucherTitle {...data} logo={voucher.voucherImg} voucherName={voucher.name} />
          <p className="sub-title">活动设置</p>
          <style type="text/css">{'.kb-detail-table-label {background-color: rgb(244,244,244);}.kb-detail-table-6{font-size:12px;}'}</style>
          <table className="kb-detail-table-6">
            <tbody>
              <tr>
                <td className="kb-detail-table-label">券种类</td>
                <td>{promoType}</td>
                <td className="kb-detail-table-label">
                {typeLabel}
                </td>
                <td>{promoContent}</td>
                <td className="kb-detail-table-label">品牌名称</td>
                <td>{voucher.subTitle}</td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">使用条件</td>
                <td>{useCondition}</td>
                <td className="kb-detail-table-label">券有效期</td>
                <td>
                {
                  voucher.relativeTime ? <span>领取后 {voucher.relativeTime} 日内有效</span>
                  : <span>{voucher.startTime} ~ {voucher.endTime}</span>
                }
                </td>
                <td className="kb-detail-table-label">券适用门店</td>
                <td>
                  {voucher.cityShopVOs.length &&
                  <ShopListModal title={'券适用门店'}
                    visible={this.state.showShopListModal}
                    onCancel={this.hideShopList}
                    style={{ top: modalTop }}
                    data={voucher.cityShopVOs}
                    isCityShop="true"
                    />}
                  {voucher.shopIds && voucher.shopIds.length ? voucher.shopIds.length : 0} 家门店 {voucher.shopIds && voucher.shopIds.length && <a onClick={this.showShopList}>查看</a>}
                </td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">发放总量</td>
                <td>{voucher.voucherCount}</td>
                <td className="kb-detail-table-label">券可用时段</td>
                <td>{voucher.availableVoucherTime && voucher.availableVoucherTime.length > 0 ?
                  formatAvailableVoucherTime(voucher.availableVoucherTime)
                  : '不限制'}</td>
                <td className="kb-detail-table-label">不可用日期</td>
                <td>{voucher.forbiddenVoucherTime ? formatForbiddenVoucherTime(voucher.forbiddenVoucherTime) : '不限制'}</td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">使用说明</td>
                <td colSpan="5">{voucher.useInstructions.join('；\n')}</td>
              </tr>
            </tbody>
          </table>
          <div style={{ height: 30 }}></div>
          {voucher.promotionType === 'SINGLE_ITEM' &&
          <table className="kb-detail-table-6">
            <tbody>
              <tr>
                <td className="kb-detail-table-label">商品名称</td>
                <td>{voucher.itemName}</td>
                <td className="kb-detail-table-label">商品详情文案</td>
                <td>{voucher.itemText}</td>
                <td className="kb-detail-table-label">商品详情图片</td>
                <td style={{ overflow: scroll }}>
                <div style={{ display: 'flex' }}>
                {
                  voucher.itemHeadImg && voucher.itemHeadImg.length &&
                  voucher.itemHeadImg.map((img, i) =>
                    <img style={{ height: 60 }} src={img} key={`prdimg_${i}`} />
                  )
                }
                </div>
                </td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">更多商品详情</td>
                <td colSpan="5"><a href={voucher.itemLink} target="_blank">{voucher.itemLink}</a></td>
              </tr>
            </tbody>
          </table>
          }
        </div>
        <div style={{ textAlign: 'center' }}>
          { data.allowOffline && <Button type="primary" onClick={this.handleOffline}>下架</Button> }
          { data.allowConfirm && (
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
          )}
          {
            data.allowModifyConfirm && (
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
            data.allowOfflineConfirm && (
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
    );
  },
});
