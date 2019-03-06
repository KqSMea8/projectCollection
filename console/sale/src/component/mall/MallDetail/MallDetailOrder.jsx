import React, {PropTypes} from 'react';
import {Table, message} from 'antd';
import ajax from 'Utility/ajax';

const columns = [
  {
    title: '订单编号',
    dataIndex: 'merFromOrderNum',
  },
  {
    title: '签约账号',
    dataIndex: 'merOrderLinkCards',
  },
  {
    title: '销售方案名称',
    dataIndex: 'merSalesPlanName',
  },
  {
    title: '生效状态',
    dataIndex: 'merOrderLinkStateMsg',
  },
  {
    title: '业务经理',
    dataIndex: 'merOrderLinkBizManager',
  },
  {
    title: '生效-结束时间',
    dataIndex: 'merOrderLinkGmtVaild',
    render(text, record) {
      return [text + '至', <br key="1"/>, record.merOrderLinkGmtInvaild];
    },
  },
];

const MallDetailOrder = React.createClass({
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
    this.fetchMerchantPid(params);
  },
  showTotal(total) {
    return `共 ${total} 条`;
  },
  refresh() {
    const {pageSize, current} = this.state.pagination;
    this.fetchMerchantPid({
      pageSize,
      pageNum: current,
    });
  },

  fetch(params) {
    this.setState({loading: true});
    ajax({
      url: '/sale/merchant/orderLinksList.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        const pagination = {...this.state.pagination};
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          pagination.total = result.totalCount;
          this.setState({
            loading: false,
            data: result.data,
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

  fetchMerchantPid(pageParams = {}) {
    const params = {
      shopId: this.props.id,
    };

    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/shopDetailConfig.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result && result.status === 'succeed') {
          pageParams.partnerId = result.data.pid;
          this.fetch(pageParams);
        } else {
          message.error(result.errorMsg, 3);
        }
      },
    });
  },

  rowKey(record) {
    return record.merFromOrderNum;
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

export default MallDetailOrder;
