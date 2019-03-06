import React, {PropTypes} from 'react';
import {Table, message, Tag} from 'antd';
import ajax from 'Utility/ajax';
import {typeMap, statusMap, type2HashMap} from '../../goods/common/GoodsConfig';
import {format, formatTime} from '../../../common/dateUtils';

const columns = [{
  title: '类型',
  dataIndex: 'typeDisplay',
  width: 80,
  render(text) {
    return typeMap[text] || text;
  },
}, {
  title: '商品ID',
  dataIndex: 'itemId',
}, {
  title: '商品名称',
  dataIndex: 'subject',
}, {
  title: '商户名称',
  dataIndex: 'partnerName',
}, {
  title: '使用方式',
  dataIndex: 'useMode',
  width: 90,
  render(text, record) {
    return record.useMode === '0' ? '需要用户领取' : '无需用户领取';
  },
}, {
  title: '创建时间',
  dataIndex: 'gmtCreateMills',
  width: 80,
  render(text) {
    return format(new Date(text)) + ' ' + formatTime(new Date(text));
  },
}, {
  title: '已领/库存',
  dataIndex: 'salesQuantity',
  width: 100,
  render(text, record) {
    return text + '/' + record.totalInventory;
  },
}, {
  title: '状态',
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
  title: '操作',
  width: 100,
  render(text, record) {
    return (<div>
      <a href={'#' + type2HashMap[record.typeDisplay] + record.itemId} target = "_blank">查看</a>
    </div>);
  },
}];

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
      url: window.APP.crmhomeUrl + '/goods/koubei/itemList.json',
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
          onChange={this.onTableChange} />
      </div>
    );
  },
});

export default ShopDetailGoods;
