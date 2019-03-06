import React, { Component } from 'react';
import { Table, message } from 'antd';
import { getApplyItems } from '../../../common/api';
import moment from 'moment';

export default class ApplyItemsTable extends Component {
  constructor() {
    super();
  }

  state = {
    pagination: {
      total: 0,
      pageSize: 10,
      current: 1
    },
    list: [],
    loading: false,
    selectedRows: []
  };

  componentDidMount() {
    this.loadList();
  }

  handleSelectChange = (keys, rows) => {
    // validate
    const { order, onSelectedOk } = this.props;
    if (rows.reduce((total, row) => total + row.applyQuantity, 0) > order.stockQuantity) {
      message.error('库存不足');
      return;
    }
    this.setState({selectedRows: rows}, () => onSelectedOk(rows));
  };

  handleChangePage = next => {
    const { selectedRows } = this.state;
    // validate
    if (selectedRows.length > 0) {
      message.warn('当前已勾选订单，无法进行此操作');
      return;
    }
    this.loadList(next);
  };

  loadList = next => {
    const { produceOrderId, templateId, materialCode } = this.props.order;
    const { pagination } = this.state;
    this.setState({loading: true});
    getApplyItems({
      produceOrderId,
      templateId,
      materialCode,
      pageNum: next || pagination.current,
      pageSize: pagination.pageSize
    })
      .then(res => {
        this.setState({
          loading: false,
          pagination: {
            ...pagination,
            current: next || pagination.current,
            total: res.data.totalSize
          },
          list: res.data.data
        });
      })
      .catch(() => {
        let nextState = {loading: false};
        if (!next) {
          nextState = {
            ...nextState,
            current: 1,
            total: 0
          };
        }
        this.setState(nextState);
      });
  };

  columns = [
    {
      title: '申请单明细号',
      dataIndex: 'orderId',
    }, {
      title: '申请单位／时间',
      dataIndex: 'storageName',
      render: (t, r) => (
        <div>
          {t}<br/>
          {r.gmtCreate && moment(r.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}
        </div>
      )
    }, {
      title: '收货人／地址／电话',
      dataIndex: 'receiver',
      render(text, record) {
        return (<div>
          {record.receiver}<br/>
          {record.receiverAddress}<br/>
          {record.contactPhone}
        </div>);
      },
    }, {
      title: '申请数量',
      dataIndex: 'applyQuantity',
    }
  ];

  render() {
    const { pagination, list, loading, selectedRows } = this.state;
    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys: selectedRows.map(r => r.itemId),
      onChange: this.handleSelectChange
    };
    const pagiCfg = {
      ...pagination,
      onChange: this.handleChangePage,
      showQuickJumper: true, showTotal: t => `共${t}条`,
    };
    return (
      <Table
        style={{marginTop: 10}}
        loading={loading}
        columns={this.columns}
        dataSource={list}
        rowKey={r => r.itemId}
        rowSelection={rowSelection}
        pagination={pagiCfg}
      />
    );
  }
}
