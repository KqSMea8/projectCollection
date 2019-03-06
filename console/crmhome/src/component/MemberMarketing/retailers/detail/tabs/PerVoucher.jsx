import React, { PropTypes } from 'react';
import { Modal, message, Spin } from 'antd';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import { voucherType, payChannelsEnum, crowdRestrictionEnum, VoucherMultiUseTypeEnum, PersonPeriodAvailableTypeText } from '../../../common/enum';
import {formatForbiddenVoucherTime, formatAvailableVoucherTime} from '../../../../../common/utils';
import ajax from '../../../../../common/ajax';
import ModifiedCell from './ModifiedCell';

// 满减券
class TabsBottom extends React.Component {
  constructor() {
    super();
    this.state = {
      showShopListModal: false,
      autoHidden: false,
      shopDetail: [],
      shopsModalTitle: '适用门店',
      shopsLoading: true,
    };
  }

  hideShopList = () => {
    this.setState({ showShopListModal: false });
  }

  showShopList = (shopIds, title) => {
    this.setState({
      shopsLoading: true,
      shopsModalTitle: title,
    });
    ajax({
      url: '/goods/kbsmartplan/querySmartPlanRecommendShops.json',
      method: 'post',
      data: {shopIds: JSON.stringify(shopIds)},
      success: (res) => {
        if (res.status === 'succeed') {
          this.setState({
            shopDetail: res.data,
            shopsLoading: false,
          });
        } else {
          message.error(res.resultMsg || '系统繁忙');
        }
      },
      error: (err) => {
        this.setState({
          loading: false,
          shopsLoading: false,
        });
        message.error(err.resultMsg || '系统繁忙');
      },
    });
    this.setState({ showShopListModal: true });
  }

  renderDes = (data) => {
    const arr = data || [];
    return arr.map((v, index)=>{
      return (<p key={index}>{v}</p>);
    });
  }

  /* eslint-disable */
  render() {
    const obj = this.props.obj;
    const modifiedObj = this.props.modifiedObj || {};
    const vouchers = this.props.obj.vouchers || [{}];
    const shopIds = this.props.obj.shopIds || [];
    const shopDetail = this.state.shopDetail;
    const availableTimes = vouchers[0].availableTimes || [];
    const forbiddenDates = vouchers[0].forbiddenDates || [];
    const { shopIds: modifiedShopIds } = this.props.modifiedObj || {};
    const {
      brandName: modifiedBrandName,
      voucherLogo: modifiedVoucherLogo,
      descList: modifiedDescList,
    } = ((this.props.modifiedObj || {}).vouchers || [])[0] || {};
    return (<div>
      <table className="kb-detail-table">
      <tbody>
        <tr>
          <td className="kb-detail-table-label">券种类</td>
          <td className="kb-detail-table-value">
            {vouchers[0].voucherType ? voucherType[vouchers[0].voucherType] : ''}
          </td>
          <td className="kb-detail-table-label">劵名称</td>
          <td className="kb-detail-table-value">
           {vouchers[0].voucherName}
          </td>
          <td className="kb-detail-table-label">品牌名称</td>
          <ModifiedCell
            newVal={modifiedBrandName}
            oldVal={vouchers[0].brandName}
          />
        </tr>
        <tr>
          <td className="kb-detail-table-label">券LOGO</td>
          <ModifiedCell
            newVal={modifiedVoucherLogo}
            oldVal={vouchers[0].voucherLogo}
            cellContent={logo => (
              logo && (
                <a href={logo}>
                  <img src={logo} style={{ maxHeight: 50, maxWidth: 50 }} />
                </a>
              )
            )}
            modalContent={logo => (
              <img src={logo} style={{ maxWidth: 299 }} />
            )}
          />
          <td className="kb-detail-table-label">优惠力度</td>
          <td className="kb-detail-table-value">
            {
              vouchers[0].voucherType === 'CASH_VOUCHER' ? `${vouchers[0].couponValue}元代金券` :
            `满${vouchers[0].perConsumeAmount}元减${vouchers[0].perDiscountAmount}，最高减${vouchers[0].maxDiscountAmount}`
            }
          </td>
          <td className="kb-detail-table-label">使用条件</td>
          <td className="kb-detail-table-value">
            { vouchers[0].voucherType === 'CASH_VOUCHER' ? `订单满${vouchers[0].ruleStartAmount}元可用`
            : '\\'}
          </td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">每个用户总参与</td>
          <td className="kb-detail-table-value">
          {
            Number(obj.personTotalAvailableNum) === 999999999 ? '不限制' : `${obj.personTotalAvailableNum}次`
          }
          </td>
          <td className="kb-detail-table-label">每个用户{PersonPeriodAvailableTypeText[obj.personPeriodAvailableType]}参与</td>
          <td className="kb-detail-table-value">
          {
            Number(obj.personPeriodAvailableType) !== 1 ? '不限制' : `${obj.personPeriodAvailableNum}次`
          }
          </td>
          <td className="kb-detail-table-label">券有效期</td>
          <td className="kb-detail-table-value">
          {
            vouchers[0].validType === 'RELATIVE' ? `${vouchers[0].validPeriod}天` : `${moment(vouchers[0].validFromTime).format('YYYY-MM-DD HH:mm')} ~ ${moment(vouchers[0].validEndTime).format('YYYY-MM-DD HH:mm')}`
          }
          </td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">券适用门店</td>
          <ModifiedCell
              newVal={modifiedShopIds}
              oldVal={shopIds}
              cellContent={ids => (
                <div>
                  {ids.length ? ids.length : ''}家门店&nbsp;&nbsp;
                  {ids.length && <a onClick={() => this.showShopList(ids, '适用门店')}>查看</a>}
                </div>
              )}
              customIsEqual={isEqual}
              customOnClick={() => this.showShopList(shopIds, '修改前内容')}
          />
          <td className="kb-detail-table-label">发放总量</td>
          <ModifiedCell
            newVal={Number(modifiedObj.totalAvailableNum) == -1 ? '不限制' : modifiedObj.totalAvailableNum}
            oldVal={Number(obj.totalAvailableNum) == -1 ? '不限制' : obj.totalAvailableNum}
          />
          <td className="kb-detail-table-label">领取即时生效</td>
          <td className="kb-detail-table-value">
          {
            Number(vouchers[0].delayAvailableTime) === 0 ? '是' : `否`
          }
          </td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">券可用时段</td>
          <td className="kb-detail-table-value">
          {
            availableTimes.length > 0 ? formatAvailableVoucherTime(vouchers[0].availableTimes) : '不限制'
          }
          </td>
          <td className="kb-detail-table-label">券不可用日期</td>
          <td className="kb-detail-table-value">
          {
            forbiddenDates.length > 0 ? formatForbiddenVoucherTime(vouchers[0].forbiddenDates) : '不限制'
          }
          </td>
          <td className="kb-detail-table-label">支付渠道限制</td>
          <td className="kb-detail-table-value">
          {
            vouchers[0].paychannel ? payChannelsEnum[vouchers[0].paychannel] : '不限制'
          }
          </td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">是否与其他单品优惠券叠加</td>
          <td className="kb-detail-table-value">
          {
            vouchers[0].multiUseMode ? VoucherMultiUseTypeEnum[vouchers[0].multiUseMode] : '-'
          }
          </td>
          <td className="kb-detail-table-label">使用人群限制</td>
          <td className="kb-detail-table-value">
          {
            obj.crowdRestriction ? crowdRestrictionEnum[obj.crowdRestriction] : '全部用户'
          }
          </td>
          <td className="kb-detail-table-label">是否允许转增</td>
          <td className="kb-detail-table-value">
          {
            vouchers[0].allowTransfer ? '允许转让' : '不允许'
          }
          </td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">备注</td>
          <td className="kb-detail-table-value" colSpan="5">
          {
            vouchers[0].voucherNote
          }
          </td>
        </tr>
        <tr>
          <td className="kb-detail-table-label">使用说明</td>
          <ModifiedCell
            colSpan={5}
            newVal={modifiedDescList}
            oldVal={vouchers[0].descList || []}
            customIsEqual={isEqual}
            cellContent={descList => descList.map((item, i) => <p key={`desc${i}`}>{item}</p>)}
            modalContent={descList => descList.map((item, i) => <p key={`desc${i}`}>{item}</p>)}
          />
        </tr>

      </tbody>
    </table>
    <Modal title={this.state.shopsModalTitle}
        visible={this.state.showShopListModal}
        onCancel={this.hideShopList}
        footer={[]}
      >
        <div className="check-shop-list">
          <Spin spinning={this.state.shopsLoading}>
            {
              shopDetail.length > 0 && shopDetail.map((item, key) => {
                return (
                  <dl key={key}>
                    <dt>{item.cityName}</dt>
                    <dd>{item.name}</dd>
                  </dl>
                );
              })
            }
          </Spin>
        </div>
      </Modal>
    </div>);
  }
}

TabsBottom.propTypes = {
  data: PropTypes.any,
};

export default TabsBottom;
