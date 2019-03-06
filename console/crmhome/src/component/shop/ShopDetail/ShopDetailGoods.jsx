import React, {PropTypes} from 'react';
import {Table, message, Tag} from 'antd';
import ajax from '../../../common/ajax';
import {typeMap, statusMap} from '../common/GoodsConfig';

const columns = [{
  title: '商品ID',
  dataIndex: 'itemId',
}, {
  title: '商品名称',
  dataIndex: 'subject',
}, {
  title: '类型',
  dataIndex: 'typeDisplay',
  width: 80,
  render(text) {
    return typeMap[text] || text;
  },
},
  {
    title: '可领取时间',
    dataIndex: 'takeTime',
    width: 90,
  }, {
    title: (<div>库存/<div style={{color: '#f60'}}>已领</div></div>),
    dataIndex: 'salesQuantity',
    width: 100,
    render(text, record) {
      return (<div>
        <div>{record.totalInventory + '/'}</div>
        <span style={{color: '#f60'}}>{text}</span>
      </div>);
    },
  }, {
    title: '商品状态',
    dataIndex: 'statusDisplay',
    width: 90,
    render(text, record) {
      let msg;
      if (statusMap[text]) {
        msg = [statusMap[text].substr(0, 3), record.visibility === 'WHITELIST' ? <span style={{marginLeft: '5px'}}><Tag color="yellow">测</Tag></span> : '', <br/>, statusMap[text].substr(3)];
      } else {
        msg = text;
      }
      return msg;
    },
  }, {
    title: '使用方式',
    width: 90,
    render(text, record) {
      return record.useMode === '0' ? '需要用户领取' : '无需用户领取';
    },
  },
  ];

const ShopDetailGoods = React.createClass({
  propTypes: {
    id: PropTypes.string,
  },

  getInitialState() {
    return {
      data: [],
      loading: true,
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 10,
        showTotal: this.showTotal,
        current: 1,
      },
    };
  },

  componentDidMount() {
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
      pageNum: pagination.current,
    };
    this.fetch(params);
  },

  showTotal(total) {
    return `共 ${total} 条`;
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
      shopId: this.props.id,
      ...pageParams,
    };
    this.setState({loading: true});
    ajax({
      url: '/goods/crm/itemList.json',
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        const pagination = {...this.state.pagination};
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          pagination.total = result.data.totalItems;
          this.setState({
            loading: false,
            data: result.data.data,
            pagination,
          });
        } else {
          this.setState({loading: false});
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
    });
  },

  rowKey(record) {
    return record.itemId;
  },

  render() {
    return (
      <div>
        <Table columns={columns}
          rowKey={this.rowKey}
          dataSource={this.state.data}
          loading={this.state.loading}
          pagination={this.state.pagination}
          onChange={this.onTableChange}
          bordered/>
      </div>
    );
  },
});

export default ShopDetailGoods;
