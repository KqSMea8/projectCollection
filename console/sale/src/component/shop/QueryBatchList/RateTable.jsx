import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import {Table, message} from 'antd';
import {padding} from '../../../common/dateUtils';

const RateTable = React.createClass({
  propTypes: {
    params: PropTypes.object,
    forceRefresh: PropTypes.number,
    operationType: PropTypes.array,
    defaultDateRange: PropTypes.array,
    scene: PropTypes.string,
  },

  getInitialState() {
    return {
      filterData: '',
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
      bizTypeName: '',
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
      bizTypeName: filters.bizTypeName ? filters.bizTypeName[0] : '',
    }, this.fetch);
  },

  getColumns() {
    const filtersText = this.props.scene === 'CITY_MESSAGE' ? '导入签约城市配置信息' : '借记卡0费率申请';
    const filtersValue = this.props.scene === 'CITY_MESSAGE' ? 'IMPORT_REGION_CONFIG_INFORMATION' : 'APPLY_DEBIT_CARD_ZERO_CHARGE';
    return [
      {
        title: '批次号',
        width: 260,
        dataIndex: 'batchNo',
      },
      {
        title: '操作时间',
        dataIndex: 'gmtCreate',
      },
      {
        title: '操作人',
        render: (text) => {
          return <span>{text.extInfo.realName}</span>;
        },
      },
      {
        title: '操作类型',
        filters: [{
          text: filtersText,
          value: filtersValue,
        }],
        render: (text) => {
          return <span>{text.extInfo.subBizTypeName}</span>;
        },
      },
      {
        title: '当前进度',
        dataIndex: 'status',
        render(text) {
          let txt = '';
          if (text === 'INIT') txt = '初始状态';
          if (text === 'WAIT_EXECUTE') txt = '等待执行';
          if (text === 'FINISH') txt = '执行完成';
          if (text === 'VALIDATE_FAILURE') txt = '校验失败,数量超限';
          return <span>{txt}</span>;
        },
      },
      {
        title: '操作结果',
        width: 200,
        render(text, record) {
          const {totalCount, successCount, status} = record;
          const failCount = totalCount - successCount;
          const rightStyle = {float: 'right', paddingRight: 40};
          return (<ul>
            <li>总操作数量：<span style={rightStyle}>{totalCount ? totalCount : '-'}</span></li>
            <li>成功数量：<span style={rightStyle}>{successCount ? successCount : '-'}</span></li>
            <li style={failCount > 0 ? {color: '#FF6C0A'} : null}>失败数量：<span style={rightStyle}>{status === 'FINISH' && failCount > 0 ? failCount : '-'}</span></li>
          </ul>);
        },
      },
      {
        title: '操作',
        // dataIndex: 'sourceFile',
        render: (text, record) => {
          const {totalCount, successCount, status} = record;
          const failCount = totalCount - successCount;
          return status === 'FINISH' && failCount > 0 ? <a href={`${window.APP.kbsalesUrl}/batch/downloadBatchResult.htm?batchNo=${encodeURIComponent(text.batchNo)}`}>下载结果</a> : null;
        },
      },
    ];
  },

  format(d, toSecond) {
    const str = `${d.getFullYear()}-${padding(d.getMonth() + 1)}-${padding(d.getDate())}`;
    return toSecond ? `${str} ${padding(d.getHours())}:${padding(d.getMinutes())}:${padding(d.getSeconds())}` : str;
  },

  fetch(defaultDateRange) {
    let {gmtCreateStart, gmtCreateEnd} = this.props.params || {};
    const {pageSize, current} = this.state.pagination;
    if (defaultDateRange || gmtCreateStart && gmtCreateEnd) {
      gmtCreateStart = this.format(defaultDateRange ? defaultDateRange[0] : gmtCreateStart) + ' 00:00:00';
      gmtCreateEnd = this.format(defaultDateRange ? defaultDateRange[1] : gmtCreateEnd) + ' 23:59:59';
    }
    const scene = this.props.scene === 'CITY_MESSAGE' ? 'IMPORT_REGION_CONFIG_INFORMATION' : 'APPLY_DEBIT_CARD_ZERO_CHARGE';
    const params = {
      gmtCreateStart,
      gmtCreateEnd,
      scene,
      pageSize,
      pageNum: current,
    };
    this.setState({
      loading: true,
    });
    ajax({
      url: window.APP.kbsalesUrl + '/batch/queryBatchByBizType.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed' && result.data !== '0') {
          const data = result.data || [];
          data.forEach((v, i) => v.key = i);
          const pagination = this.state.pagination;
          pagination.total = result.totalCount;
          this.setState({
            loading: false,
            data,
            pagination,
          });
        } else {
          message.error(result.errorMsg || '系统异常，请重试', 2);
          this.setState({
            isLoading: false,
          });
        }
      },
      error: (err) => {
        message.error(err || '网络连接异常', 2);
        this.setState({
          loading: false,
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

export default RateTable;
