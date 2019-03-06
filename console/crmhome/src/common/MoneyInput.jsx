import React from 'react';
import {InputNumber} from 'antd';

/**
 * 通用表单项，金额输入框
 */

const MoneyInput = React.createClass({
  render() {
    const {min = 0.01, step = 0.01, size = 'large'} = this.props;
    const props = { ...this.props, min, step, size };

    return (<InputNumber {...props} />);
  },
});

export default MoneyInput;
