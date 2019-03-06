import React, {PropTypes} from 'react';
import { Form, Modal, Input, Upload, Icon, message} from 'antd';
const FormItem = Form.Item;

/*
  表单字段 － 商品详情图片
*/

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 16},
};

export function formatUrl(url) {
  return url.replace(/&amp;/g, '&');
}

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
    if (file.response && file.response.status) {
      // 组件会将 file.url 作为链接进行展示
      file.url = file.response.avatarImage;
      file.id = file.response.fileId;
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
      return file.response.status === 'succeed' ? true : false;
    }
    return true;
  });

  return fileList;
}

function normalizeUploadValueOne(info) {
  return normalizeUploadValue(info, 3);
}

const SingleActivityImgs = React.createClass({
  propTypes: {
    form: PropTypes.object,
    initData: PropTypes.object,
    roleType: PropTypes.string,
    actionType: PropTypes.string,
    requiredData: PropTypes.func,
  },

  getInitialState() {
    return {
      visible: false,
      priviewVisible: false,
      priviewImage: '',
    };
  },

  handleOk() {
    this.props.form.validateFieldsAndScroll((error, values)=> {
      if (!!error) {
        return;
      }
      this.setState({
        visible: false,
      });
      const obj = {
        ...values,
      };
      this.props.requiredData(obj);
    });
  },
  handleCancel() {
    this.setState({
      priviewVisible: false,
    });
  },
  checkUrl(rule, value, callback) {
    if (value) {
      const reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
      if (!reg.test(value)) {
        callback([new Error('跳转链接格式不正确，请以"http://"、"https://"或"alipays://"开头填写')]);
      }
    }
    callback();
  },

  render() {
    const { getFieldProps, getFieldValue} = this.props.form;
    const merchantIdInput = document.getElementById('J_crmhome_merchantId');
    const opMerchantId = merchantIdInput ? merchantIdInput.value : '';
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    return (
        <div>
          <a onClick={() => {this.setState({visible: true});}}>编辑</a>
          {<Modal title="商品详情" visible={this.state.visible} width={820}
            onOk={this.handleOk} onCancel={() => {this.setState({visible: false});}}>
            <Form horizontal form={this.props.form} className="market_vouchers_form">
              <img src="https://os.alipayobjects.com/rmsportal/cMHdXRdkazRFfJR.png" seed="0d7133b070914a91318ace021f5b17f7" smartracker="on" />
              <div style={{float: 'right', marginTop: '20px', width: '465px'}}>
                <FormItem
                  required
                  label="摘要："
                  {...formItemLayout}>
                  <Input {...getFieldProps('activityName', {
                    rules: [{
                      required: true,
                      message: '请输入摘要',
                    }],
                  })} placeholder="内容简介，120字以内" />
                </FormItem>
                <FormItem
                  label="商品图片："
                  extra={<div className="ft-gray" style={{lineHeight: '20px'}}>
                    <div>最多上传3张</div>
                    <div>大小：不超过2M。格式：bmp, png, jpeg, jpg, gif</div>
                    <div>建议尺寸：924px*380px以上；</div>
                  </div>}
                  {...formItemLayout}
                  style={{marginBottom: 0}}>
                  <div className="clearfix template-upload-box">
                    <Upload
                      name="Filedata"
                      action={`/goods/itempromo/uploadPicture.json?op_merchant_id=${opMerchantId}`}
                      listType="picture-card"
                      fileExt={['image/bmp', 'image/png', 'image/jpg', 'image/gif', 'image/jpeg']}
                      beforeUpload={this.beforeUpload}
                      beforeUpload={(file) => {
                        if (['JPG', 'jpg', 'bmp', 'BMP', 'png', 'PNG', 'gif', 'GIF', 'jpeg', 'JPEG'].indexOf(file.name.substring(file.name.lastIndexOf('.') + 1)) === -1) {
                          message.error('文件格式错误');
                          return false;
                        }
                        return true;
                      }}
                      onPreview={(file) => {
                        this.setState({
                          priviewImage: file.url,
                          priviewVisible: true,
                        });
                      }}
                      {...getFieldProps('activityImgsArr', {
                        valuePropName: 'fileList',
                        normalize: normalizeUploadValueOne,
                        rules: [{
                          max: 3,
                          message: '仅支持上传三张',
                          type: 'array',
                        }],
                      })}>
                    {(getFieldValue('activityImgsArr') || []).length >= 3 ? null : uploadButton}
                    </Upload>
                    <Modal visible={this.state.priviewVisible} footer={null} onCancel={this.handleCancel}>
                      <img alt="example" src={this.state.priviewImage} style={{width: '100%'}}/>
                    </Modal>
                  </div>
                </FormItem>
                <FormItem
                  label="跳转链接："
                  {...formItemLayout}>
                  <Input {...getFieldProps('activityLink', {
                    rules: [
                      this.checkUrl,
                    ],
                  })} placeholder="例：https://www.alipay.com" />
                </FormItem>
              </div>
            </Form>
          </Modal> }
      </div>
    );
  },
});

export default Form.create()(SingleActivityImgs);
