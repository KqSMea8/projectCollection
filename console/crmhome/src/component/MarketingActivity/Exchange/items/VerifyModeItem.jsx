import React from 'react';
import { Form, Radio } from 'antd';
import FormItemBase from './FormItemBase';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const FIELD_NAME = 'verifyMode';    // enums:[USER_CLICK, MERCHANT_SCAN]
const USER_CLICK = 'USER_CLICK';
const MERCHANT_SCAN = 'MERCHANT_SCAN';

class VerifyModeItem extends FormItemBase {
  static displayName = 'exchange-verify-mode';  // 核销方式
  constructor(props, ctx) {
    super(props, ctx);
    this.state = { tipMode: this.initialValue };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.initialData !== this.props.initialData) {
      this.setState({
        tipMode: this.initialValue,
      });
    }
  }
  static fieldName = FIELD_NAME;
  get initialValue() {
    return this.props.initialData && this.props.initialData[FIELD_NAME] || USER_CLICK;
  }
  get tips() {
    return this.state.tipMode === 'MERCHANT_SCAN' ?
      '提示：适用于使用口碑商家APP的商家，可使用口碑商家APP扫用户券码核销兑换券，该核销方式对账更加准确' :
      '提示：用户主动点击券上的“立即使用”按钮核销，可能造成对账不准确情况';
  }
  render() {
    const isEdit = this.props.isEdit;
    const { getFieldProps } = this.props.form;
    return (
      <FormItem {...this.itemLayout}
        label="核销方式"
        required
        help={this.tips}
      >{isEdit && this.initialValue === USER_CLICK && '用户点击核销'}
      {isEdit && this.initialValue === MERCHANT_SCAN && '商家扫码核销'}
      {!isEdit &&
        <RadioGroup {...getFieldProps(FIELD_NAME, { // 券名称
          initialValue: this.initialValue,
          rules: [{
            required: true,
          }],
          onChange: (e) => {
            this.setState({ tipMode: e.target.value });
          },
        }) }
        >
          <Radio key={USER_CLICK} value={USER_CLICK}>用户点击核销</Radio>
          <Radio key={MERCHANT_SCAN} value={MERCHANT_SCAN}>商家扫码核销</Radio>
        </RadioGroup>
      }
      </FormItem>
    );
  }
}

export default VerifyModeItem;
