import React, { Component } from 'react';
import { Table } from 'antd';
import FilterForm from './FilterForm';
import { getInStockLog } from '../../../common/api';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';

const getSummaryParams = props => {
  const summary = props.logSummary;
  if (isEmpty(summary)) {
    return {};
  }
  return {
    storageId: summary.storageId,
    materialCode: summary.material,
    templateId: summary.templeId
  };
};

export default class Log extends Component {
  constructor(props) {
    super();
    this.state = {
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10
      },
      summaryParams: getSummaryParams(props), // 从库存列表点过来
      list: [],
      filter: {},
      loading: false
    };
  }

  componentDidMount() {
    this.loadList();
  }

  componentWillReceiveProps(next) {
    if (next.logSummary !== this.props.logSummary) {
      this.setState({
        list: [],
        filter: {},
        summaryParams: getSummaryParams(next),
        pagination: {
          ...this.state.pagination,
          current: 1,
          total: 0
        }
      }, this.loadList);
    }
  }

  columns = [
    {title: '模版名称／ID', dataIndex: 'templateName', render: (t, r) => <div>{t}<br/>{r.templateId}</div>},
    {title: '申请单号', dataIndex: 'orderId'},
    {title: '仓库', dataIndex: 'storageName'},
    {title: '入库数量(件)', dataIndex: 'curQuantity'},
    {title: '入库验收人／时间', dataIndex: 'operatorName', render: (t, r) => <div>{t}<br/>{moment(r.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}</div>},
    {title: '物流公司／单号', dataIndex: 'logisticName', render: (t, r) => <div>{t}<br/>{r.logisticOrderNo}</div>},
  ];

  loadList = next => {
    const { pagination, filter, summaryParams } = this.state;
    this.setState({loading: true});
    getInStockLog({
      ...summaryParams,
      ...filter,
      ...pagination,
      pageNum: next || pagination.current
    })
      .then( res => {
        this.setState({
          list: res.data.data,
          pagination: {
            ...pagination,
            current: next || pagination.current,
            total: res.data.totalSize
          },
          loading: false,
        });
      })
      .catch( () => {this.setState({loading: false, list: []});} );
  };

  handleFilterSubmit = filter => {
    this.setState({filter, summaryParams: {}}, this.loadList);
  };

  render() {
    const { list, pagination, loading, filter } = this.state;
    return (
      <div>
        <FilterForm onSubmit={this.handleFilterSubmit} loading={loading} initial={filter}/>
        <Table
          dataSource={list}
          columns={this.columns}
          pagination={{...pagination, onChange: next => this.loadList(next)}}
        />
      </div>
    );
  }
}

