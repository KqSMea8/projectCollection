import React, { PropTypes } from 'react';
import { Tabs, Upload, message, Button, Modal, Icon, Row, Col} from 'antd';
import { appendOwnerUrlIfDev } from '../../../common/utils';
import KoubeiApplicationRecord from './ApplicationRecord';
import AlipayApplicationRecord from '../ApplicationManagement/AlipayMaterialApply/AlipayApplicationRecordList';
import permission from '@alipay/kb-framework/framework/permission';
import ajax from 'Utility/ajax';

const TabPane = Tabs.TabPane;
const Dragger = Upload.Dragger;

const ApplicationRecordIndex = React.createClass({
  propTypes: {
    children: PropTypes.any,
  },
  getInitialState() {
    return {
      // 控制转账码反馈的modal展示标识
      uploadModalVisible: false,
      // 控制反馈单上传成功之后,是否展示跳转url选择modal的展示
      skipUrlModalVisible: false,
    };
  },
  onChangeTabs(key) {
    window.location.hash = `/material/applicationManagement/applicationRecord/${key}`;
  },

  // 转账码反馈单文件上传
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

  // 后端处理成功上传的文件后刷新本页面,并且跳转到批量导入文件页面
  skipUrl() {
    this.setState({
      skipUrlModalVisible: false,
    });
    // location.href = 'http://kbservcenter-d7014.alipay.net/support/punish.htm#/import/list/TRANSFER_STUFF_IMPORT';
    // location.reload('#/material/applicationManagement/applicationRecord/alipay');
    window.open(this.state.skipUrl);
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
  showCloudUploadModal(value) {
    if (value === 'ISV_STUFF') {
      this.setState({
        title: '发货单反馈',
        bizType: 'ISV_STUFF',
        url: '/sale/asset/batchIsvForCreate.json',
        skipUrl: '/support/punish.htm#/import/list/ISV_STUFF_IMPORT',
        element: [<p>1.物料申请反馈Excel表中，本次发货数量、物流单号、物流公司、物流PO号、物料</p>,
            <p><span>&nbsp;&nbsp;&nbsp;</span>供应商、物料PO号为必填信息，如果订单项需要驳回，请标记Y，并且备注必填。</p>],
      });
    } else if (value === 'TRANSFER_CODE') {
      this.setState({
        title: '转账码反馈',
        bizType: 'TRANSFER_CODE',
        url: '/sale/asset/batchStuffForCreate.json',
        skipUrl: '/support/punish.htm#/import/list/TRANSFER_STUFF_IMPORT',
        element: [<p>1.物料申请反馈Excel表中，物料供应商、PO单号、物流公司名称、物流单号为必填信息。</p>],
      });
    }
    this.setState({
      // 隐藏转账码反馈单错误消息提示框
      uploadFailModalVisible: false,
      // 显示上传转账码反馈单的modal
      uploadModalVisible: true,
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

  // 支付宝反馈单上传
  showUpload() {
    const items = [];
    if (permission('STUFF_DELIVER_UPLOAD')) {
      items.push(
        <Button type="primary" onClick={this.showCloudUploadModal.bind(this, 'ISV_STUFF')}>
          发货单反馈
        </Button>
      );
    } else {
      items.push(
        <Button type="primary" onClick={this.showupload}>
          发货单反馈
        </Button>);
    }
    if (permission('TRANSFER_CODE_ORDER_UPLOAD')) {
      items.push(
        <Button type="primary" style={{marginLeft: 10}} onClick={this.showCloudUploadModal.bind(this, 'TRANSFER_CODE')}>
          转账码反馈
        </Button>);
    }
    return items;
  },
  render() {
    const {children} = this.props;
    let activeKey = 'koubei';
    const tabs = [];
    if (permission('STUFF_MANAGE_KOUBEI')) {
      tabs.push(
        <TabPane tab="口碑物料" key="koubei">
          <KoubeiApplicationRecord applycationType="koubei" />
        </TabPane>
      );
    }
    if (permission('STUFF_MANAGE_ALIPAY')) {
      tabs.push(
        <TabPane tab="支付宝物料" key="alipay">
          <AlipayApplicationRecord applycationType="alipay" />
        </TabPane>
      );
    }
    if (!permission('STUFF_MANAGE_KOUBEI') && !permission('STUFF_MANAGE_ALIPAY')) {
      tabs.push(
        <TabPane tab="暂无权限" key="koubei" />
      );
    }
    if (permission('STUFF_MANAGE_ALIPAY') && children.type.displayName === 'AlipayApplicationRecordList') {
      activeKey = 'alipay';
    } else if (permission('STUFF_MANAGE_KOUBEI') && children.type.displayName === 'KoubeiApplicationRecordList') {
      activeKey = 'koubei';
    }
    // const footer = (<Button type="primary" onClick={this.hasknow}>知道啦</Button>);
    const uploadFailModalFooter = (<div>
      <Button type="ghost" onClick={this.showCloudUploadModal}>重新上传</Button>
    </div>);
    const uploadSuccessModalFooter = (<div>
      <Button type="primary" onClick={this.skipUrl}>查看进度</Button>
    </div>);
    // 公用反馈单上传
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
    return (
      <div>
        <div className="kb-tabs-main">
          <Tabs defaultActiveKey=""
            activeKey={activeKey}
            onChange={this.onChangeTabs}
            tabBarExtraContent={activeKey === 'alipay' ? this.showUpload() : null }>
            {tabs}
          </Tabs>
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
            {this.state.element}
            <p>2.除上述必填内容外，其他内容勿修改，避免在校验时出现错误，导致上传失败。</p>
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

export default ApplicationRecordIndex;
