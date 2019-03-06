import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import Table from '../../../../common/Table';

const AcceptanceStaffTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    const columns = [{
      title: '验收人员名称',
      width: 95,
      dataIndex: 'staffName',
    }, {
      title: '负责任务',
      width: 95,
      dataIndex: 'ResTask',
    }, {
      title: '操作',
      width: 95,
      dataIndex: '',
      render: (_, r) => {
        return (<div>
          <a href={'#/leads/waited/detail/' + r.orderId}>查看</a>
          {r.statusCode === 'FAILED' || r.statusDesc === '已认领' ? <span>&nbsp;<span className="ant-divider"></span>&nbsp;<a onClick={() => window.open('?mode=modify#/leads/waited/edit/' + r.orderId)}>修改</a></span> : null}
        </div>);
      },
    }];
    return {
      columns,
      data: [],
      loading: false,
      selectedIds: [],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: this.showTotal,
        pageSize: 10,
        current: 1,
      },
    };
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
      url: '/sale/material/AcceptanceStaff.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        const pagination = {...this.state.pagination};
        pagination.total = result.data.totalCount;
        this.power = result.power;
        this.setState({
          loading: false,
          data: result.data,
          pagination,
        });
      },
    });
  },
  render() {
    const {data, pagination, loading, columns} = this.state;
    return (
      <div>
        <div>
          <Table columns={columns}
                 rowKey={r=>r.orderId}
                 rowSelection={this.rowSelection}
                 dataSource={data}
                 firstShow={!this.props.params}
                 pagination={pagination}
                 loading={loading}
                 onChange={this.onTableChange}
                 bordered/>
        </div>
      </div>
    );
  },
});

export default AcceptanceStaffTable;
