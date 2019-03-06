import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { List } from '@alipay/qingtai';
import { openPage } from '@alipay/kb-m-biz-util';

export default class extends PureComponent {
  static propTypes = {
    value: PropTypes.array, // [{ name, value, id }]
    onChange: PropTypes.func,
  };

  onClick = (e) => {
    e.stopPropagation();
    const { value, onChange } = this.props;
    openPage({
      url: 'tka-visit-add-visit-result.html',
      data: {
        data: JSON.stringify(value),
      },
    }, onChange);
  };

  render() {
    const { value } = this.props;
    const extra = (value && value.map(i => i.name).join('、')) || <span className="hint-choose">必填</span>;

    return (<List.Item extra={extra} onClick={this.onClick} wrap arrow="horizontal"
      className="visit-result-item">
      拜访结果
            </List.Item>);
  }
}
