import React, { Component, PropTypes } from 'react';
import { Table } from 'antd';
import BatchCodeListTable from './BatchCodeListTable';
import { BIND_STATUS } from '../../common/enums';
import { DOWN_KOUBEI_CODE_URL_URL, BATCH_CODE_DOWNLOAD, DOWNLOAD_WINDOW_READY } from '../../common/constants';
import { buildQueryString } from '../../common/utils';
import ImagePreview from 'Library/ImagePreview';
import moment from 'moment';

// 打包下载码 窗口引用
let downloadWindow = null;
// 下包下载码 窗口已加载
let downloadWindowLoaded = false;
// 打包下载码事件队列
const downloadEventQueue = [];

class ShopTable extends Component {

  static propTypes = {
    data: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    pagination: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    window.addEventListener('message', this.handleReceiveDownloadPageMessage, false);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleReceiveDownloadPageMessage, false);
  }

  handleDownloadCodeUrl = (batchId) => {
    const params = {
      batchId,
      status: BIND_STATUS.INIT,
    };
    const downloadLink = `${DOWN_KOUBEI_CODE_URL_URL}?${buildQueryString(params)}`;
    window.open(downloadLink);
  }

  // 打包下载码 加入轮询任务
  handleDownloadCode = (batchId) => {
    if (!downloadWindow || downloadWindow.closed) {
      downloadWindowLoaded = false;
      const downloadWindowUrl = location.origin
        + location.pathname
        + location.search
        + '#/material/koubeicode/manage/batchcodedownload';
      downloadWindow = window.open(downloadWindowUrl);
    } else {
      downloadWindow.focus();
    }
    const doPost = () => {
      downloadWindow.postMessage({
        type: BATCH_CODE_DOWNLOAD,
        batchId
      }, location.origin);
    };
    if (downloadWindowLoaded) {
      doPost();
    } else {
      downloadEventQueue.push(doPost);
    }
  };

  handleReceiveDownloadPageMessage = e => {
    const type = e.data.type;
    if (type && type === DOWNLOAD_WINDOW_READY) {
      downloadWindowLoaded = true;
      while (downloadEventQueue.length > 0) {
        downloadEventQueue.shift().call();
      }
    }
  }

  columns = [
    {
      title: '码生成批次',
      dataIndex: 'id',
    },
    {
      title: '提交人/时间',
      dataIndex: 'applicant',
      render: (text, record) => (<span>{text}<br/>{moment(record.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}</span>),
    },
    {
      title: '生成数量',
      dataIndex: 'quantity',
      render: num => `${num}个`,
    },
    {
      title: '待绑定数量',
      dataIndex: 'unbindCount',
      render: num => `${num}个`,
    },
    {
      title: '物料模板',
      dataIndex: 'templateName',
    },
    {
      title: '物料图',
      dataIndex: 'templateImageURL',
      render: thumb => (
        <ImagePreview
          imgSrc={thumb}
          imgTitle="物料图预览"
          style={{ maxHeight: 60 }}
        />
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 100,
    },
    {
      title: '操作',
      render: (text, record) => record.unbindCount > 0 ? (
        <span>
          <a onClick={() => this.handleDownloadCode(record.id)}>打包下载码</a>
          <span className="ant-divider"/>
          <a onClick={() => this.handleDownloadCodeUrl(record.id)}>打包下载码URL</a>
        </span>
      ) : null,
    },
  ];

  renderExpandedRow = (record) => {
    return (
      <BatchCodeListTable
        applicantId={this.props.applicantId}
        batchId={record.id}
      />
    );
  };

  render() {
    const { data, loading, pagination, onChange, expandedRowKeys, onExpandedRowsChange} = this.props;
    return (
      <Table
        columns={this.columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        rowKey={record => record.id}
        onChange={onChange}
        onExpandedRowsChange={onExpandedRowsChange}
        expandedRowKeys={expandedRowKeys}
        expandedRowRender={this.renderExpandedRow}
      />
    );
  }
}

export default ShopTable;
