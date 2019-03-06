import React, {PropTypes} from 'react';
import {Form, Select, InputNumber} from 'antd';
import classnames from 'classnames';
import MoneyInput from '../../../../common/MoneyInput';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
};

const UseCondtionFormItem = React.createClass({
  propTypes: {
    form: PropTypes.object,
    data: PropTypes.object,
    isEdit: PropTypes.bool,
    isCampaignStart: PropTypes.bool,
    minMessage: PropTypes.string,
    min: PropTypes.number,
  },

  checkMinConsume(rule, value, callback) {
    this.props.form.validateFields(['conditionsOfUseType'], {force: true});
    callback();
  },

  checkUseType(rule, value, callback) {
    const {form, min, minMessage} = this.props;
    const myType = form.getFieldValue('myType');
    const reduceType = form.getFieldValue('reduceType');
    if (myType === 'ONE_RATE' || reduceType === '2') {
      const minItemNum = form.getFieldValue('minItemNum');
      const maxDiscountItemNum = form.getFieldValue('maxDiscountItemNum');
      if (value === '2' && (minItemNum === undefined || maxDiscountItemNum === undefined)) {
        callback(new Error('请指定使用条件'));
        return;
      }
      callback();
      return;
    }
    const minConsume = form.getFieldValue('minConsume');
    if (value === '2' && minConsume === undefined) {
      callback(new Error('请输入最低消费金额'));
      return;
    }
    if (value === '2' && min && minMessage && parseFloat(minConsume) < parseFloat(min)) {
      callback(new Error(minMessage));
      return;
    }
    callback();
  },

  render() {
    const {data} = this.props;
    const {getFieldProps, getFieldError, getFieldValue} = this.props.form;
    const useType = getFieldValue('conditionsOfUseType');
    const myType = getFieldValue('myType');
    const reduceType = getFieldValue('reduceType');
    const isOnline = this.props.isCampaignStart && this.props.isEdit;
    if (isOnline) {
      if (myType === 'ONE_RATE' || reduceType === '2') {
        return (<FormItem
          label="使用条件："
          required
          {...formItemLayout}>
          <span>{data.conditionsOfUseType === '1' ? '不限制' : '指定使用条件，'}</span>
          <span style={{display: data.conditionsOfUseType === '2' ? 'inline' : 'none'}}>
            同一件商品满{data.minItemNum}件可享受优惠，且该商品最高优惠{data.maxDiscountItemNum}件
          </span>
        </FormItem>);
      }
      return (<FormItem
        label="使用条件："
        required
        {...formItemLayout}>
        <span>{data.conditionsOfUseType === '1' ? '不限制' : '购买指定商品，'}</span>
        <span style={{display: data.conditionsOfUseType === '2' ? 'inline' : 'none'}}>{data.conditionsOfUseType === '1' && '消费'}满{data.minConsume}元可用</span>
      </FormItem>); // 此处review逻辑有问题data.conditionsOfUseType=2是才显示，＝1时指定消费是什么鬼？
    }
    if (myType === 'ONE_RATE' || reduceType === '2') {
      return (<FormItem
        label="使用条件："
        required
        validateStatus={classnames({error: !!getFieldError('conditionsOfUseType')})}
        help={getFieldError('conditionsOfUseType')}
        {...formItemLayout}>
        <Select disabled={!!this.props.isEdit} style={{width: 110, marginRight: 8}} placeholder="请选择" {...getFieldProps('conditionsOfUseType', {
          validateFirst: true,
          rules: [this.checkUseType],
        })}>
          <Option key="1">不限制</Option>
          <Option key="2">指定使用条件</Option>
        </Select>
        <div style={{display: useType === '2' ? 'inline-block' : 'none', verticalAlign: 'bottom', marginTop: 8}}>
          <span className="ant-form-text">同一件商品满</span>
          <InputNumber min={1} step={1} {...getFieldProps('minItemNum', {
            validateFirst: true,
            rules: [this.checkMinConsume],
          })}/>
          <span className="ant-form-text">件可享受优惠，且该商品最高优惠</span>
          <InputNumber min={1} step={1} {...getFieldProps('maxDiscountItemNum', {
            validateFirst: true,
            rules: [this.checkMinConsume],
          })}/>
          <span className="ant-form-text">件</span>
        </div>
      </FormItem>);
    }
    return (<FormItem
      label="使用条件："
      required
      validateStatus={classnames({error: !!getFieldError('conditionsOfUseType')})}
      help={getFieldError('conditionsOfUseType')}
      {...formItemLayout}>
      <Select disabled={!!this.props.isEdit} style={{width: 110, marginRight: 8}} placeholder="请选择" {...getFieldProps('conditionsOfUseType', {
        validateFirst: true,
        rules: [this.checkUseType],
      })}>
        <Option key="1">不限制</Option>
        <Option key="2">设置最低消费</Option>
      </Select>
      <div style={{display: useType === '2' ? 'inline-block' : 'none', verticalAlign: 'bottom'}}>
        <span className="ant-form-text">消费满</span>
        <MoneyInput {...getFieldProps('minConsume', {
          validateFirst: true,
          rules: [this.checkMinConsume],
        })}/>
        <span className="ant-form-text">元可用</span>
      </div>
    </FormItem>);
  },
});

export default UseCondtionFormItem;
