import React, {PropTypes} from 'react';
import {Modal} from 'antd';


const ReductionView = React.createClass({
  propTypes: {
    discountForm: PropTypes.object,
  },

  getInitialState() {
    return {
      showGoodsIds: false,
      showShops: false,
    };
  },

  render() {
    const discountForm = this.props.discountForm;
    return (
      <div>
        <p className="sub-title">商品设置</p>
        <table className="kb-detail-table-6">
          <tbody>
          <tr>
            <td className="kb-detail-table-label">品牌名称</td>
            <td>{discountForm && discountForm.vouchers[0] && discountForm.vouchers[0].brandName}</td>
            <td className="kb-detail-table-label">品牌logo</td>
            <td>
              <img src={discountForm.vouchers[0].logoFixUrl}/>
            </td>
            <td className="kb-detail-table-label">活动商品名称</td>
            <td>{discountForm.vouchers && discountForm.vouchers[0] && discountForm.vouchers[0].subject}</td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">商品SKU编码</td>
            <td>
              <span onClick={()=> {
                this.setState({showGoods: true});
              }} style={{color: '#2db7f5', marginLeft: 10, cursor: 'pointer'}}>查看</span>
              <Modal title={'商品SKU编码'}
                     visible={this.state.showGoods}
                     onCancel={() => {
                       this.setState({showGoods: false});
                     }}
                     footer={[]}>
                <div style={{maxHeight: 200, overflow: 'auto'}}>
                  {
                    discountForm.vouchers && discountForm.vouchers[0].goodsIds.map((good, i) => {
                      return (
                          <p key={i}>{good}</p>
                      );
                    })
                  }
                </div>
              </Modal>
            </td>
            <td className="kb-detail-table-label">活动商品详情</td>
            <td>{discountForm.vouchers && discountForm.vouchers[0] && discountForm.vouchers[0].activityName}</td>
            <td className="kb-detail-table-label">活动商品图片</td>
            <td className="kb-detail-table-label">
              { discountForm.vouchers && discountForm.vouchers[0].activityImgs.map((img, i) => {
                return (
                  <img key={i} src={img} style={{float: 'left'}}/>
                );
              })}
            </td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">更多商品详情</td>
            <td colSpan="5">{discountForm.vouchers && discountForm.vouchers[0].activityLink}</td>
          </tr>
          </tbody>
        </table>

        <p className="sub-title">规则设置</p>
        <table className="kb-detail-table-6" style={{marginTop: 10}}>
          <tbody>
          <tr>
            <td className="kb-detail-table-label">随机立减金额区间</td>
            <td>
              {`${discountForm.vouchers && discountForm.vouchers[0].reduceRanges && discountForm.vouchers[0].reduceRanges.length}个区间 `}<a onClick={ () => {
                this.setState({
                  showGoodsIds: true,
                });
              }}>&nbsp;&nbsp;查看</a>
              <Modal title={'随机立减金额区间'}
                     visible={this.state.showGoodsIds}
                     onCancel={() => {
                       this.setState({
                         showGoodsIds: false,
                       });
                     }}
                     footer={[]}>
                <div style={{maxHeight: 200, overflow: 'auto'}}>
                  {
                    discountForm.vouchers && discountForm.vouchers[0].reduceRanges && discountForm.vouchers[0].reduceRanges.map((item, k) => {
                      return (<div key={k} style={{fontSize: 12, color: '#999999', margin: '20px 10px'}}>
                        {`区间${k + 1}:`}<span
                        style={{marginLeft: 30}}>{`${item.minRange}-${item.maxRange}元，占比${item.percentage}%`}</span>
                      </div>);
                    })
                  }
                </div>
              </Modal>
            </td>
            <td className="kb-detail-table-label">1笔订单购买商品最低限制</td>
            <td>{discountForm.vouchers && discountForm.vouchers[0].minItemNum || '不限制'}</td>
            <td className="kb-detail-table-label">券是否需要领取</td>
            <td>不需要</td>
          </tr>

          <tr>
            <td className="kb-detail-table-label">活动期间每人累计可{discountForm.useMode === '0' ? '领券几张' : '参与几次'}</td>
            <td>{discountForm.receiveLimited ? `最多${discountForm.receiveLimited}次` : '不限制'}</td>
            <td className="kb-detail-table-label">活动期间每人每天累计可{discountForm.useMode === '0' ? '领券几张' : '参与几次'}</td>
            <td>{discountForm.dayReceiveLimited ? `最多${discountForm.dayReceiveLimited}次` : '不限制'}</td>
            <td className="kb-detail-table-label">券有效期</td>
            <td>{
              discountForm.validTimeType === 'RELATIVE' ?
                <span>领取后{discountForm.validPeriod}日内有效</span> :
                <span>{discountForm.startTime} - {discountForm.endTime}</span>
            }</td>
          </tr>

          <tr>
            <td className="kb-detail-table-label">活动发券总数量</td>
            <td>{discountForm.budgetAmount || '不限制'}</td>
            {/* <td className="kb-detail-table-label">每天发券数量</td> */}
            {/* <td>{'---'}</td> */}
            <td className="kb-detail-table-label">使用说明</td>
            <td className="kb-detail-table-label">
              {
                discountForm.vouchers && discountForm.vouchers[0].descList.map((desc, i) => {
                  return (
                    <p key={i} style={{textAlign: 'left'}}>{desc}</p>
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
});

export default ReductionView;
