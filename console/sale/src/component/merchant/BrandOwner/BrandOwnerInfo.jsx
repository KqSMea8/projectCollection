import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';

const BrandOwnerInfo = React.createClass({
  propTypes: {
    pid: PropTypes.any,
  },

  getInitialState() {
    return {
      merchantInfo: {},
    };
  },

  componentDidMount() {
    this.fetch();
  },

  showModal() {
    this.fetch('accountList');
  },

  refresh() {
    this.fetch();
  },

  fetch() {
    ajax({
      url: '/sale/merchant/brandMerchantDetail.json',
      method: 'get',
      type: 'json',
      data: {
        partnerId: this.props.pid,
      },
      success: (result) => {
        this.setState({ merchantInfo: result.data });
      },
    });
  },

  render() {
    const merchantInfo = this.state.merchantInfo;

    return (<div>
      <h3 className="kb-page-sub-title">账号信息</h3>
      <table className="kb-detail-table-4">
        <tbody>
          <tr>
            <td className="kb-detail-table-label">品牌商名称</td>
            <td>{merchantInfo.name}</td>
            <td className="kb-detail-table-label">品牌商PID</td>
            <td>{merchantInfo.partnerId}</td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">支付宝账户</td>
            <td colSpan="3">{merchantInfo.cardNo}</td>
          </tr>
        </tbody>
      </table>
      <h3 className="kb-page-sub-title">业务和认证信息</h3>
      <table className="kb-detail-table-4">
        <tbody>
          <tr>
            <td className="kb-detail-table-label">所属BD</td>
            <td>{merchantInfo.staffName}</td>
            <td className="kb-detail-table-label">所属行业MCC</td>
            <td>{merchantInfo.mcc}</td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">备注</td>
            <td colSpan="3">{merchantInfo.memo}</td>
          </tr>
        </tbody>
      </table>
      <h3 className="kb-page-sub-title">联系人信息</h3>
      <table className="kb-detail-table-2">
        <tbody>
          <tr>
            <td className="kb-detail-table-label">联系人姓名</td>
            <td colSpan="5">{merchantInfo.contactName}</td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">手机号</td>
            <td colSpan="5">{merchantInfo.mobile}</td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">地址</td>
            <td colSpan="5">{merchantInfo.address}</td>
          </tr>
        </tbody>
      </table>
    </div>);
  },
});

export default BrandOwnerInfo;
