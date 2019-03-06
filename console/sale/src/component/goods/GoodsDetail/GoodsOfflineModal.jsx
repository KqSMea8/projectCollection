import React, {PropTypes} from 'react';
import {Modal, Form, Input} from 'antd';

const FormItem = Form.Item;

const GoodsOfflineModal = React.createClass({
  propTypes: {
    form: PropTypes.any,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    title: PropTypes.string,
  },

  onOk() {
    this.props.form.validateFields((error)=> {
      if (!error) {
        this.props.onOk(this.props.form.getFieldValue('memo'));
      }
    });
  },

  render() {
    const {getFieldProps} = this.props.form;

    const form = (<Form horizontal onSubmit={this.handleSubmit}>
       <FormItem
        label="原因："
        labelCol={{span: 3}}
        wrapperCol={{span: 17}}
        >
        <Input type="textarea" rows="3"
           {...getFieldProps('memo', {
             rules: [{required: true, message: '请填写原因'}, {max: 80, message: '限80个字'}],
           })}
          placeholder="请填写原因"/>
      </FormItem>
    </Form>);
    return (<Modal visible title={this.props.title || '下架'} onOk={this.onOk} onCancel={this.props.onCancel} width={528}>
      {form}
    </Modal>);
  },
});

export default Form.create()(GoodsOfflineModal);
