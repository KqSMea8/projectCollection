import React from 'react';
import { Form } from 'antd';
import FormItemBase from './FormItemBase';
import classnames from 'classnames';
import SelectShops from '../../../../common/SelectShops';

const FormItem = Form.Item;
const FIELD_NAME = 'shop';

class SelectShopsItem extends FormItemBase {
  static displayName = 'exchange-select-shops';
  static propTypes = {
    isEdit: React.PropTypes.bool,
    canReduce: React.PropTypes.bool,
  }
  static defaultProps = {
    isEdit: false,
    canReduce: false,
  }
  static fieldName = FIELD_NAME;
  checkShop = (rule, value, callback) => {
    if (value === undefined || value.length === 0) {
      return callback('至少选择一家门店');
    }
    callback();
  }

  get initialValue() {
    return this.props.initialData[FIELD_NAME];
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    return (
      <FormItem {...this.itemLayout}
        label="活动门店："
        required
        validateStatus={classnames({ error: !!getFieldError(FIELD_NAME) })}
        help={getFieldError(FIELD_NAME)}
      >
        <SelectShops
          selectedShops={this.initialValue}
          isEdit={this.props.isEdit}
          canReduce={this.props.canReduce}
          {...getFieldProps(FIELD_NAME, {
            rules: [this.checkShop],
          }) }
        />
      </FormItem>
    );
  }
}

export default SelectShopsItem;
