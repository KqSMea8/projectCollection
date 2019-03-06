import React from 'react';
import fetch from '@alipay/kb-fetch';
import {Table, Form, Button, Modal, Icon, Upload, message, Popover} from 'antd';
import {Page} from '@alipay/kb-framework-components/lib/layout';
// import ajax from '../../../../../common/utility/ajax';

const {Dragger} = Upload;

class DataSectionNoBD extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      infoData: {
        name: '加载中...',
      },
      data: [],
      visible: false,
      confirmLoading: false,
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 10,
        current: 1,
        total: 0,
      },
      uploadFileList: [], // 上传的文件列表
    };
  }

  componentDidMount() {
    this.queryMerchantInfoByPid();
    this.merchantTable();
  }

  onTableChange(pagination) {
    const { current, pageSize } = pagination;
    this.merchantTable({
      pageNum: current,
      pageSize,
    });
  }
  onDownload(row, e) {
    e.preventDefault();
    const { fileOriginName, url } = row;
    const resourceId = encodeURIComponent(url);
    const name = encodeURIComponent(fileOriginName);
    const a = document.createElement('a');
    a.target = '_blank';
    a.href = `${window.APP.kbservcenterUrl}/sale/asset/saleFileDownload.resource?resourceId=${resourceId}&name=${name}`;
    a.click();
  }

  queryMerchantInfoByPid() {
    fetch({
      url: 'kbsales.merchantSpiService.queryMerchantInfoByPid',
      param: { pid: this.props.params.id }
    })
    .then((resp) => {
      this.setState({
        infoData: resp.data,
      });
    }).catch(() => {
      this.setState({
        infoData: {
          name: '加载失败',
        }
      });
    });
  }

  handleUpload = () => {
    this.setState({
      visible: true,
    });
  }
  merchantTable(params = {}) {
    this.setState({
      pagination: {
        ...this.state.pagination,
        current: params.pageNum || this.state.pagination.current,
        pageSize: params.pageSize || this.state.pagination.pageSize,
      },
    });
    fetch({
      url: 'kbservcenter.dataSummaryService.findPage',
      param: {
        pId: this.props.params.id,
        pageNum: 1,
        pageSize: 10,
        ...params,
      },
    })
    .then((resp) => {
      this.setState({
        data: resp.data.contents,
        pagination: {
          ...this.state.pagination,
          total: resp.data.totalItems,
        },
      });
    })
    .catch(e => {
      console.log(e, '分页数据错误');
    });
  }

  handleOk() {
    const { uploadFileList } = this.state;
    const data = uploadFileList && uploadFileList.length > 0 ? uploadFileList[0].response.data : null;
    if (data === null) {
      return message.warning('请先上传文件');
    }
    const { sfsKey, fileName } = data;
    fetch({
      url: 'kbservcenter.dataSummaryService.addDataSummary',
      param: {
        fileName: fileName,
        url: sfsKey,
        pId: this.props.params.id,
      },
    })
    .then((resp) => {
      if (resp.status === 'succeed') {
        this.setState({
          visible: false,
          uploadFileList: [],
        });
        this.merchantTable({
          pageNum: 1,
        });
        message.success('提交成功');
      } else {
        message.fail('提交失败');
      }
    })
    .catch(e => {
      console.log(e);
    });
  }

  handleCancel() {
    this.setState({
      visible: false,
      confirmLoading: false,
      uploadFileList: [],
    });
  }

  render() {
    const { infoData, data, pagination, uploadFileList } = this.state;
    const { id } = this.props.params;
    const columns = [{
      title: '文件名',
      dataIndex: 'FileName',
      key: 'FileName',
      render: (text, r) => <span>{r.fileOriginName}</span>
    }, {
      title: '上传时间',
      dataIndex: 'UploadTime',
      key: 'UploadTime',
      render: (text, r) => <span>{r.createTime}</span>
    }, {
      title: '审批人',
      dataIndex: 'ApproverPerson',
      key: 'ApproverPerson',
      render: (text, r) => <span>{r.approveName || ''}</span>
    }, {
      title: '审批状态',
      dataIndex: 'ApproverState',
      key: 'ApproverState',
      render: (text, r) => {
        let pass;
        if ((r.status === '已通过' || r.status === '不通过') && r.remark) {
          const title = <span>审批意见</span>;
          const content = (
            <p style={{ maxWidth: 300 }}>{r.remark}</p>
          );
          pass = (
            <div>
              <span>{r.status}</span>
              <Popover placement="topLeft" title={title} content={content}>
                <Icon type="question-circle-o" style={{paddingLeft: 4}}/>
              </Popover>
            </div>
          );
        } else {
          pass = <span>{r.status}</span>;
        }
        return pass;
      }
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, r) => (
        <span>
          <a href onClick={this.onDownload.bind(this, r)}>下载</a>
        </span>
      ),
    }];
    const draggerProps = {
      name: 'file',
      multiple: false,
      fileList: uploadFileList,
      showUploadList: true,
      action: `${window.APP.kbservcenterUrl}/manage/datasummary/upload.json`,
      beforeUpload: (file) => {
        if (this.state.confirmLoading || this.state.uploadFileList.length >= 1) {
          message.warning('一次只能上传一个文件');
          return false;
        }
        const filename = file.name;
        if (filename && filename.length > 32) {
          message.error('文件名最多32个字符');
          return false;
        }
        const dotIndex = filename.lastIndexOf('.');
        const type = filename.substring(dotIndex + 1);
        if (['pdf', 'ppt', 'pptx', 'doc', 'docx'].indexOf(type) === -1) {
          message.error('格式有误，暂无法上传');
          return false;
        }
        /* if (file.size > 10 * 1024 * 1024) {
          message.error('文件大小不能超过10M');
          return false;
        } */
        this.setState({
          confirmLoading: true,
          uploadFileList: [file],
        });
      },
      onChange: (info) => {
        const status = info.file.status;
        if ((status === 'done') && info.file.response && info.file.response.data && (info.file.response.status === 'succeed')) {
          this.setState({
            confirmLoading: false,
            uploadFileList: [info.file],
          });
          message.success('上传成功，请点击提交');
        } else if (status === 'error' || status === 'done') {
          this.setState({
            confirmLoading: false,
            uploadFileList: []
          });
          message.error(info.file.response && info.file.response.resultMsg || '上传失败，请稍后再试。该商户可能没有门店');
        } else if (status === 'uploading') {
          message.warning('正在上传，请勿关闭窗口...');
        } else if (status === 'removed') {
          this.setState({
            confirmLoading: false,
            uploadFileList: [],
          });
        }
      },
    };
    const modalOptions = {
      title: '上传数据小结',
      visible: this.state.visible,
      confirmLoading: this.state.confirmLoading,
      onOk: this.handleOk.bind(this),
      onCancel: this.handleCancel.bind(this),
      okText: this.state.confirmLoading ? '上传中' : '提 交',
    };
    const breadcrumb = [
      {title: '商户管理', link: `#/tka/merchant/list`},
      {title: '商户详情', link: `#/tka/merchant/detail/${id}`},
      {title: '数据小结'}
    ];
    return (
      <div style={{ margin: 20 }}>
        <Page breadcrumb={breadcrumb}>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0px' }}>
            <h2>商户：{infoData && infoData.name}</h2>
            <Button type="primary" onClick={this.handleUpload}>上传数据小结</Button>
          </div>
          <Table
            style={{ margin: '8px 0' }}
            columns={columns}
            dataSource={data}
            pagination={pagination}
            onChange={this.onTableChange.bind(this)}
          />
          <Modal {...modalOptions}>
            <div style={{ margin: '16px 32px' }}>
              <Dragger {...draggerProps} style={{ height: 180 }}>
                <p className="ant-upload-drag-icon">
                  <Icon type="cloud-upload-o"/>
                </p>
                <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                <p className="ant-upload-hint">文件名最多32个字符，支持扩展名：.pdf  .ppt .pptx .doc .docx</p>
              </Dragger>
              <style dangerouslySetInnerHTML={{ __html: `
                .ant-upload.ant-upload-drag {
                  height: 180px;
                }
              ` }} />
            </div>
          </Modal>
        </Page>
      </div>
    );
  }
}

export default Form.create()(DataSectionNoBD);
