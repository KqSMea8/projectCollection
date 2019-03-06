/**
 * @file SingleListTable.jsx
 * @desc 待办任务单任务列表
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Table, Popover, Icon} from 'antd';
import moment from 'moment';

import {OSSUtil} from '@alipay/kb-framework-components/lib/biz';

import {getTodoTaskList, getTodoFlowTaskList} from '../../common/api';
import ListUtil from './ListUtil';
import TodoListTable from './TodoListTable';
import ProgressBar from '../../../../common/library/ProgressBar';
import {TaskStatusText} from '../../common/enum';

class SingleListTable extends React.Component {
  static propTypes = {
    /* eslint react/forbid-prop-types:0 */
    search: PropTypes.object,
    isFlow: PropTypes.bool,
  };
  static defaultProps = {
    search: {},
    isFlow: false,
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
    this.loadList({search: next.search, next: 1});
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
    }
  };
  columns = [
    {
      title: '任务名称',
      dataIndex: 'name',
      render: (t, r) => {
        return (
          <div>
            <span>{t}</span>
            {r.description && (
              <Popover title="任务描述" content={r.description}>
                <Icon type="question-circle-o" style={{marginLeft: 8}} />
              </Popover>
            )}
          </div>
        );
      }
    },
    {
      title: '任务进度',
      dataIndex: 'finishRate',
      render: (t) => {
        const rate = parseFloat(t);
        if (isNaN(rate)) {
          return '无数据';
        }
        return <div><ProgressBar value={rate / 100}/><span style={{color: '#ccc', marginLeft: 8}}>完成{rate}%</span></div>;
      }
    },
    {title: '待办数量', dataIndex: 'waitCount'},
    {
      title: '开始时间',
      dataIndex: 'beginTime',
      render: (t, r) => {
        if (r.deadlineTimeTypeDTO && r.deadlineTimeTypeDTO.timeType === 'relative') return '--';
        return t;
      },
    },
    {
      title: '截止时间',
      dataIndex: 'deadlineTime',
      render: (t, r) => {
        if (r.deadlineTimeTypeDTO && r.deadlineTimeTypeDTO.timeType === 'relative') return '--';
        const deadlineTime = r.deadlineTime || (r.deadlineTimeTypeDTO && `${r.deadlineTimeTypeDTO.absoluteTime} 23:59:59`);
        // 截止时间在2天以内的高亮
        const today = new Date();
        today.setHours(23, 59, 59);
        const daysDiff = moment(today).diff(t, 'days');
        if (daysDiff >= -2 && daysDiff <= 0) {
          return <span className="kb-text-highlight">{deadlineTime}</span>;
        }
        return <span>{deadlineTime}</span>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: t => TaskStatusText[t],
    },
    {
      title: '任务攻略',
      dataIndex: 'tipsFileUrl',
      render: (t) => {
        if (!t) {
          return null;
        }
        return <a href={OSSUtil.getImageUrl(t, window.APP.kbsalesUrl)} target="_blank">查看攻略</a>;
      }
    }
  ];
  loadList = ({next, search} = {}) => {
    const {pagination} = this.state;
    const {isFlow} = this.props;
    const searchParams = {
      ...ListUtil.composeSearchParams(search || this.props.search),
      pageSize: pagination.pageSize,
      pageNo: next || pagination.current
    };
    this.setState({loading: true});
    const fetchFunc = isFlow ? getTodoFlowTaskList : getTodoTaskList;
    fetchFunc(searchParams)
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
        this.setState({loading: false});
      });
  };
  renderExpandedRow = (r) => {
    return <TodoListTable search={{taskId: r.id, ...this.props.search}} />;
  };
  render() {
    const {pagination, list, loading} = this.state;
    return (
      <Table
        loading={loading}
        columns={this.columns}
        dataSource={list}
        rowKey={r => r.id}
        expandedRowRender={this.renderExpandedRow}
        pagination={{...pagination, onChange: next => this.loadList({next})}}
      />
    );
  }
}

export default SingleListTable;
