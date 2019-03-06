import React, {PropTypes} from 'react';
import {Button} from 'antd';
import BatchTaskModal from '../common/BatchTaskModal';

const ShopList = React.createClass({
  propTypes: {
    children: PropTypes.any,
    getParams: PropTypes.func,
  },
  getInitialState() {
    return {
      batchTaskModalVisible: false,
      params: {},
    };
  },
  showBatchModal() {
    const params = this.props.getParams();
    this.setState({
      batchTaskModalVisible: true,
      params: params,
    });
  },
  hideBatchModal() {
    this.setState({
      batchTaskModalVisible: false,
    });
  },
  render() {
    return (
      <div style={{display: 'inline-block'}}>
        <Button type="primary" size="large" onClick={this.showBatchModal} style={{marginRight: '10px'}}>批量重开门店</Button>
        <BatchTaskModal
          batchTaskType="REOPEN_SHOP"
          searchParams={this.state.params}
          visible={this.state.batchTaskModalVisible}
          onFinish={this.hideBatchModal} />
      </div>
    );
  },
});

export default ShopList;
