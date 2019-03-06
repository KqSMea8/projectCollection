import React, {PropTypes} from 'react';
import { Table } from 'antd';
import ajax from '@alipay/kb-framework/framework/ajax';

const TaskDetail = React.createClass({
  propTypes: {
    form: PropTypes.object,
    row: PropTypes.object,
  },

  getInitialState() {
    this.columns = [{
      title: '任务总数',
      dataIndex: 'totalCount',
      key: 'totalCount',
      width: 100,
    }, {
      title: '已完成任务数',
      dataIndex: 'finishCount',
      key: 'finishCount',
      width: 100,
    }, {
      title: '待处理数',
      dataIndex: 'waitCount',
      key: 'waitCount',
      width: 100,
    }, {
      title: '超时未完成数',
      dataIndex: 'timeOutCount',
      key: 'timeOutCount',
      width: 100,
    }];

    return {
      data: [],
    };
  },

  componentDidMount() {
    this.fetch();
  },

  fetch() {
    this.setState({ loading: true });

    ajax({
      url: '/wireless/countTaskShop.json',
      method: 'GET',
      data: {categoryCode: this.props.row && this.props.row.taskId},
      type: 'json',
      success: (res) => {
        if (res && res.status === 'succeed') {
          this.setState({
            loading: false,
            data: [res.data],
          });
        } else {
          this.setState({
            loading: false,
            data: [],
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
    const {data, loading} = this.state;

    return (<div>
      <Table
        columns={this.columns}
        dataSource={data}
        loading={loading}
        pagination={false}
      />
    </div>);
  },
});

export default TaskDetail;
