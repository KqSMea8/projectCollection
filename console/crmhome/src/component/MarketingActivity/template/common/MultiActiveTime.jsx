import React, {PropTypes} from 'react';
import {Row, TimePicker, Select, Icon, Form} from 'antd';
import classnames from 'classnames';
import {padStart} from '../../../../common/utils';

const format = 'HH:mm';

/*
  表单字段 － 使用时段
*/
let uuid = 0;
function formatTime(d) {
  return d && typeof d !== 'string' ?
    (padStart(d.getHours(), 2, '0') + ':' + padStart(d.getMinutes(), 2, '0') + ':' + padStart(d.getSeconds(), 2, '0')) : d;
}
function arrayIntersection(first, second) {
  let a = first.join('|');
  let b = second.join('|');

  if (a.length > b.length) { // a长度大于b时交换，能提高效率.因为正则表达式是从字符串的左边到右边开始匹配的。
    const temp = b;
    b = a;
    a = temp;
  }
  return b.match(new RegExp(a, 'g')); // 使用分支条件，获取匹配数据
}

const Option = Select.Option;
const FormItem = Form.Item;

const MultiActiveTime = React.createClass({
  propTypes: {
    form: PropTypes.object.isRequired,
    max: PropTypes.number.isRequired,
    isEdit: PropTypes.bool.isRequired,
    isCampaignStart: PropTypes.bool,
    data: PropTypes.object,
  },

  componentWillMount() {
    const {form} = this.props;
    const keys = [];
    if (this.props.data && this.props.data.templateNo && this.props.data.bsnParams.availableTimeValues) {
      this.props.data.bsnParams.availableTimeValues.map((item, index) => {
        const times = item.times.split(',');
        form.setFieldsValue({
          [`activeTimeStart${index}`]: times[0],
          [`activeTimeEnd${index}`]: times[1],
          [`activeTimeWeek${index}`]: item.values.split(','),
        });
        keys.push(index);
      });

      form.setFieldsValue({
        timeKeys: keys,
      });
    }
  },

  compareTimeStart(key, rule, value, callback) {
    this.props.form.validateFields(['activeTimeEnd' + key], {force: true});
    callback();
  },

  compareTimeEnd(key, rule, value, callback) {
    const {form} = this.props;
    const startTime = form.getFieldValue('activeTimeStart' + key);
    if (!startTime || !value) {
      callback(new Error('请选择使用时段'));
      return;
    }
    if (formatTime(startTime) >= formatTime(value)) {
      callback(new Error('开始时间不能大于等于结束时间'));
      return;
    }

    form.getFieldValue('timeKeys').forEach((k) => {
      form.validateFields(['activeTimeWeek' + k], {force: true});
    });

    callback();
  },

  validatorActiveTimeWeek(key, rule, value, callback) {
    const {form} = this.props;
    if (!value || value.length === 0) {
      callback(new Error('请选择使用时段'));
      return;
    }
    if (this.hasOverlap(key, value)) {
      callback(new Error('使用时段不可重叠'));
      return;
    }
    // 依次校验其他每个有错误的输入星期框
    form.getFieldValue('timeKeys').forEach((k) => {
      if (k !== key && form.getFieldError('activeTimeWeek' + k)) {
        form.validateFields(['activeTimeWeek' + k], {force: true});
      }
    });
    callback();
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

    keys.forEach((k) => {
      form.validateFields(['activeTimeWeek' + k], {force: true});
    });
  },
  hasOverlap(thisKey, value) {
    const {getFieldValue} = this.props.form;
    let flag = false;
    getFieldValue('timeKeys').forEach((key) => {
      const preStart = formatTime(getFieldValue('activeTimeStart' + key));
      const preEnd = formatTime(getFieldValue('activeTimeEnd' + key));
      const thisStart = formatTime(getFieldValue('activeTimeStart' + thisKey));
      const thisEnd = formatTime(getFieldValue('activeTimeEnd' + thisKey));

      if (key !== thisKey) {
        let jiaoji;
        if (value && getFieldValue('activeTimeWeek' + key)) {
          jiaoji = arrayIntersection(value, getFieldValue('activeTimeWeek' + key));
        }
        // 若星期上有重叠，则检查时间
        if (jiaoji && jiaoji.length > 0) {
          if ((thisStart <= preEnd && thisStart >= preStart) || (thisEnd <= preEnd && thisEnd >= preStart)) {
            flag = true;
            return true;
          }
        }
      }
    });
    return flag;
  },
  add(e) {
    e.preventDefault();
    const {form, max} = this.props;
    const keys = form.getFieldValue('timeKeys');
    if (keys.length >= max) {
      return;
    }

    // 判断是否初始化数据需要更新uuid
    if (uuid < keys[keys.length - 1]) {
      uuid = keys[keys.length - 1];
    }

    uuid++;
    keys.push(uuid);

    form.setFieldsValue({
      timeKeys: keys,
    });
  },

  render() {
    const isOnline = this.props.isCampaignStart && this.props.isEdit;
    const {form, max} = this.props;
    const {getFieldValue, getFieldError, getFieldProps} = form;
    const times = getFieldValue('timeKeys');

    const rows = times.map((key)=> {
      const start = formatTime(getFieldValue('activeTimeStart' + key));
      const end = formatTime(getFieldValue('activeTimeEnd' + key));
      const weeks = getFieldValue('activeTimeWeek' + key);
      if (isOnline) {
        return (<p key={`week${key}`}>{`${weeks.map(week => ({
          '1': '周一', '2': '周二', '3': '周三', '4': '周四', '5': '周五', '6': '周六', '7': '周日',
        }[week])).join('、')} ${start} ~ ${end}`}</p>);
      }
      return (
        <FormItem
        key={key}
        help={getFieldError('activeTimeEnd' + key)}
        validateStatus={
          classnames({
            error: !!getFieldError('activeTimeEnd' + key),
          })}>
          <div>
            <div style={{display: 'inline-block', verticalAlign: 'top'}}>
              <TimePicker format={format} {...getFieldProps('activeTimeStart' + key, {
                rules: [this.compareTimeStart.bind(this, key)],
                initialValue: start || '00:00:00',
              })} />
            </div>
            <div style={{padding: '0 3px', display: 'inline-block', verticalAlign: 'top'}}> - </div>
            <div style={{display: 'inline-block', verticalAlign: 'top'}}>
              <TimePicker format={format} {...getFieldProps('activeTimeEnd' + key, {
                rules: [this.compareTimeEnd.bind(this, key)],
                initialValue: end || '23:59:59',
              })} style={{marginRight: 8}}/>
            </div>
            <div style={{minWidth: 90, display: 'inline-block', verticalAlign: 'top', margintTop: -1}}>
              <FormItem>
                <Select
                  multiple
                  style={{width: '100%'}}
                    {...getFieldProps('activeTimeWeek' + key, {
                      rules: [this.validatorActiveTimeWeek.bind(this, key)],
                      initialValue: weeks,
                    })}>
                  <Option value="1">周一</Option>
                  <Option value="2">周二</Option>
                  <Option value="3">周三</Option>
                  <Option value="4">周四</Option>
                  <Option value="5">周五</Option>
                  <Option value="6">周六</Option>
                  <Option value="7">周日</Option>
                </Select>
              </FormItem>
            </div>
            <div style={{display: 'inline-block', verticalAlign: 'top'}}>
              {
                getFieldValue('timeKeys').length !== 1 &&
                <Icon type="cross-circle-o" onClick={this.remove.bind(this, key)}
                  style={{marginLeft: 18, fontSize: 14, verticalAlign: 'middle', cursor: 'pointer'}}
                />
              }
            </div>
          </div>
      </FormItem>);
    });

    return (
      <div style={{ display: 'block', paddingTop: 5 }}>
        {rows}
        <Row style={{ display: times.length >= max || isOnline ? 'none' : '' }}>
          <div>
            <a onClick={this.add}>增加指定时间段</a>，最多添加{max}项
          </div>
        </Row>
      </div>
    );
  },
});
export default MultiActiveTime;
