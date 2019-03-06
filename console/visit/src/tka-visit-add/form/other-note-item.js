import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { List } from '@alipay/qingtai';
import { openPage } from '@alipay/kb-m-biz-util';
import './other-note-item.less';

export default class extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
  };

  onClick = (e) => {
    e.stopPropagation();
    const { value, onChange } = this.props;
    openPage({
      url: 'tka-visit-add-other-note.html',
      data: { value },
    }, onChange);
  };

  render() {
    const extra = this.props.value || <span className="hint-choose">商户最新动态, 在竞对的营销/服务情况</span>;

    return (<List.Item className="other-note-item" arrow="horizontal" extra={extra}
      onClick={this.onClick}>
      其他备注
            </List.Item>);
  }
}
