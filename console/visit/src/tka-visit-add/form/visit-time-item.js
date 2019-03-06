import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { List } from '@alipay/qingtai';

export default class extends PureComponent {
  static propTypes = {
    value: PropTypes.number,
  };

  render() {
    const date = this.props.value ? new Date(this.props.value) : new Date();
    const extra = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    return (<List.Item extra={extra}>
      拜访时间
            </List.Item>);
  }
}
