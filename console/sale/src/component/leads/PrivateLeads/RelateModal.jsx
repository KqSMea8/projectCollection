import React, {PropTypes} from 'react';
import {Modal, Form, Input} from 'antd';

const FormItem = Form.Item;

const RelateModal = React.createClass({
  propTypes: {
    form: PropTypes.any,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  },
  onOk() {
    this.props.form.validateFields((error, values)=> {
      if (!error) {
        this.props.onOk(values);
      }
    });
  },
  render() {
    const {getFieldProps} = this.props.form;
    const form = (<Form horizontal onSubmit={this.handleSubmit}>
      <FormItem
        label="支付宝企业账号："
        labelCol={{span: 6}}
        wrapperCol={{span: 17}}>
        <Input placeholder="请输入" {...getFieldProps('account', {
          rules: [{
            required: true,
          }],
        })}/>
      </FormItem>

      <FormItem
        label="企业名称："
        labelCol={{span: 6}}
        wrapperCol={{span: 17}}>
        <Input type="textarea"
               rows="2"
          {...getFieldProps('company', {
            rules: [{
              required: true,
            }],
          })}
               placeholder="请输入"/>
      </FormItem>
    </Form>);
    return (<Modal visible title="关联商户" onOk={this.onOk} onCancel={this.props.onCancel}>
      {form}
    </Modal>);
  },
});

export default Form.create()(RelateModal);
