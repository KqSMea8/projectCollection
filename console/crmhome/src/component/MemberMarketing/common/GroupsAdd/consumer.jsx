import React from 'react';
import { Form, Switch, Select, InputNumber, Col } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class Trade extends React.Component {
  render() {
    const { formItemLayout, tradeProps } = this.props;
    return (
      <div data-trade>
        <FormItem { ...formItemLayout } label="交易数据：">
          <Switch {...tradeProps} checkedChildren="开" unCheckedChildren="关" />
        </FormItem>
      </div>
    );
  }
}

class TradeCycle extends React.Component {
  render() {
    const { formItemLayout, tradeCycleProps } = this.props;
    return (
      <div data-trade-cycle>
        <FormItem { ...formItemLayout } label="消费时段：">
          <Select { ...tradeCycleProps } size="large" style={{ width: 300 }} placeholder="请选择">
            <Option value={7}>7天以内</Option>
            <Option value={30}>30天以内</Option>
            <Option value={90}>90天以内</Option>
            <Option value={180}>180天以内</Option>
          </Select>
        </FormItem>
      </div>
    );
  }
}

class TradeAmount extends React.Component {
  render() {
    const { formItemLayout, tradeAmountMinProps, tradeAmountMaxProps } = this.props;
    return (
      <div data-trade-amount>
        <FormItem { ...formItemLayout } label="消费金额：">
          <Col span="5">
            <InputNumber { ...tradeAmountMinProps } min={0} step="1" size="large"
              style={{ width: 90 }} />
          </Col>
          <Col span="1"><p> - </p></Col>
          <Col span="6">
            <InputNumber { ...tradeAmountMaxProps } min={0} step="1" size="large"
              style={{ width: 90 }} />
            <span>元</span>
          </Col>
        </FormItem>
      </div>
    );
  }
}

class TradeCount extends React.Component {
  render() {
    const { formItemLayout, tradeCountMinProps, tradeCountMaxProps } = this.props;
    return (
      <div data-trade-count>
        <FormItem { ...formItemLayout } label="消费频次：">
          <Col span="5">
            <InputNumber { ...tradeCountMinProps } min={0} step="1" size="large"
              style={{ width: 90 }} />
          </Col>
          <Col span="1"><p> - </p></Col>
          <Col span="6">
            <InputNumber { ...tradeCountMaxProps } min={0} step="1" size="large"
              style={{ width: 90 }} />
            <span>次</span>
          </Col>
        </FormItem>
      </div>
    );
  }
}

class TradePerPrice extends React.Component {
  render() {
    const { formItemLayout, tradePerPriceMinProps, tradePerPriceMaxProps } = this.props;
    return (
      <div data-trade-per-price>
        <FormItem { ...formItemLayout } label="消费客单价：">
          <Col span="5">
            <InputNumber { ...tradePerPriceMinProps } min={0} step="1" size="large"
              style={{ width: 90 }} />
          </Col>
          <Col span="1"><p> - </p></Col>
          <Col span="6">
            <InputNumber { ...tradePerPriceMaxProps } min={0} step="1" size="large"
              style={{ width: 90 }} />
            <span>元</span>
          </Col>
        </FormItem>
      </div>
    );
  }
}

class GroupsAddConsumer extends React.Component {
  static propTypes = {
    formItemLayout: React.PropTypes.object.isRequired,
    form: React.PropTypes.object.isRequired,
    initData: React.PropTypes.object.isRequired,
  }

  static defaultProps = {
    formItemLayout: {
      labelCol: { span: 7 },
      wrapperCol: { span: 12, offset: 1 },
    },
    initData: {},
  }

  render() {
    const { formItemLayout, form, initData } = this.props;
    const { getFieldProps, getFieldError } = form;
    const { tradeAmount, tradeCount, tradePerPrice } = initData;
    const [ tradeAmountMin, tradeAmountMax ] = tradeAmount || [];
    const [ tradeCountMin, tradeCountMax ] = tradeCount || [];
    const [ tradePerPriceMin, tradePerPriceMax ] = tradePerPrice || [];
    const tradeAmountMinProps = getFieldProps('tradeAmountMin', { initialValue: tradeAmountMin });
    const tradeAmountMaxProps = getFieldProps('tradeAmountMax', { initialValue: tradeAmountMax });
    const tradeCountMinProps = getFieldProps('tradeCountMin', { initialValue: tradeCountMin });
    const tradeCountMaxProps = getFieldProps('tradeCountMax', { initialValue: tradeCountMax });
    const tradePerPriceMinProps = getFieldProps('tradePerPriceMin',
      { initialValue: tradePerPriceMin });
    const tradePerPriceMaxProps = getFieldProps('tradePerPriceMax',
      { initialValue: tradePerPriceMax });
    const tradeProps = getFieldProps('trade', {
      initialValue: !!(tradeAmount || tradeCount || tradePerPrice),
      valuePropName: 'checked',
    });
    return (
      <groups-add-consumer>
        <div><span>消费行为</span></div>
        <Trade formItemLayout={formItemLayout} tradeProps={tradeProps} />
        {tradeProps.checked && (
          <div>
            <TradeCycle formItemLayout={formItemLayout}
              tradeCycleProps={getFieldProps('tradeCycle')} />
            <TradeAmount formItemLayout={formItemLayout} tradeAmountMinProps={tradeAmountMinProps}
              tradeAmountMaxProps={tradeAmountMaxProps} getFieldError={getFieldError} />
            <TradeCount formItemLayout={formItemLayout} tradeCountMinProps={tradeCountMinProps}
              tradeCountMaxProps={tradeCountMaxProps} getFieldError={getFieldError} />
            <TradePerPrice formItemLayout={formItemLayout}
              tradePerPriceMinProps={tradePerPriceMinProps}
              tradePerPriceMaxProps={tradePerPriceMaxProps}
              getFieldError={getFieldError} />
          </div>
        )}
      </groups-add-consumer>
    );
  }
}

export default GroupsAddConsumer;
