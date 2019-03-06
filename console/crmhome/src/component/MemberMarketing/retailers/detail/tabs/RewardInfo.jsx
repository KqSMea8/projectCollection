import React from 'react';
import isEqual from 'lodash/isEqual';
import { Modal, Spin, message } from 'antd';
import ajax from '../../../../../common/ajax';
import { voucherType as VoucherTypeEnum } from '../../../common/enum';
import { validPeriodReadable, formatAvailableTimes, formatForbiddenDates } from './utils';
import ModifiedCell from './ModifiedCell';

class RewardInfo extends React.Component {
  state = {
    shopsLoading: false,
    shopsDetail: [],
    shopsModalTitle: '适用门店',
    showShopListModal: false,
  };

  hideShopList = () => {
    this.setState({ showShopListModal: false });
  }

  showShopList = (shopIds) => {
    this.setState({
      shopsLoading: true,
    });
    ajax({
      url: '/goods/kbsmartplan/querySmartPlanRecommendShops.json',
      method: 'post',
      data: { shopIds: JSON.stringify(shopIds) },
      success: (res) => {
        if (res.status === 'succeed') {
          this.setState({
            shopsDetail: res.data,
            shopsLoading: false,
          });
        } else {
          message.error(res.resultMsg || '系统繁忙');
        }
      },
      error: (err) => {
        this.setState({
          shopsLoading: false,
          shopsDetail: [],
        });
        message.error(err.resultMsg || '系统繁忙');
      },
    });
    this.setState({ showShopListModal: true });
  }

  render() {
    const { shopIds, totalAvailableNum } = this.props.obj || {};
    const voucher = ((this.props.obj || {}).vouchers || [])[0];
    const { voucherName, voucherType, brandName, voucherLogo, availableTimes, forbiddenDates, descList, voucherNote,
      delayAvailableTime, allowTransfer, couponValue, ruleStartAmount } = voucher;
    const { shopIds: modifiedShopIds, totalAvailableNum: modifiedTotalAvailableNum } = this.props.modifiedObj || {};
    const {
      brandName: modifiedBrandName,
      voucherLogo: modifiedVoucherLogo,
      descList: modifiedDescList,
    } = ((this.props.modifiedObj || {}).vouchers || [])[0] || {};
    const { shopsDetail, shopsLoading, shopsModalTitle, showShopListModal } = this.state;
    return (
      <div>
        <table className="kb-detail-table">
          <tbody>
            <tr>
              <td className="kb-detail-table-label">奖品设置</td>
              <td className="kb-detail-table-value" colSpan={5}>每次送{voucherName}</td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginBottom: 30 }} />
        <table className="kb-detail-table">
          <tbody>
            <tr>
              <td className="kb-detail-table-label">券种类</td>
              <td className="kb-detail-table-value">{VoucherTypeEnum[voucherType]}</td>
              <td className="kb-detail-table-label">券名称</td>
              <td className="kb-detail-table-value">{voucherName}</td>
              <td className="kb-detail-table-label">品牌名称</td>
              <ModifiedCell
                newVal={modifiedBrandName}
                oldVal={brandName}
              />
            </tr>
            <tr>
              <td className="kb-detail-table-label">品牌Logo</td>
              <ModifiedCell
                newVal={modifiedVoucherLogo}
                oldVal={voucherLogo}
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
              <td className="kb-detail-table-label">券面额</td>
              <td className="kb-detail-table-value">{couponValue}元</td>
              <td className="kb-detail-table-label">使用条件</td>
              <td className="kb-detail-table-value">满{ruleStartAmount}元可用</td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">券有效期</td>
              <td className="kb-detail-table-value">{validPeriodReadable(voucher)}</td>
              <td className="kb-detail-table-label">适用门店</td>
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
                newVal={modifiedTotalAvailableNum === '-1' ? '不限制' : modifiedTotalAvailableNum}
                oldVal={totalAvailableNum === '-1' ? '不限制' : totalAvailableNum}
              />
            </tr>
            <tr>
              <td className="kb-detail-table-label">领取当日是否可用</td>
              <td className="kb-detail-table-value">{delayAvailableTime === '0' ? '是' : '否'}</td>
              <td className="kb-detail-table-label">是否可以转赠</td>
              <td className="kb-detail-table-value">{allowTransfer ? '是' : '否'}</td>
              <td className="kb-detail-table-label">券可用时段</td>
              <td className="kb-detail-table-value">{formatAvailableTimes(availableTimes)}</td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">不可用日期</td>
              <td className="kb-detail-table-value">{formatForbiddenDates(forbiddenDates)}</td>
              <td className="kb-detail-table-label">备注</td>
              <td className="kb-detail-table-value" colSpan={3}>
                <span style={{ color: '#f50' }}>{voucherNote}</span>
              </td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">使用说明</td>
              <ModifiedCell
                colSpan={5}
                newVal={modifiedDescList}
                oldVal={descList || []}
                customIsEqual={isEqual}
                cellContent={list => list.map((item, i) => <p key={`desc${i}`}>{item}</p>)}
                modalContent={list => list.map((item, i) => <p key={`desc${i}`}>{item}</p>)}
              />
            </tr>
          </tbody>
        </table>
        <Modal
          title={shopsModalTitle}
          visible={showShopListModal}
          onCancel={this.hideShopList}
          footer={[]}
        >
          <div className="check-shop-list">
            <Spin spinning={shopsLoading}>
              {shopsDetail.length > 0 && shopsDetail.map((item, key) => (
                <dl key={key}>
                  <dt>{item.cityName}</dt>
                  <dd>{item.name}</dd>
                </dl>
              ))}
            </Spin>
          </div>
        </Modal>
      </div>
    );
  }
}

export default RewardInfo;
