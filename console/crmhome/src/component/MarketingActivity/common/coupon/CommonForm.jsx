import React, {PropTypes} from 'react';
import {Form, Radio, Input} from 'antd';
import ValidTimeFormItem from './ValidTimeFormItem';
import ShopFormItem from './ShopFormItem';
import BudgetAmountFormItem from './BudgetAmountFormItem';
import AvailableTimeFormItem from './AvailableTimeFormItem';
import ForbiddenDateFormItem from './ForbiddenDateFormItem';
import InputAddable from '../../../../common/InputAddable';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
};

const CommonForm = React.createClass({
  propTypes: {
    form: PropTypes.object,
    data: PropTypes.object,
    isEdit: PropTypes.bool,
    isCampaignStart: PropTypes.bool,
  },

  render() {
    const {isEdit, data, isCampaignStart} = this.props;
    const {getFieldProps, getFieldValue} = this.props.form;
    const isOnline = this.props.isCampaignStart && this.props.isEdit;
    return (<div>
      <ValidTimeFormItem form={this.props.form} data={data} isEdit={isEdit} isCampaignStart={isCampaignStart} />
      <ShopFormItem form={this.props.form} data={data} isEdit={isEdit} isCampaignStart={isCampaignStart} />
      <BudgetAmountFormItem form={this.props.form} data={data} isEdit={isEdit} isCampaignStart={isCampaignStart} />
      {getFieldValue('validTimeType') !== 'FIXED' &&
      <FormItem
        label="领取当日是否可用："
        {...formItemLayout}>
        {isOnline ? <p className="ant-form-text">{data.effectType === '0' ? '是' : '否'}</p> :
        <RadioGroup {...getFieldProps('effectType', { initialValue: data.effectType })}>
          <Radio value="0">是</Radio>
          <Radio value="1" disabled={getFieldValue('validTimeType') === 'FIXED'}>否</Radio>
        </RadioGroup>}
      </FormItem>}
      <FormItem
        label="是否可以转赠："
        {...formItemLayout}>
        {isEdit ? <p className="ant-form-text">{data.donateFlag === '1' ? '是' : '否'}</p> :
        <RadioGroup {...getFieldProps('donateFlag')}>
          <Radio value="1">是</Radio>
          <Radio value="0">否</Radio>
        </RadioGroup>}
      </FormItem>
      <AvailableTimeFormItem form={this.props.form} data={data} isEdit={isEdit} isCampaignStart={isCampaignStart} />
      <ForbiddenDateFormItem form={this.props.form} data={data} isEdit={isEdit} isCampaignStart={isCampaignStart} />
      <FormItem
        label="备注："
        {...formItemLayout}>
        {isEdit ? <p className="ant-form-text">{data.voucherNote}</p> :
        <Input placeholder="用于收银系统识别本券，详情请咨询技术支持" {...getFieldProps('voucherNote', {
          validateFirst: true,
          rules: [{
            required: false,
            message: '此处必填',
          }, {
            max: 50,
            message: '限50个字',
          }],
        })}/>}
      </FormItem>
      <FormItem
        label="使用说明："
        {...formItemLayout}>
        <InputAddable form={this.props.form} prefix="descList" placeholder="请输入使用说明" />
      </FormItem>
    </div>);
  },
});

export default CommonForm;
