import React, { PropTypes } from 'react';
import { Modal, Form, InputNumber, message } from 'antd';
const FormItem = Form.Item;

const RepayModal = React.createClass({
  propTypes: {
    form: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    record: PropTypes.object,
  },
  onOK() {
    const info = {...this.props.form.getFieldsValue()};
    if (info.amount > 0) {
      this.props.onOk(info.amount || 0, this.props.record);
    } else {
      message.error('打款金额必须大于0');
    }
  },
  onCancel() {
    this.props.onCancel();
  },
  render() {
    const { record } = this.props;
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (<Modal title="回款确认" visible onOk={this.onOK} onCancel={this.onCancel}>
      <Form horizontal>
        <FormItem
          {...formItemLayout}
          label="商户名称：">
          <p className="ant-form-text" id="userName" name="userName">{record.merchantName}</p>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="商户PID：">
          <p className="ant-form-text" id="userName" name="userName">{record.partnerId}</p>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="回款金额："
          help="请线下与商户确认清楚哦,打款金额必须大于0"
        >
          <InputNumber {...getFieldProps('amount')}/>
          <span className="ant-form-text"> 元</span>
        </FormItem>
      </Form>
    </Modal>);
  },
});

export default Form.create()(RepayModal);
