import React, { PropTypes } from 'react';
import ajax from 'Utility/ajax';
import {Modal, Form, Button, message, Row, Col, Icon} from 'antd';
import {Uploader, normalizeUploadValueTweenty, normalizeUploadValueOne} from './Uploader';

const FormItem = Form.Item;
const BatchControlModal = React.createClass({
  propTypes: {
    form: PropTypes.object,
    visible: PropTypes.bool,
    onFinish: PropTypes.func,
    status: PropTypes.string,
    downloadResultBatchId: PropTypes.number,
    getLastBatchControlResult: PropTypes.func,
  },

  getInitialState() {
    return {
      downLoadBactchId: null,
      uploadFailModalVisible: false,
      uploadModalVisible: false,
      failureCause: '',
      submitFinish: false,
    };
  },

  onSubmit() {
    this.props.form.submit(() => {
      this.props.form.validateFields((errors, values) => {
        if (errors) {
          return;
        }
        this.setState({submitFinish: true});
        const data = values.shopList[0].response;
        const fileName = data.fileName;
        const fileUrl = data.fileUrl;
        const attachments = values.attachments;
        const attachmentArr = [];
        attachments.map(each => {
          attachmentArr.push({fileUrl: each.response.fileUrl, fileName: each.response.fileName});
        });
        ajax({
          url: '/support/control/batchSaleForCreate.json',
          method: 'post',
          data: {fileName, fileUrl, attachments: JSON.stringify(attachmentArr)},
          type: 'json',
          success: (result) => {
            if (result.status) {
              this.dealSubmitValidateFailure(result); // excel内容校验为VALIDATE_FAILURE执行
            } else if (result.batchId) {
              this.dealbatchIdResult(result.batchId); // excel内容校验为SUCCESS/PART_FAILURE/FAILURE时执行，请求结果不能快速返回，需轮询接口
            }
          },
        });
      });
    });
  },

  dealbatchIdResult(batchId) {
    ajax({
      url: '/support/batch/queryBatchOrder.json',
      method: 'get',
      data: {batchId},
      type: 'json',
      success: (res) => {
        if (res.resultCode === 'AE0311717079') {
          // 批处理查询进行中，进行轮询
          if (this.dealBatchTimeout) {
            clearTimeout(this.dealBatchTimeout);
          }
          this.dealBatchTimeout = setTimeout(() => {
            this.dealbatchIdResult(batchId);
          }, 2000);
        } else {
          clearTimeout(this.dealBatchTimeout);
          this.dealBatchControlSubmitResult(res);
        }
      },
    });
  },

  dealSubmitValidateFailure(result) {
    if (result.status === 'VALIDATE_FAILURE') {
      this.setState({
        uploadFailModalVisible: true,
        downLoadBactchId: null,
        failureCause: result.failureDesc ? result.failureDesc : '',
      });
      this.resetModalData();
    }
  },

  dealBatchControlSubmitResult(result) {
    if (result.status === 'SUCCESS') {
      message.success('文件上传成功', 3);
    } else {
      if (result.status === 'PART_FAILURE' || result.status === 'FAILURE') {
        this.setState({
          uploadFailModalVisible: true,
          failureCause: result.failureDesc ? result.failureDesc : '',
          downLoadBactchId: result.batchId,
        });
      }
    }
    this.resetModalData();
  },

  resetModalData() {
    this.props.form.resetFields();
    this.cancelBatchControlModal();
    this.setState({submitFinish: false});
  },

  cancelBatchControlModal() {
    this.props.form.resetFields();
    this.props.onFinish();
    this.setState({
      uploadModalVisible: false,
    });
  },

  changeBatchControlFooter() {
    const {status, downloadResultBatchId} = this.props;
    let showDownloadBatchResultText = null;
    if (status === 'FAILURE') {
      showDownloadBatchResultText = (<div style={{float: 'left', marginLeft: 5}}>
        <span style={{color: '#ff6e0d'}}>上次的创建结果有报错，</span>
        <a href={downloadResultBatchId ? '/support/batch/downloadBatchResult.htm?batchId=' + encodeURIComponent(downloadResultBatchId) : '#'}>下载结果</a>
      </div>);
    }
    return (<div>
      {showDownloadBatchResultText}
      <Button type="primary" onClick={this.onSubmit} loading={this.state.submitFinish}>确定</Button>
    </div>);
  },


  downloadFailureResult() {
    const {downLoadBactchId} = this.state;
    if (downLoadBactchId) {
      window.location.href = '/support/batch/downloadBatchResult.htm?batchId=' + encodeURIComponent(downLoadBactchId);
    }
  },

  cancelUploadFailModal() {
    this.setState({
      uploadFailModalVisible: false,
    });
  },

  showUploadModal() {
    this.setState({
      uploadFailModalVisible: false,
      uploadModalVisible: true,
    });
    this.props.getLastBatchControlResult();
  },

  render() {
    const {getFieldProps} = this.props.form;
    const {uploadModalVisible, downLoadBactchId} = this.state;
    const excelSchema = {scene: 'batchControlSend'}; // 批量管理按钮上传Excel文件场景码
    const uploadUrl = '/support/upload/commonFileUpload.json'; // 批量管理附件上传接口与excel文件上传地址相同
    const uploadFailModalFooter = (<div>
      {!!downLoadBactchId && (<Button type="primary" target="_blank" onClick={this.downloadFailureResult}>下载结果</Button>)}
      <Button type="ghost" onClick={this.showUploadModal}>重新上传</Button>
    </div>);
    return (<div>
      <Form>
        <Modal
          title="批量管控"
          width="600"
          visible={uploadModalVisible ? uploadModalVisible : this.props.visible}
          onCancel={this.cancelBatchControlModal}
          footer={this.changeBatchControlFooter()}
          >
            <p style={{marginBottom: 10}}>批量管控请上传以下文件</p>
            <FormItem
              className="batch-control-uploader"
              label={<span>1、门店列表：请先<a href="/batchControlSaleTemplate.xlsx">下载Excel模版</a>，并按照模版格式上传</span>}
              style={{margin: '5px 0px 15px', overflow: 'hidden'}}
              help="支持.xlsx格式，最多不超过200个门店。"
              required>
              <Uploader
                data={excelSchema}
                uploadUrl={uploadUrl}
                acceptType=".xlsx"
                {...getFieldProps('shopList', {
                  valuePropName: 'fileList',
                  normalize: normalizeUploadValueOne,
                  rules: [{
                    required: true,
                    max: 1,
                    type: 'array',
                  }],
                })}/>
            </FormItem>

            <FormItem
              className="batch-control-uploader"
              label={<span>2、附件上传：全国KA需上传商户申请邮件截图；非全国KA需上传近7天拜访小记截图或邮件申请截图；
                    <br/>
                    <span style={{marginLeft: 90}}>（附件会关联到上述需管控门店对应的管控事件中）</span>
                  </span>}
              style={{margin: '5px 0px 25px', overflow: 'hidden'}}
              help="支持 jpg 、jpeg、png、rar、zip格式，最多可上传20个附件，单个图片不超过2M，压缩文件不超过20M"
              required>
              <Uploader
                uploadUrl={uploadUrl}
                acceptType="jpeg, jpg, png, rar, zip"
                needSpeedUp
                {...getFieldProps('attachments', {
                  valuePropName: 'fileList',
                  normalize: normalizeUploadValueTweenty,
                  rules: [{
                    required: true,
                    max: 20,
                    type: 'array',
                  }],
                })}/>
          </FormItem>
        </Modal>

        <Modal
        title="上传失败"
        visible={this.state.uploadFailModalVisible}
        onCancel={this.cancelUploadFailModal}
        footer={uploadFailModalFooter}
        >
          <Row style={{padding: 16, borderRadius: 6, backgroundColor: '#ffeee6'}}>
            <Col span="4" style={{textAlign: 'right'}}>
              <span style={{fontSize: '250%', color: '#f50', padding: '20px'}}><Icon type="exclamation-circle" /></span>
            </Col>
            <Col>
              <h5 style={{fontSize: '120%', fontWeight: 'normal'}}>上传失败</h5>
              <p style={{color: '#999'}}>{this.state.failureCause}</p>
            </Col>
          </Row>
        </Modal>
      </Form>
    </div>);
  },
});

export default Form.create()(BatchControlModal);
