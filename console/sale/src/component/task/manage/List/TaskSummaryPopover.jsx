import React from 'react';
import PropTypes from 'prop-types';
import { Popover, Table } from 'antd';

import { getTaskExeStat } from '../../common/api';

export default class TaskSummaryPopover extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };
  state = {
    loading: true,
    stat: null,
  };
  loadData() {
    const { id } = this.props.data;
    getTaskExeStat({
      taskDefId: id,
    })
      .then(resp => {
        this.setState({
          loading: false,
          stat: resp.data,
        });
      });
  }
  handleVisibleChange = () => {
    const { stat } = this.state;
    if (stat) {
      return true;
    }
    this.loadData();
  };
  render() {
    const { data } = this.props;
    const { stat, loading } = this.state;
    const renderSummaryTable = () => {
      const columns = [
        { title: '任务总数', dataIndex: 'totalCount'},
        { title: '已完成任务数', dataIndex: 'finishCount'},
        { title: '未完成数', dataIndex: 'waitCount'},
        { title: '超时未完成数', dataIndex: 'overTimeCount'},
      ];
      const dataSource = stat ? [stat] : [];
      return (
        <Table
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      );
    };
    return (
      <Popover
        title="任务效果"
        onVisibleChange={this.handleVisibleChange}
        content={renderSummaryTable()}
      >
        <span className="kb-action-link">{data.name}</span>
      </Popover>
    );
  }
}
