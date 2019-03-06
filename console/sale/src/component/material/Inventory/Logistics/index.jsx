import React from 'react';
import {Button, Upload, Modal, Icon, Row, Col, message} from 'antd';
import MaterialAcceptanceForm from './MaterialAcceptanceForm';
import MaterialAcceptanceTable from './MaterialAcceptanceTable';
import { appendOwnerUrlIfDev } from '../../../../common/utils';
import ajax from 'Utility/ajax';
const Dragger = Upload.Dragger;
const MaterialAcceptance = React.createClass({
  getInitialState() {
    return {};
  },
  onSearch(params) {
    this.setState({
      params,
    });
  },
  onFileUploadChange(info) {
    // 文件上传中
    if (info.file && info.file.response) {
      if (info.file.status === 'done' && info.file.response.status === 'succeed') {
        const fileName = info.file.response.fileName;
        const fileUrl = info.file.response.resourceId;
        // 后端处理文件的方法
        this.queryCurrentResult(fileName, fileUrl);
      } else {
        // if (info.file.status === 'error' || info.file.response.status === 'failed') {
        const failureCause = (info.file.response &&
          info.file.response.resultMsg) ?
          info.file.response.resultMsg :
          '出现未知错误，请尝试重新上传';
        this.setState({
          // 显示转账码反馈单错误消息提示框
          uploadFailModalVisible: true,
          // 隐藏转账码上传的页面
          uploadModalVisible: false,
          failureCause: failureCause,
        });
      }
    }
  },
  setPagination(pagination) {
    this.setState({
      pagination: pagination,
    });
  },
  // 转账码反馈单后端处理
  queryCurrentResult(fileName, fileUrl) {
    this.setState({
      uploadModalVisible: false,
    });
    ajax({
      url: appendOwnerUrlIfDev(this.state.url),
      data: {fileName, fileUrl},
      success: (result) => {
        if (result.status !== 'succeed') {
          message.error(result.resultMsg || '文件上传成功,创建批次单失败');
          return;
        }
        if (result.status === 'succeed') {
          this.setState({
            skipUrlModalVisible: true,
            successMessage: '创建批次单成功,是否跳转至批量文件导入页面查看进度?',
          });
          return;
        }
      },
      error: (err) => {
        message.error(err.resultMsg ? err.resultMsg + ',文件上传成功,创建批次单失败' : '文件上传成功,创建批次单失败', 3);
      },
    });
  },
  // 控制转账码反馈单上传modal是否展示
  cancelUploadModal() {
    this.setState({
      uploadModalVisible: false,
    });
  },

  // 点击关闭时 隐藏转账码反馈单错误消息提示框
  cancelUploadFailModal() {
    this.setState({
      uploadFailModalVisible: false,
    });
  },
  // 点击关闭时 隐藏转账码反馈单跳转url消息提示框
  cancelUploadSuccessModal() {
    this.setState({
      skipUrlModalVisible: false,
    });
  },

  // 支付宝ISV反馈单上传 如果没有操作权限,直接展示没有权限
  showupload() {
    message.error('您没有该操作的权限');
    return;
  },
  skipUrl() {
    this.setState({
      skipUrlModalVisible: false,
    });
    window.open(this.state.skipUrl);
  },
  downloadSkipUrl() {
    this.setState({
      skipUrlModalVisible: false,
    });
    window.open(this.state.downloadurl);
  },
  showCloudUploadModal() {
    this.setState({
      title: '导入申请单',
      bizType: 'ISV_STUFF',
      url: '/sale/asset/batchKaStuffApplyOrderForCreate.json',
      // 隐藏转账码反馈单错误消息提示框
      uploadFailModalVisible: false,
      // 显示上传转账码反馈单的modal
      uploadModalVisible: true,
      downloadurl: 'http://p.tb.cn/rmsportal_10446__E7_89_A9_E6_B5_81_E5_8D_95_E4_B8_8B_E8_BD_BD_E8_A1_A8_E6_A0_BC_E6_A0_BC_E5_BC_8F.xls',
      skipUrl: '/support/punish.htm#/import/list/KA_STUFF_APPLY_ORDER_IMPORT',
      element: [<p>1.物料申请反馈Excel表中，本次发货数量、物流单号、物流公司、物流PO号、物料</p>,
        <p><span>&nbsp;&nbsp;&nbsp;</span>供应商、物料PO号为必填信息，如果订单项需要驳回，请标记Y，并且备注必填。</p>],
    });
  },
  render() {
    const uploadSuccessModalFooter = (<div>
      <Button type="primary" onClick={this.downloadSkipUrl}>下载模板</Button>
      <Button type="primary" onClick={this.skipUrl}>查看进度</Button>
    </div>);
    const uploadFailModalFooter = (<div>
      <Button type="ghost" onClick={this.showCloudUploadModal}>重新上传</Button>
    </div>);
    const props = {
      name: 'file',
      action: appendOwnerUrlIfDev('/sale/asset/saleFileUpload.json'),
      data: {bizType: this.state.bizType},
      showUploadList: false,
      accept: '.xls',
      beforeUpload: (file) => {
        const type = file.name.substring(file.name.lastIndexOf('.') + 1);
        if (['xls'].indexOf(type) === -1) {
          message.error('文件格式错误', 3);
          return false;
        }
        return true;
      },
      onChange: this.onFileUploadChange,
    };
    return (<div>
        <div className="app-detail-header">
          <div style={{float: 'right'}}>
            {( window.APP.userType === 'BUC' ) ?
              <Button type="primary" key="1" style={{marginLeft: 10}} onClick={this.showCloudUploadModal.bind(this, 'TRANSFER_CODE')}>
                导入申请单
              </Button>
              : null }
          </div>
          <span>物流查询</span>
        </div>
        <div className="app-detail-content-padding">
          <MaterialAcceptanceForm onSearch={this.onSearch} params={this.state.params} pagination={this.state.pagination}/>
          <MaterialAcceptanceTable params={this.state.params} setPagination={this.setPagination}/>
        </div>
        <Modal
          key= "TRANSFER_CODE"
          title= {this.state.title}
          visible={this.state.uploadModalVisible}
          onCancel={this.cancelUploadModal}
          width={550}
          footer={uploadSuccessModalFooter}>
          <div style={{margin: '0px auto', width: '95%', color: 'grey'}}>
            <p>上传说明：</p>
            <p>请先下载Excel模版，并按照模版格式上传，不超过1000条记录，点击“下载Excel“可以下载模版的</p>
          </div>
          <div style={{margin: '20px auto', width: '95%'}}>
            <Dragger withCredentials {...props}>
              <p className="ant-upload-drag-icon">
                <Icon type="cloud-upload-o" />
              </p>
              <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
              <p className="ant-upload-hint">支持扩展名：xls</p>
            </Dragger>
          </div>
        </Modal>
        <Modal
          key= "TRANSFER_CODE_ORDER"
          title="上传失败"
          visible={this.state.uploadFailModalVisible}
          onCancel={this.cancelUploadFailModal}
          footer={uploadFailModalFooter}>
          <Row>
            <Col span="4" style={{textAlign: 'right'}}>
              <span style={{fontSize: '250%', color: '#f50', padding: '20px'}}>
                <Icon type="exclamation-circle-o" />
              </span>
            </Col>
            <Col>
              <h5 style={{fontSize: '120%', fontWeight: 'normal'}}>上传失败</h5>
              <p style={{color: '#999'}}>{this.state.failureCause}</p>
            </Col>
          </Row>
        </Modal>
        <Modal
          key= "TRANSFER_CODE_ORDER_SUCCESS"
          title="上传成功"
          visible={this.state.skipUrlModalVisible}
          onCancel={this.cancelUploadSuccessModal}
          footer={uploadSuccessModalFooter}>
          <Row>
            <Col span="4" style={{textAlign: 'right'}}>
              <span style={{fontSize: '250%', color: '#87D068', padding: '20px'}}>
                <Icon type="check-circle-o" />
              </span>
            </Col>
            <Col>
              <h5 style={{fontSize: '120%', fontWeight: 'normal'}}>上传成功,正在导入数据记录...</h5>
              <p style={{color: '#999'}}>{this.state.successMessage}</p>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  },
});
export default MaterialAcceptance;
