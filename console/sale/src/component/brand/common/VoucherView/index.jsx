import React, {PropTypes} from 'react';
import { Tabs, Modal } from 'antd';
import { retailersActivityType } from '../AllStatus';
import {formatAvailableVoucherTime, formatForbiddenVoucherTime} from '../brandUtils';

const TabPane = Tabs.TabPane;

const VoucherView = React.createClass({
  propTypes: {
    discountForm: PropTypes.object,
  },
  getInitialState() {
    return {
      showGoods: false,
      showShopListModal: false,
    };
  },
  showGoodsView() {
    this.setState({
      showGoods: true,
    });
  },
  onCancelGoods() {
    this.setState({
      showGoods: false,
    });
  },
  onCancelShop() {
    this.setState({
      showShopListModal: false,
    });
  },
  showShopList() {
    this.setState({
      showShopListModal: true,
    });
  },
  /*eslint-disable */
  renderVoucherTable(discountForm, item ) {
    /*eslint-enable */
    let limit;
    if (item.itemDiscountType === 'RATE' || item.itemDiscountType === 'REDUCETO') {
      limit = '同一件商品满' + item.minItemNum + '件可享受优惠，且该商品最高优惠' + item.maxDiscountItemNum + '件';
    } else {
      limit = item.minimumAmount ? '活动单品满' + item.minimumAmount + '元可用' : '不限制';
    }

    let discountDisplay;
    if (item.itemDiscountType === 'RATE') {
      discountDisplay = `${item.rate}折`;
    } else if (item.itemDiscountType === 'REDUCETO') {
      discountDisplay = '减至' + item.reduceToPrice + '元';
    } else {
      discountDisplay = '立减' + item.couponValue + '元';
    }

    return (
        <div>
          <p className="sub-title">优惠券设置</p>
          <table className="kb-detail-table-6">
            <tbody>
            <tr>
              <td className="kb-detail-table-label">券类型</td>
              <td>{item.goodsIds && item.goodsIds.length > 0 ? '单品' : '全场' }{retailersActivityType[item.itemDiscountType]}</td>
              <td className="kb-detail-table-label">商品名称</td>
              <td>{item.subject}</td>
              <td className="kb-detail-table-label">品牌名称</td>
              <td>{item.brandName}</td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">
                { item.itemDiscountType === 'RATE' ? '折扣力度' : '优惠方式'}
              </td>
              <td>
                { discountDisplay }
              </td>
              <td className="kb-detail-table-label">品牌logo</td>
              <td>
                <img src={item.logoFixUrl}/>
              </td>
              <td className="kb-detail-table-label">商品详情图片</td>
              <td>
                { item.activityImgs && item.activityImgs.map((img, i) => {
                  return (
                      <img key={i} src={img}/>
                  );
                })}
              </td>
            </tr>
            {discountForm.goodsIds.length > 0 ?
                <tr>
                  <td className="kb-detail-table-label">商品编码</td>
                  {
                    <td>
                <span onClick={this.showGoodsView}
                      style={{color: '#2db7f5', marginLeft: 10, cursor: 'pointer'}}>查看</span>
                      <Modal title={'优惠单品列表'}
                             visible={this.state.showGoods}
                             onCancel={this.onCancelGoods}
                             footer={[]}>
                        {
                          discountForm.goodsIds.map((good, i) => {
                            return (
                                <p key={i}>{good}</p>
                            );
                          })
                        }
                      </Modal>
                    </td>
                  }
                  <td className="kb-detail-table-label">商品详情文案</td>
                  <td>{item.activityName}</td>
                  <td className="kb-detail-table-label">更多商品详情</td>
                  <td>{item.activityLink}</td>
                </tr> : '' }
            {discountForm.goodsIds.length === 0 ?
                <tr>
                  <td className="kb-detail-table-label">领取当日可用</td>
                  <td>{(item.actived === '0' || !item.actived) ? '是' : '否'}</td>
                  <td className="kb-detail-table-label">券可用时段</td>
                  <td>{(item.availableTimes.length !== 0) ? formatAvailableVoucherTime(item.availableTimes) : '不限制'}</td>
                  <td className="kb-detail-table-label">不可用日期</td>
                  <td>{item.forbiddenTime ? formatForbiddenVoucherTime(item.forbiddenTime) : '不限制'}</td>
                </tr> : '' }
            <tr>
              <td className="kb-detail-table-label">使用条件</td>
              <td>{limit}</td>
              {
                discountForm.type !== 'REAL_TIME_SEND' ? [
                  (<td className="kb-detail-table-label">券有效期</td>),
                  (<td>{
                    item.validTimeType === 'RELATIVE' ? [
                      (<span>领取后{item.validPeriod}日内有效</span>)] : [
                      (<span>{item.validTimeFrom} - {item.validTimeTo}</span>)]
                  }
                  </td>)] : ''
              }

              <td className="kb-detail-table-label">使用说明</td>
              <td>
                {
                  item.descList && item.descList.map((desc, i) => {
                    return (
                        <p key={i}>{desc}</p>
                    );
                  })
                }
              </td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">券适用门店</td>
              <td >
                { item.cityShop && item.cityShop.length > 0 ? (
                <div>
                  {item.shop.length}家门店
                  <span onClick={this.showShopList} style={{ color: '#2db7f5', marginLeft: 10, cursor: 'pointer' }}>查看</span>

                  <Modal title={'券适用门店'}
                         visible={this.state.showShopListModal}
                         onCancel={this.onCancelShop}
                         footer={[]}>
                    <div className="check-shop-list">
                      {
                        item.cityShop.map((shopItem, key) => {
                          return (
                            <dl key={key}>
                              <dt>{shopItem.cityName}</dt>
                              {
                                  shopItem.shops.map((shop, i) => {
                                    const shopTitle = shop.name + '(' + shop.id + ')';
                                    return (
                                      <dd key={i}>{shopTitle}</dd>
                                    );
                                  })
                               }
                            </dl>
                          );
                        })
                      }
                    </div>
                  </Modal>
                </div>) : null }
              </td>
            </tr>
            </tbody>
          </table>

          <p className="sub-title">活动规则</p>
          <table className="kb-detail-table-6" style={{marginTop: 10}}>
            <tbody>
            <tr>
              <td className="kb-detail-table-label">
                { item.itemDiscountType === 'RATE' ? '折扣力度' : '优惠方式'}
              </td>
              <td>
                { discountDisplay }
              </td>
              <td className="kb-detail-table-label">使用条件</td>
              <td>{limit}</td>
              {
                (item.itemDiscountType === 'RATE' || item.itemDiscountType === 'REDUCETO') && [
                  (item.limitAmount &&
                    [(<td key={'rate-label'} className="kb-detail-table-label">封顶优惠金额</td>),
                      (<td key={'rate-limit'}>{item.limitAmount ? `限制封顶金额${item.limitAmount}元` : '不限制'}</td>)]),
                  (item.limitNum &&
                    [(<td key={'rate-label'} className="kb-detail-table-label">封顶优惠件数</td>),
                      (<td key={'rate-limit'}>{item.limitNum ? `限制封顶件数${item.limitNum}件` : '不限制'}</td>)
                      ])
                ]
              }
            </tr>
            <tr>
              {
                discountForm.type === 'CONSUME_SEND' ? [
                  (discountForm.consumeGoodsIds.length > 0 &&
                  [(<td key={1} className="kb-detail-table-label">消费商品编码</td>),
                    (<td key={2} style={{width: 'auto'}}>{discountForm.consumeGoodsIds}</td>)]),
                  (item.consumeMinCost &&
                  [(<td key={3} className="kb-detail-table-label">消费送券条件</td>),
                    (<td key={4}>满{item.consumeMinCost}元发券</td>)]),
                  (item.consumeSendNum &&
                  [(<td key={5} className="kb-detail-table-label">消费送券数量</td>),
                    (<td key={6}>{item.consumeSendNum}张</td>)
                  ])
                ] : null
              }
            </tr>
            <tr>
              <td className="kb-detail-table-label">发放总量</td>
              <td>{discountForm.budgetAmount ? discountForm.budgetAmount : '不限制'}</td>
              <td className="kb-detail-table-label">参与限制</td>
              <td>{discountForm.receiveLimited ? discountForm.receiveLimited : '不限制'}</td>
              <td className="kb-detail-table-label">每日参与限制</td>
              <td>{discountForm.dayReceiveLimited ? discountForm.dayReceiveLimited : '不限制'}</td>
            </tr>
             <tr>
              <td className="kb-detail-table-label">每天发券数量</td>
              <td>{discountForm.dayAvailableNum ? discountForm.dayAvailableNum : '不限制'}</td>
              <td className="kb-detail-table-label">订单最低消费</td>
              <td>{item.orderMinimumAmount ? '满' + item.orderMinimumAmount + '元可参与' : '不限制'}</td>
            </tr>
            </tbody>
          </table>
        </div>
    );
  },
  render() {
    const { discountForm } = this.props;
    return discountForm.vouchers && discountForm.vouchers.length > 1 ?
        (<Tabs defaultActiveKey={'1'}>
          {
            discountForm.vouchers.map((item, key) => {
              return (
                  <TabPane tab={`券${key + 1}`} key={key + 1}>
                    { this.renderVoucherTable(discountForm, item) }
                  </TabPane>
              );
            })
          }
        </Tabs>) : this.renderVoucherTable(discountForm, discountForm.vouchers[0]);
  },
});

export default VoucherView;
