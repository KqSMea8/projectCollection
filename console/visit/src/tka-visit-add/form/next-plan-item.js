import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { List } from '@alipay/qingtai';
import { openPage } from '@alipay/kb-m-biz-util';

export default class extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
  };

  onClick = (e) => {
    e.stopPropagation();
    const { value, onChange } = this.props;
    openPage({
      url: 'tka-visit-add-next-plan.html',
      data: { value },
    }, onChange);
  };

  render() {
    const extra = this.props.value || <span className="hint-choose">必填</span>;

    return (<List.Item extra={extra} onClick={this.onClick} arrow="horizontal"
      className="next-plan-item">
      下一步计划
            </List.Item>);
  }
}
