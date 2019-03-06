import React, { PropTypes } from 'react';
import ajax from 'Utility/ajax';
import { Button, Modal, Upload, Icon, Row, Col, message, Alert } from 'antd';
import ProgressMessage from './ProgressMessage';

const Dragger = Upload.Dragger;

let uploadTimer = null;
let processTimer = null;
let CONFIG;
let batchFooter = '';
let batchTaskFooter = '';

const BatchTaskModal = React.createClass({
  propTypes: {
    batchTaskType: PropTypes.string,
    visible: PropTypes.bool,
    onFinish: PropTypes.func,
    searchParams: PropTypes.object,
    bizType: PropTypes.string,
    showRateText: PropTypes.bool,
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
      showSuccessModal: false,
    };
  },
  componentWillReceiveProps(nextProps) {
    if (!nextProps.batchTaskType) {
      return;
    }

    CONFIG = {
      CREATE_SHOP: {
        queryType: 'create',
        uploadUrl: window.APP.crmhomeUrl + '/shop/koubei/batchCreate.json',
        downloadUrl: window.APP.crmhomeUrl + '/shop/koubei/downloadShopCreateTemplate.htm',
        modalTitle: '批量创建门店',
        downloadTemplateText: '模板',
      },
      MODIFY_SHOP: {
        queryType: 'modify',
        uploadUrl: window.APP.crmhomeUrl + '/shop/koubei/batchModify.json',
        downloadUrl: window.APP.crmhomeUrl + '/shop/koubei/shopExport.json',
        modalTitle: '批量修改门店',
        downloadTemplateText: '门店列表',
      },
      REOPEN_SHOP: {
        queryType: 'reOpen',
        uploadUrl: window.APP.crmhomeUrl + '/shop/koubei/batchReOpen.json',
        downloadUrl: window.APP.crmhomeUrl + '/shop/koubei/orderExport.json',
        modalTitle: '批量重开门店',
        downloadTemplateText: '模板',
      },
      RATE_SHOP: { // 门店0费率申请
        queryType: 'rate',
        uploadUrl: window.APP.kbsalesUrl + '/batch/batchFileUpload.json', // 文件上传
        downloadUrl: window.APP.kbsalesUrl + '/batch/templateDownload.json?scene=APPLY_DEBIT_CARD_ZERO_CHARGE', // 下载模板
        modalTitle: nextProps.rateMenus,
      },
      CITY_MESSAGE: { // 导入直属城市信息
        queryType: 'city',
        uploadUrl: window.APP.kbsalesUrl + '/batch/batchFileUpload.json', // 文件上传
        downloadUrl: window.APP.kbsalesUrl + '/batch/templateDownload.json?scene=IMPORT_REGION_CONFIG_INFORMATION', // 下载模板
        modalTitle: nextProps.rateMenus,
      },
      // 注意：如果有新的业务是用 kbsales 系统的批量上传接口，请使用 BatchTaskModalForKBSales，不要在这个文件再加啦。
    };
    const queryType = CONFIG[nextProps.batchTaskType].queryType;
    if (queryType !== 'rate' && queryType !== 'city') {
      this.queryLastResult(queryType);
    }
    this.setState({
      rateModalTitle: CONFIG[nextProps.batchTaskType].modalTitle,
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

    if (batchTaskType === 'REOPEN_SHOP' || batchTaskType === 'MODIFY_SHOP') {
      this.downloadShopList(config.downloadUrl, config.downloadTemplateText);
    } else if (batchTaskType === 'CREATE_SHOP' || batchTaskType === 'RATE_SHOP' || batchTaskType === 'CITY_MESSAGE') {
      window.location.href = config.downloadUrl;
    }
  },
  onBatchCreate(fileName, ossFileKey) { // 批处理创建
    const {batchTaskType} = this.props;
    const scene = batchTaskType === 'RATE_SHOP' ? 'APPLY_DEBIT_CARD_ZERO_CHARGE' : 'IMPORT_REGION_CONFIG_INFORMATION';
    ajax({
      url: window.APP.kbsalesUrl + '/batch/batchOrderCreate.json',
      method: 'POST',
      type: 'json',
      data: {
        fileName,
        ossFileKey,
        scene,
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
          failureCause: result.resultMsg,
        });
      },
    });
  },
  onFileUploadChange(info) {
    if (this.state.queryType === 'rate' && !!this.props.showRateText) {
      this.setState({
        uploadModalVisible: false,
        failureCause: '每天中午11点-13点，下午18点-20点，不允许做数据批量处理，请在该时段外进行操作！',
        uploadFailModalVisible: true,
      });
      return;
    }
    // 文件上传中
    if (info.file.status === 'uploading') {
      if (!uploadTimer) {
        // 可能多次进入 uploading 状态，避免重复执行
        this.showUploadProgress();
      }
    // 文件上传完毕，后端处理文件中
    } else if (info.file.status === 'done' && info.file.response.status === 'succeed') {
      const {queryType} = this.state;
      clearInterval(uploadTimer);
      uploadTimer = null;
      if (queryType === 'rate' || queryType === 'city') {
        this.onBatchCreate(info.file.response.data.fileName, info.file.response.data.ossFileKey);
      } else {
        this.showProcessProgress();
      }
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

  getFailureDownload(queryType, batchNo) { // 下载结果
    return window.APP.crmhomeUrl + '/shop/koubei/shopErrorFileDownload.json?batchNo=' + encodeURIComponent(batchNo) + '&queryType=' + queryType;
  },

  downloadShopList(url, name) {
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
        return this.startPollingDownloadLink(response.batchNo, name);
      }
    }).then((response) => {
      if (response.status === 'succeed') {
        message.success(name + '生成成功，开始下载');
        window.location.href = window.APP.crmhomeUrl + '/shop/koubei/shopExportDownload.htm?batchNo=' + encodeURIComponent(response.batchNo);
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

  startPollingDownloadLink(batchNo, name) {
    const dismiss = message.loading('等待' + name + '生成……', 0);
    return new Promise((resolve, reject) => {
      let timer = setInterval(() => {
        ajax({
          url: window.APP.crmhomeUrl + '/shop/koubei/shopExportQuery.json',
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

  queryProcessStatus(queryType) { // 查询上次处理结果
    this.setState({failureDownloadUrl: null});
    const url = window.APP.crmhomeUrl + '/shop/koubei/queryBatchResult.json?queryType=' + queryType;
    return ajax({
      url,
    });
  },

  queryLastResult(queryType) {
    this.queryProcessStatus(queryType).then((response) => {
      if (response.status !== 'succeed') {
        message.error(response.resultMsg || '查询上次处理结果失败');
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

  queryCurrentResult(queryType) { // 查询结果
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
          !response.errorFile) {
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
        failureCause = '导入完毕，请下载结果列表，在结果列表中校正后再重新上传。';
        failureDownloadUrl = this.getFailureDownload(queryType, response.batchNo);
      } else if (response.resultMsg &&
                 response.resultMsg.length &&
                 response.resultMsg[0] &&
                 response.resultMsg[0].errorMessage) {
        failureCause = response.resultMsg[0].errorMessage;
      } else {
        failureCause = '出现未知错误，请尝试重新上传';
      }
      this.setState({
        percent: 0,
        progressVisible: false,
        uploadFailModalVisible: true,
        failureDownloadUrl: failureDownloadUrl,
        failureCause: failureCause,
      });
    });
  },

  downloadFailureResult() {
    window.location.href = this.state.failureDownloadUrl;
  },

  showUploadModal() {
    const {batchTaskType} = this.props;
    this.setState({
      uploadFailModalVisible: false,
      uploadModalVisible: true,
    });
    if (batchTaskType !== 'RATE_SHOP' && batchTaskType !== 'CITY_MESSAGE') {
      this.queryLastResult(this.state.queryType);
    }
  },
  showUploadSuccess() { // 0费率申请上传成功展示
    this.setState({
      showSuccessModal: true,
      uploadModalVisible: false,
      progressVisible: false,
    });
  },
  hideSuccessModal() {
    this.setState({showSuccessModal: false});
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
  goToBatchLogs() {
    window.location.hash = `#/shop/rate?shop=${this.props.bizType}`;
  },
  render() {
    const {modalTitle, uploadUrl, downloadTemplateText, rateModalTitle, uploadFailModalVisible} = this.state;
    const { batchTaskType } = this.props;
    const rateShop = this.props.batchTaskType === 'RATE_SHOP';
    const cityMessage = this.props.batchTaskType === 'CITY_MESSAGE';
    const uploadModalFooter = (<p style={{fontSize: '12px', textAlign: 'left'}}>
      <span style={{color: '#F90'}}>上次的处理结果有报错，</span>
      <a href={this.state.failureDownloadUrl}>下载结果</a>
    </p>);
    const goToBatchText = <span style={{color: '#F90'}}>每天中午11点-13点，下午18点-20点，不允许做数据批量处理，请在该时段外进行操作！</span>;
    const goToBatch = (<span style={{marginRight: '25px'}}><Button onClick={this.goToBatchLogs} type="primary" >查看进度</Button></span>);
    const rateModalText = !!this.props.showRateText ? goToBatchText : goToBatch;
    const rateModalFooter = (<div>{goToBatch}<Button type="ghost" onClick={this.showUploadModal}>重新上传</Button></div>);
    const rateModalFooterText = !!this.props.showRateText ? goToBatch : rateModalFooter;
    const uploadFailModalFooter = (<div>{!!this.state.failureDownloadUrl && (<Button type="primary" onClick={this.downloadFailureResult}>下载结果</Button>)}
      <Button type="ghost" onClick={this.showUploadModal}>重新上传</Button></div>);
    if (rateShop) {
      batchFooter = rateModalText;
      batchTaskFooter = rateModalFooterText;
    } else if (cityMessage) {
      batchFooter = goToBatch;
      batchTaskFooter = rateModalFooter;
    } else {
      batchFooter = (!!this.state.failureDownloadUrl && uploadModalFooter);
      batchTaskFooter = uploadFailModalFooter;
    }
    return (<div>
      <Modal
        title={modalTitle}
        visible={this.state.uploadModalVisible}
        onCancel={this.cancelUploadModal}
        footer={batchFooter}
      >
        {batchTaskType === 'RATE_SHOP' && <Alert message="【重要提醒】为商家申请借记卡零费率，商家将无法使用贷记（信用卡、花呗等）收款渠道，同时您的基础业务协作费将会降到0.05%" type="warning" showIcon />}
        {batchTaskType === 'MODIFY_SHOP' && <p>请先在门店列表上方选择筛选条件，<a href="" onClick={this.onClickDownloadTemplate}>下载</a>门店列表，修改后提交。注意上传格式为xls。</p>}
        {(batchTaskType === 'CREATE_SHOP' || batchTaskType === 'REOPEN_SHOP') && (
          <p>请先<a href="" onClick={this.onClickDownloadTemplate}>下载{downloadTemplateText}</a>，一次最多导入{batchTaskType === 'CREATE_SHOP' ? '400' : '200'}条记录。注意上传格式为xls。</p>
        )}
        {rateShop && <p>请先<a onClick={this.onClickDownloadTemplate}>下载模板</a>，一次最多导入100条记录。注意上传格式为xls。</p>}
        {cityMessage && <p>请先<a onClick={this.onClickDownloadTemplate}>下载Excel模版</a>，并按照模版格式上传。</p>}
        <div style={{margin: '32px auto', width: '80%'}}>
          <Dragger
            name="shopBatchFile"
            showUploadList={false}
            multiple={false}
            action={uploadUrl}
            withCredentials
            data={{bindingPublic: this.state.termsChecked}}
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
        title={rateShop || cityMessage ? rateModalTitle : '上传失败'}
        visible={uploadFailModalVisible}
        onCancel={this.cancelUploadFailModal}
        footer={batchTaskFooter}
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
      <Modal
        title="上传结束" visible={this.state.showSuccessModal} onCancel={this.hideSuccessModal}
        footer={goToBatch}
      >
        <Alert message={rateShop || cityMessage ? '提交成功！' : '格式正确'}
          description={(rateShop || cityMessage) ? ('你提交的文档正在处理中，你可点击"查看进度"进行结果查询') : ('你提交的文档中数据较多，系统在后台中努力上传，你可在结果页中查看上传进度')}
          type="success" showIcon
        />
      </Modal>
    </div>);
  },
});
export default BatchTaskModal;
