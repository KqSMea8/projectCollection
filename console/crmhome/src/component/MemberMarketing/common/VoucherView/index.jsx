import React, {PropTypes} from 'react';
import { Tabs, Modal } from 'antd';
import { retailersActivityType, USE_MODE } from '../../config/AllStatus';
import {formatAvailableVoucherTime, formatForbiddenVoucherTime} from '../../../../common/utils';

const TabPane = Tabs.TabPane;

const VoucherView = React.createClass({
  propTypes: {
    discountForm: PropTypes.object,
  },

  getInitialState() {
    return {
    };
  },

  /*eslint-disable */
  renderVoucherTable(discountForm, item, itemKey ) {
    /*eslint-enable */
    let limit;
    if (item.itemDiscountType === 'RATE' || item.itemDiscountType === 'REDUCETO' ) {
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
        <p className="sub-title">活动商品设置</p>
        <table className="kb-detail-table-6">
          <tbody>
          <tr>
            <td className="kb-detail-table-label">券类型</td>
            <td>{item.goodsIds && item.goodsIds.length > 0 ? '单品' : '全场' }{retailersActivityType[item.itemDiscountType]}</td>
            <td className="kb-detail-table-label">品牌名称</td>
            <td>{item.brandName}</td>
            <td className="kb-detail-table-label">品牌logo</td>
            <td>
              <img src={item.logoFixUrl}/>
            </td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">商品名称</td>
            <td>{item.subject}</td>
            <td className="kb-detail-table-label">商品详情</td>
            <td>{item.activityName}</td>
            <td className="kb-detail-table-label">商品详情图片</td>
            <td>
              { item.activityImgs && item.activityImgs.map((img, i) => {
                return (
                <img key={i} src={img}/>
                  );
              })}
            </td>
          </tr>
          {
            item.multiUseMode && <tr>
              <td className="kb-detail-table-label">券叠加类型</td>
              <td colSpan="5">{USE_MODE[item.multiUseMode]}</td>
            </tr>
          }

          { discountForm.goodsIds.length > 0 &&
          <tr>
            <td className="kb-detail-table-label">商品SKU编码</td>
            <td colSpan="5">
              <span onClick={()=> {
                const state = this.state;
                state[`showGoods${itemKey}`] = true;
                this.setState(state);
              }} style={{color: '#2db7f5', marginLeft: 10, cursor: 'pointer'}}>查看</span>
              <Modal title={'商品SKU编码'}
                     visible={this.state[`showGoods${itemKey}`]}
                     onCancel={() => {
                       const state = this.state;
                       state[`showGoods${itemKey}`] = false;
                       this.setState(state);
                     }}
                     footer={[]}>
                <div style={{maxHeight: 200, overflow: 'auto'}}>
                  {
                    discountForm.goodsIds.map((good, i) => {
                      return (
                          <p key={i}>{good}</p>
                      );
                    })
                  }
                </div>
              </Modal>
            </td>
          </tr>}
          <tr>
            <td className="kb-detail-table-label">更多商品详情</td>
            <td colSpan="5">{item.activityLink}</td>
          </tr>

          { discountForm.goodsIds.length === 0 &&
          <tr>
            <td className="kb-detail-table-label">领取当日可用</td>
            <td>{(item.actived === '0' || !item.actived) ? '是' : '否'}</td>
            <td className="kb-detail-table-label">券可用时段</td>
            <td>{(item.availableTimes.length !== 0) ? formatAvailableVoucherTime(item.availableTimes) : '不限制'}</td>
            <td className="kb-detail-table-label">不可用日期</td>
            <td>{item.forbiddenTime ? formatForbiddenVoucherTime(item.forbiddenTime) : '不限制'}</td>
          </tr> }

          { (item.cityShop && item.cityShop.length > 0) && (
          <tr>
            <td className="kb-detail-table-label">券适用门店</td>
            <td colSpan="5">
              <div>
                {item.shop.length}家门店
                <span onClick={()=> {
                  const state = this.state;
                  state[`showShops${itemKey}`] = true;
                  this.setState(state);
                }} style={{ color: '#2db7f5', marginLeft: 10, cursor: 'pointer' }}>查看</span>

                <Modal title={'券适用门店'}
                       visible={this.state[`showShops${itemKey}`]}
                       onCancel={() => {
                         const state = this.state;
                         state[`showShops${itemKey}`] = false;
                         this.setState(state);
                       }}
                       footer={[]}>
                  <div className="check-shop-list">
                    {
                      item.cityShop.map((shopItem, key) => {
                        return (
                        <dl key={key}>
                          <dt>{shopItem.cityName}</dt>
                          {
                            shopItem.shops.map((shop, i) => {
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
            </td>
          </tr>) }
          </tbody>
        </table>

        <p className="sub-title">活动规则设置</p>
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
                (item.limitAmount && [
                  (<td key={'rate-label'} className="kb-detail-table-label">封顶优惠金额</td>),
                  (<td key={'rate-limit'}>{item.limitAmount ? `限制封顶金额${item.limitAmount}元` : '不限制'}</td>)]),
                (item.limitNum && [
                  (<td key={'rate-label'} className="kb-detail-table-label">封顶优惠件数</td>),
                  (<td key={'rate-limit'}>{item.limitNum ? `限制封顶件数${item.limitNum}件` : '不限制'}</td>)]),
                (!item.limitNum && !item.limitAmount &&
                  [(<td key={'rate-label'} className="kb-detail-table-label">封顶优惠件数</td>),
                    (<td key={'rate-limit'}>{'不限制'}</td>)]),
              ]
            }
          </tr>
          <tr>
            {
              discountForm.type === 'CONSUME_SEND' && [
                (discountForm.consumeGoodsIds && discountForm.consumeGoodsIds.length > 0 &&
                  [(<td key={1} className="kb-detail-table-label">消费商品编码</td>),
                    (<td key={2} style={{width: 'auto'}}>{discountForm.consumeGoodsIds}</td>)]),
                (item.consumeMinCost &&
                  [(<td key={3} className="kb-detail-table-label">消费送券条件</td>),
                    (<td key={4}>满{item.consumeMinCost}元发券</td>)]),
                (item.consumeSendNum &&
                  [(<td key={5} className="kb-detail-table-label">消费送券数量</td>),
                    (<td key={6}>{item.consumeSendNum}张</td>)
                    ])
              ]
            }
          </tr>
          <tr>
            <td className="kb-detail-table-label">参与限制</td>
            <td>{discountForm.receiveLimited ? discountForm.receiveLimited : '不限制'}</td>
            <td className="kb-detail-table-label">每日参与限制</td>
            <td>{discountForm.dayReceiveLimited ? discountForm.dayReceiveLimited : '不限制'}</td>
            {
              discountForm.type !== 'REAL_TIME_SEND' && [
                (<td key={'time-label'} className="kb-detail-table-label">券有效期</td>),
                (<td key={'time-content'} >{
                  item.validTimeType === 'RELATIVE' ?
                      (<span>{`领取后${item.validPeriod}日内有效`}</span>) :
                      (<span>{item.validTimeFrom} - {item.validTimeTo}</span>)
                }
                </td>)]
            }
          </tr>
          <tr>
            <td className="kb-detail-table-label">发放总量</td>
            <td>{discountForm.budgetAmount && discountForm.budgetAmount !== '999999999' ? discountForm.budgetAmount : '不限制'}</td>
            {
              discountForm.type === 'DIRECT_SEND' && [(<td className="kb-detail-table-label">每天发券数量</td>),
              (<td>{discountForm.dayAvailableNum ? discountForm.dayAvailableNum : '不限制'}</td>)]
            }
            { discountForm.type !== 'REAL_TIME_SEND' && [
              (<td className="kb-detail-table-label">券是否可以转赠</td>),
              (<td colSpan={discountForm.type === 'DIRECT_SEND' ? 0 : 3}>{item.donateFlag ? '是' : '否'}</td>)]
            }

          </tr>
          { (!discountForm.crowdName && item.itemDiscountType !== 'MONEY') && <tr>
            <td className="kb-detail-table-label">订单最低消费</td>
            <td>{item.orderMinimumAmount ? '满' + item.orderMinimumAmount + '元可参与' : '不限制'}</td>
          </tr> }
          <tr>
            <td className="kb-detail-table-label">使用说明</td>
            <td colSpan="5">
              {
                item.descList && item.descList.map((desc, i) => {
                  return (
                      <p key={i}>{desc}</p>
                  );
                })
              }
            </td>
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
              { this.renderVoucherTable(discountForm, item, key) }
            </TabPane>
              );
          })
        }
      </Tabs>) : this.renderVoucherTable(discountForm, discountForm.vouchers[0], 0);
  },
})
;

export default VoucherView;
