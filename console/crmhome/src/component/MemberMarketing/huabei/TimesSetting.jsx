import React, {PropTypes} from 'react';
import {Radio, Form, Icon, Col, Row, Alert} from 'antd';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

const ShopsSetting = React.createClass({
  propTypes: {
    form: PropTypes.object,
    prviousRateData: PropTypes.array,
    alertMessage: PropTypes.string,
    downLoadButton: PropTypes.any,
    type: PropTypes.string,
    previousStatus: PropTypes.bool,
    rateData: PropTypes.array,
  },

  componentWillReceiveProps(next) {
    if (this.props.prviousRateData !== next.prviousRateData) {
      const res = {};
      const {rateData, prviousRateData} = next;
      rateData.filter((item, index) => index % 2).forEach(item => {
        if (!!~prviousRateData.indexOf(item.fqNum)) {
          res[`${item.fqNum}`] = 'T';
        } else {
          res[`${item.fqNum}`] = 'F';
        }
      });
      this.props.form.setFieldsValue(res);
    }
  },

  showFormItems() {
    const {rateData} = this.props;
    const { getFieldProps } = this.props.form;
    if (!this.huabeiForm && rateData.length) {
      this.huabeiForm = rateData.map((item, i) => {
        if (i % 2 === 0) {
          return (
            <FormItem
              label = {item.fqNum + '期'}
              wrapperCol={{span: 8}}
              labelCol={{span: 3}}
              key={i}
            >
              <RadioGroup {...getFieldProps(`${item.feeConfigName}${item.fqNum}`, {initialValue: 'F'})}>
                <Radio value="F">不免息(费率{(item.rate * 100).toFixed(1)}%)</Radio>
                <Radio value="T">免息(费率{(rateData[i + 1].rate * 100).toFixed(1)}%)</Radio>
              </RadioGroup>
            </ FormItem>
          );
        }
      });
    }

    return this.huabeiForm;
  },
  render() {
    const {alertMessage, type, previousStatus, downLoadButton, rateData} = this.props;
    const {getFieldProps} = this.props.form;
    return (<div style={{padding: 16}}>
      {previousStatus && <Alert message={<span><span>{alertMessage}</span>{downLoadButton}</span>} type={type} showIcon/>}
      <Row style={{marginBottom: 16}}>
        <Col span="1" style={{color: '#fa0', fontSize: 22, marginBottom: 16, width: 40}}>
          <Icon type="exclamation-circle-o" />
        </Col>
        <Col span="20" style={{color: '#999', fontSize: 12}}>
          <ul>
            <li>1.如果选择了免息，产生的花呗费率会由商家自主承担，如果选择不免息，则费率由消费者自主承担。其余费率期限的配置，亦同理。</li>
            <li>2.使用条件满足用户有花呗额度，且实付金额在可用分期额度内。</li>
            <li>3.使用条件满足用户在线买单时实付金额≥100可用。</li>
          </ul>
        </Col>
      </Row>
      <Form form={this.props.form} horizontal>
        {rateData.map((item, i) => {
          if (i % 2 === 0) {
            return (
              <FormItem
                label = {item.fqNum + '期'}
                wrapperCol={{span: 8}}
                labelCol={{span: 3}}
                key={i}
              >
                <RadioGroup {...getFieldProps(`${item.fqNum}`)}>
                  <Radio value="F">不免息(费率{(item.rate * 100).toFixed(1)}%)</Radio>
                  <Radio value="T">免息(费率{(rateData[i + 1].rate * 100).toFixed(1)}%)</Radio>
                </RadioGroup>
              </ FormItem>
            );
          }
        })}
      </Form>
    </div>);
  },
});

export default ShopsSetting;
