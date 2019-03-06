import React, {PropTypes} from 'react';
import {Form, Button, Input, Row, Col} from 'antd';

const FormItem = Form.Item;

const InputMerchantInfo = React.createClass({
  propTypes: {
    form: PropTypes.object,
    onOk: PropTypes.func,
    visible: PropTypes.bool,
    defaultData: PropTypes.object,
  },

  componentWillMount() {
    this.props.form.setFieldsInitialValue(this.props.defaultData);
  },

  onOk() {
    this.props.form.validateFieldsAndScroll(this.props.onOk);
  },

  render() {
    const rootStyle = this.props.visible ? {} : {display: 'none'};
    const {getFieldProps, getFieldError} = this.props.form;
    return (
      <div style={rootStyle}>
        <div style={{padding: '48px 0', minHeight: 200}}>
          <Form horizontal>
            <FormItem
              label="商户名称："
              required
              labelCol={{span: 6}}
              wrapperCol={{span: 10}}>
              <Input placeholder="请输入名称"
                {...getFieldProps('merchantName', {
                  validateFirst: true,
                  rules: [{
                    required: true,
                    message: '此处必填',
                  }],
                })}/>
            </FormItem>
            <FormItem
              label="商户支付宝账号："
              required
              help={getFieldError('alipayUserName') || '商户账号需通过实名认证，且是企业支付宝账号才可创建综合体'}
              labelCol={{span: 6}}
              wrapperCol={{span: 10}}>
              <Input placeholder="请输入企业账号"
                {...getFieldProps('alipayUserName', {
                  validateFirst: true,
                  rules: [{
                    required: true,
                    message: '此处必填',
                  }],
                })}/>
            </FormItem>
          </Form>
        </div>
        <div style={{padding: '12px 0 24px 0', margin: '-16px -16px 0', borderTop: '1px solid #e4e4e4'}}>
        </div>
        <Row>
          <Col offset="6">
              <Button type="primary" size="large" onClick={this.onOk}>下一步</Button>
          </Col>
        </Row>
      </div>
    );
  },
});

export default Form.create()(InputMerchantInfo);
