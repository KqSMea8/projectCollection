import React, { PropTypes } from 'react';
import { formatAvailableVoucherTime, formatForbiddenVoucherTime } from '../../../common/utils';
import ShopListModal from './ShopListModal';

const DiscountCouponDetail = React.createClass({
  getInitialState() {
    return {
      showShopList: !!this.props.showShopList,
    };
  },

  PropTypes: {
    showShopList: PropTypes.bool,
  },

  toggleShopList(e) {
    e.preventDefault();
    this.setState({ showShopList: !this.state.showShopList });
  },

  render() {
    let modalTop = 100;
    if (window.top !== window) {
      modalTop = window.top.scrollY - 100;
    }
    const { data } = this.props;
    return (
      <table className="kb-detail-table-6">
        <tbody>
          <tr>
            <td className="kb-detail-table-label">券种类</td>
            <td>{data.itemDiscountType === 'MONEY' ? '全场代金券' : ''}</td>
            <td className="kb-detail-table-label">券名称</td>
            <td>{data.subject}</td>
            <td className="kb-detail-table-label">品牌名称</td>
            <td>{data.brandName}</td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">券logo</td>
            <td>
              <img src={data.logoFixUrl}/>
            </td>
            <td className="kb-detail-table-label">券面额</td>
            <td>{data.couponValue}元</td>
            <td className="kb-detail-table-label">使用条件</td>
            <td>满{data.minimumAmount}元可用</td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">券有效期</td>
            <td>
              {
                data.validTimeType === 'RELATIVE' ?
                  <span>领取后{data.validPeriod}日内有效</span> :
                  <span>{data.validTimeFrom} - {data.validTimeTo}</span>
              }
            </td>
            <td className="kb-detail-table-label">券适用门店</td>
            <td>
              {data.shop.length} 家门店
              {
                data.shop.length ? <span onClick={this.toggleShopList} style={{ color: '#2db7f5', marginLeft: 10, cursor: 'pointer' }}>查看</span>
                  : null
              }

              <ShopListModal title={'券适用门店'}
                style={{ top: modalTop }}
                visible={this.state.showShopList}
                onCancel={this.toggleShopList}
                footer={[]}
                data={data.cityShop}
                isCityShop="true"
              />
            </td>
            <td className="kb-detail-table-label">发放总量</td>
            <td>{data.budgetAmount}</td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">领取当日可用</td>
            <td>{(data.actived === '0' || !data.actived) ? '是' : '否'}</td>
            <td className="kb-detail-table-label">券可用时段</td>
            <td>{(data.availableTimes.length !== 0) ? formatAvailableVoucherTime(data.availableTimes) : '不限制'}</td>
            <td className="kb-detail-table-label">不可用日期</td>
            <td>{data.forbiddenTime ? formatForbiddenVoucherTime(data.forbiddenTime) : '不限制'}</td>
          </tr>
          <tr>
            <td>使用说明</td>
            <td colSpan="5">
              {
                data.descList && data.descList.map((item, i) => {
                  return (
                    <p key={i}>{item}</p>
                  );
                })
              }
            </td>
          </tr>
        </tbody>
      </table>
    );
  },
});

export default DiscountCouponDetail;
