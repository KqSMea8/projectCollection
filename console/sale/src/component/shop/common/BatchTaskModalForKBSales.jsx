import React, { PropTypes } from 'react';
import ajax from 'Utility/ajax';
import { Button, Modal, Upload, Icon, Row, Col, message } from 'antd';
import ProgressMessage from './ProgressMessage';

const Dragger = Upload.Dragger;

let uploadTimer = null;

// kbsales 系统的批量上传对话框
const BatchTaskModalForKBSales = React.createClass({
  propTypes: {
    scene: PropTypes.string.isRequired,
    modalTitle: PropTypes.string,
    modalFooter: PropTypes.any,
    visible: PropTypes.bool,
    maxImportCountText: PropTypes.number, // 一次最多倒入记录数文案
    onCancel: PropTypes.func,
    onFinish: PropTypes.func,
  },

  getDefaultProps() {
    return {
      maxImportCountText: 2000,
    };
  },

  getInitialState() {
    return {
      uploadModalVisible: this.props.visible,
      uploadFailModalVisible: false,
      percent: 0,
      progressVisible: false,
      failureCause: '',
    };
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible) {
      this.setState({
        uploadModalVisible: nextProps.visible && !this.state.progressVisible && !this.state.uploadFailModalVisible,
      });
    }
  },

  onClickDownloadTemplate(e) {
    e.preventDefault();
    location.href = `${window.APP.kbsalesUrl}/batch/templateDownload.json?scene=${this.props.scene}`; // 下载模板
  },
  onBatchCreate(fileName, ossFileKey) { // 批处理创建
    ajax({
      url: window.APP.kbsalesUrl + '/batch/batchOrderCreate.json',
      method: 'POST',
      type: 'json',
      data: {
        fileName,
        ossFileKey,
        scene: this.props.scene,
      },
      success: (result) => {
        if (result.status === 'succeed') {
          this.showUploadSuccess();
        }
      },
      error: (result) => {
        this.setState({
          uploadFailModalVisible: true,
          progressVisible: false,
          failureCause: result.resultMsg || '出现错误，请尝试重新上传',
        });
      },
    });
  },
  onFileUploadChange(info) {
    // 文件上传中
    if (info.file.status === 'uploading') {
      if (!uploadTimer) {
        // 可能多次进入 uploading 状态，避免重复执行
        this.showUploadProgress();
      }
    // 文件上传完毕，后端处理文件中
    } else if (info.file.status === 'done' && info.file.response.status === 'succeed') {
      clearInterval(uploadTimer);
      uploadTimer = null;
      this.onBatchCreate(info.file.response.data.fileName, info.file.response.data.ossFileKey);
    // 文件上传出错，或者上传完毕但预处理出错，同步返回错误结果
    } else { // if (info.file.status === 'error' || info.file.response.status === 'failed') {
      clearInterval(uploadTimer);
      uploadTimer = null;
      this.setState({
        percent: 0,
        progressVisible: false,
        uploadFailModalVisible: true,
        failureCause: info.file.response && info.file.response.resultMsg || '出现未知错误，请尝试重新上传',
      });
    }
  },
  goToProgressList() {
    location.hash = `#/kbsales-batchprogress?scene=${encodeURIComponent(this.props.scene)}`;
  },

  showUploadProgress() {
    this.setState({
      percent: 0,
      progressText: '正在上传文件，请勿关闭窗口',
      progressVisible: true,
      uploadModalVisible: false,
    });
    uploadTimer = setInterval(() => {
      const percent = this.state.percent + 10;
      if (percent > 90) {
        this.setState({percent: 90});
        clearInterval(uploadTimer);
      } else {
        this.setState({percent: percent});
      }
    }, 1000);
  },

  showUploadModal() {
    this.setState({
      uploadFailModalVisible: false,
      uploadModalVisible: true,
    });
  },
  showUploadSuccess() {
    this.setState({
      uploadModalVisible: false,
      progressVisible: false,
    });
    message.success('提交成功，2秒后跳转到进度页', 2);
    if (this.props.onFinish) {
      this.props.onFinish();
    }
    setTimeout(() => {
      this.goToProgressList();
    }, 2000);
  },
  cancelUploadModal() {
    this.setState({
      uploadModalVisible: false,
    });
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  },

  cancelUploadFailModal() {
    this.setState({
      uploadFailModalVisible: false,
    });
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  },
  render() {
    const {uploadFailModalVisible} = this.state;
    const { modalTitle, modalFooter, maxImportCountText } = this.props;
    return (<div>
      <Modal
        title={modalTitle}
        visible={this.state.uploadModalVisible}
        onCancel={this.cancelUploadModal}
        footer={modalFooter || <Button onClick={this.goToProgressList} type="primary">查看进度</Button>}
      >
        <p>请先<a onClick={this.onClickDownloadTemplate}>下载模板</a>，一次最多导入{maxImportCountText}条记录。注意上传格式为xls。</p>
        <div style={{margin: '32px auto', width: '80%'}}>
          <Dragger
            name="shopBatchFile"
            showUploadList={false}
            multiple={false}
            action={`${window.APP.kbsalesUrl}/batch/batchFileUpload.json`}
            withCredentials
            onChange={this.onFileUploadChange}>
            <p className="ant-upload-drag-icon">
              <Icon type="cloud-upload-o" />
            </p>
            <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
            <p className="ant-upload-hint">支持扩展名：xls</p>
          </Dragger>
        </div>
      </Modal>
      <Modal
        title="上传失败"
        visible={uploadFailModalVisible}
        onCancel={this.cancelUploadFailModal}
        footer={<Button type="ghost" onClick={this.showUploadModal}>重新上传</Button>}
        >
        <Row>
          <Col span="4" style={{textAlign: 'right'}}>
            <span style={{fontSize: '250%', color: '#f50', padding: '20px'}}><Icon type="exclamation-circle-o" /></span>
          </Col>
          <Col>
            <h5 style={{fontSize: '120%', fontWeight: 'normal'}}>上传失败</h5>
            <p style={{color: '#999'}}>{this.state.failureCause}</p>
          </Col>
        </Row>
      </Modal>
      <ProgressMessage percent={this.state.percent} visible={this.state.progressVisible} text={this.state.progressText} />
    </div>);
  },
});
export default BatchTaskModalForKBSales;
