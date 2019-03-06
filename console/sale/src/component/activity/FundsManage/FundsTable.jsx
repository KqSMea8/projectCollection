import React, {PropTypes} from 'react';
import { Table } from 'antd';
import moment from 'moment';

const FundsTable = React.createClass({
  propTypes: {
    list: PropTypes.array,
    handleChange: PropTypes.func,
    onAction: PropTypes.func,
    loading: PropTypes.bool,
  },

  getInitialState() {
    this.columns = [{
      title: '资金池名称',
      dataIndex: 'poolName',
    }, {
      title: '资金池ID',
      render: (_, r) => {
        return <div>{r.poolId || '创建中……'}</div>;
      },
    }, {
      title: '资金有效期',
      render: (_, r) => {
        return <div>{moment(r.startTime).format('YYYY.MM.DD') + '-' + moment(r.endTime).format('YYYY.MM.DD')}</div>;
      },
    }, {
      title: '当前余额',
      rowClassName: 't-center',
      render: (_, r) => {
        const val = typeof r.balance === 'undefined' ? '--' : r.balance;
        return r.needAlarm ? <span style={{color: 'red'}}>{val}</span> : <span>{val}</span>;
      },
    }, {
      title: '预警金额',
      rowClassName: 't-center',
      render: (_, r) => {
        return r.alarmAmount ? <span>{r.alarmAmount}</span> : <span style={{color: 'red'}}>未设置</span>;
      },
    }, {
      title: '失效金额',
      rowClassName: 't-center',
      render: (_, r) => {
        return r.invalidAmount ? <span>{r.invalidAmount}</span> : <span style={{color: 'red'}}>未设置</span>;
      },
    }, {
      title: '操作',
      width: 160,
      render: (_, r) => {
        return (
          <div>
            {
              r.status === 'NORMAL' ?
                <span>
                  <a onClick={() => {this.props.onAction('detail', 'show', r);}}>查看</a>
                  <span className="ft-bar">|</span>
                  <a onClick={() => {this.props.onAction('recharge', 'show', r);}}>充值</a>
                  <span className="ft-bar">|</span>
                  <a onClick={() => {this.props.onAction('warn', 'show', r);}}>修改</a>
                </span>
                :
                <span>
                  <a onClick={() => {this.props.handleChange({});}}>刷新</a>
                </span>
            }
          </div>
        );
      },
    }];

    return {};
  },

  onTableChange(pagination) {
    this.props.handleChange({
      pageNum: pagination.current,
    });
  },

  render() {
    const { params } = this.props;
    const firstShow = false;
    const locale = {
      emptyText: firstShow ? '暂无数据，请输入查询条件搜索，必填条件：时间、活动名称、数据状态、账单类型' : '搜不到结果，换下其他搜索条件吧~',
    };

    const pagination = {
      current: params.pageNum,
      total: this.props.total,
      pageSize: 10,
    };

    return (
      <div className="qf-funds-table">
        <Table columns={this.columns}
          rowKey={record => record.id}
          locale={locale}
          dataSource={this.props.list || []}
          pagination={pagination}
          loading={this.props.loading}
          onChange={this.onTableChange}
        />
      </div>
    );
  },
});

export default FundsTable;
