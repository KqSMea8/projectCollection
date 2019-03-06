import React, {PropTypes} from 'react';
import {Table} from 'antd';
import ajax from 'Utility/ajax';

function gotoOrderDetail(r, e) {
  e.preventDefault();
  window.open(window.APP.salesmngUrl + '/order/orderInfo.htm?orderNum=' + r.merFromOrderNum);
}

const MerchantOrder = React.createClass({
  propTypes: {
    pid: PropTypes.any,
  },

  getInitialState() {
    this.columns = [{
      title: '订单编号',
      dataIndex: 'merFromOrderNum',
    }, {
      title: '签约账号',
      dataIndex: 'merOrderLinkCards',
      render(v) {
        return (<div className="ft-ellipsis" style={{width: 300}}>
          {v.join('  ')}
        </div>);
      },
    }, {
      title: '销售方案名称',
      dataIndex: 'merSalesPlanName',
      width: 260,
    }, {
      title: '生效状态',
      dataIndex: 'merOrderLinkStateMsg',
      width: 100,
    }, {
      title: '业务经理',
      dataIndex: 'merOrderLinkBizManager',
    }, {
      title: '生效-结束时间',
      render(v, r) {
        return (r.merOrderLinkGmtVaild && r.merOrderLinkGmtInvaild) ? (<span>
          {r.merOrderLinkGmtVaild}至<br/>
          {r.merOrderLinkGmtInvaild}
        </span>) : null;
      },
    }, {
      title: '操作',
      render(_, r) {
        return (<div>
          <a onClick={gotoOrderDetail.bind(this, r)}>查看订单详情</a>
        </div>);
      },
    }];

    return {
      data: [],
      loading: true,
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 10,
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
      partnerId: this.props.pid,
    };
    ajax({
      url: '/sale/merchant/orderLinksList.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        const pagination = {...this.state.pagination};
        pagination.total = result.totalCount;
        this.setState({
          loading: false,
          data: result.data,
          pagination,
        });
      },
      error: () => {
        this.setState({
          loading: false,
          data: [],
        });
      },
    });
  },

  render() {
    const {data, pagination, loading} = this.state;
    return (
      <Table columns={this.columns}
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={this.onTableChange}/>
    );
  },
});

export default MerchantOrder;
