import React, { Component } from 'react';
import { Table } from 'antd';
import { getAllocationRecord } from '../../../common/api';
import moment from 'moment';

export default class AllocateRecordTab extends Component {
  constructor() {
    super();
    this.state = {
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      list: [],
      loading: false
    };
  }

  componentDidMount() {
    this.loadList();
  }

  loadList = next => {
    const { pagination } = this.state;
    const params = {
      produceOrderId: this.props.id,
      pageNum: next || pagination.current,
      pageSize: pagination.pageSize
    };
    getAllocationRecord(params)
      .then(res => {
        this.setState({
          list: res.data.data,
          pagination: {
            ...pagination,
            current: next || pagination.current,
            total: res.data.totalSize
          },
          loading: false
        });
      })
      .catch(() => {});
  };

  columns = [
    {title: '申请单明细号', dataIndex: 'itemId'},
    {title: '申请单号', dataIndex: 'orderId'},
    {title: '申请单位/时间', dataIndex: 'storageName', render: (t, r) => <div>{r.storageName}<br/>{moment(r.applyDate).format('YYYY-MM-DD HH:mm:ss')}</div>},
    {title: '收货地址', dataIndex: 'receiver', render: (t, r) => <div>{r.receiver}<br/>{r.address}<br/>{r.contactPhone}</div>},
    {title: '分配数量', dataIndex: 'assignQuantity'},
    {title: '操作人/时间', dataIndex: 'operator', render: (t, r) => <div>{t}<br/>{moment(r.collectCreate).format('YYYY-MM-DD HH:mm:ss')}</div>}
  ];

  render() {
    const { list, pagination, loading } = this.state;
    return (
      <Table
        dataSource={list}
        columns={this.columns}
        pagination={{...pagination, onChange: next => this.loadList(next), showQuickJumper: true, showTotal: total => `共${total}条`}}
        loading={loading}
      />
    );
  }
}
