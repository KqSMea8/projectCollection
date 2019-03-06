import React, {PropTypes} from 'react';
import { Modal, Row, Col } from 'antd';


const BargainView = React.createClass({
  propTypes: {
    discountForm: PropTypes.object,
  },

  getInitialState() {
    return {
      showGoodsIds: false,
      showShops: false,
    };
  },

  /*eslint-disable */
  render() {
    const { discountForm } = this.props;

    return (
      <div>
        <p className="sub-title">活动商品设置</p>
        <table className="kb-detail-table-6">
          <tbody>
          <tr>
            <td className="kb-detail-table-label">品牌名称</td>
            <td>{discountForm.brandName}</td>
            <td className="kb-detail-table-label">品牌logo</td>
            <td>
              <img src={discountForm.logoFixUrl}/>
            </td>
            {
              discountForm.itemDiscountType === 'BUY_A_SEND_A' &&
                  [(<td key="11" className="kb-detail-table-label">优惠力度</td>),
                    (<td key="12">{`同一件商品购满${discountForm.discountBuyNum}, 送${discountForm.discountGiveNum}件`}</td>)] }

            { discountForm.itemDiscountType === 'BUY_A_SEND_B' && [(<td key="21" className="kb-detail-table-label">购买及赠送商品组合</td>),
                (<td key="22">
                    <a onClick={()=> {
                      this.setState({
                        showGoodsIds: true,
                      });
                    }}>{`${discountForm.buyGiveGoods.length}个组合`}</a>
                    <Modal title={'购买及赠送商品组合'}
                           visible={this.state.showGoodsIds}
                           onCancel={() => {
                             this.setState({
                               showGoodsIds: false,
                             });
                           }}
                           footer={[]}>
                      <div style={{maxHeight: 300, overflowX: 'hidden', color: '#999'}}>
                        <ul>
                        {
                          discountForm.buyGiveGoods.map((good, i) => {
                            return (

                                <li key={i} style={{marginBottom: 10}}>
                                  <Row gutter={16}>
                                    <Col span={3}>组合{i + 1}</Col>
                                    <Col span={8}>
                                      买
                                      <div style={{maxHeight: 80, overflowY: 'auto'}}>
                                        {
                                          good.buyGoodIds.map((id, key) => {
                                            return <p key={`id${key}`}>{id}</p>;
                                          })
                                        }
                                      </div>
                                    </Col>
                                    <Col span={5}>
                                      送<p>{good.giveGoodId}</p>
                                    </Col>
                                  </Row>
                                </li>
                            );
                          })
                        }
                        </ul>
                      </div>
                    </Modal>
                  </td>)]
            }
          </tr>

          {
            discountForm.itemDiscountType === 'BUY_A_SEND_A' ?
            <tr>
              <td className="kb-detail-table-label">活动商品名称</td>
              <td>{discountForm.subject}</td>
              <td className="kb-detail-table-label">商品SKU 编码</td>
              <td>
                <a onClick={ ()=> {
                  this.setState({
                    showGoodsIds: true,
                  });
                }}>查看</a>
                <Modal title={'商品编码'}
                       visible={this.state.showGoodsIds}
                       onCancel={() => {
                         this.setState({
                           showGoodsIds: false,
                         });
                       }}
                       footer={[]}>
                  <div style={{maxHeight: 200, overflow: 'auto'}}>
                    {
                      discountForm.goodsIds.map((id, i) => {
                        return (
                          <p key={i}>{id}</p>
                        );
                      })
                    }
                  </div>
                </Modal>
              </td>
              <td className="kb-detail-table-label">活动商品详情</td>
              <td>{discountForm.activityName}</td>
            </tr> :
            <tr>
              <td className="kb-detail-table-label">购买商品名称</td>
              <td>{discountForm.subject}</td>
              <td className="kb-detail-table-label">赠送商品名称</td>
              <td>{discountForm.giveSubject}</td>
              <td className="kb-detail-table-label">活动商品详情</td>
              <td>{discountForm.activityName}</td>
            </tr>
          }

          <tr>
            <td className="kb-detail-table-label">活动商品图片</td>
            <td colSpan="5">
              { discountForm.activityImgs && discountForm.activityImgs.map((img, i) => {
                return (
                    <img key={i} src={img}/>
                );
              })}
            </td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">更多商品详情</td>
            <td colSpan="5">{discountForm.activityLink}</td>
          </tr>
          </tbody>
        </table>

        <p className="sub-title">活动规则设置</p>
        <table className="kb-detail-table-6" style={{marginTop: 10}}>
          <tbody>
          {
            discountForm.itemDiscountType === 'BUY_A_SEND_A' ?
            <tr>
              <td className="kb-detail-table-label">一笔订单最多几件享受优惠</td>
              <td>{discountForm.discountGiveLimit && discountForm.discountGiveLimit !== '0' ?
                  discountForm.discountGiveLimit : '不限制'}</td>
              <td className="kb-detail-table-label">一笔订单同一SKU商品最多送几件</td>
              <td>{discountForm.oneSKUGiveLimt || '不限制'}</td>
              <td className="kb-detail-table-label">券是否需要领取</td>
              <td>{discountForm.useMode === '0' ? '需要领取' : '无需领取'}</td>
            </tr> :
            <tr>
              <td className="kb-detail-table-label">购买商品最低限制</td>
              <td>{discountForm.minItemNum || '不限制'}</td>
              <td className="kb-detail-table-label">一笔订单同一SKU商品最多送几件</td>
              <td>{discountForm.oneSKUGiveLimt || '不限制'}</td>
              <td className="kb-detail-table-label">券是否需要领取</td>
              <td>{discountForm.useMode === '0' ? '需要领取' : '无需领取'}</td>
            </tr>
          }

          {
            discountForm.itemDiscountType === 'BUY_A_SEND_A' ?
            <tr>
              <td className="kb-detail-table-label">活动期间每人累计可领券几张</td>
              <td>{discountForm.receiveLimited || '不限制'}</td>
              <td className="kb-detail-table-label">活动期间每人每天累计可领券几张</td>
              <td>{discountForm.dayReceiveLimited || '不限制'}</td>
              <td className="kb-detail-table-label">券有效期</td>
              <td>{
                discountForm.validTimeType === 'RELATIVE' ?
                  <span>领取后{discountForm.validPeriod}日内有效</span> :
                  <span>{discountForm.validTimeFrom} - {discountForm.validTimeTo}</span>
              }</td>
            </tr> :
            <tr>
              <td className="kb-detail-table-label">活动期间每人累计可参与几次</td>
              <td>{discountForm.receiveLimited || '不限制'}</td>
              <td className="kb-detail-table-label">活动期间每人每天可参与几次</td>
              <td>{discountForm.dayReceiveLimited || '不限制'}</td>
              <td className="kb-detail-table-label">券有效期</td>
              <td>{
                discountForm.validTimeType === 'RELATIVE' ?
                    <span>领取后{discountForm.validPeriod}日内有效</span> :
                    <span>{discountForm.validTimeFrom} - {discountForm.validTimeTo}</span>
              }</td>
            </tr>
          }

          <tr>
            <td className="kb-detail-table-label">券发放总量</td>
            <td colSpan="5">{discountForm.budgetAmount || '不限制'}</td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">使用说明</td>
            <td colSpan="5">
              {
                discountForm.descList && discountForm.descList.map((desc, i) => {
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
})
;

export default BargainView;
