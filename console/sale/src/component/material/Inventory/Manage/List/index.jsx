import React, { Component } from 'react';
import { Table } from 'antd';
import FilterForm from './FilterForm';
import { getInventoryList } from '../../../common/api';
import { StuffTypeText } from '../../../common/enum';

export default class List extends Component {
  constructor() {
    super();
  }

  state = {
    list: [],
    loading: false,
    pagination: {
      current: 1,
      total: 0,
      pageSize: 10
    },
    filter: {},
  };

  componentDidMount() {
    this.loadList();
  }

  columns = [
    {title: '模版名称/ID', width: 120, dataIndex: 'templeName', render: (t, r) => <div>{t}<br/>{r.templeId}</div>},
    {title: '物料属性', width: 100, dataIndex: 'stuffAttrName'},
    {title: '物料类型', width: 100, dataIndex: 'stuffType', render: t => StuffTypeText[t]},
    {title: '规格尺寸', width: 80, dataIndex: 'sizeName'},
    {title: '材质', width: 300, dataIndex: 'materialName'},
    {title: '仓库', width: 120, dataIndex: 'storageName'},
    {title: '申请总量(件)', width: 120, dataIndex: 'applyNum'},
    {title: '已入库总量(件)', width: 150, dataIndex: 'stockNum'},
    {title: '操作', width: 120, dataIndex: '', render: (t, r) => <a onClick={() => this.props.onViewLog(r)}>查看流水</a>},
  ];

  loadList = next => {
    const { filter, pagination } = this.state;
    this.setState({loading: true});
    getInventoryList({
      ...filter,
      ...pagination,
      pageNum: next || pagination.current
    })
      .then(res => {
        this.setState({
          list: res.data.data,
          current: next || pagination.current,
          total: res.data.totalSize,
          loading: false
        });
      })
      .catch(() => this.setState({loading: false, list: []}));
  };

  handleFilterSubmit = filter => {
    this.setState({filter}, this.loadList);
  };

  render() {
    const { list, pagination, loading } = this.state;
    return (
    <div>
      <FilterForm onSubmit={this.handleFilterSubmit} loading={loading}/>
      <Table
        columns={this.columns}
        dataSource={list}
        pagination={{...pagination, onChange: next => this.loadList(next)}}
      />
    </div>
    );
  }
}
