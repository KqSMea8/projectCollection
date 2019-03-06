import React from 'react';
import * as antd from 'antd';
import { number2DateTime } from '../dateUtils';
import { STATUS, SUB_STATUS } from './TaskEnums';

const Table = antd.Table;
const FILE_URL_PREFIX = window.APP.crmhomeUrl + '/shop/koubei/shopSfsFileDownload.htm?_input_charset=ISO8859-1&batchId=';

const columns = [
  {
    title: '上传时间',
    dataIndex: 'uploadTime',
    key: 'uploadTime',
    width: 150,
    render: (value) => number2DateTime(value),
  }, {
    title: '文件名称',
    dataIndex: 'fileName',
    key: 'fileName',
  }, {
    title: '当前进度',
    dataIndex: 'status',
    key: 'status',
    render: (value) => {
      let res = STATUS[value];
      if (res !== '处理完成') {
        res = <span style={{ color: '#ff9900' }}>{res}</span>;
      }
      return res;
    },
  }, {
    title: '处理结果',
    dataIndex: 'subStatus',
    key: 'subStatus',
    render: (value) => {
      let res = SUB_STATUS[value];
      if (value === SUB_STATUS['全部失败'] || value === SUB_STATUS['部分成功']) {
        res = <span style={{ color: '#ff9900' }}>{res}</span>;
      }
      return res;
    },
  }, {
    title: '操作',
    key: 'action',
    render: (value, row) => {
      let rtn = null;
      if (row.subStatus === SUB_STATUS['全部失败'] || row.subStatus === SUB_STATUS['部分成功']) {
        rtn = (<a href={FILE_URL_PREFIX + encodeURIComponent(row.batchId)}>下载结果</a>);
      }
      return rtn;
    },
  },
];

export default (props) => {
  const paginationCfg = { pageSize: props.pageSize, current: props.pageNum,
    total: props.total, onChange: props.switchPage, showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`, defaultCurrent: 1,
  };

  return (
    <div>
      <Table dataSource={props.data} bordered
        loading={props.loading} columns={columns} pagination={paginationCfg}
      />
    </div>
  );
};
