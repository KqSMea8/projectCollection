import React, {PropTypes} from 'react';
import UploadFile from './UploadFile';
import {Form, message} from 'antd';
const FormItem = Form.Item;

const UploadBusinessFile = React.createClass({
  propTypes: {
    form: PropTypes.any,
    initialValue: PropTypes.any,
    name: PropTypes.string,
    action: PropTypes.string,
    disabled: PropTypes.bool,
    data: PropTypes.object,
    onShopUploadFunction: PropTypes.func,
    onProgress: PropTypes.func,
    beforeUpload: PropTypes.func,
    onLogId: PropTypes.func,
  },
  getDefaultProps() {
    return {
      maxLine: 100000,
      beforeUpload: () => {},
    };
  },
  onChange(v) {
    if (v.fileList.length) {
      // 文件上传
      this.props.onShopUploadFunction(1);
      this.props.onProgress(1, v.fileList[0].response);
    } else {
      // 文件被删除
      this.props.onProgress(0);
      this.props.onShopUploadFunction(0);
      this.props.form.setFieldsValue({'uploadStatu': {hasUpload: false, shopTotalCnt: 0}});
      this.props.onLogId('');
    }
  },

  normalizeUploadValue(info, limit) {
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
  },

  normalizeUploadValueOne(info) {
    return this.normalizeUploadValue(info, 1);
  },

  render() {
    const {getFieldProps} = this.props.form;
    const legal = '/goods/itempromo/downloadPromoShops.htm';
    return (
      <FormItem className="uploadBox">
          <UploadFile
            {...this.props}
            {...getFieldProps(this.props.propsName, {
              valuePropName: 'fileList',
              initialValue: this.props.userData ? this.props.userData.uploadBusinessFile : [],
              normalize: this.normalizeUploadValueOne,
              onChange: this.onChange,
              rules: [{
                message: '请上传文件',
                max: 1,
                type: 'array',
              }],
            })}/>
          <span style={{position: 'absolute', left: 110, top: -4}}>仅支持xls、xlsx格式文档，最多上传20000家门店</span>
          <a href={legal} style={{position: 'absolute', left: 110, top: 9}} >下载全部适用门店列表</a>
      </FormItem>
    );
  },

});

export default UploadBusinessFile;
