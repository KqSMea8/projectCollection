import React, {PropTypes} from 'react';
import {Upload, Icon, Button, message} from 'antd';

const Uploader = React.createClass({
  propTypes: {
    name: PropTypes.string,
    uploadUrl: PropTypes.string,// 新的上传地址
    acceptType: PropTypes.string,// 上传类型设置
    needSpeedUp: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      needSpeedUp: false,
    };
  },

  beforeUpload(file) {
    // e.x.: accetpType: 'jpeg, jpg, png, rar, zip'
    const acceptType = this.props.acceptType && this.props.acceptType.split(',');
    const defaultType = ['jpeg', 'jpg', 'png', 'rar', 'zip'];
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
    const action = this.props.uploadUrl || '/support/upload/fileUpload.json';
    const acceptType = this.props.acceptType || 'image/jpeg,image/jpg,image/png,.rar,.zip';
    const needSpeedUp = this.props.needSpeedUp;
    if (needSpeedUp) {
      return (
        <Upload beforeUpload={this.beforeUpload} name="attachmentFileName" {...this.props} className="events-attach-file" action={action}>
           <Button type="ghost">
             <Icon type="upload" /> 点击上传
           </Button>
         </Upload>
      );
    }
    return (
      <Upload accept={acceptType} name="attachmentFileName" {...this.props} className="events-attach-file" action={action}>
         <Button type="ghost">
           <Icon type="upload" /> 点击上传
         </Button>
       </Upload>
    );
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
    if (file.response && file.response.attachment) {
      // 组件会将 file.url 作为链接进行展示
      file.name = file.response.attachment.name;
      file.url = window.APP.uploadUrl + file.response.attachment.urlParam;
      file.resourceId = file.response.attachment.resourceId;
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
    if (file.type && file.type.indexOf('image') !== -1 && file.size > 2 * 1024 * 1024) {
      message.error('图片最大2M', 2.5);
      return false;
    }

    if (file.type && file.type.indexOf('image') === -1 && file.size > 20 * 1024 * 1024) {
      message.error('文件最大20M', 2.5);
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
