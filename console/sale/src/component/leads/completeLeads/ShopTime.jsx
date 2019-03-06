import React, {PropTypes} from 'react';
import {Col, Form, Checkbox, TimePicker, Icon} from 'antd';
import classnames from 'classnames';
import {padding} from '../../../common/dateUtils';

const FormItem = Form.Item;

const maxCount = 2;
const pattern = 'HH:mm';

let uuid = 0;

export function formatTime(d) {
  return d && typeof d !== 'string' ? (padding(d.getHours()) + ':' + padding(d.getMinutes())) : d;
}

const ShopTime = React.createClass({
  propTypes: {
    form: PropTypes.object,
    defaultData: PropTypes.object,
  },

  remove(key) {
    const {form} = this.props;
    let keys = form.getFieldValue('timeKeys');
    keys = keys.filter((k) => {
      return k !== key;
    });
    form.setFieldsValue({
      timeKeys: keys,
    });
  },

  add(e) {
    e.preventDefault();
    uuid++;
    const {form} = this.props;
    let keys = form.getFieldValue('timeKeys');
    if (keys.length >= maxCount) {
      return;
    }
    keys = keys.concat(uuid);
    form.setFieldsValue({
      timeKeys: keys,
    });
  },

  compareTimeStart(key, rule, value, callback) {
    this.props.form.validateFields(['shopTimeEnd' + key], {force: true});
    callback();
  },

  compareTimeEnd(key, rule, value, callback) {
    const {form} = this.props;
    const {getFieldValue} = form;
    const startTime = formatTime(getFieldValue('shopTimeStart' + key));
    const endTime = formatTime(value);
    if (!startTime || !endTime) {
      callback(new Error('请选择完整的营业时间'));
      return;
    }
    if (startTime >= endTime) {
      callback(new Error('营业结束时间不能大于等于开始时间'));
      return;
    }
    callback();
  },

  render() {
    const {getFieldValue, getFieldProps, getFieldError} = this.props.form;
    const {defaultData} = this.props;
    getFieldProps('timeKeys', {
      initialValue: defaultData.timeKeys || [],
    });
    const rows = getFieldValue('timeKeys').map((key)=> {
      return (<FormItem
        key={key}
        validateStatus={
          classnames({
            error: !!getFieldError('shopTimeEnd' + key),
          })}
        help>
        <TimePicker {...getFieldProps('shopTimeStart' + key, {
          initialValue: defaultData['shopTimeStart' + key],
          rules: [this.compareTimeStart.bind(this, key)],
        })} format={pattern} />
        <div style={{display: 'inline-block', width: 20, textAlign: 'center'}}>
          <p className="ant-form-split">-</p>
        </div>
        <TimePicker {...getFieldProps('shopTimeEnd' + key, {
          initialValue: defaultData['shopTimeEnd' + key],
          rules: [this.compareTimeEnd.bind(this, key)]},
        )} format={pattern} />
        <Icon type="cross-circle-o" onClick={this.remove.bind(this, key)} style={{marginLeft: 18, fontSize: 14, verticalAlign: 'middle', cursor: 'pointer'}} />
        <Col span="19">
          <p className="ant-form-explain">{getFieldError('shopTimeEnd' + key)}</p>
        </Col>
      </FormItem>);
    });

    return (<FormItem
      label="营业时段："
      labelCol={{span: 4}}
      wrapperCol={{span: 12}}
      help="支持增加至2个营业时间段，且营业的结束时间必须大于开始时间">
      <div style={{marginBottom: 10}}>
        <a href="#" style={{marginRight: 30, color: rows.length === 2 ? '#aaa' : undefined}} onClick={this.add}>增加时段</a>
        <label>
          <Checkbox {...getFieldProps('shopTimeRadio', {
            initialValue: defaultData.shopTimeRadio,
            valuePropName: 'checked',
          })}>24小时营业</Checkbox>
        </label>
      </div>
      {rows}
    </FormItem>);
  },
});

export default ShopTime;
