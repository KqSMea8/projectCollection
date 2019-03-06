import React, {PropTypes} from 'react';
import { Form } from 'antd';
import { pick } from 'lodash';
import BaseFormComponent from './BaseFormComponent';
import CommonSelectShops from './SelectShops/index';

const FormItem = Form.Item;

const checkShop = (rule, value, callback) => {
  if (value === undefined || value.length === 0) {
    return callback('至少选择一家门店');
  }
  callback();
};

export default class SelectShopsAsync extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    defaultValue: PropTypes.array.isRequired,
    shop: PropTypes.array,
    canReduce: PropTypes.bool,
    isEdit: PropTypes.bool,
    needCheckShop: PropTypes.bool,
    intelligentLock: PropTypes.bool,
  }
  static defaultProps = {
    ...BaseFormComponent.defaultProps,
    label: '适用门店',
    rules: [],
    defaultValue: [],
    canReduce: true,
    isEdit: undefined,
    needCheckShop: false,
    intelligentLock: false,
    shop: [],
  }

  get isEdit() {
    const value = this.form.getFieldValue(this.props.field);
    return value && value.length > 0;
  }

  render() {
    const { field, defaultValue, canReduce, rules, shop, intelligentLock } = this.props;
    const { getFieldProps, getFieldError } = this.form;
    const fieldProps = getFieldProps(field, {
      rules: [...rules, checkShop],
    });
    const formItemProps = pick(this.props, ['label', 'labelCol', 'wrapperCol', 'help', 'extra', 'required']);
    const error = getFieldError(field);
    return (
      <FormItem
        {...formItemProps}
        validateStatus={error ? 'error' : 'success'}
        help={error || undefined}
      >
        <CommonSelectShops
          selectedShops={defaultValue}
          isEdit={this.props.isEdit === undefined ? this.isEdit : this.props.isEdit}
          canReduce={canReduce}
          onChange={v => fieldProps.onChange(v.map(d => d.id))}
          needCheckShop={this.props.needCheckShop}
          shop={shop}
          intelligentLock={intelligentLock}
        />
      </FormItem>
    );
  }
}
