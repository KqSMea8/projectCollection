import React from 'react';
import isEqual from 'lodash/isEqual';
import { Modal, Spin, message } from 'antd';
import ajax from '../../../../../common/ajax';
import { crowdRestrictionEnum, PersonPeriodAvailableTypeText } from '../../../common/enum';
import ModifiedCell from './ModifiedCell';

class ActivityInfo extends React.Component {
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
    const { activityName, shopIds, crowdRestriction, personTotalAvailableNum, personPeriodAvailableType,
      personPeriodAvailableNum } = this.props.obj;
    const { shopIds: modifiedShopIds } = this.props.modifiedObj || {};
    const { shopsDetail, shopsLoading, shopsModalTitle, showShopListModal } = this.state;
    return (
      <div>
        <table className="kb-detail-table">
          <tbody>
            <tr>
              <td className="kb-detail-table-label">活动名称</td>
              <td className="kb-detail-table-value">{activityName}</td>
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
              <td className="kb-detail-table-label">活动人群</td>
              <td className="kb-detail-table-value">{crowdRestriction ? crowdRestrictionEnum[crowdRestriction] : '不限人群'}</td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">参与限制</td>
              <td className="kb-detail-table-value">消费即送</td>
              <td className="kb-detail-table-label">总共参与次数</td>
              <td className="kb-detail-table-value">{Number(personTotalAvailableNum) === 999999999 ? '不限制' : `${personTotalAvailableNum}次`}</td>
              <td className="kb-detail-table-label">{PersonPeriodAvailableTypeText[personPeriodAvailableType]}参与次数</td>
              <td className="kb-detail-table-value">{Number(personPeriodAvailableType) !== 1 ? '不限制' : `${personPeriodAvailableNum}次`}</td>
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

export default ActivityInfo;
