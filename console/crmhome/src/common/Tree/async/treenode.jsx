import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

const TRUE = 1;
const FALSE = 0;
const INDETERMINATE = -1;
const NOOP = -1;

class TreeNode extends Component {
  static propTypes = {
    expandState: PropTypes.any,
    checkState: PropTypes.any,
    disableState: PropTypes.any,
    onExpand: PropTypes.func,
    onCheck: PropTypes.func,
    content: PropTypes.any,
  };

  shouldComponentUpdate(props) {
    const keys = ['checkState', 'disableState', 'expandState'];
    return keys.some((key) => {
      return props[key] !== this.props[key];
    });
  }

  renderCheckbox() {
    const { checkState, disableState } = this.props;
    const checkboxCls = {
      checkbox: true,
      'checkbox-checked': checkState === TRUE,
      'checkbox-indeterminate': checkState === INDETERMINATE,
      'checkbox-disabled': disableState === TRUE,
    };
    return (
      <span className = { classNames(checkboxCls) } />
    );
  }

  renderSwitcher() {
    const { expandState, onExpand } = this.props;
    const switcherCls = {
      'ant-tree-switcher': true,
      'ant-tree-center_open': expandState === TRUE,
      'ant-tree-noline_close': expandState === FALSE,
      'ant-tree-switcher-noop': expandState === NOOP,
    };
    return expandState === NOOP ?
      (<span className = { classNames(switcherCls) } />)
      :
      (<span className = { classNames(switcherCls) } onClick = { onExpand } />);
  }

  render() {
    const { content, onCheck, disableState } = this.props;
    const nodeCls = {
      'tree-node': true,
      'tree-node-disabled': disableState === TRUE,
    };
    return (
      <div className = { classNames(nodeCls) }>
        { this.renderSwitcher() }
        {
          disableState === TRUE ?
            (<div className = "tree-node-text">{ this.renderCheckbox() }{ content }</div>)
            :
            (<div className = "tree-node-text" onClick = {onCheck}>{ this.renderCheckbox() }{ content }</div>)
        }
      </div>
    );
  }
}

export default TreeNode;

