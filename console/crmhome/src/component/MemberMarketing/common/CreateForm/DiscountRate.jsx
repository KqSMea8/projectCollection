import React, {PropTypes} from 'react';
import { Form, InputNumber } from 'antd';
import classnames from 'classnames';

const FormItem = Form.Item;

/*
  表单字段 － 折扣力度
*/

const DiscountRate = React.createClass({
  propTypes: {
    form: PropTypes.object,
    layout: PropTypes.object,
    allData: PropTypes.object,
    initData: PropTypes.object,
    roleType: PropTypes.string,
    actionType: PropTypes.string,
  },

  getDefaultProps() {
    return {
      allData: {},
      initData: {},
    };
  },

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const { initData, actionType} = this.props;

    let isDisabled = false;
    if (actionType === 'edit' && initData.displayStatus === 'STARTED') {
      isDisabled = true;
    }

    return (
      <FormItem
        {...this.props.layout}
        required
        label="折扣力度："
        help={getFieldError('rate')}
        validateStatus={
        classnames({
          error: !!getFieldError('rate'),
        })}>
        <InputNumber
          min={1.1}
          max={9.9}
          step={0.1}
          disabled={isDisabled}
          {...getFieldProps('rate', {
            rules: [
              { required: true, type: 'number', message: '请设置折扣力度' },
            ],
            initialValue: initData.rate && Number.parseFloat(initData.rate),
          })} />折
      </FormItem>
    );
  },
});

export default DiscountRate;
