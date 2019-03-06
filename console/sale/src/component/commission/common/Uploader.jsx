import React, {PropTypes} from 'react';
import {Upload, Icon, Button, message} from 'antd';

const ComplaintExcel = 'http://p.tb.cn/rmsportal_9192_RebateAppealTemplate.xlsx';

const Uploader = React.createClass({
  propTypes: {
    name: PropTypes.string,
    uploadUrl: PropTypes.string,// 新的上传地址
    acceptType: PropTypes.string,// 上传类型设置
    needSpeedUp: PropTypes.bool,
    noticeHelpe: PropTypes.any,
  },

  getDefaultProps() {
    return {
      needSpeedUp: false,
    };
  },

  beforeUpload(file) {
    const acceptType = this.props.acceptType && this.props.acceptType.split(',');
    const defaultType = ['jpg', 'jpeg', 'xls', 'xlsx', 'txt', 'csv'];
    let expectType = [];
    if (acceptType.length) {
      expectType = acceptType;
    } else {
      expectType = defaultType;
    }
    const exts = file.name.split('.');
    const ext = exts[exts.length - 1];
    let rightType = false;
    expectType.forEach((value) => {
      if (value.trim() === ext.toLowerCase()) {
        rightType = true;
      }
    });
    if (!rightType) {
      message.error('文件格式不正确', 2.5);
    }
    return rightType;
  },

  render() {
    const action = this.props.uploadUrl || '/sale/rebate/fileUpload.json';
    const {noticeHelpe} = this.props;
    const acceptType = this.props.acceptType || 'jpg, jpeg, xls, xlsx, txt, csv';
    return (<div>
      {
        noticeHelpe ? noticeHelpe : <p style={{color: '#999'}}>建议<a href={ComplaintExcel} target="_blank">下载Excel模版</a>，并按照模版格式上传</p>
      }
      <Upload beforeUpload={this.beforeUpload} accept={acceptType} name="fileName" {...this.props} className="events-attach-file" action={action}>
            <Button type="ghost">
              <Icon type="upload" />上传文件
            </Button>
       </Upload>
    </div>);
  },
});
function normalizeUploadValue(info, limit) {
  if (Array.isArray(info)) {
    return info;
  }
  if (!info) {
    return [];
  }
  let fileList = info.fileList;
  fileList = fileList.slice(0);

  if (limit) {
    if (fileList.length > limit) {
      message.warn('上传最多' + limit + '个', 2.5);
      return fileList.slice(0, limit);
    }
  }

  // 2. 读取远程路径并显示链接
  fileList = fileList.map((file) => {
    if (typeof file.response === 'string') {
      file.response = JSON.parse(file.response);
    }
    if (file.response) {
      file.fileName = file.response.fileName;
      file.ossKey = file.response.ossKey;
    }
    return file;
  });

  // 4. 按照服务器返回信息筛选成功上传的文件 大小限制
  fileList = fileList.filter((file) => {
    if (file.response) {
      if (file.response.buserviceErrorCode === 'USER_NOT_LOGIN') {
        message.error('请重新登录', 2.5);
        return false;
      }
      if (file.response && file.response.exceptionCode) {
        message.error('上传失败', 2.5);
        return false;
      }
      if (file.response.resultMsg) {
        message.error(file.response.resultMsg, 2.5);
        return false;
      }
      return file.response.status === 'succeed';
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error('文件最大5M', 2.5);
      return false;
    }

    return true;
  });

  return fileList;
}

function normalizeUploadValueTweenty(info) {
  return normalizeUploadValue(info, 20);
}

function normalizeUploadValueOne(info) {
  return normalizeUploadValue(info, 1);
}

export {Uploader, normalizeUploadValueTweenty, normalizeUploadValueOne};
