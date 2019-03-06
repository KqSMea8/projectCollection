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
            <td className="kb-detail-table-label">
              券种类
            </td>
            <td>
              {data.itemDiscountType === 'MONEY' ? '全场代金券' : '全场折扣券'}
            </td>
            <td className="kb-detail-table-label">适用门店</td>
            <td>
              {data.shop.length} 家门店 {
                data.shop.length ? <a href="#" onClick={this.toggleShopList}>查看</a>
                  : null}
              <ShopListModal title={'券适用门店'}
                visible={this.state.showShopList}
                onCancel={this.toggleShopList}
                style={{ top: modalTop }}
                data={data.cityShop}
                isCityShop="true"
                />
            </td>
            <td className="kb-detail-table-label">券名称</td>
            <td>{data.subject}</td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">品牌名称</td>
            <td>{data.brandName}</td>
            <td className="kb-detail-table-label">券logo</td>
            <td><img src={data.logoFixUrl} /></td>
            <td className="kb-detail-table-label">券图片</td>
            <td>
              {data.activityImgs && data.activityImgs.length
                && data.activityImgs.map((item, i) => {
                  return (
                    <img key={i} src={item}/>
                  );
                }) || null}
            </td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">券面额</td>
            <td>{data.couponValue} {data.couponValue && '元'}</td>
            <td className="kb-detail-table-label">券有效期</td>
            <td>
              {
                data.validTimeType === 'RELATIVE' ?
                  <span>领取后{data.validPeriod}日内有效</span> :
                  <span>{data.validTimeFrom} - {data.validTimeTo}</span>
              }
            </td>
            <td className="kb-detail-table-label">最低消额</td>
            <td>
              {data.minimumAmount} {data.minimumAmount && '元'}
            </td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">可使用时段</td>
            <td>{(data.availableTimes.length !== 0) ? formatAvailableVoucherTime(data.availableTimes) : '不限制'}</td>
            <td className="kb-detail-table-label">不可用时段</td>
            <td>{data.forbiddenTime ? formatForbiddenVoucherTime(data.forbiddenTime) : '不限制'}</td>
            <td className="kb-detail-table-label">使用说明</td>
            <td>
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
