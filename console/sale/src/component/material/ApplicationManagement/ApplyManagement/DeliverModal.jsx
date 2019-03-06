import React, {PropTypes} from 'react';
import {Modal} from 'antd';
import {Table} from 'antd';

const DeliverModal = React.createClass({
  propTypes: {
    data: PropTypes.array,
  },

  getInitialState() {
    this.columns = [
      {
        title: '发货数量',
        dataIndex: 'purchaseQuantity',
        width: 210,
        render(text) {
          return [text, <span>&nbsp;</span>, '件'];
        },
      }, {
        title: '物流状态',
        width: 210,
        dataIndex: 'expressStatusDesc'
      }, {
        title: '收货物流公司/单号',
        dataIndex: 'expressNo',
        width: 210,
        render(text, record) {
          return (<div>{record.expressCompany}<br/>{text}</div>);
        },
      }];

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
        <a onClick={this.showModal}>{this.props.showData}件</a>
      </div>
      <Modal
        visible={this.state.visible}
        title="发货明细" onOk={this.handleOk} footer={false} onCancel={this.handleCancel}>
        <Table style={{height: '300px', overflow: 'auto'}} columns={this.columns} pagination={false}
               dataSource={this.props.data}/>
      </Modal>
    </div>);
  },
});
export default DeliverModal;
