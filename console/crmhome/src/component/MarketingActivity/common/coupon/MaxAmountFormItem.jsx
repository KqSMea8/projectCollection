import React, {PropTypes} from 'react';
import {Form, Select, InputNumber} from 'antd';
import classnames from 'classnames';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
};

const MaxAmountFormItem = React.createClass({
  propTypes: {
    form: PropTypes.object,
    data: PropTypes.object,
    isEdit: PropTypes.bool,
  },

  checkValue(rule, value, callback) {
    this.props.form.validateFields(['maxAmountType'], {force: true});
    callback();
  },

  checkType(rule, value, callback) {
    const {form} = this.props;
    const maxAmount = form.getFieldValue('maxAmount');
    if (value === '2' && maxAmount === undefined) {
      callback(new Error('请输入最高优惠'));
      return;
    }
    callback();
  },

  render() {
    const {isEdit, data} = this.props;
    const {getFieldProps, getFieldError, getFieldValue} = this.props.form;
    const maxAmountType = getFieldValue('maxAmountType') || '1';
    return (<FormItem
      label="最高优惠："
      required
      validateStatus={classnames({error: !!getFieldError('maxAmountType')})}
      help={getFieldError('maxAmountType')}
      {...formItemLayout}>
      {isEdit ? <p className="ant-form-text">{data.maxAmountType === '1' ? '不限制' : '指定金额'}</p> :
      <Select style={{width: 110}} placeholder="请选择" {...getFieldProps('maxAmountType', {
        validateFirst: true,
        rules: [this.checkType],
      })}>
        <Option key="1">不限制</Option>
        <Option key="2">指定金额</Option>
      </Select>}
      <div style={{display: maxAmountType === '2' ? 'inline-block' : 'none', verticalAlign: 'bottom', marginLeft: 8}}>
        <span className="ant-form-text">最高优惠</span>
        {isEdit ? <p className="ant-form-text">{data.maxAmount}</p> :
        <InputNumber size="large" {...getFieldProps('maxAmount', {
          validateFirst: true,
          rules: [this.checkValue],
        })}/>}
        <span className="ant-form-text">元</span>
      </div>
    </FormItem>);
  },
});

export default MaxAmountFormItem;
