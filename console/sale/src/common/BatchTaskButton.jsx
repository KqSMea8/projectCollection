import React, { PropTypes } from 'react';
import { Button, Modal, Upload, Icon, Alert, message } from 'antd';
import ProgressMessage from './ProgressMessage';

const Dragger = Upload.Dragger;

let uploadTimer = null;
let processTimer = null;

const TemplateUrls = { // 下载模板
  ALLOCATE_LEADS: '/shop/koubei/leadsAllocateTemplateDownload.htm',
  ALLOCATE_SHOP: '/shop/koubei/shopAllocateTemplateDownload.htm',
  AUTHORIZE_SHOP: '/shop/koubei/shopAuthTemplateDownload.htm',
  SHOP_RELATION_CREATE: '/shop/koubei/createShopRelationTemplateDownload.htm',
};

const UploadUrls = { // 上传文件
  ALLOCATE_LEADS: '/shop/koubei/leadsBatchAllocateFileUpload.json',
  ALLOCATE_SHOP: '/shop/koubei/shopBatchAllocateFileUpload.json',
  AUTHORIZE_SHOP: '/shop/koubei/shopAuthBatchFileUpload.json',
  SHOP_RELATION_CREATE: '/shop/koubei/createShopRelationFileUpload.json',
};

const logHash = { // 查看进度跳转
  ALLOCATE_LEADS: '#/team-leads/logs',
  ALLOCATE_SHOP: '#/shop-alloc/logs/ALLOCATE_SHOP',
  AUTHORIZE_SHOP: '#/shop/team/logs',
  SHOP_RELATION_CREATE: '#/shop-alloc/logs/SHOP_RELATION_CREATE',
};

const BatchTaskButton = React.createClass({
  propTypes: {
    bizType: PropTypes.string,
    style: PropTypes.object,
    onShowModal: PropTypes.func,
  },

  getInitialState() {
    return {
      uploadModalVisible: false,
      uploadFailModalVisible: false,
      percent: 0,
      progressVisible: false,
      failureDownloadUrl: null,
      failureCause: '',
      buttonText: '',
      titleText: {
        title: '',
        titles: '',
      },
      actionText: '',
      showSuccessModal: false,
    };
  },

  componentWillMount() {
    const buttonTexts = {
      AUTHORIZE_SHOP: '批量授权门店',
      ALLOCATE_LEADS: '批量分配leads',
      ALLOCATE_SHOP: '批量分配门店',
      SHOP_RELATION_CREATE: '创建人店关系',
    };
    this.setState({
      buttonText: buttonTexts[this.props.bizType],
      titleText: {
        title: this.props.bizType === 'AUTHORIZE_SHOP' ? '批量授权' : '批量分配',
        titles: this.props.bizType === 'SHOP_RELATION_CREATE' ? '创建人店关系' : null,
      },
      actionText: this.props.bizType === 'AUTHORIZE_SHOP' ? '修改' : '创建',
    });
  },

  showUploadProgress() {
    this.setState({
      percent: 0,
      progressText: '正在上传文件，请勿关闭窗口',
      progressVisible: true,
      // uploadModalVisible: false,
    });
    const self = this;
    uploadTimer = setInterval(() => {
      const percent = self.state.percent + 10;
      if (percent > 90) {
        this.setState({percent: 90});
        clearInterval(uploadTimer);
        uploadTimer = null;
      } else {
        this.setState({percent: percent});
      }
    }, 1000);
  },

  showUploadSuccess() {
    this.setState({showSuccessModal: true, uploadModalVisible: false, progressVisible: false });
  },

  hideSuccessModal() {
    this.setState({showSuccessModal: false});
  },

  showProcessProgress() {
    this.setState({
      percent: 0,
      progressText: '文件上传成功，正在导入，请勿关闭窗口',
      progressVisible: true,
      uploadModalVisible: false,
    });
    const self = this;
    processTimer = setInterval(() => {
      const percent = self.state.percent + 5;
      if (percent > 99) {
        this.processFailWith({
          failureCause: '处理超时',
        });
      } else {
        self.setState({percent: percent});
        self.process();
      }
    }, 3000);
  },

  processFailWith(result) {
    clearInterval(processTimer);
    processTimer = null;
    this.setState({
      percent: 0,
      progressVisible: false,
      uploadFailModalVisible: true,
      failureDownloadUrl: result.failureDownloadUrl,
      failureCause: result.failureCause,
    });
  },

  change(info) {
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
      //  this.showProcessProgress();
      this.showUploadSuccess();
    // 文件上传出错，或者上传完毕但预处理出错，同步返回错误结果
    } else { // if (info.file.status === 'error' || info.file.response.status === 'failed') {
      clearInterval(uploadTimer);
      uploadTimer = null;
      const failureCause = (info.file.response &&
                            info.file.response.resultMsg) ?
                            info.file.response.resultMsg :
                            '出现未知错误，请尝试重新上传';
      message.error(failureCause);
      this.setState({
        percent: 0,
        progressVisible: false,
        // uploadFailModalVisible: true,
        failureCause: failureCause,
        failureDownloadUrl: false,
      });
    }
  },

  downloadFailureResult() {
    window.location.href = this.state.failureDownloadUrl;
  },

  batchDispatch() {
    this.setState({
      uploadFailModalVisible: false,
      uploadModalVisible: true,
    });
    if (this.props.onShowModal) this.props.onShowModal();
  },

  cancelUploadModal() {
    this.setState({
      uploadModalVisible: false,
    });
  },

  cancelUploadFailModal() {
    this.setState({
      uploadFailModalVisible: false,
    });
  },

  goToBatchLogs() {
    window.location.hash = logHash[this.props.bizType];
  },

  render() {
    const batchDetailListLink = (<Button type="primary" onClick={this.goToBatchLogs}>查看进度</Button>);
    const titleTexts = this.state.titleText;
    return (<div style={this.props.style}>
      <Button
        type="primary"
        size="large"
        disabled={this.state.progressVisible}
        onClick={this.batchDispatch}>
        {this.state.buttonText}
      </Button>
      <Modal
        title={this.props.bizType === 'SHOP_RELATION_CREATE' ? titleTexts.titles : titleTexts.title}
        visible={this.state.uploadModalVisible}
        onCancel={this.cancelUploadModal}
        footer={/* !!this.state.failureDownloadUrl && uploadModalFooter*/ batchDetailListLink}>
        {this.props.bizType === 'SHOP_RELATION_CREATE' ? <p>初次使用请先<a href={`${window.APP.crmhomeUrl}${TemplateUrls[this.props.bizType]}?_input_charset=ISO8859-1`}>下载模板</a>，
        一次最多导入2000条记录。注意上传格式为xls。</p> : <p>请先<a href={`${window.APP.crmhomeUrl}${TemplateUrls[this.props.bizType]}?_input_charset=ISO8859-1`}>下载模板</a>，一次最多导入2000条记录。注意上传格式为xls。</p>}
        <div style={{margin: '32px auto', width: '80%'}}>
          <Dragger
            name="fileName"
            showUploadList={false}
            action={window.APP.crmhomeUrl + UploadUrls[this.props.bizType]}
            withCredentials
            onChange={this.change}>
            <p className="ant-upload-drag-icon">
              <Icon type="cloud-upload-o" />
            </p>
            <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
            <p className="ant-upload-hint">支持扩展名：xls</p>
          </Dragger>
        </div>
      </Modal>
      <ProgressMessage percent={this.state.percent} visible={this.state.progressVisible} text={this.state.progressText} />
      <Modal
        title="上传结束" visible={this.state.showSuccessModal} onCancel={this.hideSuccessModal}
        footer={batchDetailListLink}
      >
        <Alert message="格式正确"
          description="你提交的文档中数据较多，系统在后台中努力上传，你可在结果页中查看上传进度"
          type="success" showIcon
        />
      </Modal>
    </div>);
  },
});

export default BatchTaskButton;
