import React from 'react';
import { Button, Upload, message } from 'antd';
import ajax from 'Utility/ajax';
import {appendOwnerUrlIfDev} from '../../../common/utils';
import ApplicationRecord from './ApplicationRecord';

const ApplicationManagementIndex = React.createClass({
  getInitialState() {
    return {
      isPurchase: '',
    };
  },

  componentWillMount() {
    this.refresh();
  },

  onOk() {
    ajax({
      url: appendOwnerUrlIfDev('/sale/asset/buildPurchaseFile.json'),
      method: 'get',
      type: 'json',
      success: (result) => {
        if (result.status && result.status === 'succeed') {
          const url = appendOwnerUrlIfDev('/sale/asset/downloadPurchaseFile.resource');
          location.href = url;
        }
      },
    });
  },

  refresh() {
    ajax({
      url: appendOwnerUrlIfDev('/sale/asset/isPurchaseCheck.json'),
      method: 'get',
      type: 'json',
      success: (result) => {
        if (result.status && result.status === 'succeed') {
          this.setState({
            isPurchase: result.data,
          });
        }
      },
    });
  },

  render() {
    const props = {
      name: 'file',
      action: appendOwnerUrlIfDev('/sale/asset/uploadPurchaseFile.json'),
      showUploadList: 'false',
      beforeUpload: (file) => {
        const type = file.name.substring(file.name.lastIndexOf('.') + 1);
        if (['xls'].indexOf(type) === -1) {
          message.error('文件格式错误', 3 );
          return false;
        }
        return true;
      },
      onChange(info) {
        if (info.file.status === 'done' && info.file.response.status === 'failed') {
          message.error(info.file.response.fillErrors[0].errorMessage, 3);
        } else if (info.file.status === 'error') {
          message.error(`上传失败。`, 3);
        } else if (info.file.status === 'done' && info.file.response.status === 'succeed') {
          message.success(`上传成功。`, 3);
        }
      },
    };
    return (
      <div>
        <div className="app-detail-header">申请单管理</div>
        <div className="app-detail-content-padding" style={{position: 'absolute', top: -5, right: 16, zIndex: 1}}>
          <Button type="primary" size="large" >
            <a href="#/material/applicationManagement/applyMaterial" target= "_blank" style={{color: 'white'}}>申请物料</a>
          </Button>
          {
            this.state.isPurchase &&
            (<span>
              <span style={{marginLeft: '20px'}}/>
              <Button size="large" onClick={this.onOk}>下载采购单</Button>
              <span style={{marginLeft: '20px'}}/>
              <Upload
              withCredentials
              {...props}
              // normalize = {this.normalizeUploadValue}
              showUploadList={false}>
                <Button type="primary" size="large">上传采购单</Button>
              </Upload>
            </span>)
          }
        </div>
        <ApplicationRecord />
      </div>);
  },
});

export default ApplicationManagementIndex;
