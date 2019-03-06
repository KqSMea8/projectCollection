import { Table, Modal } from 'antd';
import React, {PropTypes} from 'react';

const OrderModal = React.createClass({
  propTypes: {
    id: PropTypes.any,
  },
  getInitialState() {
    this.columns = [{
      title: '卡面面额(元)',
      dataIndex: 'denomination',
      key: 'denomination',
      render(text) {
        let msg;
        msg = <div>{text}元<span style={{float: 'right', color: '#aaa', marginRight: 20}}>X</span></div>;
        return msg;
      },
    }, {
      title: '优惠折扣（%）',
      dataIndex: 'rate',
      key: 'rate',
      render(text) {
        let msg;
        msg = <div>{text}%<span style={{float: 'right', color: '#aaa', marginRight: 30}}>=</span></div>;
        return msg;
      },
    }, {
      title: '实际售价(元)',
      dataIndex: 'price',
      key: 'price',
      render(text) {
        return (text + '元' );
      },
    }];
    return { visible: false };
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
  fetch() {
  },
  render() {
    const OrderId = this.props.id;
    return (
      <div>
        <a onClick={this.showModal}>查看详情</a>
        <Modal title="活动详情" visible={this.state.visible} onCancel={this.handleCancel} footer={false}>
            <Table columns={this.columns}
            dataSource={OrderId}
            pagination={false}/>
        </Modal>
      </div>
    );
  },
});

export default OrderModal;
