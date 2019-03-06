import React, { PropTypes } from 'react';
import { Form, Radio } from 'antd';
import BaseFormComponent from './BaseFormComponent';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

export default class RadioComponent extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    label: PropTypes.string.isRequired,
    convert2Value: PropTypes.func,
    convert2Form: PropTypes.func,
  }
  static defaultProps = {
    defaultValue: '',
    rules: [],
    convert2Value: v => v,
    convert2Form: v => v,
  }
  get fieldProps() {
    const { getFieldProps, getFieldValue } = this.form;
    const { defaultValue, field, rules, convert2Value, convert2Form } = this.props;
    return {...getFieldProps(field, {
      initialValue: defaultValue,
      rules,
      getValueFromEvent(e) {
        return convert2Form(e.target.value);
      },
    }), value: convert2Value(getFieldValue(field))};
  }

  get renderOptions() {
    const {options} = this.props;
    return options.map((option) => {
      return <Radio value={option.key} disabled={!!option.disabled}>{option.name}</Radio>;
    });
  }

  render() {
    const { label, extra, required, labelCol, wrapperCol, visible } = this.props;
    if (!(!!visible)) {
      return null;
    }
    return (
      <FormItem
        label={label}
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
      >
        <FormItem style={{display: 'inline-block', width: '100%'}}>
          {React.createElement(RadioGroup, this.fieldProps, ...this.renderOptions)}
        </FormItem>
        <p style={{lineHeight: '16px', color: '#999', marginTop: 5}}>{extra}</p>
      </FormItem>
    );
  }
}
