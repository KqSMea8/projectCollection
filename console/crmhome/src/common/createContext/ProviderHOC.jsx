import React, { PropTypes } from 'react';
import consumerHOC from './ConsumerHOC';

let keyUUID = 0;

export default (defaultValue) => {
  let uuid = 0;
  function getUUID() {
    return uuid++;
  }

  const ctxName = `__ctx_value__${keyUUID++}`;
  return class ContextProvider extends React.Component {
    static defaultProps = {
      value: defaultValue,
    }

    static childContextTypes = {
      [ctxName]: PropTypes.any,
      [`${ctxName}_register`]: PropTypes.func,
    }

    static createConsumer = () => {
      return consumerHOC(ctxName, defaultValue);
    }

    constructor(props) {
      super(props);
      this._observers = {};
      this.initalValue = props.value;
    }

    getChildContext() {
      return {
        [ctxName]: this.props.value, // 通过 1 标记 consumer 是否在 provider 作用域内
        [`${ctxName}_register`]: this.register,
      };
    }

    shouldComponentUpdate(nextProps) {
      return nextProps !== this.props;
    }

    componentDidUpdate() {
      this.flush();
    }

    register = consumer => {
      const key = getUUID();
      this._observers[key] = consumer;
      return () => {
        delete this._observers[key];
      };
    }

    flush() {
      for (const i in this._observers) {
        if (this._observers.hasOwnProperty(i)) {
          try {
            this._observers[i].forceUpdate();
          } catch (_) {
            void 0;
          }
        }
      }
    }

    render() {
      return <div>{this.props.children}</div>;
    }
  };
};
