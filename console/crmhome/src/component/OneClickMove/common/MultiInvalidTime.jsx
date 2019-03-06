import React, { PropTypes } from 'react';
import { Select, Form, DatePicker, Row, Col } from 'antd';
import { pick } from 'lodash';
import moment from 'moment';
import Base from './BaseFormComponent';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

export default class MultiInvalidTime extends Base {
  static propTypes = {
    field: PropTypes.shape({
      type: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired,
    max: PropTypes.number,
    dateFormat: PropTypes.string,
    size: PropTypes.string,
  }
  static defaultProps = {
    ...Base.defaultProps,
    label: '不可用时间',
    max: 5,
    dateFormat: 'YYYY-MM-DD',
    defaultValue: {
      type: '0',
    },
    size: 'large',
  }

  state = {
    keyMap: {},
  }

  hasDuplicatedDate = (r, v, cb) => {
    if (this.form.getFieldValue(this.props.field.type) === '0') {
      return cb();
    }
    const data = this.form.getFieldValue(this.props.field.value);
    const src = data.filter(d => d && d.length === 2)
      .map(d => d.map(_d => moment(_d, this.props.dateFormat).toDate()));
    if (data.some(days => !days || days.length !== 2 || days.some(d => !d))) {
      return cb('请填写');
    }
    const rtn = src.some((days, i) => {
      return src.some((_days, j) => i !== j && (_days[0].valueOf() >= days[0].valueOf() && _days[0].valueOf() <= days[1].valueOf()
        || _days[1].valueOf() >= days[0].valueOf() && _days[1].valueOf() <= days[1].valueOf())
      );
    });
    if (rtn) {
      return cb('存在重复时间段');
    }
    cb();
  }

  datePickerOnChange = i => (value) => {
    const field = this.props.field;
    const oldValues = [...this.form.getFieldValue(field.value)];
    oldValues[i] = value.some(d => !d) ? [] : value.map(d => moment(d).format(this.props.dateFormat));
    this.form.setFieldsValue({
      [field.value]: oldValues,
    });
    this.form.validateFields([field.value]);
  }

  addRow = () => {
    const field = this.props.field;
    const oldValues = [...(this.form.getFieldValue(field.value) || [])];
    oldValues.push([]);
    this.form.setFieldsValue({
      [field.value]: oldValues,
    });
    this.form.validateFields([field.value]);
  }

  removeRow = i => () => {
    const field = this.props.field;
    const oldValues = [...(this.form.getFieldValue(field.value) || [])];
    oldValues.splice(i, 1);
    this.form.setFieldsValue({
      [field.value]: oldValues,
    });
    this.form.validateFields([field.value]);
  }

  typeChange = (v) => {
    const { setFieldsValue, getFieldValue } = this.form;
    const field = this.props.field;
    const nextValue = {
      [field.type]: v,
    };
    const value = getFieldValue(field.value);
    if (v === '1' && (!value || value.length === 0)) {
      nextValue[field.value] = [[]];
    }
    setFieldsValue(nextValue);
  }

  render() {
    const formProps = pick(this.props, ['label', 'extra', 'required', 'labelCol', 'wrapperCol']);
    const field = this.props.field;
    const { getFieldProps, getFieldValue, getFieldError } = this.form;
    let values = getFieldValue(field.value) || [];
    const rules = [];

    if (getFieldValue(field.type) === '1') {
      rules.push(this.hasDuplicatedDate);
    }
    if (values.length === 0) {
      values = [[]];
      getFieldProps(field.value, { initialValue: values, rules });
    } else {
      getFieldProps(field.value, { rules });
    }

    const errors = getFieldValue(field.type) === '1' ? getFieldError(field.value) : null;
    if (errors && errors.length > 0) {
      formProps.help = errors[0];
      formProps.validateStatus = 'error';
    } else {
      formProps.validateStatus = 'success';
    }
    return (
      <FormItem
        {...formProps}
      >
        <Row>
          <Col>
            <Select size={this.props.size} {...getFieldProps(field.type, {initialValue: this.props.defaultValue.type, onChange: this.typeChange })}>
              <Option key="0" value="0">不限制</Option>
              <Option key="1" value="1">指定日期</Option>
            </Select>
          </Col>
        </Row>
        {
          React.createElement('div', {style: { display: getFieldValue(field.type) === '0' ? 'none' : 'block' }},
          ...(values && values.length > 0 ? values : [[null, null]]).map((range, i) => {
            return (
              <Row style={{ marginTop: '5px' }}>
                <Col span={18}>
                  <RangePicker key={i} showTime={false} onChange={this.datePickerOnChange(i)}
                    format={this.props.dateFormat.replace(/Y/g, 'y').replace(/D/g, 'd')}   // moment 和 antd 1.x 的 geocalandar format 不一致
                    value={range.map(d => {
                      return moment(d, this.props.dateFormat).toDate();
                    })}
                  />
                </Col>
                <Col span={4} style={{ textAlign: 'center' }}>
                  {values.length < this.props.max && <a onClick={this.addRow}>增加一个</a>}
                </Col>
                <Col span={2} style={{ textAlign: 'center' }}>
                  {values.length > 1 && <a onClick={this.removeRow(i)}>删除</a>}
                </Col>
              </Row>
            );
          }))
        }
      </FormItem>
    );
  }
}
