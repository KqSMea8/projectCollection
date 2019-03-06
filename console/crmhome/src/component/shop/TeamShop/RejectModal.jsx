import React, { PropTypes } from 'react';
import { Modal, Form, Checkbox, Input } from 'antd';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

const rejectReasons = [
  '门店信息不准确',
  '这不是我的门店',
  '不认识服务商，信不过',
  '这个店是我的，但不想入驻到口碑',
  '其他原因',
];

const RejectModal = React.createClass({
  propTypes: {
    form: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    visible: PropTypes.bool,
  },

  getDefaultProps() {
    return { visible: false };
  },

  onOk() {
    this.props.form.validateFields((error, values) => {
      if (!error) {
        const reasons = values.reasons.slice();
        const otherReason = values.otherReason;
        const otherIdx = reasons.indexOf('其他原因');
        if (otherIdx > -1 && otherReason && otherReason.trim().length) {
          reasons[otherIdx] = '其他原因: ' + otherReason;
        }
        this.props.onOk(reasons);
      }
    });
  },

  checkReason(rule, value, callback) {
    this.props.form.validateFields(['otherReason'], {force: true});
    callback();
  },

  checkOtherReason(rule, value, callback) {
    const reasons = this.props.form.getFieldValue('reasons') || [];
    const otherReason = this.props.form.getFieldValue('otherReason');
    if (reasons.indexOf('其他原因') > -1 && (!otherReason || otherReason.trim() === '')) {
      callback('此处必填');
      return;
    }
    callback();
  },

  render() {
    const { getFieldProps, getFieldValue } = this.props.form;
    const reasons = getFieldValue('reasons') || [];
    const hasOther = reasons.indexOf('其他原因') > -1;
    return (<Modal
      title="驳回"
      visible={this.props.visible}
      onOk={this.onOk}
      onCancel={this.props.onCancel}>
      <Form horizontal form={this.props.form}>
        <FormItem
          label="驳回理由"
          required
          labelCol={{span: 4}}
          wrapperCol={{span: 16}}>
          <CheckboxGroup options={rejectReasons} {...getFieldProps('reasons', {
            rules: [{
              required: true,
              type: 'array',
              message: '至少选择一个理由',
            }, this.checkReason],
          })}/>
        </FormItem>
        <FormItem
          label="其他原因"
          required={hasOther}
          labelCol={{span: 4}}
          wrapperCol={{span: 16}}>
          <Input type="textarea" {...getFieldProps('otherReason', {
            rules: [{
              max: 50,
              message: '限50个字',
            }, this.checkOtherReason],
          })}/>
        </FormItem>
      </Form>
    </Modal>);
  },
});

export default Form.create()(RejectModal);
