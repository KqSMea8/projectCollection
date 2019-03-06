import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';

import ListUtil from './ListUtil';
import { getTodoFlowList } from '../../common/api';
import FlowTitle from './FlowTitle';
import SingleListTable from './SingleListTable';

class FlowListTable extends React.Component {
  static propTypes = {
    /* eslint react/forbid-prop-types:0 */
    search: PropTypes.object
  };
  static defaultProps = {
    search: {}
  };
  constructor() {
    super();
    this.state.pagination = {...this.initialPagination};
  }
  state = {
    pagination: {},
    list: [],
    loading: false
  };
  componentDidMount() {
    this.loadList();
  }
  componentWillReceiveProps(next) {
    this.loadList({ search: next.search, next: 1 });
  }
  initialPagination = {
    current: 1,
    total: 0,
    pageSize: 10,
    showTotal: total => `共${total}条`,
    showSizeChanger: true,
    showQuickJumper: true,
    onChange: next => this.loadList({next}),
    onShowSizeChange: (current, pageSize) => {
      this.setState({ pagination: { ...this.state.pagination, pageSize, current: 1 } }, this.loadList);
    },
  };
  columns = [
    {
      title: '流名称',
      dataIndex: '-',
      render: (t, r) => <FlowTitle data={r}/>
    }
  ];
  loadList = ({next, search} = {}) => {
    const { pagination } = this.state;
    const searchParams = {
      ...ListUtil.composeSearchParams(search || this.props.search),
      pageSize: pagination.pageSize,
      pageNo: next || pagination.current
    };
    this.setState({ loading: true });
    getTodoFlowList(searchParams)
      .then((resp) => {
        this.setState({
          list: resp.data.data,
          pagination: {
            ...pagination,
            current: next || pagination.current,
            total: resp.data.totalItems,
          },
          loading: false
        });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };
  renderExpandedRow = (r) => {
    return <SingleListTable isFlow search={{taskFlowId: r.id, ...this.props.search}} />;
  };
  render() {
    const { pagination, list, loading } = this.state;
    const allRowKeys = list.map(i => i.id);
    return (
      <Table
        className="flow-list-table"
        showHeader={false}
        loading={loading}
        columns={this.columns}
        dataSource={list}
        pagination={pagination}
        rowKey={r => r.id}
        expandedRowKeys={allRowKeys}
        expandedRowRender={this.renderExpandedRow}
      />
    );
  }
}

export default FlowListTable;
