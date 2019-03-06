import React, {PropTypes} from 'react';
import {Modal, Form, Row, Col, Select} from 'antd';
import { UserSelect } from '@alipay/kb-biz-components';

const FormItem = Form.Item;
const Option = Select.Option;

const ShopAllocModal = React.createClass({
  propTypes: {
    form: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    confirmLoading: PropTypes.bool,
  },

  onOk() {
    this.props.form.validateFields((error, v)=> {
      if (!error) {
        const values = {...v};
        this.props.onOk(values);
      }
    });
  },

  onCancel() {
    this.props.onCancel();
  },

  render() {
    const {getFieldProps, getFieldValue} = this.props.form;
    const form = (<Form horizontal onSubmit={this.handleSubmit}>
      <FormItem
        label="分配给："
        labelCol={{span: 4}}
        wrapperCol={{span: 18}}>
        <Row>
          <Col span="6">
            <Select style={{width: 120}} {...getFieldProps('userType', { initialValue: 'BUC' })}>
              <Option value="BUC">内部小二</Option>
            </Select>
          </Col>
          <Col span="15" offset="3">
            <FormItem>
              {
                getFieldValue('userType') === 'BUC' ?
                  <UserSelect
                    kbsalesUrl={window.APP.kbsalesUrl}
                    type="BD"
                    {...getFieldProps('bucUser', {
                      rules: [{ required: true, type: 'object', message: '此处必填' }],
                    }) }
                  /> : null
              }
            </FormItem>
          </Col>
        </Row>
      </FormItem>
    </Form>);
    return (<Modal title="门店POS销售权限分配" visible onOk={this.onOk} onCancel={this.onCancel} confirmLoading={this.props.confirmLoading}>
      {form}
    </Modal>);
  },
});

export default Form.create()(ShopAllocModal);
