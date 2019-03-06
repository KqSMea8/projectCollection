import React from 'react';
import PropTypes from 'prop-types';
import { Table, } from 'antd';
import { Divider } from '@alipay/kb-framework-components/lib/layout';

import { TaskExeContentText, TaskExecutorText } from '../../../common/enum';

class TaskEditTable extends React.PureComponent {
  static propTypes = {
    list: PropTypes.array,
    readonly: PropTypes.bool
  };
  static defaultProps = {
    list: [],
    readonly: false
  };
  static getRowKey(r, i) {
    return i;
  }
  handleUpdate = (index) => {
    const { onUpdate } = this.props;
    onUpdate(index);
  };
  handleRemove = (index) => {
    const { onRemove } = this.props;
    onRemove(index);
  };
  columns = [
    { title: '任务名称', dataIndex: 'name' },
    {
      title: '截止时间',
      dataIndex: 'deadlineTimeTypeDTO',
      render: (deadlineTimeTypeDTO) => {
        if (!deadlineTimeTypeDTO) return '';
        if (deadlineTimeTypeDTO.timeType === 'relative') return '--';
        return `${deadlineTimeTypeDTO.absoluteTime && deadlineTimeTypeDTO.absoluteTime.replace(/-/g, '/')} 23:59:59`;
      }
    },
    { title: '执行内容', dataIndex: 'exeContent', render: t => TaskExeContentText[t] },
    { title: '执行者', dataIndex: 'executorSelectStrategy', render: t => TaskExecutorText[t] },
    {
      title: '操作',
      dataIndex: '-',
      render: (t, r, i) => (
        <div>
          <span className="kb-action-link" onClick={this.handleUpdate.bind(this, i)}>修改</span>
          <Divider />
          <span className="kb-action-link" onClick={this.handleRemove.bind(this, i)}>删除</span>
        </div>
      )
    },
  ];
  render() {
    const { list, readonly } = this.props;
    return (
      <Table
        style={{ marginTop: 12 }}
        dataSource={list}
        rowKey={TaskEditTable.getRowKey}
        columns={readonly ? this.columns.slice(0, -1) : this.columns}
        pagination={list.length < 10 ? false : { pageSize: 10 }}
      />
    );
  }
}

export default TaskEditTable;
