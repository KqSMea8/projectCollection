import React, {PropTypes} from 'react';
import {Table} from 'antd';
import ajax from 'Utility/ajax';
import CommissionQueryTableAction from './CommissionQueryTableAction';

const CommissionQueryTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    this.columns = [{
      title: '数据状态',
      dataIndex: 'dataStatus',
    }, {
      title: '应结算时间',
      dataIndex: 'settleTime',
    }, {
      title: '开票公司',
      dataIndex: 'companyInfo',
    }, {
      title: '应结算总金额(元)',
      dataIndex: 'canSettleAmount',
    }, {
      title: '其他调整原因',
      dataIndex: 'otherAdjustReason',
    }, {
      title: '其他调整金额(元)',
      dataIndex: 'otherAdjustAmount',
    }, {
      title: '品类违规扣款(元)',
      dataIndex: 'pkPunishAmount',
    }, {
      title: '最终可付款总金额(元)',
      dataIndex: 'finalSettleAmount',
    }, {
      title: '操作',
      render: (_, r) => {
        return <CommissionQueryTableAction data={r} onRefresh={this.refresh} />;
      },
    }];

    return {
      data: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 10,
        current: 1,
      },
      loading: false,
      firstShow: true,
    };
  },

  // componentDidMount() {
  //   const {current, pageSize} = {...this.state.pagination};
  //   this.onTableChange({
  //     current,
  //     pageSize,
  //   });
  // },

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
      url: '/sale/rebate/merchantRebateQuery.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          const pagination = {...this.state.pagination};
          pagination.total = res.totalCount || res.data.length;

          res.data = res.data.map((d, i) => {
            d.key = i;
            return d;
          });

          this.setState({
            loading: false,
            firstShow: false,
            data: res.data,
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
    const {data, pagination, loading, firstShow} = this.state;
    const locale = {
      emptyText: firstShow ? '暂无数据，请输入查询条件搜索，必填条件：时间、活动名称、数据状态、账单类型' : '搜不到结果，换下其他搜索条件吧~',
    };

    return (
      <div>
        <Table columns={this.columns}
               locale={locale}
               dataSource={data}
               pagination={pagination}
               loading={loading}
               onChange={this.onTableChange}/>
      </div>
    );
  },
});

export default CommissionQueryTable;
