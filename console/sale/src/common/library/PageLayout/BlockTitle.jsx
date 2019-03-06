import React from 'react';

const BlockTitle = props => {
  const { title, style } = props;
  return (
    <h3 className="kb-form-sub-title" style={style}>
      <div className="kb-form-sub-title-icon"></div>
      <span className="kb-form-sub-title-text">{title}</span>
      <div className="kb-form-sub-title-line"></div>
    </h3>
  );
};

BlockTitle.defaultProps = {
  title: '',
  style: {}
};

export default BlockTitle;
