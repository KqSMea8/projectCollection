import React, { PureComponent } from 'react';
import { List } from '@alipay/qingtai';
import PropTypes from 'prop-types';
import { openPage } from '@alipay/kb-m-biz-util';
import '../style.less';

/* eslint-disable */
export default class extends PureComponent {
  static propTypes = {
    merchantId: PropTypes.string,
    dispatch: PropTypes.func,
    value: PropTypes.string,
    onChange: PropTypes.func,
  };
  componentWillReceiveProps(next) {
    if (next.merchantId !== this.props.merchantId) {
      this.props.onChange(null);
      if (next.merchantId) {
        next.dispatch({
          type: 'getMerchantDigitalFeedback',
          payload: { merchantId: next.merchantId },
        });
      }
    }
  }
  // 判断拜访商户有没有选择 没有选择的话不能进入
  onClick = e => {
    e.stopPropagation();
    const { onChange, merchantId, value } = this.props;
    if (!merchantId) {
      kBridge.call('showToast', '请先选择拜访商户');
      return;
    }
    openPage(
      {
        url: 'digital-feedback-page.html',
        data: {
          value: JSON.stringify(value || {}),
        },
      },
      onChange
    );
  };
  render() {
    const count = Object.values(this.props.value || {}).filter(v => v).length;
    const color =
      count > 0 && count < 22 ? 'red' : count === 0 ? '#666' : '#333';
    const extra = (
      <span className="hint-choose" style={{ color }}>
        {count}
        <span style={{ color: '#333' }}>/22</span>
      </span>
    );
    return (
      <List.Item
        extra={extra}
        onClick={this.onClick}
        wrap
        arrow="horizontal"
        className="visit-object-item"
      >
        数字化程度反馈
      </List.Item>
    );
  }
}
