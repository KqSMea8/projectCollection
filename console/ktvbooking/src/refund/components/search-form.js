import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Form, Input, Icon } from 'antd';

import './search-form.less';

const { func, object } = PropTypes;
const FormItem = Form.Item;

export default class SearchForm extends PureComponent {
  static propTypes = {
    dispatch: func,
    form: object,
  }

  handleSearch = () => {
    const { form: { validateFieldsAndScroll }, dispatch } = this.props;
    validateFieldsAndScroll({ force: true, scroll: { offsetTop: 100 } }, (err, values) => {
      if (!err) {
        const { checkShop: { shopId }, orderId } = values;
        dispatch({ type: 'queryMerchantOrderByOrderId', payload: {
          shopId, // 2015122900077000000002412658
          orderId: (orderId || '').trim(), // 23456792
        } });
      }
    });
  }

  clearOrderId = () => {
    const { form: { validateFieldsAndScroll, setFieldsValue }, dispatch } = this.props;
    setFieldsValue({ orderId: '' });
    validateFieldsAndScroll(['checkShop'], { force: true, scroll: { offsetTop: 100 } }, (err, values) => {
      if (!err) {
        const { checkShop: { shopId } } = values;
        dispatch({ type: 'queryMerchantOrderByOrderId', payload: {
          shopId, // 2015122900077000000002412658
          orderId: '', // 23456792
        } });
      }
    });
  }

  render() {
    const { getFieldProps, getFieldValue } = this.props.form;
    return (
      <Form className="refund-search-form" horizontal>
        <Row gutter={16}>
          <Col offset={7} span={7}>
            <FormItem className="orderid">
              <Input onPressEnter={this.handleSearch} {...getFieldProps('orderId', {
                initialVal: '',
                rules: [{
                  required: true, whitespace: true, message: '请输入订单号',
                }, {
                  pattern: /^[0-9]{32}$/, message: '订单号只能输入32位数字',
                }],
              })} placeholder="请输入订单号" />
              {getFieldValue('orderId') && <Icon onClick={this.clearOrderId} className="icon-clear" type="cross-circle" />}
            </FormItem>
          </Col>
          <Col span={10}>
            <Button type="primary" size="large" onClick={this.handleSearch}>搜索</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
