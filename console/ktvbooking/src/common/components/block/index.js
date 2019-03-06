import React from 'react';
import { node, string } from 'prop-types';

import './style.less';

export default function Block(props) {
  const { title, subtitle, children, className } = props;
  return (
    <div className={`c-block ${className || ''}`}>
      <h3 className="c-block-title">
        <i className="c-block-icon" />
        <div className="c-block-txt">{title}</div>
        {subtitle && <div className="c-block-subtext">{subtitle}</div>}
      </h3>
      {children && <div className="c-block-body">{children}</div>}
    </div>
  );
}

Block.propTypes = {
  title: node.isRequired, // 标题
  subtitle: node, // 子标题
  children: node, // 内容
  className: string,
};
