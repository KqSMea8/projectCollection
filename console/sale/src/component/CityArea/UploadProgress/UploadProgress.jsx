import React from 'react';
import { Table, message } from 'antd';
import ajax from 'Utility/ajax';
import moment from 'moment';

const params = {
  pageSize: 10,
  current: 1,
};

const UploadProgress = React.createClass({
  getInitialState() {
    return {
      list: [],
      total: 0,
    };
  },

  componentDidMount() {
    this.fetchUploadList();
  },

  download(id) {
    const downloadPath = `${window.APP.crmhomeUrl}/shop/koubei/territory/batchFileDownload.htm?_input_charset=ISO8859-1&batchId=${id}`;
    window.open(downloadPath);
  },

  fetchUploadList() {
    ajax({
      url: `${window.APP.crmhomeUrl}/shop/koubei/territory/queryUploadProgress.json`,
      method: 'get',
      data: {
        pageNum: params.current,
        pageSize: params.pageSize,
      },
      type: 'json',
      success: (res) => {
        if (!res) {
          return;
        }
        if (res.status && res.status === 'succeed') {
          this.setState({
            list: res.data.batchTasks,
            total: res.data.pageInfo.items,
          });
        } else {
          if (res.errorMsg) {
            message.error(res.errorMsg, 3);
          }
        }
      },
    });
  },

  render() {
    const columns = [{
      title: '上传时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
      render: (text) => {
        return (<span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>);
      },
    }, {
      title: '文件名称',
      dataIndex: 'fileName',
      key: 'fileName',
    }, {
      title: '当前进度',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        return (<span style={{color: text === '正在处理' ? '#fc6620' : ''}}>{text}</span>);
      },
    }, {
      title: '处理结果',
      dataIndex: 'subStatus',
      key: 'subStatus',
      render: (text) => {
        return (<span style={{color: text === '全部成功' ? '' : '#fc6620'}}>{text}</span>);
      },
    }, {
      title: '操作',
      render: (text, record) => (
        <span>
          {
            record.subStatus === '部分失败' || record.subStatus === '全部失败' || record.subStatus === '部分成功' ?
              <a href="#" onClick={(e) => { e.preventDefault(); this.download(record.batchId);}}>下载结果</a>
              :
              null
          }
        </span>
      ),
    }];

    const { list, total } = this.state;
    const pagination = {
      total: total,
      showSizeChanger: true,
      showQuickJumper: true,
      onShowSizeChange: (current, pageSize) => {
        params.current = current;
        params.pageSize = pageSize;
        this.fetchUploadList();
      },
      onChange: (current) => {
        params.current = current;
        this.fetchUploadList();
      },
    };

    return (
      <div>
        <Table rowKey={record => record.batchId} columns={columns} dataSource={list} pagination={pagination} bordered />
      </div>
    );
  },
});

export default UploadProgress;
