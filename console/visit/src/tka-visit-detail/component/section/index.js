import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './index.less';

const { string, node, func } = PropTypes;

export default class extends PureComponent {
  static propTypes = {
    className: string,
    title: string,
    children: node,
    onClick: func,
  };

  render() {
    const { className = '', title, children, onClick } = this.props;
    return (
      <div className={`section ${className}`} onClick={onClick}>
        {title && <div className="section-title">{title}</div>}
        <div className="section-content">{children}</div>
      </div>
    );
  }
}
