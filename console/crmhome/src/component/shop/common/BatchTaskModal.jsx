import React, { PropTypes } from 'react';
import ajax from '../../../common/ajax';
import { Button, Modal, Upload, Icon, Row, Col, message } from 'antd';
import ProgressMessage from './ProgressMessage';
import {kbScrollToTop} from '../../../common/utils';

const Dragger = Upload.Dragger;

let uploadTimer = null;
let processTimer = null;

const errorMessageMap = {
  USER_NOT_LOGIN: '用户需要重新登陆',
};

const CONFIG = {
  CREATE_SHOP: {
    queryType: 'create',
    modalTitle: '批量创建门店',
    downloadTemplateText: '模板',
    uploadUrl: '/shop/crm/batchCreate.json',
    downloadUrl: '',
    downloadPollingUrl: '',
    downloadTemplateUrl: '/shop/crm/downloadShopCreateTemplate.htm',
  },
  MODIFY_SHOP: {
    queryType: 'modify',
    modalTitle: '批量修改门店',
    downloadTemplateText: '门店列表',
    uploadUrl: '/shop/crm/batchModify.json',
    downloadUrl: '/shop/crm/shopExport.json',
    downloadPollingUrl: '/shop/crm/shopExportQuery.json',
    downloadTemplateUrl: '/shop/crm/shopExportDownload.htm',
  },
  REOPEN_SHOP: {
    queryType: 'reOpen',
    modalTitle: '批量重开门店',
    downloadTemplateText: '流水列表',
    uploadUrl: '/shop/crm/batchReOpen.json',
    downloadUrl: '/shop/crm/orderExport.json',
    downloadPollingUrl: '/shop/crm/shopExportQuery.json',
    downloadTemplateUrl: '/shop/crm/shopExportDownload.htm',
  },
  MODIFY_CONTENT: {
    queryType: 'modifyContent',
    modalTitle: '批量修改服务信息',
    downloadTemplateText: '门店列表',
    uploadUrl: '/shop/batchModifyShopContent.json',
    downloadUrl: '/shop/shopContentExport.json',
    downloadPollingUrl: '/shop/crm/shopContentExportQuery.json',
    downloadTemplateUrl: '/shop/crm/shopContentExportDownload.htm',
  },
};

const BatchTaskModal = React.createClass({
  propTypes: {
    batchTaskType: PropTypes.string,
    visible: PropTypes.bool,
    onFinish: PropTypes.func,
    searchParams: PropTypes.object,
    kbParams: PropTypes.object,
  },

  getInitialState() {
    return {
      uploadModalVisible: false,
      uploadFailModalVisible: false,
      percent: 0,
      progressVisible: false,
      failureDownloadUrl: null,
      failureCause: '',
      modalTitle: '',
      downloadTemplateText: '',
      termsChecked: true,
    };
  },

  componentWillReceiveProps(nextProps) {
    if (!nextProps.batchTaskType) {
      return;
    }
    const queryType = CONFIG[nextProps.batchTaskType].queryType;
    if (nextProps.visible !== this.props.visible) {
      this.queryLastResult(queryType);
    }
    this.setState({
      ...CONFIG[nextProps.batchTaskType],
      uploadModalVisible: nextProps.visible && !this.state.progressVisible && !this.state.uploadFailModalVisible,
    });
  },

  onTermsCheckedChange(e) {
    this.setState({ termsChecked: e.target.checked });
  },

  onClickDownloadTemplate(e) {
    e.preventDefault();
    const {batchTaskType} = this.props;
    const config = CONFIG[batchTaskType];

    if (batchTaskType === 'REOPEN_SHOP' || batchTaskType === 'MODIFY_SHOP' || batchTaskType === 'MODIFY_CONTENT') {
      this.downloadShopList(config.downloadUrl, config.downloadTemplateText, config.downloadTemplateUrl, config.downloadPollingUrl);
    } else if (batchTaskType === 'CREATE_SHOP') {
      window.location.href = config.downloadTemplateUrl  // eslint-disable-line no-location-assign
        + (this.props.kbParams && this.props.kbParams.isFromKbServ ? '?op_merchant_id=' + this.props.kbParams.op_merchant_id : '');
    }
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
      this.showProcessProgress();
    // 文件上传出错，或者上传完毕但预处理出错，同步返回错误结果
    } else { // if (info.file.status === 'error' || info.file.response.status === 'failed') {
      clearInterval(uploadTimer);
      uploadTimer = null;
      const failureCause = (info.file.response &&
                            info.file.response.resultMsg) ?
                            info.file.response.resultMsg :
                            '出现未知错误，请尝试重新上传';
      this.setState({
        percent: 0,
        progressVisible: false,
        uploadFailModalVisible: true,
        failureCause: failureCause,
        failureDownloadUrl: false,
      });
    }
  },

  getFailureDownload(queryType, batchNo) {
    return '/shop/crm/shopErrorFileDownload.json?batchNo=' + encodeURIComponent(batchNo) + '&queryType=' + queryType;
  },

  downloadShopList(url, name, templateUrl, downloadPollingUrl) {
    kbScrollToTop();
    ajax({
      url: url,
      method: 'post',
      data: {
        ...this.props.searchParams,
      },
    }).then((response) => {
      if (!response.batchNo || response.batchNo.trim === '') {
        throw response;
      } else {
        return this.startPollingDownloadLink(response.batchNo, name, downloadPollingUrl);
      }
    }).then((response) => {
      if (response.status === 'succeed') {
        message.success(name + '生成成功，开始下载');
        window.location.href = templateUrl + '?batchNo=' + encodeURIComponent(response.batchNo)  // eslint-disable-line no-location-assign
          + (this.props.kbParams && this.props.kbParams.isFromKbServ ? '&op_merchant_id=' + this.props.kbParams.op_merchant_id : '');
      } else {
        throw response;
      }
    }).catch((reason) => {
      let errorMsg;
      if (reason.resultMsg) {
        errorMsg = reason.resultMsg;
      } else if (reason.exportStatus === 'PROCESSING') {
        errorMsg = '已经有一个' + name + '导出任务在处理中了，请稍后重试';
      } else if (reason.exportStatus === 'NODATA') {
        errorMsg = '没有数据';
      } else if (reason.exportStatus === 'FAIL') {
        errorMsg = '导出失败，请重新尝试';
      } else {
        errorMsg = '获取' + name + '失败';
      }
      message.error(errorMsg);
    });
  },

  startPollingDownloadLink(batchNo, name, url) {
    const dismiss = message.loading('等待' + name + '生成……', 0);
    return new Promise((resolve, reject) => {
      let timer = setInterval(() => {
        ajax({
          url: url,
          method: 'get',
          data: { batchNo },
        }).then((response) => {
          if (response.exportStatus !== 'PROCESSING') {
            clearInterval(timer);
            timer = null;
            dismiss();
            if (response.exportStatus === 'SUCCESS') {
              resolve({ status: 'succeed', batchNo });
            } else if (response.exportStatus === 'FAIL') {
              reject({ status: 'failed', resultMsg: '无法下载，请重试'});
            } else if (response.exportStatus === 'NODATA') {
              reject({ status: 'failed', resultMsg: '没有数据，可以尝试改变搜索条件'});
            }
          }
        });
      }, 1000);
    });
  },

  queryProcessStatus(queryType) {
    this.setState({failureDownloadUrl: null});
    return ajax({
      url: '/shop/crm/queryBatchResult.json',
      data: {
        queryType,
      },
    });
  },

  queryLastResult(queryType) {
    this.queryProcessStatus(queryType).then((response) => {
      if (response.status !== 'succeed') {
        message.error(response.resultMsg || '查询上次处理结果失败'); // TODO 文案修改
        return;
      }
      const batchStatus = response.batchStatus.toUpperCase();
      // 上一次任务处理完毕，有结果
      if ((batchStatus === 'FAIL' || batchStatus === 'SUCCESS') &&
          response.errorFile &&
          response.errorFile.length &&
          response.batchNo) {
        this.setState({failureDownloadUrl: this.getFailureDownload(queryType, response.batchNo)});
      // 上一次任务处理中
      } else if (batchStatus === 'PROCESSING') {
        Modal.warning({
          title: '处理中',
          content: '上次上传的文件正在处理中，请稍后再试',
        });
        this.setState({
          uploadModalVisible: false,
        });
      } else {
        // 其他情况包括均不处理
      }
    });
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

  showProcessProgress() {
    this.setState({
      percent: 0,
      progressText: '文件上传成功，正在导入，请勿关闭窗口',
      progressVisible: true,
      uploadModalVisible: false,
    });
    const self = this;
    processTimer = setInterval(() => {
      let percent = self.state.percent + 0.2;
      percent = parseFloat(percent.toFixed(1));
      if (percent > 99.9) {
        clearInterval(processTimer);
        processTimer = null;
      } else {
        self.setState({percent: percent});
        self.queryCurrentResult(self.state.queryType);
      }
    }, 1000);
  },

  queryCurrentResult(queryType) {
    const {batchTaskType} = this.props;
    this.queryProcessStatus(queryType).then((response) => {
      if (response.status !== 'succeed') {
        message.error(response.resultMsg || '查询处理结果失败');
        return;
      }
      const batchStatus = response.batchStatus.toUpperCase();
      // 处理中，空过
      if (batchStatus === 'PROCESSING') {
        return;
      }
      // 处理完毕
      clearInterval(processTimer);
      processTimer = null;
      // 全部导入成功
      if (batchStatus === 'SUCCESS' &&
          !(response.errorFile && response.errorFile.length)) {
        this.setState({
          percent: 100,
          progressText: '导入完毕，全部处理成功',
          progressVisible: false,
        });
        this.setState({failureDownloadUrl: false});
        this.props.onFinish();
        return;
      }
      // 有错误
      let failureCause;
      let failureDownloadUrl = false;
      if (response.errorFile &&
          response.errorFile.length &&
          response.batchNo) {
        failureCause = batchTaskType === 'MODIFY_CONTENT'
          ? '你提交的文档中数据不符合模板格式，请下载结果列表，在结果列表查看报错原因，订正结果后再重新上传。'
          : '导入完毕，请下载结果列表，在结果列表中校正后再重新上传。';
        failureDownloadUrl = this.getFailureDownload(queryType, response.batchNo);
      } else if (response.resultMsg &&
                 response.resultMsg.length &&
                 response.resultMsg[0] &&
                 response.resultMsg[0].errorMessage) {
        failureCause = response.resultMsg[0].errorMessage;
      } else {
        failureCause = errorMessageMap[response.resultCode] || response.resultMsg || '出现未知错误，请尝试重新上传';
      }
      this.setState({
        progressVisible: false,
        uploadFailModalVisible: true,
        failureDownloadUrl: failureDownloadUrl,
        failureCause: failureCause,
      });
    });
  },

  downloadFailureResult() {
    window.location.href = this.state.failureDownloadUrl  // eslint-disable-line no-location-assign
      + (this.props.kbParams && this.props.kbParams.isFromKbServ ? '&op_merchant_id=' + this.props.kbParams.op_merchant_id : '');
  },

  showUploadModal() {
    this.setState({
      uploadFailModalVisible: false,
      uploadModalVisible: true,
    });
    this.queryLastResult(this.state.queryType);
  },

  cancelUploadModal() {
    this.setState({
      uploadModalVisible: false,
    });
    if (!this.state.progressVisible && !this.state.uploadFailModalVisible) {
      this.props.onFinish();
    }
  },

  cancelUploadFailModal() {
    this.setState({
      uploadFailModalVisible: false,
    });
    this.props.onFinish();
  },

  render() {
    const {modalTitle, uploadUrl, downloadTemplateText} = this.state;

    const uploadModalFooter = (<p style={{fontSize: '12px', textAlign: 'left'}}>
      <span style={{color: '#F90'}}>上次的处理结果有报错，</span>
      <a href={this.state.failureDownloadUrl}>下载结果</a>
    </p>);

    const uploadFailModalFooter = (<div>
      {!!this.state.failureDownloadUrl && (<Button type="primary" onClick={this.downloadFailureResult}>下载结果</Button>)}
      <Button type="ghost" onClick={this.showUploadModal}>重新上传</Button>
    </div>);

    const uploadParams = {
      bindingPublic: this.state.termsChecked,
      ...this.props.searchParams,
    };
    if (this.props.kbParams && this.props.kbParams.isFromKbServ) {
      uploadParams.op_merchant_id = this.props.kbParams.op_merchant_id;
    }

    return (<div>
      <Modal
        title={modalTitle}
        visible={this.state.uploadModalVisible}
        onCancel={this.cancelUploadModal}
        footer={!!this.state.failureDownloadUrl && uploadModalFooter}>
        {this.props.batchTaskType === 'MODIFY_SHOP' && <p>请先在门店列表上方选择筛选条件，然后<a href="" onClick={this.onClickDownloadTemplate}>下载{downloadTemplateText}</a>，修改后提交。注意上传格式为xls。</p>}
        {(this.props.batchTaskType === 'CREATE_SHOP' || this.props.batchTaskType === 'REOPEN_SHOP') && <p>请先<a href="" onClick={this.onClickDownloadTemplate}>下载{downloadTemplateText}</a>，一次最多导入{this.props.batchTaskType === 'CREATE_SHOP' ? '400' : '200'}条记录。注意上传格式为xls。</p>}
        {this.props.batchTaskType === 'MODIFY_CONTENT' && <p><a href="" onClick={this.onClickDownloadTemplate}>下载全部{downloadTemplateText}</a>，选择需要修改的门店进行修改，然后提交。注意上传格式为.xls。</p>}
        <div style={{margin: '32px auto', width: '80%'}}>
          <Dragger
            name="shopBatchFile"
            showUploadList={false}
            action={uploadUrl}
            withCredentials
            data={uploadParams}
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
        visible={this.state.uploadFailModalVisible}
        onCancel={this.cancelUploadFailModal}
        footer={uploadFailModalFooter}
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

export default BatchTaskModal;
