import React, {PropTypes} from 'react';
import {Modal} from 'antd';
import PurchaseStorageDetailModalOperationLog from './PurchaseStorageDetailModalOperationLog';

const PurchaseStorageDetailModalIndex = React.createClass({
  propTypes: {
    stuffPurchaseItemVOList: PropTypes.array,
    stuffInStockItemVOList: PropTypes.array,
    itemTotal: PropTypes.number,
  },

  getInitialState() {
    return {};
  },

  showModal() {
    this.setState({
      visible: true,
    });
  },

  handleCancel() {
    this.setState({
      visible: false,
    });
  },

  render() {
    return (<div>
      <div>
        <a onClick={this.showModal}>{this.props.itemTotal ? this.props.itemTotal : 0}条记录</a>
      </div>
      <Modal ref="modal"
           visible={this.state.visible}
           title="入库明细" onOk={this.handleOk} footer={false} onCancel={this.handleCancel}>
            <PurchaseStorageDetailModalOperationLog stuffInStockItemVOList={this.props.stuffInStockItemVOList}/>
      </Modal>
    </div>);
  },
});
export default PurchaseStorageDetailModalIndex;
