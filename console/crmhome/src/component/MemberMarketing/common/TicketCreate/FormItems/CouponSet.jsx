import React, {PropTypes} from 'react';
import { Form, Input, Upload, Icon, message, Modal } from 'antd';
import classnames from 'classnames';
import BrandName from '../../../../../common/BrandName';

const FormItem = Form.Item;

/*
  表单字段 － 优惠券设置：券种类、商品名称、品牌名称、品牌logo、商品详情文案、商品详情图片、更多商品详情
*/

const CouponSet = React.createClass({
  propTypes: {
    form: PropTypes.object,
    layout: PropTypes.object,
    initData: PropTypes.object,
    roleType: PropTypes.string,
    actionType: PropTypes.string,
  },

  getDefaultProps() {
    return {
      initData: {},
    };
  },

  getInitialState() {
    return {
      goodsPicList: [],
      logoList: [],
      previewVisible: false,
      previewImage: '',
    };
  },

  componentWillReceiveProps(nextProps) {
    const { initData } = nextProps;
    const LogoUrlName = 'logoFixUrl';

    if (!this.props.initData[LogoUrlName] && initData[LogoUrlName]) {
      this.setState({
        logoList: [{
          uid: '-1' + Math.random(),
          name: 'xxx.png',
          status: 'done',
          url: initData[LogoUrlName],
          thumbUrl: initData[LogoUrlName],
        }],
      });
    }

    if (!this.props.initData.activityImgs && initData.activityImgs) {
      const arr = initData.activityImgs.map((item, index) => ({
        uid: '-1' + Math.random(),
        name: 'xxx.png',
        status: 'done',
        url: item,
        thumbUrl: item,
        response: {
          status: 'succeed',
          fileId: initData.activityImgFileIds[index],
        },
      }));

      this.setState({
        goodsPicList: arr || [],
      });
    }
  },

  checkActivityLink(rule, value, callback) {
    const reg = new RegExp(/^(http|https|alipays)\:\/\/[^\s]+$/ig);
    if ( value && !reg.test(value) ) {
      callback([new Error('链接格式不正确，请以"http://"、"https://"或"alipays://"开头填写')]);
      return;
    }

    callback();
  },

  handleCancelPreview() {
    this.setState({
      previewVisible: false,
    });
  },

  render() {
    const self = this;
    const { getFieldProps, getFieldError } = this.props.form;
    const { initData, roleType, actionType } = this.props;
    const isEdit = actionType === 'edit';
    const LogoFieldName = 'logoFileId';
    const logoText = roleType === 'brand' ? '品牌logo' : '券logo';
    const isGenericIndustry = window.APP.isGenericIndustry === 'true';
    if (isEdit && !initData.subject) {
      return null;
    }

    // 销售中台账户登录，需要获取merchantId，图片上传中增加op_merchant_id参数
    const merchant = document.getElementById('J_crmhome_merchantId');

    const goodsPicProps = {
      name: 'Filedata',
      action: '/goods/itempromo/uploadPicture.json',
      multiple: true,
      listType: 'picture-card',
      fileList: this.state.goodsPicList,
      data: {
        op_merchant_id: merchant && merchant.value ? merchant.value : null,
      },
      onChange(info) {
        let isSessionInvalid = false;
        let list = info.fileList;

        if (list.length > 3) {
          list = list.slice(-3);
        }

        const arr = list.map(item => {
          item.url = item.thumbUrl;
          const { response } = item;
          if (response && response.status && response.status === 'succeed') {
            return response.fileId;
          }
          if (response && response.stat && response.stat === 'deny') {
            isSessionInvalid = true;
          }
        });

        if (isSessionInvalid) {
          Modal.error({
            title: '登录超时，需要立刻跳转到登录页吗？',
            content: <a href={location.href} target="_blank">点此跳转登录页</a>,
          });
          self.setState({ goodsPicList: [] });
          self.props.form.setFieldsValue({
            'activityImgFileIds': [],
          });
        } else {
          self.setState({ goodsPicList: list });
          self.props.form.setFieldsValue({
            'activityImgFileIds': arr,
          });
        }
      },
      beforeUpload(file) {
        const isTooLarge = file.size > 2 * 1024 * 1024;
        const arr = ['image/jpeg', 'image/bmp', 'image/png', 'image/gif'];
        const isImg = arr.indexOf(file.type) !== -1;

        if (isTooLarge) {
          message.error('图片不能超过2M');
        }

        if (!isImg) {
          message.error('请上传 bmp, png, jpg, gif 格式的文件');
        }

        return !isTooLarge && isImg;
      },
      onPreview(file) {
        self.setState({
          previewImage: file.url,
          previewVisible: true,
        });
      },
    };

    const logoProps = {
      name: 'Filedata',
      action: '/goods/itempromo/uploadPicture.json',
      listType: 'picture-card',
      data: {
        op_merchant_id: merchant ? merchant.value : null,
      },
      fileList: this.state.logoList,
      onChange(info) {
        const list = info.fileList.slice(-1);

        const obj = {};
        obj[LogoFieldName] = '';

        if ( list && list.length ) {
          list[0].url = list[0].thumbUrl;
          const { response } = list[0];
          if (response && response.status && response.status === 'succeed') {
            obj[LogoFieldName] = response.fileId;
          }
          if (response && response.stat && response.stat === 'deny') {
            Modal.error({
              title: '登录超时，需要立刻跳转到登录页吗？',
              content: <a href={location.href} target="_blank">点此跳转登录页</a>,
            });

            self.setState({ logoList: [] });
            self.props.form.setFieldsValue(obj);

            return;
          }
        }

        self.setState({ logoList: list });
        self.props.form.setFieldsValue(obj);
      },
      beforeUpload(file) {
        const isTooLarge = file.size > 2 * 1024 * 1024;
        const arr = ['image/jpeg', 'image/bmp', 'image/png', 'image/gif'];
        const isImg = arr.indexOf(file.type) !== -1;

        if (isTooLarge) {
          message.error('图片不能超过2M');
        }

        if (!isImg) {
          message.error('请上传 bmp, png, jpg, gif 格式的文件');
        }

        return !isTooLarge && isImg;
      },
      onPreview(file) {
        self.setState({
          previewImage: file.url,
          previewVisible: true,
        });
      },
    };
    return (
      <div>
        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancelPreview}>
          <img src={this.state.previewImage} style={{ maxWidth: '100%' }} />
        </Modal>

        <FormItem
          {...this.props.layout}
          required
          label="商品名称：">
          <Input
            {...getFieldProps('subject', {
              rules: [
                { required: true, message: '请填写商品名称' },
                { max: 20, message: '最多 20 个字符' },
              ],
              initialValue: initData.subject,
            })}
            placeholder="如，莫斯利安酸奶，50字以内"
            style={{ width: 250 }} />
        </FormItem>
        <FormItem
          {...this.props.layout}
          required
          label="品牌名称："
        >
          <BrandName
            {...getFieldProps('brandName', {
              validate: [{
                rules: [
                  { required: true, message: '请选择品牌名称' },
                ],
                trigger: 'onChange',
              }],
              initialValue: initData.brandName,
            })}
          />
        </FormItem>
        <FormItem
          {...this.props.layout}
          required
          label={logoText + '：'}
          help={getFieldError(LogoFieldName)}
          validateStatus={
          classnames({
            error: !!getFieldError(LogoFieldName),
          })}>
          <Upload {...logoProps}>
            <Icon type="plus" />
            <div className="ant-upload-text">上传图片</div>
          </Upload>
          <p className="tip">建议：请上传{logoText}，不超过2M。格式：bmp, png, jpeg, jpg, gif。建议尺寸: 500px＊500px</p>
          <Input type="hidden" {...getFieldProps(LogoFieldName, {
            rules: [
              { required: true, message: '请上传' + logoText },
            ],
            initialValue: initData[LogoFieldName] || '',
          })}/>
        </FormItem>
        <FormItem
          {...this.props.layout}
          required
          label="商品详情：">
          <Input
            {...getFieldProps('activityName', {
              rules: [
                { required: true, message: '请填写商品详情' },
                { max: 120, message: '最多 120 个字符' },
              ],
              initialValue: initData.activityName || '',
            })}
            type="textarea"
            placeholder="商品内容简介，120字以内" />
        </FormItem>
        <FormItem
          {...this.props.layout}
          required
          label="商品图片："
          help={getFieldError('activityImgFileIds')}
          validateStatus={
          classnames({
            error: !!getFieldError('activityImgFileIds'),
          })}>
          <Upload {...goodsPicProps}>
            <Icon type="plus" />
            <div className="ant-upload-text">上传图片</div>
          </Upload>
          <p className="tip">建议：图片重点内容居中，最多能上传3张。大小: 不超过2M；格式: bmp, png, jpeg, jpg, gif；建议尺寸924px*380px</p>
          <Input type="hidden" {...getFieldProps('activityImgFileIds', {
            rules: [
              { required: true, type: 'array', message: '请上传商品详情图片' },
            ],
            initialValue: initData.activityImgFileIds || [],
          })}/>
        </FormItem>
        {
          !isGenericIndustry && (<FormItem
            {...this.props.layout}
            label="更多商品详情：">
            <Input
              placeholder="例：http://www.alipay.com"
              style={{ width: 250 }}
              {...getFieldProps('activityLink', {
                rules: [
                  { validator: this.checkActivityLink },
                ],
                initialValue: initData.activityLink,
              })} />
          </FormItem>)
        }
      </div>
    );
  },
});

export default CouponSet;
