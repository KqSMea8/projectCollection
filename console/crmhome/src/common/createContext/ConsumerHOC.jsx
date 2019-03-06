import React, { PropTypes } from 'react';

export default (ctxName, defaultValue) => class Consumer extends React.Component {
  static contextTypes = {
    [ctxName]: PropTypes.any,
    [`${ctxName}_register`]: PropTypes.func,
  }

  componentDidMount() {
    this.remove = this.context[`${ctxName}_register`](this);
  }

  componentWillUnmount() {
    if (this.remove) {
      this.remove();
    }
  }

  render() {
    // 作用域内使用 provider 接受到的 value，作用域外使用 createContext 时指定的 value
    return this.props.children(ctxName in this.context ? this.context[ctxName] : defaultValue);
  }
};
