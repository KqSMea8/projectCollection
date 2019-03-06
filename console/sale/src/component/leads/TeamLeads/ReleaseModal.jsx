import React, {PropTypes} from 'react';
import {Modal, Form, Input, Radio} from 'antd';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;

const ReleaseModal = React.createClass({
  propTypes: {
    form: PropTypes.any,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  },

  onOk() {
    this.props.form.validateFields((error, values)=> {
      if (!error) {
        if (values.releaseReason === '其他') {
          values.releaseReason = values.memo;
          values.memo = null;
        }
        this.props.onOk(values);
      }
    });
  },

  reasonChange() {
    this.props.form.setFields({
      memo: {
        value: this.props.form.getFieldValue('memo'),
      },
    });
  },

  render() {
    const {getFieldProps, getFieldValue, getFieldError} = this.props.form;
    const ifOther = !getFieldValue('releaseReason') || getFieldValue('releaseReason') === '其他';
    let labelRules;

    if (ifOther) {
      labelRules = [{required: true, message: '此处必填'}];
    }

    const form = (<Form horizontal onSubmit={this.handleSubmit}>
      <FormItem
        label="释放理由："
        labelCol={{span: 6}}
        wrapperCol={{span: 17}}>
        <RadioGroup {...getFieldProps('releaseReason', {
          rules: [{
            required: true,
          }],
          onChange: this.reasonChange,
          initialValue: '其他',
        })}>
          <Radio value="商家信息无效">商家信息无效</Radio>
          <Radio value="电话不真实">电话不真实</Radio>
          <Radio value="电话打不通">电话打不通</Radio>
          <Radio value="其他">其他</Radio>
        </RadioGroup>
      </FormItem>
       <FormItem
        label="其它原因："
        labelCol={{span: 6}}
        wrapperCol={{span: 17}}
        help={getFieldError('memo')}
        required={false}>
        <Input
           {...getFieldProps('memo', {
             rules: labelRules,
           })}
          placeholder="说明具体原因"/>
      </FormItem>
    </Form>);
    return (<Modal visible title="释放leads" onOk={this.onOk} onCancel={this.props.onCancel} width={600}>
      {form}
    </Modal>);
  },
});

export default Form.create()(ReleaseModal);
