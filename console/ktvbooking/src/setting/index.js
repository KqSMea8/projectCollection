import React, { PureComponent } from 'react';
import { object, func, bool } from 'prop-types';
import { page } from '@alipay/page-wrapper';
import { Button, Form, Input, Switch, Select } from 'antd';

import Page from '../common/components/page';
import Block from '../common/components/block';
import ShopSelectFormItem from '../common/components/shop-select/form-item';

import { Help } from './components/help';

import store from './store';
import spmConfig from './spm.config';
import './style.less';

const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};
const times = [
  '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30',
  '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30',
];
const startTimeOptions = times.map((value) => (<Option key={`${value}|CURRENT_DAY`}>{value}</Option>));
const endTimeOptions = times.map((value) => (<Option key={`${value}|NEXT_DAY`}>{value}</Option>));

@page({
  store, spmConfig,
  auth: { menu: '4105' },
})
@Form.create()
export default class Setting extends PureComponent {
  static propTypes = {
    dispatch: func,
    history: object,
    editData: object,
    form: object,
    loading: bool,
  }

  /*
    电话为空:接收通知电话不能为空
    多个电话未用,隔开:多个电话请用英文逗号“，”隔开, 最多可输入3个
    输入手机号非11位数字，输入座机号未加区号，电话号码非7~8位数字;
    400电话非10位数字:请输入正确的电话格式
 */
  telValiator = (rule, value, callback) => {
    if (!value) { callback('请输入接收通知电话'); return; }
    const vals = value.split(',');
    const len = vals.length;
    if (len > 3) {
      callback('电话号码最多只能添加3个');
      return;
    }
    for (let i = 0; i < len; i++) {
      const val = vals[i];
      if (val && !/^(400[0-9]{7}|0[0-9]{2,3}-[0-9]{7,8}|[01][0-9]{10})$/.test(val)) {
        callback(`第${i + 1}个电话号码格式不正确`);
        return;
      }
    }
    callback();
  }

  onShopChange = (shopId) => {
    const { dispatch } = this.props;
    if (shopId) {
      dispatch({ type: 'getEditData', payload: { shopId } });
    }
  }

  handleSubmit = () => {
    const { form: { validateFieldsAndScroll }, dispatch } = this.props;
    validateFieldsAndScroll({}, (err, values) => {
      if (err) { return; }
      const { checkShop: { shopId },
        noticePhone, needNotice, orderStartTime, orderEndTime, timeOut } = values;
      dispatch({ type: 'saveData', payload: {
        shopId, noticePhone, needNotice, orderStartTime, orderEndTime, timeOut,
      } });
    });
  }

  notNull = (value) => value !== undefined && value !== null && value.toString().replace(/(^\s*)|(\s*$)/g, '') !== ''

  render() {
    const { form, loading, editData } = this.props;
    const { getFieldProps } = form;

    return (
      <Page title="其他预订设置" id="setting">
        <Form>
          <ShopSelectFormItem form={form} onChange={this.onShopChange}
            style={{ marginBottom: 24 }} />

          <Block title="预订通知">
            <FormItem label="通知类型" {...formItemLayout}>
              <div>接单、预订成功通知、预订取消通知</div>
            </FormItem>
            <FormItem label="通知渠道" {...formItemLayout}>
              <div>商家中心弹窗提示、电话通知</div>
            </FormItem>
            <FormItem required extra={Help({ fieldName: 'noticePhone' })} label="接收通知电话" {...formItemLayout}>
              <Input className="notice-phone" {...getFieldProps('noticePhone', {
                initialValue: editData.noticePhone,
                rules: [this.telValiator],
              })} placeholder="请输入" />
            </FormItem>
            <FormItem required extra={Help({ fieldName: 'needNotice' })} label="接收通知开关" {...formItemLayout}>
              <Switch checkedChildren="开" unCheckedChildren="关" {...getFieldProps('needNotice', {
                initialValue: this.notNull(editData.needNotice) ? editData.needNotice : true,
                valuePropName: 'checked',
              })} />
            </FormItem>
          </Block>

          <Block title="商家人工接单时间">
            <FormItem required extra={Help({ fieldName: 'setTime' })} label="设置时间点" {...formItemLayout}>
              <Select className="set-time" showSearch {...getFieldProps('orderStartTime', {
                initialValue: editData.orderStartTime || '00:00|CURRENT_DAY',
                rules: [{ required: true, message: '请选择开始时间' }],
              })}>
                {startTimeOptions}
              </Select>
              <span className="split-time">~</span>
              <span>次日&nbsp;</span>
              <Select className="set-time" showSearch {...getFieldProps('orderEndTime', {
                initialValue: editData.orderEndTime || '00:00|NEXT_DAY',
                rules: [{ required: true, message: '请选择结束时间' }],
              })}>
                {endTimeOptions}
              </Select>
            </FormItem>
          </Block>

          <Block title="提前预订时间">
            <FormItem required extra={Help({ fieldName: 'timeOut' })} label="提前预订时间" {...formItemLayout}>
              <Select className="set-time" {...getFieldProps('timeOut', {
                initialValue: editData.timeOut || '15',
                rules: [{ required: true, message: '请选择提前预订时间' }],
              })} placeholder="请选择">
                <Option key="15">15分钟</Option>
                <Option key="30">30分钟</Option>
                <Option key="60">1个小时</Option>
                <Option key="120">2个小时</Option>
              </Select>
            </FormItem>
          </Block>

          <Button className="btn-commit" type="primary" size="large" onClick={this.handleSubmit} loading={loading}>提交</Button>
        </Form>
      </Page>
    );
  }
}
