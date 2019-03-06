import React from 'react';
import { Form } from 'antd';
import BuyRulesTpl from './common/BuyRulesTpl';

const formItemLayout = {
  labelCol: { span: 4, offset: 2 },
  wrapperCol: { span: 15 },
};

class FormItemTest extends React.Component {
  componentDidMount() {
    this.props.form.setFieldsInitialValue({
      buyRules: {
        supportWifi: false,
      },
    });
  }

  handleBuyRulesChange = value => {
    this.props.form.setFieldsValue({
      buyRules: value,
    });
  }
  render() {
    window.f = this.props.form;
    return (
      <Form form={this.props.form} horizontal style={{ padding: '20px', width: 650 }}>
        <BuyRulesTpl {...formItemLayout} {...this.props.form.getFieldProps('buyRules')} />
      </Form>
    );
  }
}

export default Form.create()(FormItemTest);
