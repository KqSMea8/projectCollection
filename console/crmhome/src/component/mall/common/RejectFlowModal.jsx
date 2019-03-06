import React, {PropTypes} from 'react';
import {Modal, Form, Checkbox, Input} from 'antd';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

const reasonOptionsMap = {
  CREATE_SHOP: [
    '门店信息不准确',
    '这不是我的门店',
    '不认识服务商，信任不过',
    '这个店是我的，但不想入驻到口碑',
    '其他原因',
  ],
  SURROUND_SHOP: [
    '该门店不属于本综合体商圈',
    '门店填写信息有误',
    '门店已歇业',
    '其他原因',
  ],
  REMOVE_SHOP: [
    '该门店属于本综合体商圈',
    // '门店已歇业', removed by 昱乔 required by 博衍
    '其他原因',
  ],
};

const RejectFlowModal = React.createClass({
  propTypes: {
    form: PropTypes.object,
    action: PropTypes.string,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  },

  onOK() {
    this.props.form.validateFields((error, values)=> {
      if (!error) {
        this.props.onOk(values);
      }
    });
  },

  checkReason(rule, value, callback) {
    this.props.form.validateFields(['memo'], {force: true});
    callback();
  },

  checkMemo(rule, value, callback) {
    const reason = this.props.form.getFieldValue('reason');
    if (reason.indexOf('其他原因') >= 0 && (!value || value.trim() === '')) {
      callback('此处必填');
      return;
    }
    callback();
  },

  render() {
    const {getFieldProps, getFieldValue} = this.props.form;
    const reason = getFieldValue('reason') || [];
    const hasOther = reason.indexOf('其他原因') >= 0;
    const reasonOptions = reasonOptionsMap[this.props.action];
    return (<Modal title="驳回" visible onOk={this.onOK} onCancel={this.props.onCancel}>
      <Form horizontal form={this.props.form} className="reject-flow-modal-form">
        <FormItem
          label="驳回理由："
          required
          labelCol={{span: 4}}
          wrapperCol={{span: 16}}>
          <CheckboxGroup options={reasonOptions} {...getFieldProps('reason', {
            rules: [{
              required: true,
              type: 'array',
              message: '至少选择一个理由',
            }, this.checkReason],
          })}/>
        </FormItem>
        <FormItem
          label="其他原因："
          required={hasOther}
          labelCol={{span: 4}}
          wrapperCol={{span: 16}}>
          <Input type="textarea" {...getFieldProps('memo', {
            rules: [this.checkMemo, {
              max: 50,
              message: '限50个字',
            }],
          })}/>
        </FormItem>
      </Form>
    </Modal>);
  },
});

export default Form.create()(RejectFlowModal);
