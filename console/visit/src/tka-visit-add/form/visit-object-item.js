import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { List } from '@alipay/qingtai';
import { openPage } from '@alipay/kb-m-biz-util';

export default class extends PureComponent {
  static propTypes = {
    value: PropTypes.array, // [{ name, job, id, phone }]
    onChange: PropTypes.func,
    merchantId: PropTypes.string, // 当前选中的商户
  };

  onClick = (e) => {
    e.stopPropagation();
    const { value, onChange, merchantId } = this.props;
    if (!merchantId) {
      kBridge.call('showToast', '请先选择拜访商户');
      return;
    }
    openPage({
      url: 'tka-visit-add-visit-object.html',
      data: {
        data: JSON.stringify(value),
        merchantId,
      },
    }, onChange);
  };

  getFormatText() {
    const { value } = this.props;
    if (value && value.length > 0) {
      const jobs = {};
      value.forEach(i => { jobs[i.job] = true; });
      return Object.keys(jobs).join('、');
    }
    return null;
  }

  render() {
    const extra = this.getFormatText() || <span className="hint-choose">必填</span>;

    return (<List.Item extra={extra} onClick={this.onClick} wrap arrow="horizontal"
      className="visit-object-item">
      拜访对象
            </List.Item>);
  }
}
