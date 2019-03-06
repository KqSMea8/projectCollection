import { Table } from 'antd';
import ajax from 'Utility/ajax';
import React, {PropTypes} from 'react';

const panIndustry = {
  PAN_INDUSTRY: '泛行业服务商',
  CATERING_FMCG: '城市服务商',
};

const GatheringshopTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },
  getInitialState() {
    this.columns = [{
      title: '商户名称/商户PID',
      dataIndex: 'merchantName',
      render(text, record) {
        return (<span>
          {text}<br/>
          {record.merchantPid}
        </span>);
      },
    }, {
      title: '商户地址/联系电话',
      dataIndex: 'merchantAddress',
      render(text, record) {
        return (<span>
          {text}<br/>
          {record.merchantMobile}
        </span>);
      },
    }, {
      title: '商户来源',
      dataIndex: 'source',
      render(text) {
        return panIndustry[text] || text;
      },
    }, {
      title: '归属BD',
      dataIndex: 'brokerBd',
    }, {
      title: '服务商名称/员工',
      dataIndex: 'brokerName',
      render(text, record) {
        return (<span>
          {text}<br/>
          {record.staffName}
        </span>);
      },
    }];

    return {
      data: [],
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 10,
        showTotal: this.showTotal,
        current: 1,
      },
      loading: true,
    };
  },

  componentDidMount() {
    const {current, pageSize} = {...this.state.pagination};
    this.onTableChange({
      current,
      pageSize,
    });
  },

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.refresh();
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

  showTotal(total) {
    return `共 ${total} 条记录`;
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

    this.setState({loading: true});

    ajax({
      url: '/sale/merchant/payMerchantList.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          const pagination = {...this.state.pagination};
          pagination.total = res.data.totalItems || res.data.data.length;
          this.setState({
            loading: false,
            data: res.data.data,
            pagination,
          });
        }
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
    const locale = {};
    if (this.props.params) {
      locale.emptyText = '搜不到结果，换下其他搜索条件吧~';
    } else {
      locale.emptyText = '暂无数据，请输入查询条件搜索';
    }
    return (
      <div>
        <Table columns={this.columns}
               bordered
               dataSource={data}
               pagination={pagination}
               loading={loading}
               locale={locale}
               onChange={this.onTableChange}/>
      </div>
    );
  },
});

export default GatheringshopTable;
