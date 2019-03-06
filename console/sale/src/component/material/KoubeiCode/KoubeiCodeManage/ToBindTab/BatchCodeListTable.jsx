import React, { Component, PropTypes } from 'react';
import { Table, message } from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';
import {appendOwnerUrlIfDev} from '../../../../../common/utils';
import ajax from 'Utility/ajax';

class BatchCodeListTable extends Component {
  static propTypes = {
    applicantId: PropTypes.string,
    batchId: PropTypes.number.isRequired,
  };

  static defaultProps = {
    applicantId: '',
  };

  constructor(props) {
    super(props);
  }

  state = {
    loading: true,
    list: [],
  };

  componentDidMount() {
    this.fetchList();
  }

  fetchList() {
    this.setState({
      loading: true,
    });
    const { batchId, applicantId } = this.props;
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      data: {
        // 目前单批次最多150条，故全量获取
        pageNum: 1,
        pageSize: 200,
        mappingValue: 'kbasset.pageQueryKBCodeUnbindCode',
        applicantId,
        batchId,
      },
      type: 'json',
    }).then(res => {
      this.setState({
        loading: false,
      });
      if (res && res.status === 'succeed') {
        this.setState({
          list: res.data.data,
        });
      }
    }).catch(() => {
      this.setState({
        loading: false,
        list: [],
      });
    });
  }

  singleQrcodeUrl(record) {
    return `${record.coreURL}&dName=${this.props.batchId}_${record.qrCode}&d`;
  }

  columns = [
    {
      title: '二维码编号',
      width: 200,
      dataIndex: 'qrCode',
    },
    {
      title: '操作',
      width: 400,
      render: (text, record) => (
        <span>
          <a download href={record.resourceURL} target="_blank">下载图</a>
          <span className="ant-divider"/>
          <CopyToClipboard
            text={record.coreURL}
            onCopy={() => message.success('URL复制成功')}
          >
            <a>复制码的URL</a>
          </CopyToClipboard>
        </span>
      ),
    },
  ];

  render() {
    const { list, loading } = this.state;
    return (
      <Table
        columns={this.columns}
        dataSource={list}
        loading={loading}
        rowKey={record => record.qrCode}
        pagination={false}
        useFixedHeader
      />
    );
  }
}


export default BatchCodeListTable;
