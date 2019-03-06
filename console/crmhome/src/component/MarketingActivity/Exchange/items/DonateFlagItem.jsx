import React from 'react';
import { Form, Radio } from 'antd';
import FormItemBase from './FormItemBase';
const RadioGroup = Radio.Group;

const FormItem = Form.Item;
const FIELD_NAME = 'donateFlag';

class DonateFlagItem extends FormItemBase {
  static displayName = 'exchange-receive-limited';
  constructor(props, ctx) {
    super(props, ctx);
  }
  static fieldName = FIELD_NAME;
  get initialValue() {
    return this.props.initialData && this.props.initialData[FIELD_NAME] || undefined;
  }
  render() {
    const { getFieldProps } = this.props.form;
    const { isEdit, isOnline, initialData = {}} = this.props;
    return (
      <FormItem
        label="是否可以转赠："
        {...this.itemLayout}>
        {
          isEdit ? <p className="ant-form-text">{initialData.donateFlag === '1' ? '是' : '否'}</p> :
          <RadioGroup disabled={isOnline} {...getFieldProps('donateFlag', {
            initialValue: this.initialValue,
            rules: [{
              required: true,
              message: '是否可以转赠为必选项',
            }],
          })}>
            <Radio value="1">是</Radio>
            <Radio value="0">否</Radio>
          </RadioGroup>
        }
      </FormItem>
    );
  }
}

export default DonateFlagItem;
