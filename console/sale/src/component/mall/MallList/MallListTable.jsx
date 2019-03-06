import React, {PropTypes} from 'react';
import {Button, Modal, message} from 'antd';
import ajax from 'Utility/ajax';
import Table from '../../../common/Table';

const MallListTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
    shopStatus: PropTypes.any,
    mallId: PropTypes.any,
  },

  getInitialState() {
    return {
      data: [],
      loading: true,
      selectedIds: [],
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

  componentWillMount() {
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

  onSelectChange(selectedRowKeys) {
    this.setState({
      selectedIds: selectedRowKeys,
    });
  },

  refresh() {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNum: current,
    });
  },

  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.props.params,
    };
    params.mallId = this.props.mallId;
    this.setState({
      loading: true,
    });
    let Url = '';
    if (this.props.shopStatus === '1' ) {
      Url = window.APP.crmhomeUrl + '/shop/querySurroundedShops.json.kb';
    } else if (this.props.shopStatus === '2') {
      Url = window.APP.crmhomeUrl + '/shop/queryToBeConfirmShops.json.kb';
    }
    params.mallId = this.props.mallId;
    ajax({
    //  url: window.APP.crmhomeUrl + '/shop/myShops.json',
      url: Url,
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        result.data = result.data || {};
        const pagination = {...this.state.pagination};
        pagination.total = result.data.totalItems;
        this.setState({
          loading: false,
          data: result.data.data || [],
          pagination,
        });
      },
      error: (result) => {
        this.setState({
          loading: false,
        });
        message.error(result.resultMsg);
      },
    });
  },
  removeShop(v, removeSum) {
    Modal.confirm({
      title: '你确定移出当前选择的门店吗？',
      content: '请确定门店确实不在本综合体里',
      okText: '确认',
      cancelText: '取消',
      onOk: this.changerStatus.bind(this, v, removeSum),
      onCancel: this.closeWindow,
    });
    this.setState({
      removeList: true,
    });
  },
  closeWindow() {
    window.close();
  },
  changerStatus(id, removeSum) {
    const params = {};
    params.mallId = this.props.mallId;
    params.operateType = 'REMOVE_SHOP';   // 移除
    params.source = 'sales_mg';
    if (removeSum === 'removeList' ) {
      params.relateShopId = id.join(',');
    }
    if (removeSum === 'removeOne') {
      params.relateShopId = id;
    }
    ajax({
      url: window.APP.crmhomeUrl + '/shop/surroundShop.json.kb',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status) {
          message.success('操作成功，已通知商户', 3);
          this.fetch();
        }
      },
      error: (e) => {
        message.error(e.resultMsg, 3);
      },
    });
  },
  render() {
    const columns = [
      {
        title: '门店名称/门店ID',
        dataIndex: 'shopName',
        width: 160,
        render: (t, r) => {
          return (
            <div key={t}>
              <p>{r.shopName}</p>
              <p>{r.shopId}</p>
            </div>);
        },
      },
      {
        title: '品牌名称',
        width: 140,
        dataIndex: 'brandName',
      },
      {
        title: '归属BD/服务商',
        width: 110,
        dataIndex: 'merchantName',
        render: (t, r) => {
          return (
            <div key={t}>
              <p>{r.merchantPid}</p>
              <p>{r.merchantName}</p>
            </div>);
        },
      },
      {
        title: '地址/联系方式',
        width: 240,
        dataIndex: 'address',
        render: (t, r) => {
          return (
            <div key={t}>
              <p>{r.address}</p>
              <p>{r.mobile}</p>
            </div>);
        },
      },
      {
        title: '品类',
        width: 120,
        dataIndex: 'category',
        render: (c) => {
          if (c) {
            const category = JSON.parse(c) || {};
            return (
              <p>
                <span>{category.category.name}</span>
                <span style={{margin: '0 4px'}}>-</span>
                <span>{category.subcategory.name}</span>
                <span style={{margin: '0 4px'}}>-</span>
                <span>{category.detailcategory.name}</span>
              </p>
          );
          }
        },
      },
      {
        title: '操作',
        width: 120,
        dataIndex: '',
        render: (text, r) => {
          return (<a onClick={this.removeShop.bind(this, r.shopId, 'removeOne')}>移除</a>);
        },
      },
    ];
    const {loading, data, pagination, selectedIds} = this.state;
    this.rowSelection = {
      selectedRowKeys: selectedIds,
      onChange: this.onSelectChange,
    };
    const buttonArea = (
      !loading && data && data.length > 0 && (<div>
          <span style={{marginRight: 12}}>已选({selectedIds.length})</span>
            <Button disabled={selectedIds.length === 0 && true} type="primary" onClick={this.removeShop.bind(this, selectedIds, 'removeList')}>
              批量移除
            </Button>
        </div>
      )
    );
    return (
      <div>
        {buttonArea && <div style={{marginBottom: 10}}>{buttonArea}</div>}
        <Table columns={columns}
          loading={loading}
          rowKey={r => r.shopId}
          rowSelection={this.rowSelection}
          dataSource={data}
          pagination={pagination}
          firstShow={!this.props.params}
          onChange={this.onTableChange} />
        {buttonArea && <div style={{marginTop: -44}}>{buttonArea}</div>}
      </div>
    );
  },
});

export default MallListTable;
