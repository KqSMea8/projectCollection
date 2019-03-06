import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import {Table} from 'antd';
import {padding} from '../../../common/dateUtils';

const ShopCorrectionTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
    forceRefresh: PropTypes.number,
    operationType: PropTypes.array,
    defaultDateRange: PropTypes.array,
  },

  getInitialState() {
    return {
      filterData: this.getFilterData(),
      data: [],
      loading: false,
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 10,
        showTotal: (total) => {
          return `共${total}个记录`;
        },
        current: 1,
      },
      opType: '',
    };
  },

  componentDidMount() {
    const {defaultDateRange} = this.props;
    this.fetch(defaultDateRange);
  },

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params
      || this.props.forceRefresh !== prevProps.forceRefresh) {
      this.fetch();
    }
  },

  onTableChange(pagination, filters) {
    const pager = this.state.pagination;
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
      opType: filters.opType ? filters.opType : '',
    }, this.fetch);
  },

  getFilterData() {
    const {operationType} = this.props;
    const filters = [];
    operationType.forEach(v => {
      const item = {
        text: v.label,
        value: v.value,
      };
      if (v.children) {
        item.children = v.children.map(vv => {
          return {
            text: vv.label,
            value: vv.value,
          };
        });
      }
      filters.push(item);
    });
    return filters;
  },

  getColumns() {
    const {filterData} = this.state;
    return [
      {
        title: '批次号',
        width: 260,
        dataIndex: 'batchId',
      },
      {
        title: '操作时间',
        dataIndex: 'opTime',
        render: (text) => {
          return text ? this.format(new Date(text), true) : '';
        },
      },
      {
        title: '操作人',
        dataIndex: 'opName',
      },
      {
        title: '操作类型',
        dataIndex: 'opType',
        filters: filterData,
        filterMultiple: false,
        render: (text) => {
          const {operationType} = this.props;
          const map = operationType.reduce((p, c) => p.children.concat(c.children));
          return map.filter(v => v.value === text)[0].label;
        },
      },
      {
        title: '当前进度',
        dataIndex: 'status',
        render(text) {
          let txt = '';
          if (text === 'INIT') txt = '初始化';
          if (text === 'FINISHED') txt = '处理结束';
          if (text === 'PROCESSING') txt = '正在处理';
          if (text === 'UNKNOWN_ERROR') txt = '处理失败';
          return <span style={text === 'PROCESSING' ? {color: '#FFB547'} : null}>{txt}</span>;
        },
      },
      {
        title: '操作结果',
        width: 200,
        render(text, record) {
          const {totalCount, successCount, failCount} = record;
          const rightStyle = {float: 'right', paddingRight: 40};
          return (<ul>
            <li>总操作数量：<span style={rightStyle}>{totalCount ? totalCount : '-'}</span></li>
            <li>成功数量：<span style={rightStyle}>{successCount ? successCount : '-'}</span></li>
            <li style={failCount ? {color: '#FF6C0A'} : null}>失败数量：<span style={rightStyle}>{failCount ? failCount : '-'}</span></li>
          </ul>);
        },
      },
      {
        title: '操作',
        dataIndex: 'resultFileResourceId',
        render: (text) => {
          return text ? <a href={`/sale/dataCorrectionResultFileDownload.json?resourceId=${encodeURIComponent(text)}`}>下载结果</a> : null;
        },
      },
    ];
  },

  format(d, toSecond) {
    const str = `${d.getFullYear()}-${padding(d.getMonth() + 1)}-${padding(d.getDate())}`;
    return toSecond ? `${str} ${padding(d.getHours())}:${padding(d.getMinutes())}:${padding(d.getSeconds())}` : str;
  },

  fetch(defaultDateRange) {
    let {beginTime, endTime} = this.props.params || {};
    const {opName} = this.props.params || {};
    const {opType} = this.state;
    const {pageSize, current} = this.state.pagination;
    if (defaultDateRange || beginTime && endTime) {
      beginTime = this.format(defaultDateRange ? defaultDateRange[0] : beginTime) + ' 00:00:00';
      endTime = this.format(defaultDateRange ? defaultDateRange[1] : endTime) + ' 23:59:59';
    }
    const params = {
      beginTime,
      endTime,
      opName: opName ? opName.id : '',
      opType: opType.length ? opType[0] : '',
      pageSize,
      pageNum: current,
    };
    this.setState({
      loading: true,
    });
    ajax({
      url: '/sale/queryDataCorrectionList.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        const data = result.data || [];
        data.forEach((v, i) => v.key = i);
        const pagination = this.state.pagination;
        pagination.total = result.totalSize;
        this.setState({
          loading: false,
          data,
          pagination,
        });
      },
    });
  },

  render() {
    const {loading, data, pagination} = this.state;
    return (<div>
      <Table columns={this.getColumns()}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        onChange={this.onTableChange} />
    </div>);
  },
});

export default ShopCorrectionTable;
