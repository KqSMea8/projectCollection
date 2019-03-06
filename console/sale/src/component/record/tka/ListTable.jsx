import React, { PropTypes } from 'react';
import { Table } from 'antd';
import { getRecordList } from './common/api';
import moment from 'moment';

// import './record.less';

export const visitWayMap = {
  VISIT_SPEAK: '面谈',
  VISIT_PHONE: '电话',
  VISIT_MERCHANT: '商户来访',
  VISIT_OTHER: '其他',
};
const visitPurposesMap = {
  NEED_INTENT_TALK: '需求&意向沟通',
  SIGN_PLAN_TALK: '签约计划沟通',
  ACTIVITY_REPLAY: '活动复盘',
  OTHER_TKA: '其他',
};

class ListTable extends React.Component {
  static propTypes = {
    params: PropTypes.any, // 请求入参
  };

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      pagination: {
        current: 1,
        pageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
      },
      loading: false,
    };

    this.columns = [
      {
        title: '商户名称/ID',
        width: 100,
        dataIndex: 'customerId',
        render(id, item) {
          return (<div>
            <p>{item.customerName}</p>
            <p>{id}</p>
            {item.companyName && <p style={{ color: '#999' }}>分公司：{item.companyName}</p>}
          </div>);
        },
      }, {
        title: '拜访人/陪访人',
        width: 80,
        dataIndex: 'creatorName',
        render(creatorName, item) {
          return (<div>
            <p>{creatorName}</p>
            {item.restVisitUser && <p style={{ color: '#999' }}>陪访人：{item.restVisitUser}</p>}
          </div>);
        },
      }, {
        title: '拜访时间',
        width: 45,
        dataIndex: 'visitTime',
        render(visitTime) {
          return moment(new Date(visitTime)).format('YYYY/MM/DD');
        },
      }, {
        title: '拜访方式',
        width: 45,
        dataIndex: 'visitWay',
        render(value) {
          return visitWayMap[value];
        },
      }, {
        title: '拜访目的',
        width: 80,
        dataIndex: 'visitPurposes',
        render(value) {
          return value && value.map(item => visitPurposesMap[item] || item).join('、');
        },
      }, {
        title: '审阅结果',
        width: 30,
        dataIndex: 'auditResult',
        render(value) {
          if (value === '1') return '有效';
          if (value === '0') return '无效';
        },
      }, {
        title: '查看',
        width: 30,
        dataIndex: '',
        render(_, item) {
          return <a target="_blank" href={`#/tka-record/detail/${item.id}`}>查看</a>;
        },
      },
    ];
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
    if (prevProps.params !== this.props.params) {
      this.reload();
    }
  }

  onTableChange(pagination) {
    this.setState({ pagination: pagination }, () => {
      this.fetch();
    });
  }

  reload() {
    this.setState({
      pagination: {
        ...this.state.pagination,
        current: 1,
      },
    }, () => {
      this.fetch();
    });
  }

  fetch() {
    const { pagination } = this.state;
    this.setState({ loading: true });
    getRecordList({
      ...this.props.params,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    }).then((res) => {
      this.setState({
        loading: false,
        data: res.data,
        pagination: {
          ...pagination,
          total: res.totalItems,
        }
      });
    }).catch(() => {
      this.setState({ loading: false });
    });
  }

  render() {
    const { pagination, data, loading } = this.state;

    return (
      <div style={this.props.style}>
        <Table
          columns={this.columns}
          rowSelection={this.rowSelection}
          dataSource={data}
          rowKey={r => r.id}
          pagination={pagination}
          loading={loading}
          onChange={this.onTableChange.bind(this)}
        />
      </div>
    );
  }
}

export default ListTable;
