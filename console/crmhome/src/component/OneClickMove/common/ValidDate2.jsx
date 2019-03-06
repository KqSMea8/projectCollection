/**
 * 券有效期/有效期
 */
import React, { PropTypes } from 'react';
import { Form, InputNumber, Select, DatePicker } from 'antd';
import BaseFormComponent from './BaseFormComponent';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const SUB_FORM_ITEM_STYLE = { display: 'table-cell', verticalAlign: 'top' };

function disabledTime(value) {
  if (!value) {
    return false;
  }

  return value.getTime() < moment(moment().format('YYYY-MM-DD') + ' 00:00:00', 'YYYY-MM-DD HH:mm:ss').toDate();
}

export default class ValidDate2 extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    days: PropTypes.number,
    cycle: PropTypes.number,
    field: PropTypes.shape({
      validTimeType: PropTypes.string.isRequired,
      validPeriod: PropTypes.string.isRequired,
      validTime: PropTypes.string.isRequired,
    }),
    rules: PropTypes.shape({
      validPeriod: PropTypes.array,
      validTime: PropTypes.array,
    }),
    defaultValue: PropTypes.shape({
      validPeriod: PropTypes.number,
      validTimeType: PropTypes.oneOf(['FIXED', 'RELATIVE']),
      validTimeStart: PropTypes.any,
    }),
    span: PropTypes.shape({
      month: PropTypes.number,
      day: PropTypes.number,
    }),
    format: PropTypes.string,
    pickerFormat: PropTypes.string,
    isValid: PropTypes.bool, // 是否是有效期，true(有效期)false(券有效期)
    limitOneYears: PropTypes.bool,
    isDisabledDate: PropTypes.bool,
  }
  static defaultProps = {
    ...BaseFormComponent.defaultProps,
    rules: {
      validPeriod: [],
      validTime: [],
    },
    defaultValue: {
      validTimeType: 'RELATIVE',
      validPeriod: 30,
      validTimeStart: moment(moment().format('YYYY-MM-DD') + ' 00:00', 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm'),
    },
    label: '券有效期',
    span: {
      month: 3,
      day: 0,
    },
    format: 'YYYY-MM-DD HH:mm',
    isValid: false,
    limitOneYears: false,
    isDisabledDate: true,
    pickerFormat: 'yyyy-MM-dd HH:mm',
  }
  get validPeriodProps() {
    const { getFieldProps } = this.form;
    const { field, rules, defaultValue } = this.props;
    return getFieldProps(field.validPeriod, {
      initialValue: defaultValue.validPeriod || ValidDate2.defaultProps.defaultValue.validPeriod,
      rules: [...(rules.validPeriod || ValidDate2.defaultProps.rules.validPeriod)],
    });
  }
  get validTimeProps() {
    const { getFieldProps, getFieldValue } = this.form;
    const { field, rules, format, limitOneYears } = this.props;
    const initialStart = this.props.defaultValue.validTimeStart || ValidDate2.defaultProps.defaultValue.validTimeStart;
    const initialEnd = moment(initialStart, this.props.format).add((this.props.span.day || ValidDate2.defaultProps.span.day) + 1, 'd')
      .add(this.props.span.month || ValidDate2.defaultProps.span.month, 'M')
      .add(-1, 's').format(this.props.format);
    const rulesNew = [...(rules.validTime || ValidDate2.defaultProps.rules.validTime)];
    if (limitOneYears) {
      rulesNew.push((r, v, cb) => {
        if (moment(v[1]) - moment(v[0]) > 31104000000) { // 开始到终止时间不能超过360天
          return cb('开始到终止时间不能超过360天');
        }
        cb();
      });
    }
    return {
      ...getFieldProps(field.validTime, {
        initialValue: [initialStart, initialEnd],
        rules: rulesNew,
        getValueFromEvent(v) {
          return v.map(d => {
            if (d) {
              return moment(d).format(format);
            }
            return null;
          });
        },
      }), value: getFieldValue(this.props.field.validTime).map(d => {
        if (d) {
          return moment(d, this.props.format).toDate();
        }
        return null;
      }),
    };
  }
  get validTimeTypeProps() {
    const { getFieldProps } = this.form;
    const { defaultValue, field } = this.props;
    const props = getFieldProps(field.validTimeType, {
      initialValue: defaultValue.validTimeType || 'RELATIVE',
    });
    const onChange = (value) => {
      props.onChange(value);
      if (this.form.getFieldValue('salesPeriodEnd')) {
        this.form.validateFields(['salesPeriodEnd'], { force: true }, () => { });
      }
    };
    return { ...props, onChange };
  }
  render() {
    const { label, placeholder, required, labelCol, wrapperCol, extra, field, isValid, pickerFormat, isDisabledDate } = this.props;
    const { getFieldValue } = this.form;
    return (
      <FormItem
        label={label}
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        extra={extra}
      >
        <Select {...this.validTimeTypeProps} placeholder="请选择">
          <Option key="RELATIVE">相对时间</Option>
          <Option key="FIXED">指定时间</Option>
        </Select>
        {getFieldValue(field.validTimeType) === 'RELATIVE' &&
          <div style={{ marginTop: 10 }}>
            <span style={{ paddingRight: 10, display: 'table-cell' }}>{isValid ? '购买后' : '领取后'}</span>
            <FormItem style={SUB_FORM_ITEM_STYLE} >
              <InputNumber style={{ width: 70 }}
                placeholder={placeholder}
                {...this.validPeriodProps}
                min={0} step="1"
                size="large"
              />
            </FormItem>
            <span style={{ display: 'table-cell' }}>日内有效</span>
          </div>}
        {getFieldValue(field.validTimeType) === 'FIXED' &&
          <div style={{ marginTop: 10 }}>
            <FormItem style={{ display: 'inline-block', width: '100%' }} >
              <RangePicker
                disabledDate={isDisabledDate ? disabledTime : false}
                format={pickerFormat}
                showTime
                size="large"
                style={{ width: '100%' }}
                {...this.validTimeProps}
              />
            </FormItem>
          </div>}
      </FormItem>
    );
  }
}
