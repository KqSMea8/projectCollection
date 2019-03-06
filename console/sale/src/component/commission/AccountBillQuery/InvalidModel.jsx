import React, {PropTypes} from 'react';
import {Modal, Form, Input} from 'antd';
const FormItem = Form.Item;

const InvalidModel = React.createClass({
  propTypes: {
    form: PropTypes.any,
    invalidVisible: PropTypes.any,
    invalidHandleCancel: PropTypes.func,
    invalidHandleOk: PropTypes.func,
  },

  getInitialState() {
    return {
      visible: this.props.invalidVisible,
    };
  },

  handleOk() {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      this.props.invalidHandleOk(values);
    });
  },

  render() {
    const {getFieldProps} = this.props.form;
    const visible = this.props.invalidVisible;
    return (
      <Modal title="撤回发票" visible={visible}
        onOk={this.handleOk} onCancel={this.props.invalidHandleCancel}>
        <Form horizontal>
          <FormItem
            label="撤回原因："
            required
            labelCol={{span: 4}}
            wrapperCol={{span: 17}}>
            <Input style={{width: '100%'}} type="textarea" rows="3" placeholder="最多不超过20字"
              {...getFieldProps('memo', {
                validateFirst: true,
                rules: [{
                  required: true,
                  message: '请填写撤回原因',
                }, {
                  max: 20,
                  message: '最多不超过20字',
                }],
              })}/>
          </FormItem>
        </Form>
      </Modal>
  );
  },
});

export default Form.create()(InvalidModel);
