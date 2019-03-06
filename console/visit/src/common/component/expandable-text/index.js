import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@alipay/qingtai';

import './index.less';

const { string, bool } = PropTypes;

export default class extends PureComponent {
  static propTypes = {
    text: string,
    type: string,
    btnText: string,
    collect: bool, // 展示收起
  };

  static defaultProps = {
    type: 'simple',
    btnText: '查看全文',
    collect: true,
  };

  state = {
    expanded: false,
  };

  triggerExpand = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const { text = '', type, btnText, collect } = this.props;
    const { expanded } = this.state;
    if (text.length < 100 || expanded) {
      return (
        <div className="expandable-text">
          {text}
          {collect && text.length >= 100 && <a className="simple-btn" onClick={this.triggerExpand}>收起</a>}
        </div>
      );
    }
    return (
      <div className="expandable-text">
        {text.slice(0, 100)}...
        {type === 'simple' ? (
          <a className="simple-btn" onClick={this.triggerExpand}>{btnText}</a>
        ) : (
          <Button onClick={this.triggerExpand}>{btnText}</Button>
        )}
      </div>
    );
  }
}
