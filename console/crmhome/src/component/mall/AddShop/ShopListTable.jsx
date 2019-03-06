import React, {PropTypes} from 'react';
import {Button, message} from 'antd';
import ajax from '../../../common/ajax';
import Table from '../../../common/Table';

const ShopListTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
    mallId: PropTypes.any,
    mallDistanceData: PropTypes.object,
    range: PropTypes.any,
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
    this.setState({
      loading: true,
    });
    params.mallId = this.props.mallId;
    params.rangeType = this.props.range === '1' ? this.props.mallDistanceData.distance.near : this.props.mallDistanceData.distance.far;
    ajax({
      url: '/shop/queryNearbyShops.json',
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
    });
  },

  AddShop(v) {
    const params = {};
    params.mallId = this.props.mallId;
    params.operateType = 'SURROUND_SHOP';
    params.source = 'crm_home';
    if (this.state.selectedIds.length > 0) {
      params.relateShopId = this.state.selectedIds.join(',');
    } else {
      params.relateShopId = v;
    }
    ajax({
      url: '/shop/surroundShop.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          message.success('操作成功');
          setTimeout(() => {
            this.refresh();
          }, 1000);
        }
      },
    });
  },

  render() {
    const mallId = this.props.mallId;
    const columns = [
      {
        title: '门店ID',
        dataIndex: 'shopId',
        width: 140,
      },
      {
        title: '门店名称',
        dataIndex: 'shopName',
        width: 180,
      },
      {
        title: '地址/联系方式',
        dataIndex: 'address',
        width: 210,
        render: (text, record) => {
          return [
            text,
            <br key={1}/>,
            record.mobile ? 'Tel：' + record.mobile : '',
          ];
        },
      },
      {
        title: '所属综合体',
        dataIndex: 'belongMallName',
        width: 140,
      },
      {
        title: '品类',
        dataIndex: 'category',
        width: 130,
        render: (c) => {
          const category = JSON.parse(c);
          return [category.category.name, category.subcategory.name, category.detailcategory.name].filter(r => r).join('-');
        },
      },
      {
        title: '操作',
        dataIndex: '',
        width: 110,
        render: (text, r) => {
          let operation = '';
          if (!r.belongMallId) {
            operation = <a onClick={this.AddShop.bind(this, r.shopId)}>添加</a>;
          } else {
            if (r.belongMallId === mallId) {
              operation = <span>已添加</span>;
            } else if (r.belongMallId !== mallId) {
              operation = <span>无法添加</span>;
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
