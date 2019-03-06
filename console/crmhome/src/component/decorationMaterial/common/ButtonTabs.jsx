import React, {PropTypes} from 'react';
import {Button} from 'antd';

const ButtonGroup = Button.Group;

const ButtonTabs = React.createClass({
  propTypes: {
    activeKey: PropTypes.string,
    onChange: PropTypes.func,
    children: PropTypes.any,
  },
  getDefaultProps() {
    return {
      onChange() {},
    };
  },
  getInitialState() {
    const {props} = this;
    let key = '';
    if ('activeKey' in props && props.activeKey !== '') {
      key = props.activeKey;
    } else {
      React.Children.forEach(props.children, (v) => {
        if (!key) key = v.key;
      });
    }
    return {
      curKey: key,
    };
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.activeKey !== this.props.activeKey) {
      this.setState({
        curKey: nextProps.activeKey,
      });
    }
  },
  onTabChange(key) {
    const {onChange} = this.props;
    this.setState({
      curKey: key,
    });
    onChange(key);
  },
  render() {
    const {children} = this.props;
    const {curKey} = this.state;
    const buttons = React.Children.map(children, (v) => {
      return <Button type={curKey === v.key ? 'primary' : 'ghost'} onClick={() => this.onTabChange(v.key)}>{v.props.tab}</Button>;
    });
    const content = [];
    React.Children.forEach(children, (v) => {
      if (curKey === v.key) content.push(v);
    });
    return (<div className="button-tabs">
      <div className="button-tabs-nav">
        <ButtonGroup>{buttons}</ButtonGroup>
      </div>
      <div className="button-tabs-content">
        {content}
      </div>
    </div>);
  },
});

const TabPane = React.createClass({
  propTypes: {
    tab: PropTypes.string,
    key: PropTypes.string,
    children: PropTypes.element,
  },
  render() {
    const {children} = this.props;
    return (<div>
      {children}
    </div>);
  },
});

ButtonTabs.TabPane = TabPane;

export default ButtonTabs;
