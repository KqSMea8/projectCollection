import Table from '../../../../common/Table';
import ajax from 'Utility/ajax';
import React, {PropTypes} from 'react';

const openWaitedLeadsStatusMap = {
  INIT: '未认领',
  CLAIMED: '已认领',
  CONFIRMING: '待商户确认',
  OPENED: '已开店',
  OPENING: '开店中',
  PROCESSING: '审核中',
  FAILED: '审核驳回',
};

const WaitedLeadsTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    this.columns = [{
      title: '门店名',
      width: 95,
      dataIndex: 'name',
    }, {
      title: '公司名称',
      width: 95,
      dataIndex: 'companyName',
    }, {
      title: '区域',
      width: 95,
      dataIndex: 'address',
      render(_, r) {
        return r.provinceName + '-' + r.cityName + (r.districtName ? ('-' + r.districtName) : '') + ' ' + r.address;
      },
    }, {
      title: '品类',
      width: 95,
      dataIndex: 'categoryName',
    }, {
      title: '品牌',
      width: 95,
      dataIndex: 'brandName',
    }, {
      title: '流水状态',
      width: 95,
      dataIndex: 'statusCode',
      render(_) {
        return openWaitedLeadsStatusMap[_] || _;
      },
    }, {
      title: '操作',
      width: 95,
      dataIndex: '',
      render: (_, r) => {
        return (<div>
          <a href={'#/leads/waited/detail/' + r.orderId + '/diary'}>查看</a>
          {r.statusCode === 'FAILED' || r.statusDesc === '已认领' ? <span>&nbsp;<span className="ant-divider"></span>&nbsp;<a onClick={() => window.open('?mode=modify#/leads/waited/edit/' + r.orderId)}>修改</a></span> : null}
        </div>);
      },
    }];
    return {
      data: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: this.showTotal,
        pageSize: 10,
        current: 1,
      },
      loading: false,
    };
  },
  componentDidMount() {
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
    return `共 ${total} 条`;
  },
  refresh() {
    const {pageSize} = this.state.pagination;
    this.onTableChange({
      current: 1,
      pageSize,
    });
  },
  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.props.params,
    };
    this.setState({loading: true});
    ajax({
      url: '/sale/leads/queryUneffective.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        const pagination = {...this.state.pagination};
        pagination.total = result.data.totalCount;
        this.power = result.power;
        this.setState({
          loading: false,
          data: result.data.queryResult.shopLeadses,
          pagination,
        });
      },
    });
  },
  render() {
    const {data, pagination, loading} = this.state;
    return (
      <div>
        <div>
          <Table columns={this.columns}
                 rowKey={r=>r.orderId}
                 rowSelection={this.rowSelection}
                 dataSource={data}
                 firstShow={!this.props.params}
                 pagination={pagination}
                 loading={loading}
                 onChange={this.onTableChange}/>
        </div>
      </div>
    );
  },
});

export default WaitedLeadsTable;
