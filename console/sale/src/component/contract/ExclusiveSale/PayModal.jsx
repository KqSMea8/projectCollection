import React, {PropTypes} from 'react';
import { Modal } from 'antd';
const PayModal = React.createClass({
  propTypes: {
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    record: PropTypes.object,
  },
  onOK() {
    this.props.onOk(this.props.record);
  },
  render() {
    const { record } = this.props;
    return (<Modal title="确认打款信息" okText="确定打款" visible onOk={this.onOK} onCancel={this.props.onCancel}>
      <table className="kb-detail-table-4">
        <tbody>
          <tr>
            <td className="kb-detail-table-label">商户名称：</td>
            <td>{record.merchantName}</td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">商户PID：</td>
            <td>{record.partnerId}</td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">本次预付金额：</td>
            <td><span style={{ 'color': '#F60' }}>{record.firstPayAmount + '元'}</span></td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">参与活动门店：</td>
            <td>{record.participateShopSize + '家门店'}</td>
          </tr>
          <tr>
            <td className="kb-detail-table-label">打款节奏：</td>
            <td>{record.transferScales}</td>
          </tr>
        </tbody>
      </table>
    </Modal>);
  },
});

export default PayModal;
