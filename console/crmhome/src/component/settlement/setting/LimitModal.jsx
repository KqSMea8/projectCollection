import React, {PropTypes} from 'react';
import {Icon, Form, Modal, message, InputNumber} from 'antd';
import ajax from '../../../common/ajax';
const FormItem = Form.Item;

message.config({
  duration: 3,
});

const LimitModal = React.createClass({
  propTypes: {
    form: PropTypes.object,
    show: PropTypes.bool,
    update: PropTypes.func,
    initData: PropTypes.any,
    onCancel: PropTypes.func,
  },

  getInitialState() {
    return {
      submitLoading: false,
    };
  },

  submitModify() {
    const self = this;

    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }

      self.setState({
        submitLoading: true,
      });

      ajax({
        url: '/promo/kbsettle/warnModify.json',
        method: 'post',
        data: {
          jsonDataStr: JSON.stringify({
            warnLimit: values.warnLimit,
          }),
        },
        type: 'json',
        success: (res) => {
          self.setState({
            submitLoading: false,
          }, () => {
            if (res.status === 'success') {
              message.success('修改成功');
              self.props.onCancel();
              self.props.update();
            } else {
              message.error(res.errorMsg);
            }
          });
        },
        error: (res) => {
          self.setState({
            submitLoading: false,
          }, () => {
            message.error(res.errorMsg);
          });
        },
      });
    });
  },

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    return (
      <Modal title={'预警额度修改'}
             width= {500}
             visible={this.props.show}
             onOk={this.submitModify}
             onCancel={this.props.onCancel}
             confirmLoading={this.state.submitLoading}
             maskClosable={false}>

        <Form horizontal form={this.props.form}>
          <FormItem
            label="预警额度："
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            help={getFieldError('warnLimit')}
            required>
            <InputNumber
                size="large"
                style={{ width: 240, marginRight: 5 }}
              {...getFieldProps('warnLimit', {
                initialValue: this.props.initData,
                rules: [
                  { required: true, type: 'number', message: '请输入预警额度' },
                ],
              })} />
            <span className="ant-form-text"> 元</span>
            <p className="tip">
              <Icon type="exclamation-circle"
                    style={{color: '#57c5f7', marginRight: 5}}/>
              当剩余资金少于预警资金值时，发出通知</p>
          </FormItem>
        </Form>
      </Modal>
    );
  },
});

export default Form.create()(LimitModal);
