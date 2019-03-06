import React, {PropTypes} from 'react';
import {normalizeUploadValueOne} from './Upload';
import UploadFile from './UploadFile';
import {Form} from 'antd';
const FormItem = Form.Item;
function getCtokenFromCookie(win) {
  const cookieParts = win.document.cookie.split(/;\s/g);
  for (let i = 0, len = cookieParts.length; i < len; i ++) {
    const cookieNameValue = cookieParts[i].match(/([^=]+)=/i);
    if (cookieNameValue && cookieNameValue[1] === 'ctoken') {
      return cookieParts[i].substring(cookieNameValue[1].length + 1);
    }
  }
}
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
    }
  },
  render() {
    const {getFieldProps} = this.props.form;
    const merchantIdInput = document.getElementById('J_crmhome_merchantId');
    const opMerchantId = merchantIdInput ? merchantIdInput.value : '';
    const ctoken = getCtokenFromCookie(window);
    const legal = '/goods/itempromo/downloadPromoShops.htm?op_merchant_id=' + opMerchantId + '&ctoken=' + ctoken + '&promoTool=' + this.props.actityType;
    return (
      <FormItem
      label="文件上传"
      extra={<div style={{display: 'inline-block', marginLeft: '15px'}}><span style={{color: 'grey'}}>仅支持xls、xlsx格式文档，最多上传10000家门店.</span><a href={legal}>下载全部文件</a></div>}
      labelCol={{span: 2}}
      wrapperCol={{span: 22}}>
          <UploadFile
            {...this.props}
            {...getFieldProps(this.props.propsName, {
              valuePropName: 'fileList',
              normalize: normalizeUploadValueOne,
              onChange: this.onChange,
              rules: [{
                message: '请上传文件',
                max: 1,
                type: 'array',
              }],
            })}/>
      </FormItem>
    );
  },

});

export default UploadBusinessFile;
