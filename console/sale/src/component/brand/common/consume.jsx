import React, {PropTypes} from 'react';
import { Tabs, Modal } from 'antd';
import { retailersActivityType } from './AllStatus';

const TabPane = Tabs.TabPane;

const ConsumeView = React.createClass({
  propTypes: {
    discountForm: PropTypes.object,
  },
  getInitialState() {
    return {
      showGoods: false,
      showVoucherGoods: false,
    };
  },

  onCancelGoods() {
    this.setState({
      showGoods: false,
    });
  },

  showGoodsView() {
    this.setState({
      showGoods: true,
    });
  },

  renderVoucherTable( item, itemKey ) {
    let limit;
    if (item.itemDiscountType === 'RATE' || item.itemDiscountType === 'REDUCETO' ) {
      limit = '同一件商品满' + item.minItemNum + '件可享受优惠，且该商品最高优惠' + item.maxDiscountItemNum + '件';
    } else {
      limit = item.minimumAmount ? '满' + item.minimumAmount + '元可用' : '不限制';
    }

    let discountDisplay;
    if (item.itemDiscountType === 'RATE') {
      discountDisplay = `${item.rate}折`;
    } else if (item.itemDiscountType === 'REDUCETO') {
      discountDisplay = '减至' + item.reduceToPrice + '元';
    } else if (item.itemDiscountType === 'MONEY') {
      discountDisplay = '立减' + item.couponValue + '元';
    } else {
      discountDisplay = '兑换券';
    }

    return (
      <table className="kb-detail-table-6">
        <tbody>
        <tr>
          { /* 消费送，券类型全都为单品券 */ }
          <td className="kb-detail-table-label">券类型</td>
          <td>{item.goodsIds && item.goodsIds.length > 0 ? '单品' : '全场' }{retailersActivityType[item.itemDiscountType]}</td>

          <td className="kb-detail-table-label">
            { item.itemDiscountType === 'RATE' ? '折扣力度' : '优惠方式'}
          </td>
          <td>
            { discountDisplay }
          </td>
          <td className="kb-detail-table-label">礼品张数</td>
          <td>{item.consumeSendNum}</td>
        </tr>

        <tr>
          <td className="kb-detail-table-label">商品名称</td>
          <td>{item.subject}</td>
          <td className="kb-detail-table-label">品牌名称</td>
          <td>{item.brandName}</td>
          <td className="kb-detail-table-label">品牌logo</td>
          <td><img src={item.logoFixUrl}/></td>
        </tr>

        <tr>
          <td className="kb-detail-table-label">商品详情</td>
          <td>{item.activityName}</td>
          <td className="kb-detail-table-label">商品图片</td>
          <td>
            { item.activityImgs && item.activityImgs.map((img, i) => {
              return (
                  <img key={i} src={img}/>
              );
            })}
          </td>
          <td className="kb-detail-table-label">更多商品详情</td>
          <td>{item.activityLink}</td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">使用条件</td>
          <td>{limit}</td>
          {
            item.itemDiscountType === 'RATE' && [
              (<td key={'rate-label'} className="kb-detail-table-label">封顶优惠金额</td>),
              (<td key={'rate-limit'}>{item.limitAmount ? `限制封顶金额${item.limitAmount}元` : '不限制'}</td>)
            ]
          }
          {
            item.itemDiscountType === 'REDUCETO' && [
              (<td key={'rate-label'} className="kb-detail-table-label">封顶优惠件数</td>),
              (<td key={'rate-limit'}>{item.limitNum ? `限制封顶件数${item.limitNum}件` : '不限制'}</td>)
            ]
          }
          <td className="kb-detail-table-label">券有效期</td>
          <td>{
            item.validTimeType === 'RELATIVE' ?
                (<span>领取后{item.validPeriod}日内有效</span>) :
                (<span>{item.validTimeFrom} - {item.validTimeTo}</span>)
          }
          </td>
        </tr>
        {
          (item.voucherGoodsIds && item.voucherGoodsIds.length > 0) &&
          <tr>
            <td key={'item-code'} className="kb-detail-table-label">商品编码</td>
            <td key={'code-list'}>
                  <span onClick={() => {
                    const state = this.state;
                    state[`showGoods${itemKey}`] = true;
                    this.setState(state);
                  }} style={{color: '#2db7f5', marginLeft: 10, cursor: 'pointer'}}>查看</span>
              <Modal key={itemKey}
                     title={'商品编码'}
                     visible={this.state[`showGoods${itemKey}`]}
                     onCancel={() => {
                       const state = this.state;
                       state[`showGoods${itemKey}`] = false;
                       this.setState(state);
                     }}
                     footer={[]}>
                <div style={{maxHeight: 200, overflow: 'auto'}}>
                  {
                    item.voucherGoodsIds.map((good, i) => {
                      return (
                          <p key={i}>{good}</p>
                      );
                    })
                  }
                </div>
              </Modal>
            </td>
          </tr>
        }
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
    );
  },

  render() {
    const { discountForm } = this.props;
    return (
        <div>
          <p className="sub-title">礼包设置</p>
          <Tabs defaultActiveKey={'1'}>
            {
              discountForm.vouchers.map((item, key) => {
                return (
                    <TabPane tab={`礼品${key + 1}`} key={key + 1}>
                      { this.renderVoucherTable(item, key) }
                    </TabPane>
                );
              })
            }
          </Tabs>

          <p className="sub-title">活动设置</p>
          <table className="kb-detail-table-6" style={{marginTop: 10}}>
            <tbody>
            <tr>
              <td className="kb-detail-table-label">活动时间</td>
              <td>
                {discountForm.startTime} - {discountForm.endTime}
              </td>
              <td className="kb-detail-table-label">参与限制</td>
              <td>
                <p>每日参与限制：{discountForm.dayReceiveLimited ? discountForm.dayReceiveLimited + '次' : '不限制'}</p>
                <p>总共参与限制：{discountForm.receiveLimited ? discountForm.receiveLimited + '次' : '不限制'}</p>
              </td>
              <td className="kb-detail-table-label">商品限制</td>
              <td>
                {
                  discountForm.consumeGoodsIds && discountForm.consumeGoodsIds.length > 0 ? [
                    (<span key={'consume-btn'} onClick={this.showGoodsView} style={{color: '#2db7f5', marginLeft: 10, cursor: 'pointer'}}>查看</span>),
                    (<Modal key={'consume-code'} title={'商品编码'}
                            visible={this.state.showGoods}
                            onCancel={this.onCancelGoods}
                            footer={[]}>
                      <div style={{maxHeight: 200, overflow: 'auto'}}>
                        {
                          discountForm.consumeGoodsIds.map((good, i) => {
                            return (
                                <p key={i}>{good}</p>
                            );
                          })
                        }
                      </div>
                    </Modal>)
                  ] : '不限制'
                }
              </td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">消费限制</td>
              <td colSpan="5">{!discountForm.minimumAmount || discountForm.minimumAmount === 0 ? '不限制' : '单笔消费商品满' + discountForm.minimumAmount + '元送礼包'}</td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">活动数量</td>
              <td colSpan="5">{ discountForm.budgetAmount ? discountForm.budgetAmount : '不限制' }</td>
            </tr>
            </tbody>
          </table>
        </div>
    );
  },
})
;

export default ConsumeView;
