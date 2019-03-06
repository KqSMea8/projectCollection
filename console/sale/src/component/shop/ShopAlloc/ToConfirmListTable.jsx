import React, {PropTypes} from 'react';
import {Button, Popconfirm, message} from 'antd';
import ajax from 'Utility/ajax';
import permission from '@alipay/kb-framework/framework/permission';
import Table from '../../../common/Table';
import {tagMap} from '../../../common/ShopTagSelect';
import ToConfirmAction from './ToConfirmAction';
import ShopAlloc from '../common/ShopAlloc';
import {remoteLog} from '../../../common/utils';

const ToConfirmListTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    const columns = [
      {
        title: ['门店名称', <br key="1"/>, '门店ID'],
        dataIndex: 'shopName',
        width: 120,
        render(text, record) {
          return (<span>
            {text}<br/>
            {record.shopId}
          </span>);
        },
      },
      {
        title: '地址',
        dataIndex: 'address',
        width: 100,
        render(text, record) {
          return [record.provinceName, record.cityName, record.districtName].join('-') + ' ' + text;
        },
      },
      {
        title: '商户名称',
        dataIndex: 'merchantName',
        width: 150,
      },
      {
        title: '品牌',
        dataIndex: 'brandName',
        width: 50,
      },
      {
        title: '服务商',
        dataIndex: 'brokerName',
        width: 50,
      },
      {
        title: '门店标签',
        dataIndex: 'shopTagCodes',
        width: 100,
        render(text) {
          return text ? text.map(v => (tagMap[v] || v)).join('、') : '';
        },
      },
      {
        title: '操作',
        dataIndex: '',
        width: 100,
        render: (text, record) => {
          return <ToConfirmAction row={{...record}} onConfirmAlloc={this.confirmAlloc.bind(this, record.orderId)} onEnd={this.refresh}/>;
        },
      },
    ];
    this.rowSelection = {
      onSelect: this.onSelect,
      onSelectAll: this.onSelectAll,
    };
    return {
      columns,
      data: [],
      loading: true,
      selectedRows: [],
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 10,
        showTotal: (total) => {
          return `共${total}个记录`;
        },
        current: 1,
      },
    };
  },

  componentDidMount() {
    this.refresh();
  },

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.onTableChange({
        current: 1,
        pageSize: this.state.pagination.pageSize,
      });
    }
  },

  onTableChange(pagination) {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    const params = {
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
    };
    this.fetch(params);
  },

  onSelect(record, selected) {
    let {selectedRows} = this.state;
    if (selected) {
      if (selectedRows.map(r => r.shopId).indexOf(record.shopId) === -1) {
        selectedRows = selectedRows.concat({...record});
      }
    } else {
      selectedRows = selectedRows.filter((row)=> {
        return row.shopId !== record.shopId;
      });
    }
    this.setState({selectedRows});
  },

  onSelectAll(selected, _, changeRows) {
    let {selectedRows} = this.state;
    changeRows.forEach((record) => {
      if (selected) {
        if (selectedRows.map(r => r.shopId).indexOf(record.shopId) === -1) {
          selectedRows = selectedRows.concat({...record});
        }
      } else {
        selectedRows = selectedRows.filter((row)=> {
          return row.shopId !== record.shopId;
        });
      }
    });
    this.setState({selectedRows});
  },

  refresh(needClear) {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      needClear,
      pageSize,
      pageNum: current,
    });
  },

  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.props.params,
    };
    this.setState({
      loading: true,
    });
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/waitingConfirmList.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        result.data = result.data || {};
        const pagination = {...this.state.pagination};
        pagination.total = result.data.totalItems;
        this.setState({
          selectedRows: pageParams.needClear ? [] : this.state.selectedRows,
          loading: false,
          data: result.data.data || [],
          pagination,
        });
      },
    });
  },

  confirmAllocPostData(ids) {
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/confirmAssign.json',
      method: 'post',
      data: {
        orderIds: ids.join(','),
      },
      success: (result)=> {
        if (result.status === 'failed') {
          message.error('操作失败，请重试');
          return;
        }
        message.success('操作成功');
        this.clearSelectedRows();
        setTimeout(this.refresh.bind(this), 1500);
      },
    });
  },

  clearSelectedRows() {
    this.setState({selectedRows: []});
  },

  confirmAlloc(id, e) {
    if (e) {
      e.preventDefault();
    }
    remoteLog('SHOP_CONFIRM_ALLOC');
    this.confirmAllocPostData([id]);
  },

  confirmAllocMultiple() {
    const { selectedRows } = this.state;
    if (selectedRows.length > 100) {
      return message.warn('最多选择100家门店');
    }
    remoteLog('SHOP_BATCH_CONFIRM_ALLOC');
    this.confirmAllocPostData(this.state.selectedRows.map(r => r.orderId));
  },

  rowKey(record) {
    return record.shopId;
  },

  render() {
    const {columns, loading, data, pagination, selectedRows} = this.state;

    const buttonArea = (
      (permission('SHOP_REASSIGN') || permission('SHOP_CONFIRM_ASSIGN')) && !loading && data.length > 0 && (<div>
          <span style={{marginRight: 12}}>已选({selectedRows.length})</span>
          {permission('SHOP_REASSIGN') && <ShopAlloc onEnd={this.refresh.bind(this, true)}
            selectedRows={selectedRows} buttonText="重新分配" />}
          {permission('SHOP_CONFIRM_ASSIGN') && (<Popconfirm placement="top" title="确定生效吗？" onConfirm={this.confirmAllocMultiple}>
            <Button type="primary" disabled={selectedRows.length === 0}>确认当前分配</Button>
          </Popconfirm>)}
        </div>
      )
    );
    this.rowSelection.selectedRowKeys = selectedRows.map((d) => d.shopId);
    return (
      <div>
        {buttonArea && <div style={{marginBottom: 10}}>{buttonArea}</div>}
        <Table columns={columns}
          rowKey={this.rowKey}
          rowSelection={this.rowSelection}
          dataSource={data}
          loading={loading}
          pagination={pagination}
          firstShow={!this.props.params}
          onChange={this.onTableChange} />
        {buttonArea && <div style={{marginTop: -44}}>{buttonArea}</div>}
      </div>
    );
  },
});

export default ToConfirmListTable;
