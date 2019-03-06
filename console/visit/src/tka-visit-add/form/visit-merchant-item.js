import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { List } from '@alipay/qingtai';
import { openPage } from '@alipay/kb-m-biz-util';

export default class extends PureComponent {
  static propTypes = {
    value: PropTypes.object, // { name, id }
    onChange: PropTypes.func,
  };

  onClick = (e) => {
    e.stopPropagation();
    const { value, onChange } = this.props;
    openPage({
      url: 'tka-visit-add-visit-merchant.html',
      data: {
        merchantId: value && value.id,
      },
    }, onChange);
  };

  render() {
    const { value } = this.props;
    const name = (value && value.name) || <span className="hint-choose">请选择</span>;

    return (<List.Item extra={name} onClick={this.onClick} arrow="horizontal"
      className="visit-merchant-item">
      拜访商户
            </List.Item>);
  }
}
