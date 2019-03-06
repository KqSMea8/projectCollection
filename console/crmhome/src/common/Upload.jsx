import React, {PropTypes} from 'react';
import {Upload, Icon, message} from 'antd';

export function formatUrl(url) {
  return url.replace(/&amp;/g, '&');
}

const MyUpload = React.createClass({
  propTypes: {
    exampleList: PropTypes.array,
  },

  render() {
    const examples = this.props.exampleList ? this.props.exampleList.map((row, i) => {
      return (<a key={i} href={row.url + '_700x700q90.jpg'} target="_blank" className="upload-example">
        <img src={row.url + '_78x78q80.jpg'}/>
        <span>{row.name}</span>
      </a>);
    }) : null;
    return (<div>
      <Upload
        withCredentials
        action={'/material/picUpload.json'}
        listType="picture-card" {...this.props}>
        <Icon type="plus"/>
        <div className="ant-upload-text">上传照片</div>
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
    if (file.response && file.response.success) {
      // 组件会将 file.url 作为链接进行展示
      const materialList = file.response.imgModel.materialList;
      file.url = formatUrl(materialList[0].url);
      file.id = materialList[0].sourceId;
    }
    return file;
  });

  // 3. 按照服务器返回信息筛选成功上传的文件
  fileList = fileList.filter((file) => {
    if (file.response) {
      // TODO
      if (file.response.buserviceErrorCode === 'USER_NOT_LOGIN') {
        message.error('请重新登录');
      }
      return file.response.success;
    }
    return true;
  });

  return fileList;
}

function normalizeUploadValueOne(info) {
  return normalizeUploadValue(info, 1);
}

export {MyUpload as Upload, normalizeUploadValue, normalizeUploadValueOne};
