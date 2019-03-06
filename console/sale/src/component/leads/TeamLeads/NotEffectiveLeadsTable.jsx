import Table from '../../../common/Table';
import ajax from 'Utility/ajax';
import React, {PropTypes} from 'react';
// import LeadsAlloc from '../common/LeadsAlloc';

const NotEffectiveLeadsTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    this.columns = [{
      title: '门店名',
      width: 95,
      dataIndex: 'name',
      render(_, r) {
        return r.name + (r.branchName ? '(' + r.branchName + ')' : '');
      },
    }, {
      title: '创建人/创建时间',
      width: 95,
      dataIndex: 'providerBdId',
      render(_, r) {
        return (<div>
          <div> {r.creatorName} </div>
          <div> {r.createTime} </div>
        </div>);
      },
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
      title: '审核状态',
      width: 55,
      dataIndex: 'statusDesc',
    }, {
      title: '操作',
      width: 95,
      dataIndex: '',
      render: (_, r) => {
        return (<div>
          <a href={'#/leads/waited/detail/' + r.orderId + '/diary'}>查看</a>
        </div>);
      },
    }];
    return {
      data: [],
      selectedIds: [],
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
    if (pager.current !== pagination.current || pager.pageSize !== pagination.pageSize) {
      this.setState({
        selectedIds: [],
      });
    }
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    });
    const params = {
      pageSize: pagination.pageSize,
      current: pagination.current,
    };
    this.fetch(params);
  },
  onSelect(record, selected) {
    let {selectedIds} = this.state;
    if (selected) {
      if (selectedIds.indexOf(record.id) === -1) {
        selectedIds = selectedIds.concat(record.id);
      }
    } else {
      selectedIds = selectedIds.filter((r)=> {
        return r.id !== record.id;
      });
    }
    this.setState({selectedIds});
  },
  onSelectAll(selected, selectedRows) {
    if (selected) {
      this.setState({
        selectedIds: selectedRows.map(r=>r.id),
      });
    } else {
      this.setState({
        selectedIds: [],
      });
    }
  },
  refresh(update) {
    const {pageSize, current} = this.state.pagination;
    this.onTableChange({
      current: update ? current : 1,
      pageSize,
    });
  },
  fetch(pageParams = {}) {
    const params = {
      ...pageParams,
      ...this.props.params,
    };
    if (params.current) {
      params.pageNum = params.current;
    }
    this.setState({loading: true});
    ajax({
      url: '/sale/leads/queryTeamCrOrder.json',
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
  showTotal(total) {
    return `共 ${total} 条`;
  },
  render() {
    const {data, pagination, loading} = this.state;
    return (
      <div>
        <div>
          <Table columns={this.columns}
                 rowSelection={this.rowSelection}
                 rowKey={r => r.leadsId}
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

export default NotEffectiveLeadsTable;
