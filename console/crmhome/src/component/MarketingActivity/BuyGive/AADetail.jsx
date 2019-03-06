import React, {PropTypes} from 'react';
import {Breadcrumb, Modal} from 'antd';
import moment from 'moment';
import { retailersActivityStatus } from '../../MemberMarketing/config/AllStatus';
import { convertServerNumber } from '../../../common/utils';

const AADetail = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    return {
      showShopListModal: false,
      testLoading: false,
    };
  },

  hideShopList() {
    this.setState({ showShopListModal: false });
  },

  showShopList() {
    this.setState({ showShopListModal: true });
  },

  render() {
    const { discountForm } = this.props;
    const voucher = discountForm.voucherVOs[0];
    const itemDiscountRule = voucher.itemDiscountRule;
    const sendRule = itemDiscountRule.sendRules[0];

    const unit = discountForm.autoPurchase ? '次' : '张';

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
              <img src={voucher.voucherImg}/>
              <div className="coupon-detail">
                <h4>
                  {discountForm.campName}
                  {
                    discountForm.displayStatus &&
                    <span className={'status ' + retailersActivityStatus[discountForm.displayStatus].color}>
                      {retailersActivityStatus[discountForm.displayStatus].text}
                    </span>
                  }
                </h4>
                <p>
                  活动时间：{moment(discountForm.startTime).format('YYYY-MM-DD HH:mm')}~{moment(discountForm.endTime).format('YYYY-MM-DD HH:mm')}
                </p>
                <p>
                  买一送一（买A送A）
                </p>
              </div>
            </div>

            <p className="sub-title">活动基本信息</p>
            <table className="kb-detail-table-6">
              <tbody>
              <tr>
                <td className="kb-detail-table-label" style={{width: 28}}>券适用门店</td>
                <td colSpan="6">
                  <Modal title={'适用门店'}
                         visible={this.state.showShopListModal}
                         onCancel={this.hideShopList}
                         footer={[]}>
                    <div className="check-shop-list">
                      {
                        discountForm.cityShopVOs && discountForm.cityShopVOs.map((item, key) => {
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
                  {
                    voucher.shopIds && voucher.shopIds.length ? voucher.shopIds.length : 0
                  }
                  家门店&nbsp;&nbsp;
                  {
                    voucher.shopIds && voucher.shopIds.length && <a onClick={this.showShopList}>查看</a>
                  }
                </td>
              </tr>
              </tbody>
            </table>

            <p className="sub-title">活动商品设置</p>
            <table className="kb-detail-table-6">
              <tbody>
              <tr>
                <td className="kb-detail-table-label">优惠力度</td>
                <td>同一件SKU商品买{sendRule.buyCnt}件，送{sendRule.sendCnt}件</td>
                <td className="kb-detail-table-label">品牌名称</td>
                <td>{voucher.subTitle}</td>
                <td className="kb-detail-table-label">品牌logo</td>
                <td>
                  <img style={{height: 60}} src={voucher.logo} alt="品牌logo"/>
                </td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">活动商品名称</td>
                <td>{voucher.itemName}</td>
                <td className="kb-detail-table-label">商品SKU编码</td>
                <td>
                  <a href="#" onClick={(e)=> { e.preventDefault(); this.setState({showSKUCodeModal: true});}}>查看</a>
                </td>
                <td className="kb-detail-table-label">活动商品详情</td>
                <td>{voucher.itemText}</td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">活动商品图片</td>
                <td colSpan="6">
                  <img style={{height: 60}} src={voucher.voucherImg} alt="商品封面"/>
                  {
                    voucher.itemHeadImg && voucher.itemHeadImg.map((item, index) => <img style={{ height: 60 }} src={item} key={item + index} alt="商品详情图"/>)
                  }
                </td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">更多商品详情</td>
                <td colSpan="6">
                  <a href={voucher.itemLink} target="_blank">{voucher.itemLink}</a>
                </td>
              </tr>
              </tbody>
            </table>

            <p className="sub-title">活动规则设置</p>
            <table className="kb-detail-table-6">
              <tbody>
              <tr>
                <td className="kb-detail-table-label">1笔订单最多几件享受优惠</td>
                <td>
                  {
                    convertServerNumber(itemDiscountRule.totalLimitCnt) ? `最多可送${itemDiscountRule.totalLimitCnt}件` : '不限制'
                  }
                </td>
                <td className="kb-detail-table-label">1笔订单同一SKU商品最多送几次</td>
                <td>
                  {
                    convertServerNumber(sendRule.limitCnt) ? `最多可送${sendRule.limitCnt}件` : '不限制'
                  }
                </td>
                <td className="kb-detail-table-label">券是否需要领取</td>
                <td>{discountForm.autoPurchase ? '无需领取' : '需要领取'}</td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">{discountForm.autoPurchase ? '活动期间每人累计可参与几次' : '活动期间每人累计可领券几张'}</td>
                <td>{convertServerNumber(discountForm.participateLimited) ? `最多${discountForm.participateLimited}${unit}` : '不限制'}</td>
                <td className="kb-detail-table-label">{discountForm.autoPurchase ? '活动期间每人每天可参与几次' : '活动期间每人每天可领券几张'}</td>
                <td>{convertServerNumber(discountForm.dayParticipateLimited) ? `最多${discountForm.dayParticipateLimited}${unit}` : '不限制'}</td>
                <td className="kb-detail-table-label">券有效期</td>
                <td>
                  {(voucher.relativeTime && !discountForm.autoPurchase) && `领取${voucher.relativeTime}日内有效`}
                  {(!voucher.relativeTime && !discountForm.autoPurchase) && `${voucher.startTime}到${voucher.endTime}`}
                </td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">券发放总量</td>
                <td colSpan="6">
                  {
                    convertServerNumber(discountForm.budgetAmount) ? `${discountForm.budgetAmount}张` : '不限制'
                  }
                </td>
              </tr>
              {
                !discountForm.autoPurchase ?
                <tr>
                  <td className="kb-detail-table-label">是否可以转赠</td>
                  <td colSpan="6">
                    {(discountForm.voucherVOs[0] || {}).donateFlag === 'true' && '是'}
                    {(discountForm.voucherVOs[0] || {}).donateFlag === 'false' && '否'}
                  </td>
                </tr> : null
              }
              <tr>
                <td className="kb-detail-table-label">使用说明</td>
                <td colSpan="6">
                  {
                    voucher.useInstructions && voucher.useInstructions.map((item, i) => {
                      return (
                        <p key={i}>{item}</p>
                      );
                    })
                  }
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <Modal title="商品编码"
          visible={this.state.showSKUCodeModal}
          onCancel={() => { this.setState({showSKUCodeModal: false}); }}
          footer={[]}
        >
          <div style={{maxHeight: 200, overflowY: 'auto'}}>
            {
              (voucher.itemIds || []).map((p, i) => {
                return <p key={i}>{p}</p>;
              })
            }
          </div>
        </Modal>
      </div>
    );
  },
});

export default AADetail;
