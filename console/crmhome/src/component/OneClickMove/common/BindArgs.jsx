import React from 'react';

export default function BindArgs(props) {
  const { children, targets, ...otherProps } = props;
  const el = React.Children.only(props.children);
  const needInjectProps = targets.reduce((rtn, c) => {
    if (typeof el.props[c] === 'function') {
      rtn[c] = (...args) => {
        el.props[c](otherProps, ...args);
      };
    }
    return rtn;
  }, {});
  return React.cloneElement(React.Children.only(props.children), needInjectProps);
}
