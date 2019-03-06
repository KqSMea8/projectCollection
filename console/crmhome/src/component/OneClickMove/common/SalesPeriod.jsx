import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Form } from 'antd';
import moment from 'moment';
import BaseFormComponent from './BaseFormComponent';

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const format = 'YYYY-MM-DD HH:mm:ss';
const today = moment().hours(0).minutes(0).seconds(0).milliseconds(0);
const max = moment('2037-12-31 23:59:59', format);

export default class SalesPeriod extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    rules: PropTypes.array,
    defaultValue: PropTypes.shape({
      start: PropTypes.string,
      end: PropTypes.string,
    }),
    disabled: PropTypes.bool,
    field: PropTypes.shape({
      start: PropTypes.string,
      end: PropTypes.string,
    }),
  };

  static defaultProps = {
    disabled: false,
    extra: <div>商品创建成功后，仅在售卖时间内才展示给用户并开放售卖</div>,
    label: '商品售卖时间',
    field: {
      start: 'salesPeriodStart',
      end: 'salesPeriodEnd',
    },
    defaultValue: {
      start: today.format(format),
      end: max.format(format),
    },
  }

  onChangeDelegator = (startOnchange, endOnchange) => (_, dateStrings) => {
    startOnchange(dateStrings[0]);
    endOnchange(dateStrings[1]);
  }

  validator = (_, __, cb) => {
    const { start: startField, end: endField } = this.props.field;
    const times = this.form.getFieldsValue([startField, endField]);
    if (this.props.required && (!times[startField] || !times[endField])) {
      return cb('此项必填');
    }
    if (moment(times[endField], format).isAfter(max)) {
      return cb(`结束时间不能晚于${max.format('YYYY-MM-DD')}`);
    }
    cb();
  }

  render() {
    const { label, extra, required, labelCol, wrapperCol, field, disabled } = this.props;
    const rules = [...(this.props.rules || [])];
    const startProps = this.form.getFieldProps(field.start, {
      initialValue: this.props.defaultValue.start,
    });
    rules.unshift(this.validator);
    const endProps = this.form.getFieldProps(field.end, {
      rules,
      initialValue: this.props.defaultValue.end,
    });
    let startValue;
    let endValue;
    if (!startProps.value) {
      startValue = null;
    } else {
      startValue = moment(startProps.value, format).toDate();
    }
    if (!endProps.value) {
      endValue = null;
    } else {
      endValue = moment(endProps.value, format).toDate();
    }

    return (
      <FormItem
        label={label}
        extra={extra}
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
      >
        {/* warning: 不要改顺序 FormItem 的错误提示取第一个 children，这里把所有校验规则写在 end 里 */}
        <input type="hidden" {...endProps} />
        <input type="hidden" {...startProps} />
        <RangePicker
          style={{ width: '100%' }}
          disabled={disabled}
          showTime
          format="yyyy-MM-dd HH:mm:ss"
          value={[startValue, endValue]}
          onChange={this.onChangeDelegator(startProps.onChange, endProps.onChange)}
        />
      </FormItem>
    );
  }
}
