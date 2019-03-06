import React, {PropTypes} from 'react';
import {Form, Radio, Input, InputNumber} from 'antd';
import classnames from 'classnames';
import PhotoPicker /* , {formatUrl}*/ from '../../../../common/PhotoPicker';
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

const AllMoneyForm = React.createClass({
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

  render() {
    const {isEdit, data, isSignleVisible} = this.props;
    const {getFieldProps, getFieldError} = this.props.form;
    getFieldProps('myType', {
      initialValue: 'ALL_MONEY',
    });
    const isGenericIndustry = window.APP.isGenericIndustry === 'true';
    let singleType = 'ONE_RATE';
    if (isGenericIndustry) {
      singleType = 'ONE_MONEY';
    }
    return (<Form horizontal form={this.props.form} className="kb-coupon-form">
      {isEdit ? <FormItem
        label="券类型："
        required
        {...formItemLayout}>
        <p className="ant-form-text">全场优惠</p>
      </FormItem> :
      <FormItem style={{textAlign: 'center'}}>
        <RadioGroup {...getFieldProps('promotionType', {
          onChange: this.onTypeChange,
          initialValue: 'ALL_MONEY',
        })}>
          <RadioButton value="ALL_MONEY">全场优惠</RadioButton>
          {
            isSignleVisible && <RadioButton value={singleType}>单品优惠</RadioButton>
          }
        </RadioGroup>
      </FormItem>}
      <FormItem
        label="券种类："
        required
        {...formItemLayout}>
        <p className="ant-form-text">代金券</p>
      </FormItem>
      <FormItem
        label="券名称："
        required
        {...formItemLayout}>
        {/* isEdit ? <p className="ant-form-text">{data.voucherName}</p> :*/
        <Input placeholder="请输入券名称" {...getFieldProps('voucherName', {
          validateFirst: true,
          rules: [{
            required: true,
            message: '此处必填',
          }, {
            max: 20,
            message: '限20个字',
          }],
        })}/>}
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
        <PhotoPicker {...getFieldProps('voucherLogo', {
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
        label="券面额："
        required
        validateStatus={classnames({error: !!getFieldError('couponValue')})}
        help={getFieldError('couponValue')}
        {...formItemLayout}>
        {isEdit && <p className="ant-form-text">{data.couponValue}元</p>}
        {!isEdit && <InputNumber min={0.01} step={0.01} size="large" {...getFieldProps('couponValue', {
          validateFirst: true,
          rules: [{
            required: true,
            message: '此处必填',
            type: 'number',
          }],
        })}/>}
        {!isEdit && <span className="ant-form-text">元</span>}
      </FormItem>
      <UseConditionFormItem form={this.props.form} data={data} isEdit={isEdit} isCampaignStart={this.props.isCampaignStart} />
      <CommonForm form={this.props.form} data={data} isEdit={isEdit} isCampaignStart={this.props.isCampaignStart} />
    </Form>);
  },
});

export default AllMoneyForm;
