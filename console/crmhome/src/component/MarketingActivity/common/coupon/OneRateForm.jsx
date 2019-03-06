import React, {PropTypes} from 'react';
import {Form, Radio, Input, InputNumber} from 'antd';
import classnames from 'classnames';
import PhotoPicker /* , {formatUrl} */ from '../../../../common/PhotoPicker';
import CommonForm from './CommonForm';
import UseConditionFormItem from './UseConditionFormItem';
import BrandName from '../../../../common/BrandName';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
};

const OneRateForm = React.createClass({
  propTypes: {
    form: PropTypes.object,
    onTypeChange: PropTypes.func,
    data: PropTypes.object,
    isEdit: PropTypes.bool,
    isSignleVisible: PropTypes.bool,
    isCampaignStart: PropTypes.bool,
  },

  componentWillMount() {
    this.props.form.setFieldsInitialValue(this.props.data);
  },

  onTypeChange(e) {
    this.props.onTypeChange(e.target.value);
  },

  checkUrl(rule, value, callback) {
    const reg = /^(http|https|alipays):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
    if (value && !reg.test(value)) {
      callback('请以"http://"、"https://"或"alipays://"开头填写');
    }
    callback();
  },

  checkGoodsIds(rule, value, callback) {
    const arr = value.split('\n');
    const reg = new RegExp(/^[a-zA-Z0-9\n]+$/g);
    if ( !reg.test(value) && value !== '') {
      callback([new Error('请输入数字或英文字母')]);
      return;
    }

    if (arr.length > 500) {
      callback([new Error('最多输入500个编码')]);
      return;
    }

    // 商品编码不能重复
    if (typeof value === 'string' && this.isArrayRepeated(value.split('\n'))) {
      callback(new Error('不能输入重复的商品编码'));
      return;
    }
    callback();
  },

  isArrayRepeated(arr) {
    const newArr = [];
    let repeated = false;
    for (let i = 0; i < arr.length; i++) {
      if (newArr.indexOf(arr[i]) >= 0) {
        repeated = true;
        break;
      } else {
        newArr.push(arr[i]);
      }
    }

    return repeated;
  },

  render() {
    const {isEdit, data, isSignleVisible, isCampaignStart} = this.props;
    const {getFieldProps, getFieldError} = this.props.form;
    const couponType = 'ONE_RATE';
    return (<Form horizontal form={this.props.form} className="kb-coupon-form">
      {isEdit ? <FormItem
        label="券类型："
        required
        {...formItemLayout}>
        <p className="ant-form-text">单品优惠</p>
      </FormItem> :
      <FormItem style={{textAlign: 'center'}}>
        <RadioGroup {...getFieldProps('promotionType', {
          onChange: this.onTypeChange,
          initialValue: 'ONE_RATE',
        })}>
          <RadioButton value="ALL_MONEY">全场优惠</RadioButton>
          {
            isSignleVisible && <RadioButton value="ONE_RATE">单品优惠</RadioButton>
          }
        </RadioGroup>
      </FormItem>}
      <FormItem
        label="券种类："
        required
        {...formItemLayout}>
        {isEdit ? <p className="ant-form-text">{data.type === 'RATE' ? '折扣券' : '代金券'}</p> :
        <RadioGroup {...getFieldProps('myType', {
          onChange: this.onTypeChange,
          initialValue: couponType,
        })}>
          <Radio value="ONE_RATE">折扣券</Radio>
          <Radio value="ONE_MONEY">代金券</Radio>
        </RadioGroup>}
      </FormItem>
      <FormItem
        label="商品名称："
        required
        {...formItemLayout}>
        <Input placeholder="如，莫斯利安酸奶" {...getFieldProps('itemName', {
          validateFirst: true,
          rules: [{
            required: true,
            message: '此处必填',
          }, {
            max: 20,
            message: '限20个字',
          }],
        }) } />
      </FormItem>
      <FormItem
        label="品牌名称："
        required
        help={getFieldError('brandName')}
        validateStatus={
          classnames({
            error: !!getFieldError('brandName'),
          })
        }
        {...formItemLayout}
      >
        <BrandName
        {...getFieldProps('brandName', {
          rules: [{
            required: true,
            message: '此处必选',
          }],
        })}
        />
      </FormItem>
      <FormItem
        label="券logo："
        required
        extra={<div style={{lineHeight: 1.5}}>建议：优先使用商家logo或品牌logo，不超过2M。格式：bmp，png，jpeg，gif。建议为尺寸不小于500px＊500px的等边矩形</div>}
        {...formItemLayout}>
        <PhotoPicker
        {...getFieldProps('voucherLogo', {
          rules: [{
            required: true,
            message: '此处必填',
            type: 'array',
          }, {
            max: 1,
            message: '仅支持上传一张',
            type: 'array',
          }],
        }) } />
      </FormItem>
      <FormItem
        label="商品详情："
        required
        extra={'120个字以内'}
        {...formItemLayout}>
        <Input type="textarea" placeholder="商品内容简介" {...getFieldProps('itemDetail', {
          validateFirst: true,
          rules: [{
            required: true,
            message: '此处必填',
          }, {
            max: 120,
            message: '限120个字',
          }],
        }) } />
      </FormItem>
      <FormItem
        label="商品图片："
        required
        extra={<div style={{lineHeight: 1.5}}>建议：图片重点内容居中。仅支持上传一张。大小: 不超过2M；格式: 格式: bmp, png, jpeg, jpg, gif；建议尺寸924px*380px</div>}
        {...formItemLayout}>
        <PhotoPicker
        {...getFieldProps('voucherImg', {
          rules: [{
            required: true,
            message: '此处必填',
            type: 'array',
          }, {
            max: 1,
            message: '仅支持上传一张',
            type: 'array',
          }],
        }) } />
      </FormItem>
      <FormItem
        label="更多商品详情："
        {...formItemLayout}>
        <Input placeholder="例如 https://www.alipay.com" { ...getFieldProps('itemLink', {rules: [this.checkUrl]}) } />
      </FormItem>
      <FormItem
        label="折扣力度："
        required
        validateStatus={classnames({error: !!getFieldError('rate')})}
        help={getFieldError('rate')}
        {...formItemLayout}>
        {isEdit && <p className="ant-form-text">{data.rate}折</p>}
        {!isEdit && <InputNumber min={0} step={0.1} {...getFieldProps('rate', {
          validateFirst: true,
          rules: [{
            required: true,
            message: '此处必填',
            type: 'number',
          }],
        })}/>}
        {!isEdit && <span className="ant-form-text">折</span>}
      </FormItem>
      <FormItem
        label="商品编码："
        required
        extra={<div style={{lineHeight: 1.5}}>最多可输入500个，若输入多个商品编码，多个商品均会享受优惠，请按回车键进行间隔</div>}
        {...formItemLayout}>
        <Input type="textarea" placeholder="输入券指定的商品编码" {...getFieldProps('itemIds', {
          validateFirst: true,
          rules: [{
            required: true,
            message: '此处必填',
          }, this.checkGoodsIds],
        }) } />
      </FormItem>
      <UseConditionFormItem form={this.props.form} data={data} isEdit={isEdit} isCampaignStart={isCampaignStart} />
      <CommonForm form={this.props.form} data={data} isEdit={isEdit} isCampaignStart={isCampaignStart} />
    </Form>);
  },
});

export default OneRateForm;
