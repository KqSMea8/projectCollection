import React from 'react';
import { Form, Checkbox } from 'antd';
import FormItemBase from './FormItemBase';

const FormItem = Form.Item;
const FIELD_NAME = 'renewMode';

class RenewModeItem extends FormItemBase {
  static displayName = 'exchange-renew-mode';   // 自动续期
  onChange = (e) => {
    this.props.form.setFieldsValue({
      [FIELD_NAME]: e.target.checked ? '1' : '0',
    });
  }
  static fieldName = FIELD_NAME;

  get initialValue() {
    return this.props.initialData && this.props.initialData[FIELD_NAME] || '1';
  }

  render() {
    // 券有效期为指定时间时不能自动续期
    if (this.props.form.getFieldValue('validTimeType') === 'FIXED') {
      return null;
    }
    return (
      <FormItem {...this.itemLayout}
        label="自动续期："
        help="上架时间结束时，若未领取完，则自动延期，每次延期 30 天"
      >
        <Checkbox
          disabled={this.isOnline}
          defaultChecked={this.initialValue === '1'}
          onChange={this.onChange}
        /> <span>自动延长上架时间</span>
      </FormItem>
    );
  }
}

export default RenewModeItem;
