import React from 'react';
import ajax from 'Utility/ajax';
import {Table, message} from 'antd';
import {padding} from '../../common/dateUtils';

const PageSize = 15;
const BatchProgressTable = React.createClass({

  getInitialState() {
    return {
      filterData: '',
      data: [],
      loading: false,
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: PageSize,
        showTotal: (total) => {
          return `共${total}个记录`;
        },
        current: 1,
      },
    };
  },

  componentDidMount() {
    this.fetch();
  },

  onTableChange(pagination) {
    const pager = this.state.pagination;
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState({
      pagination: pager,
    }, this.fetch);
  },

  getColumns() {
    return [
      {
        title: '文件名称',
        dataIndex: 'batchNo',
        render: (_, r) => {
          return r.sourceFile && r.sourceFile.fileName;
        },
      },
      {
        title: '上传时间',
        width: 200,
        dataIndex: 'gmtCreate',
      },
      {
        title: '当前进度',
        width: 200,
        dataIndex: 'status',
        render(text, record) {
          let txt = '';
          if (text === 'INIT') txt = '等待处理';
          if (text === 'WAIT_EXECUTE') txt = `处理中 ${record.totalCount - record.waitExecuteCount}/${record.totalCount}`;
          if (text === 'FINISH') txt = '处理完成';
          if (text === 'VALIDATE_FAILURE') txt = '处理失败';
          return <span>{txt}</span>;
        },
      },
      {
        title: '处理结果',
        width: 200,
        render(text, record) {
          const {totalCount, successCount, status} = record;
          const failCount = totalCount - successCount;
          if (status === 'FINISH') {
            if (failCount > 0 && successCount === 0) return <span style={{color: '#FF6C0A'}}>全部失败</span>;
            if (failCount > 0) return <span style={{color: '#FF6C0A'}}>部分成功</span>;
            return <span>全部成功</span>;
          } else if (status === 'VALIDATE_FAILURE') {
            return <span>{record.errorMsg || '处理失败'}</span>;
          }
        },
      },
      {
        title: '操作',
        // dataIndex: 'sourceFile',
        render: (_, record) => {
          const {totalCount, successCount, status, batchNo} = record;
          const failCount = totalCount - successCount;
          return status === 'FINISH' && failCount > 0 ? <a href={`${window.APP.kbsalesUrl}/batch/downloadBatchResult.htm?batchNo=${encodeURIComponent(batchNo)}`}>下载失败结果</a> : null;
        },
      },
    ];
  },

  format(d, toSecond) {
    const str = `${d.getFullYear()}-${padding(d.getMonth() + 1)}-${padding(d.getDate())}`;
    return toSecond ? `${str} ${padding(d.getHours())}:${padding(d.getMinutes())}:${padding(d.getSeconds())}` : str;
  },

  fetch() {
    const {pageSize, current} = this.state.pagination;
    const scene = this.props.location.query.scene || 'SHOP_GROUP_RELATION_BATCH_UPDATE'; // 默认使用 门店组管理 的批处理查询
    this.setState({ loading: true });
    ajax({
      url: window.APP.kbsalesUrl + '/batch/queryBatchByBizTypeAndStatus.json',
      method: 'get',
      data: {
        scene,
        pageSize,
        pageNum: current,
        showProgress: true,
      },
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
        this.setState({ loading: false });
      },
    });
  },

  render() {
    const {loading, data, pagination} = this.state;
    return (<div>
      <div className="app-detail-header">上传文件管理</div>
      <Table columns={this.getColumns()}
        style={{ margin: 16 }}
        dataSource={data}
        loading={loading}
        pagination={pagination.total <= PageSize ? false : pagination}
        onChange={this.onTableChange} />
    </div>);
  },
});

export default BatchProgressTable;
