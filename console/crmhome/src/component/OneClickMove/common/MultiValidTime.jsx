import React, { PropTypes } from 'react';
import { Select, TimePicker, Icon, Form, Row, Col } from 'antd';
import { pick } from 'lodash';
import moment from 'moment';
import Base from './BaseFormComponent';
import './MultiValidTime.less';

const Option = Select.Option;
const FormItem = Form.Item;

function validTimeDuplicatedIndex(values = []) {
  const res = []; // 保存重复的行
  values.some((value, i) => {
    const { days, startTime, endTime } = value;
    const rtn = values.some((d, j) => {
      const r = (d.startTime < endTime && d.startTime > startTime || d.endTime < endTime && d.endTime > startTime)
        && d.days.some(w => days && days.length && days.indexOf(w) > -1);
      if (r) {
        res.push(i, j);
      }
      return r;
    });
    return rtn;
  });
  return res;
}

function getNotlimitKey(options) {
  const res = options.filter((item) => {
    if (/不限制/.test(item.text)) {
      return true;
    }
    return false;
  });
  return res && res.length && res[0] && res[0].value || '';
}

function valuesValidate(rule, values = [], cb) {
  let i = -1;
  const hasEmpty = values.some((d, j) => {
    const rtn = !d.days || !d.days.length || !d.startTime || !d.endTime;
    if (rtn) i = j;
    return rtn;
  });
  if (hasEmpty) {
    return cb(`${i},请填写完整`);
  }
  const indexes = validTimeDuplicatedIndex(values);
  if (indexes.length > 0) {
    return cb(`${indexes.join(',')},存在重复时间段`);
  }
  let invalidTimeIndex = -1;
  values.some((d, j) => {
    const rtn = d.startTime >= d.endTime;
    if (rtn) invalidTimeIndex = j;
    return rtn;
  });
  if (values.some(d => d.startTime >= d.endTime)) {
    cb(`${invalidTimeIndex},开始时间必须早于结束时间`);
  }
  cb();
}

const DEFAULT_TYPE_OPTS = [{ value: '0', text: '不限制' }, { value: '1', text: '指定时间' }];

export default class MultiValidTime extends Base {
  static propTypes = {
    ...Base.propTypes,
    field: PropTypes.shape({
      type: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired,
    rules: PropTypes.shape({
      type: PropTypes.array,
      value: PropTypes.array,
    }),
    max: PropTypes.number,  // 最多多少组
    defaultValue: PropTypes.shape({
      type: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      value: PropTypes.array,
    }),
    timeFormat: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.any.isRequired,
      text: PropTypes.any.isRequired,
    })),
  }
  static defaultProps = {
    max: 3,
    rules: {
      type: [],
      value: [],
    },
    label: '可用时间',
    defaultValue: {
      type: '1',
      value: [],
    },
    timeFormat: 'HH:mm:ss',
    options: DEFAULT_TYPE_OPTS,
  }

  addRow = () => {
    const { field } = this.props;
    const oldValues = [...(this.form.getFieldValue(field.value) || [{ startTime: null, endTime: null, days: [] }])];
    this.form.setFieldsValue({
      [field.value]: oldValues.concat({ startTime: null, endTime: null, days: [] }),
    });
  }

  renderRows = () => {
    const { getFieldValue, setFieldsValue, getFieldProps, getFieldError } = this.form;
    const field = this.props.field;
    let values = getFieldValue(field.value);
    const rules = [];
    if (getFieldValue(field.type) !== getNotlimitKey(this.props.options)) {
      rules.push(valuesValidate);
    }
    if (!values || values.length === 0) {
      values = [{ days: [], startTime: '', endTime: '' }];
      getFieldProps(field.value, { initialValue: values, rules });
    } else {
      getFieldProps(field.value, { rules });
    }
    const error = getFieldError(field.value) && getFieldError(field.value).length ? getFieldError(field.value)[0] : '';
    const errorTips = error.split(',');
    const errorRowsIndex = errorTips.slice(0, errorTips.length - 1);
    const errorContent = errorTips[errorTips.length - 1];
    const oldValues = [...values];
    return values.map((v, i) => (
      <div className="multi-valid-time-row">
        <FormItem
          validateStatus={errorRowsIndex.indexOf(i + '') >= 0 ? 'error' : 'success'}
          help={errorRowsIndex.indexOf(i + '') >= 0 ? errorContent : null}
        >
          <Row>
            <Col span={14}>
              <TimePicker
                style={{width: '100px'}}
                value={values[i].startTime ? moment(values[i].startTime, this.props.timeFormat).toDate() : null}
                format={this.props.timeFormat}
                onChange={(date) => {
                  oldValues[i].startTime = date ? moment(date).format(this.props.timeFormat) : '';
                  setFieldsValue({
                    [field.value]: oldValues,
                  });
                  this.form.validateFields([field.value]);
                }}
              />
              &nbsp;-&nbsp;
            <TimePicker
              style={{width: '100px'}}
              value={values[i].endTime ? moment(values[i].endTime, this.props.timeFormat).toDate() : null}
              format={this.props.timeFormat}
                onChange={(date) => {
                  oldValues[i].endTime = date ? moment(date).format(this.props.timeFormat) : '';
                  setFieldsValue({
                    [field.value]: oldValues,
                  });
                  this.form.validateFields([field.value]);
                }}
              />
            </Col>
            <Col span={9}>
              <Select
                multiple
                placeholder="请选择"
                value={v.days}
                onChange={selectedValues => {
                  oldValues[i] = { ...oldValues[i], days: selectedValues };
                  setFieldsValue({
                    [field.value]: oldValues,
                  });
                  this.form.validateFields([field.value]);
                }}
              >
                <Option value="1">周一</Option>
                <Option value="2">周二</Option>
                <Option value="3">周三</Option>
                <Option value="4">周四</Option>
                <Option value="5">周五</Option>
                <Option value="6">周六</Option>
                <Option value="7">周日</Option>
              </Select>
            </Col>
            <Col span={1} style={{ textAlign: 'center' }}>
              {values.length > 1 && <Icon type="cross-circle-o" style={{ cursor: 'pointer' }} onClick={() => {
                oldValues.splice(i, 1);
                setFieldsValue({
                  [field.value]: oldValues,
                });
              }} />}
            </Col>
          </Row>
        </FormItem>
      </div>
    ));
  }

  render() {
    const formItemProps = pick(this.props, ['label', 'labelCol', 'wrapperCol', 'help', 'extra', 'required']);
    const { field, rules, options } = this.props;
    const { getFieldProps, getFieldValue } = this.form;

    return (
      <FormItem
        {...formItemProps}
      >
          <Select {...getFieldProps(field.type, {
            rules: [...rules.type],
            initialValue: this.props.defaultValue.type || '0',
          }) }>
            {options.map(d => <Option key={d.value} value={d.value}>{d.text}</Option>)}
          </Select>
          {React.createElement('div', {style: {display: getFieldValue(field.type) !== getNotlimitKey(options) ? 'block' : 'none' }}, ...this.renderRows(),  // eslint 版本太低, 不支持 JSX spread
          (
            <div style={{ display: (getFieldValue(field.value) || []).length >= this.props.max ? 'none' : 'block', marginTop: '20px' }}>
              <a onClick={this.addRow}>增加指定时间段</a>，最多添加{` ${this.props.max} `} 项
            </div>)
          )}
      </FormItem>
    );
  }
}
