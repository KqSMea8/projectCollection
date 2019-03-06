import React, { PropTypes } from 'react';
import { Select, TimePicker, Icon, Form, Row, Col } from 'antd';
import { pick } from 'lodash';
import moment from 'moment';
import Base from './BaseFormComponent';
import DateMultiSelectModal from './DateMultiSelectModal';
import './MultiValidTime.less';

const Option = Select.Option;
const FormItem = Form.Item;

function getEmptyValue() {
  return { startTime: null, endTime: null, days: [] };
}

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

const typeOptions = [{ value: '1', text: '不限制' }, { value: '2', text: '指定每周使用时段' }, { value: '3', text: '指定每月使用日期和时段' }];

export default class MultiValidTime2 extends Base {
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
  }

  addRow = () => {
    const { field } = this.props;
    const oldValues = [...(this.form.getFieldValue(field.value) || [getEmptyValue()])];
    this.form.setFieldsValue({
      [field.value]: oldValues.concat(getEmptyValue()),
    });
  }

  updateDays = i => days => {
    const { getFieldValue, setFieldsValue } = this.form;
    const field = this.props.field;
    const oldValues = [...(getFieldValue(field.value) || [getEmptyValue()])];
    oldValues[i] = { ...oldValues[i], days };
    setFieldsValue({
      [field.value]: oldValues,
    });
    this.form.validateFields([field.value]);
  }

  renderSelector = (v, i) => {
    const field = this.props.field;
    const { getFieldValue } = this.form;
    const type = getFieldValue(field.type);
    let rtn = null;

    if (type === '2') {
      rtn = (
        <Select
          multiple
          size="large"
          placeholder="请选择"
          value={v.days}
          style={{ marginTop: -3 }}
          onChange={this.updateDays(i)}
        >
          <Option value="1">周一</Option>
          <Option value="2">周二</Option>
          <Option value="3">周三</Option>
          <Option value="4">周四</Option>
          <Option value="5">周五</Option>
          <Option value="6">周六</Option>
          <Option value="7">周日</Option>
        </Select>
      );
    } else if (type === '3') {
      rtn = (
        <DateMultiSelectModal value={v.days}
          onChange={this.updateDays(i)} />
      );
    }
    return rtn;
  }

  renderRows = () => {
    const { getFieldValue, setFieldsValue, getFieldProps, getFieldError } = this.form;
    const field = this.props.field;
    let values = getFieldValue(field.value);
    const rules = [];
    if (getFieldValue(field.type) !== '1') {
      rules.push(valuesValidate);
    }
    if (!values || values.length === 0) {
      values = [getEmptyValue()];
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
                style={{ width: '100px' }}
                size="large"
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
                size="large"
                style={{ width: '100px' }}
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
              {this.renderSelector(v, i)}
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
    const { field, rules } = this.props;
    const { getFieldProps, getFieldValue, setFieldsValue } = this.form;
    return (
      <FormItem
        {...formItemProps}
      >
        <Select {...getFieldProps(field.type, {
          rules: [...rules.type],
          onChange: () => {
            setFieldsValue({
              [field.value]: [{ startTime: null, endTime: null, days: [] }],// 切换类型时清空数据
            });
          },
          initialValue: this.props.defaultValue.type || '1',
        }) }>
          {typeOptions.map(d => <Option key={d.value} value={d.value}>{d.text}</Option>)}
        </Select>
        {React.createElement('div', { style: { display: getFieldValue(field.type) !== '1' ? 'block' : 'none' } }, ...this.renderRows(),  // eslint、babel 版本太低, 不支持 JSX spread
          (
            <div style={{ display: (getFieldValue(field.value) || []).length >= this.props.max ? 'none' : 'block', marginTop: '20px' }}>
              <a onClick={this.addRow}>增加指定时间段</a>，最多添加{` ${this.props.max} `} 项
            </div>)
        )}
      </FormItem>
    );
  }
}
