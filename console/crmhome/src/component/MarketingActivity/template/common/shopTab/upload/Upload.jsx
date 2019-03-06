import React, {PropTypes} from 'react';
import {Upload, Icon, message} from 'antd';

const MyUpload = React.createClass({
  propTypes: {
    exampleList: PropTypes.array,
    text: PropTypes.string,
  },

  getDefaultProps() {
    return { text: '上传照片' };
  },

  render() {
    const examples = this.props.exampleList && this.props.exampleList.length ? this.props.exampleList.map((row, i) => {
      return (<a key={i} href={row.url} target="_blank" className="upload-example">
        <img src={row.url}/>
        <span>{row.name}</span>
      </a>);
    }) : null;

    return (<div>
      <Upload
        withCredentials
        action={'/market/uploadPicture.json'}
        onPreview={file => window.open(file.url)}
        listType="picture-card" {...this.props}>
        <Icon type="plus"/>
        <div className="ant-upload-text">{this.props.text}</div>
      </Upload>
      {examples}
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
  if (limit) {
    if (fileList.length > limit) {
      fileList = fileList.slice(-limit);
    }
  }

  fileList = fileList.slice(0);


  // 2. 读取远程路径并显示链接
  fileList = fileList.map((file) => {
    if (typeof file.response === 'string') {
      file.response = JSON.parse(file.response);
    }
    if (file.response) {
      // 组件会将 file.url 作为链接进行展示,只有图片使用。
      if (file.type.indexOf('image') !== -1) {
        file.url = file.response.fileNameUrl;
      } else { // 上传文件时，不提供下载地址。
        file.tfsUrl = file.response.fileNameUrl;
      }
      file.id = file.response.result;
    }
    return file;
  });

  // 3. 按照服务器返回信息筛选成功上传的文件
  fileList = fileList.filter((file) => {
    if (file.response) {
      if (file.response.status === 'failed') {
        message.error(file.response.errorMsg);
        return false;
      } else if (file.response.messageCode && file.response.exception_marking) {
        message.error('上传失败');
        return false;
      }
      return true;
    }
    return true;
  });
  return fileList;
}

function normalizeUploadValueOne(info) {
  return normalizeUploadValue(info, 1);
}

export {MyUpload as Upload, normalizeUploadValue, normalizeUploadValueOne};
