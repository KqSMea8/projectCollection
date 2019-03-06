import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { List } from '@alipay/qingtai';
import { openPage } from '@alipay/kb-m-biz-util';

export default class extends PureComponent {
  static propTypes = {
    value: PropTypes.object, // { name, id }
    merchantId: PropTypes.string,
    onChange: PropTypes.func,
  };

  onClick = (e) => {
    e.stopPropagation();
    const { value, onChange, merchantId } = this.props;
    if (!merchantId) {
      kBridge.call('showToast', '请先选择拜访商户');
      return;
    }
    openPage({
      url: 'tka-visit-add-visit-sub-company.html',
      data: {
        id: value && value.id,
        merchantId,
      },
    }, onChange);
  };

  render() {
    const { value } = this.props;
    const name = (value && value.name) || <span className="hint-choose">非必填</span>;

    return (<List.Item extra={name} onClick={this.onClick} wrap arrow="horizontal"
      className="visit-sub-company-item">
      拜访分公司
            </List.Item>);
  }
}
