/**
 * 折扣力度
 */
import React from 'react';
import { Form, InputNumber, Select, Popover } from 'antd';
import BaseFormComponent from './BaseFormComponent';

const TABLE_CELL = { display: 'table-cell' };
const SUB_FORM_ITEM_STYLE = { display: 'table-cell', verticalAlign: 'top', paddingLeft: '8px' };
const FormItem = Form.Item;
const tip = <span>折扣范围1.1折－9.9折，例：设置<span style={{ color: '#ffc600' }}>2折</span>后，原价10元，用户仅需付<span style={{ color: '#ffc600' }}>2元</span></span>;
const Option = Select.Option;
const discountTypeTip = (
  <div>
    <dl className="fn-mt10">
      <dt className="ft-14">不自动抹零</dt>
      <dd className="ft-12 ft-explain">正常收款，不做抹零操作</dd>
    </dl>
    <dl className="fn-mt10">
      <dt className="ft-14">自动抹零到元</dt>
      <dd className="ft-12 ft-explain">例：打折后金额为<span className="ft-orange">8.50</span>元，自动抹零到<span className="ft-orange">8</span>元</dd>
    </dl>
    <dl className="fn-mt10">
      <dt className="ft-14">自动抹零到角</dt>
      <dd className="ft-12 ft-explain">例：打折后金额为<span className="ft-orange">8.58</span>元，自动抹零到<span className="ft-orange">8.5</span>元</dd>
    </dl>
    <dl className="fn-mt10">
      <dt className="ft-14">四舍五入到元</dt>
      <dd className="ft-12 ft-explain">例：打折后金额为<span className="ft-orange">8.30</span>元，自动四舍五入到<span className="ft-orange">8</span>元
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;打折后金额为<span className="ft-orange">8.80</span>元，自动四舍五入到<span className="ft-orange">9</span>元</dd>
    </dl>
    <dl className="fn-mt10  fn-mb10">
      <dt className="ft-14">四舍五入到角</dt>
      <dd className="ft-12 ft-explain">例：打折后金额为<span className="ft-orange">8.33</span>元，自动四舍五入到<span className="ft-orange">8.3</span>元
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;打折后金额为<span className="ft-orange">8.38</span>元，自动四舍五入到<span className="ft-orange">8.4</span>元</dd>
    </dl></div>
);

export default class InputComponent extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    field: React.PropTypes.object,
    rules: React.PropTypes.object,
  }
  static defaultProps = {
    ...BaseFormComponent.defaultProps,
    label: '折扣力度',
    defaultValue: {
      discountType: '0',
      discountValue: undefined,
    },
    labelCol: {
      span: 4,
      offset: 2,
    },
    rules: {
      discountType: [],
      discountValue: [],
    },
  }

  get fieldPropsDiscount() {
    const { getFieldProps } = this.form;
    const { defaultValue, field, rules } = this.props;
    return getFieldProps(field.discountValue, {
      initialValue: defaultValue.discountValue,
      rules: rules.discountValue || [],
    });
  }

  get fieldPropsType() {
    const { getFieldProps } = this.form;
    const { field, rules, defaultValue } = this.props;
    return getFieldProps(field.discountType, {
      initialValue: defaultValue.discountType,
      rules: rules.discountType || [],
    });
  }

  render() {
    const { labelCol, wrapperCol, disabled, required } = this.props;
    return (
      <FormItem
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        extra={tip}
        label="折扣力度"
      >
        <FormItem style={SUB_FORM_ITEM_STYLE}>
          <InputNumber
            style={{ width: 52 }}
            step={0.1}
            max={9.9}
            min={1.1}
            {...this.fieldPropsDiscount}
            disabled={disabled}
          />
        </FormItem>
        <span style={TABLE_CELL}>折，且收款时</span>
        <FormItem style={SUB_FORM_ITEM_STYLE}>
          <Select {...this.fieldPropsType} style={{ width: 105 }}>
            <Option key="0">不自动抹零</Option>
            <Option key="1">自动抹零到元</Option>
            <Option key="2">自动抹零到角</Option>
            <Option key="3">四舍五入到元</Option>
            <Option key="4">四舍五入到角</Option>
          </Select>
        </FormItem>
        <Popover content={discountTypeTip} title="抹零规则：">
          <span style={{ paddingLeft: 5, cursor: 'pointer', color: '#2db7f5', ...TABLE_CELL }}>抹零规则</span>
        </Popover>
      </FormItem>
    );
  }
}
