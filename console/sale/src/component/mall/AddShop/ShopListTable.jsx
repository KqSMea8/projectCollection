import React, {PropTypes} from 'react';
import {Button, message} from 'antd';
import ajax from 'Utility/ajax';
import Table from '../../../common/Table';
const ShopListTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
    mallId: PropTypes.any,
    rangeType: PropTypes.any,
    defaultData: PropTypes.any,
  },

  getInitialState() {
    return {
      data: [],
      loading: true,
      defaultData: this.props.defaultData || '',
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
    if (this.state.defaultData === 'roundTwo') {
      this.setState({
        loading: false,
      });
    }
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

  refresh(option) {
    const {pageSize, current} = this.state.pagination;
    if (option === 'roundTwo') {
      this.setState({
        defaultData: '',
      });
    }
    if (this.state.defaultData !== 'roundTwo') {
      this.fetch({
        pageSize,
        pageNum: current,
      });
    }
  },

  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.props.params,
    };
    this.setState({
      loading: true,
    });
    params.mallId = this.props.mallId;
    params.rangeType = this.props.rangeType;
    ajax({
      url: window.APP.crmhomeUrl + '/shop/queryNearbyShops.json.kb',
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
  AddShop(v) {
    const params = {};
    params.mallId = this.props.mallId;
    params.operateType = 'SURROUND_SHOP';
    params.source = 'sales_mg';
    if (this.state.selectedIds.length > 0) {
      params.relateShopId = this.state.selectedIds.join(',');
    } else {
      params.relateShopId = v;
    }
    ajax({
      url: window.APP.crmhomeUrl + '/shop/surroundShop.json.kb',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          message.success('操作成功', 3);
          this.refresh('roundTwo');
        }
      },
      error: (result) => {
        message.error(result.resultMsg);
      },
    });
  },
  render() {
    const mallId = this.props.mallId;
    const columns = [
      {
        title: '门店ID',
        width: 140,
        dataIndex: 'shopId',
      },
      {
        title: '门店名称',
        width: 180,
        dataIndex: 'shopName',
      },
      {
        title: '地址/联系方式',
        width: 210,
        dataIndex: 'address',
        render: (text, r) => {
          return (
            <div>
              <p>{r.address}</p>
              <p>{r.mobile}</p>
            </div>
        );
        },
      },
      {
        title: '所属综合体',
        width: 140,
        dataIndex: 'belongMallName',
      },
      {
        title: '品类',
        width: 130,
        dataIndex: 'category',
        render: (c) => {
          const category = JSON.parse(c);
          return (
            <p>
              <span>{category.category.name}</span>
              <span style={{margin: '0 4px'}}>-</span>
              <span>{category.subcategory.name}</span>
              <span style={{margin: '0 4px'}}>-</span>
              <span>{category.detailcategory.name}</span>
            </p>
        );
        },
      },
      {
        title: '操作',
        width: 110,
        dataIndex: '',
        render: (text, r) => {
          let operation = '';
          if (!r.belongMallId) {
            operation = <a onClick={this.AddShop.bind(this, r.shopId)}>添加</a>;
          } else {
            if (r.belongMallId === mallId) {
              operation = <span style={{color: '#ccc'}}>已添加</span>;
            } else if (r.belongMallId !== mallId) {
              operation = <span style={{color: '#ccc'}}>无法添加</span>;
            }
          }
          return (operation);
        },
      },
    ];
    const {loading, data, pagination, selectedIds} = this.state;
    this.rowSelection = {
      selectedRowKeys: selectedIds,
      onChange: this.onSelectChange,
      getCheckboxProps(record) {
        return {
          disabled: (record.belongMallId),
        };
      },
    };
    const buttonArea = (
      !loading && data && data.length > 0 && (<div>
          <span style={{marginRight: 12}}>已选({selectedIds.length})</span>
            <Button disabled={selectedIds.length === 0 && true} type="primary" onClick={this.AddShop}>
              批量添加
            </Button>
        </div>
      )
    );
    return (
      <div>
        {buttonArea && <div style={{marginBottom: 10}}>{buttonArea}</div>}
        <Table columns={columns}
          rowKey={r => r.shopId}
          loading={loading}
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

export default ShopListTable;
