import React, {PropTypes} from 'react';
import {Modal, Table, message} from 'antd';
import ajax from '../../../common/ajax';

const columns = [{
  title: '门店名称',
  dataIndex: 'shopName',
  key: 'name',
}];

const ShopListModal = React.createClass({
  propTypes: {
    shopListModal: PropTypes.bool,
  },
  getInitialState() {
    return {
      shopList: [],
      pagination: {
        showQuickJumper: true,
        showSizeChanger: false,
        pageSize: 10,
        showTotal: (total) => {
          return `共${total}个记录`;
        },
        current: 1,
      },
      visible: false,
    };
  },
  componentWillMount() {
    this.refresh();
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
      pageNo: pagination.current,
    };
    this.fetch(params);
  },

  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
    };
    this.setState({
      loading: true,
    });
    params.leadsId = this.props.leadsId;
    ajax({
      url: `${window.APP.kbservindustryprodUrl}/item/leads/queryShopsByItemLeadsId.json`,
      method: 'get',
      useIframeProxy: true,
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status && result.status === 'succeed') {
          const pagination = {...this.state.pagination};
          pagination.total = result.page.totalSize;
          const data = {...pagination};
          data.data = result.data;
          this.setState({
            shopList: data.data,
            loading: false,
            pagination,
          });
        }
      },
      error: (result) => {
        this.setState({
          loading: false,
        });
        message.error(result);
      },
    });
  },

  refresh() {
    const {pageSize, current} = this.state.pagination;
    this.fetch({
      pageSize,
      pageNo: current,
    });
  },

  render() {
    const { pagination, loading, shopList } = this.state;
    return (<Modal footer={null}
              title="门店列表"
              visible={this.props.shopListModal}
              onCancel={this.props.cancelShopListModal}>
                <Table className="kb-shop-list-table"
                  columns={columns}
                  showHeader={false}
                  dataSource={shopList}
                  rowKey={r => r.shopId}
                  size="small"
                  loading={loading}
                  pagination={pagination}
                  onChange={this.onTableChange} />
            </Modal>);
  },
});

export default ShopListModal;
