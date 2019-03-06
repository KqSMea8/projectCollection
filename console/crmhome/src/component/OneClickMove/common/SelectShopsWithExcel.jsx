import React, { PropTypes } from 'react';
import { Form } from 'antd';
import { pick } from 'lodash';
import BaseFormComponent from './BaseFormComponent';
import SelectShopsExcel from './SelectShops/SelectShopsExcel';

const FormItem = Form.Item;

export default class SelectShopsAsync extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    defaultValue: PropTypes.array.isRequired,
    canReduce: PropTypes.bool,
    isEdit: PropTypes.bool,
    needCheckShop: PropTypes.bool,
  }
  static defaultProps = {
    ...BaseFormComponent.defaultProps,
    label: '适用门店',
    rules: [],
    defaultValue: [],
    canReduce: true,
    isEdit: undefined,
    needCheckShop: false,
  }

  onUpload = logId => {
    this.form.setFieldsValue({
      logId,
      shopType: 'upload',
      shopIds: [],
    });
  }

  checkShop = (rule, value, callback) => {
    const { shopType, logId } = this.form.getFieldsValue();
    if (shopType === 'select' && (value === undefined || value.length === 0)) {
      return callback('至少选择一家门店');
    }
    if (shopType === 'upload' && !logId) {
      return callback('至少选择一家门店');
    }
    callback();
  };

  render() {
    const { field, defaultValue, canReduce, rules = [], isEdit } = this.props;
    const { getFieldProps, getFieldError } = this.form;
    const fieldProps = getFieldProps(field, {
      rules: [...rules, this.checkShop],
    }); // 不可把 fieldProps 部分放入 jsx 中，因为这里摈弃了 ref，避免误删除字段
    const formItemProps = pick(this.props, ['label', 'labelCol', 'wrapperCol', 'help', 'extra', 'required']);
    const error = getFieldError(field);
    return (
      <FormItem
        {...formItemProps}
        validateStatus={error ? 'error' : 'success'}
        help={error || undefined}
      >
        <SelectShopsExcel
          activeKey={this.form.getFieldValue('shopType') || 'select'}
          selectedShops={defaultValue}
          isEdit={isEdit}
          canReduce={canReduce}
          onChange={v => {
            fieldProps.onChange(v.map(d => d.id));
            this.form.setFieldsValue({ logId: null });
          }}
          needCheckShop={this.props.needCheckShop}
          onUpload={this.onUpload}
        />
        <input type="hidden" {...getFieldProps('logId', { initialValue: '' }) } />
        <input type="hidden" {...getFieldProps('shopType', { initialValue: 'select' }) } />
      </FormItem>
    );
  }
}
