import React, {PropTypes} from 'react';
import {Upload, Button, message} from 'antd';

function getCookie(key) {
  const m = new RegExp('\\b' + key + '\\=([^;]+)').exec(document.cookie);
  return m ? m[1] : '';
}

const PhotoUpload = React.createClass({
  propTypes: {
    pid: PropTypes.string,
    onChange: PropTypes.func,
  },

  getInitialState() {
    return {
      loading: false,
      fileList: [],
    };
  },

  handleChange(info) {
    const fileList = info.fileList.filter((file) => {
      if (file.response) {
        if (!file.response.success) {
          message.error('上传失败', 1);
        } else {
          message.success('上传成功', 1);
          this.props.onChange();
        }
        this.setState({
          loading: false,
        });
        return false;
      }
      return true;
    });
    this.setState({
      fileList,
    });
  },

  beforeUpload(file) {
    if (['image/jpeg', 'image/gif', 'image/png', 'image/bmp'].indexOf(file.type) < 0) {
      message.error('图片格式错误');
      return false;
    }
    // 单个文件限制大小为10*1024*1024
    if (file.size > 10485760) {
      message.error('图片已超过10M');
      return false;
    }
    this.setState({
      loading: true,
    });
    return true;
  },

  render() {
    const props = {
      action: window.APP.crmhomeUrl + '/shop/koubei/uploadMaterial.json',
      withCredentials: true,
      data: {
        merchantPid: this.props.pid,
        ctoken: getCookie('ctoken'),
      },
      onChange: this.handleChange,
      beforeUpload: this.beforeUpload,
      showUploadList: false,
      multiple: true,
      fileList: this.state.fileList,
    };
    return (
      <div>
        <div style={{display: 'inline-block', marginRight: 10}}>
          大小不超过10M，仅支持 bmp、png、jpeg、jpg、gif格式
        </div>
        <Upload {...props}>
          <Button size="large" type="primary" loading={this.state.loading}>上传素材</Button>
        </Upload>
      </div>
    );
  },
});

export default PhotoUpload;
