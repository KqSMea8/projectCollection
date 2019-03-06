import React, {Component} from 'react';
import {Modal, Button, Table, message} from 'antd';
import moment from 'moment';

// 被中台嵌入时重写 message
if (window.top !== window) {
  ['error', 'warn', 'success'].forEach(f => {
    message[f] = function iframeMessage(text) {
      window.parent.postMessage(JSON.stringify({ action: f, message: text }), '*');
    };
  });
}

class Addgoods extends Component {
  onChange=(pagination)=>{
    const {current, pageSize: showSizeChanger} = pagination;
    this.props.getGoods({current, showSizeChanger});
  }

  onEnter=()=>{
    const { selectedRowKeys } = this.props.rowSelection;
    if (selectedRowKeys.length > 20) {
      message.error(`最多可选择20个商品，已选 ${selectedRowKeys.length} 个商品`, 1);
    } else {
      this.props.onCancel();
      this.props.setGoods();
    }
  }

  colums = [{
    title: '商品ID',
    dataIndex: 'itemId',
    width: '15%',
  }, {
    title: '商品名称',
    dataIndex: 'itemName',
    width: '15%',
  }, {
    title: '商品图片',
    dataIndex: 'imageUrl',
    width: '12%',
    render: (text)=>{
      return <img width="90" height="50" src={`${text}&time=${new Date().getTime()}`} style={{width: '100%'}} />;
    },
  }, {
    title: '原价',
    dataIndex: 'originalPrice',
    width: '7.5%',
  }, {
    title: '现价',
    dataIndex: 'price',
    width: '7.5%',
  }, {
    title: '库存',
    dataIndex: 'inventory',
    width: '10%',
  }, {
    title: '可售卖时间',
    dataIndex: 'salesBeginDate',
    width: '15%',
    render: (text)=>{
      return <p>{moment(text).format('YYYY-MM-DD HH:mm:ss')}<br />开始</p>;
    },
  }, {
    title: '有效期（天）',
    dataIndex: 'validPeriod',
    render: (text, record)=>{
      return +text === 0 ? <p>
        {moment(record.validPeriodFrom).format('YYYY-MM-DD HH:mm:ss')}-{moment(record.validPeriodTo).format('YYYY-MM-DD HH:mm:ss')}
      </p> : <p>{text}</p>;
    },
  }];

  render() {
    const { colums } = this;
    const { total, rowSelection } = this.props;
    const { selectedRowKeys } = rowSelection;
    const pagination = {
      showSizeChanger: true,
      total: this.props.total,
    };
    const footer = (
      <div style={{textAlign: 'center', lineHeight: '30px', color: '#666'}}>
        <p>最多可选择{total > 20 ? '20' : total}个商品，已选<span style={{color: 'red'}}>{selectedRowKeys.length}</span>个商品</p>
        <Button type="primary" onClick={this.onEnter}>确认</Button>
      </div>
    );

    return (
      <Modal
        visible={this.props.visible}
        width={950}
        title="添加商品"
        footer={footer}
        onCancel={this.props.onCancel}
      >
        <Table
          bordered
          pagination={pagination}
          columns={colums}
          dataSource={this.props.data}
          rowKey={record => record.itemId}
          onChange={this.onChange}
          rowSelection={this.props.rowSelection}
          loading={this.props.loading}
        />
      </Modal>
    );
  }
}
export default Addgoods;
