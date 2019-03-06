import React from 'react';

export default (props) => {
  return (
    <div className="jui-cut-label fn-mb30 fn-relative" style={props.style}>
      <div className="jui-message-bar">
        {props.children}
      </div>
    </div>
  );
};
