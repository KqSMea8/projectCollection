import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import {pick, isEqual} from 'lodash';
class TreeNode extends Component {
  static propTypes = {
    node: PropTypes.object,
    expand: PropTypes.bool,
    onExpand: PropTypes.func,
    onCheck: PropTypes.func,
    nodeText: PropTypes.func,
  };

  constructor(props) {
    super(props);
  }


  shouldComponentUpdate(props) {
    /**
     * $$path
     * $$checkState
     * $$disableState
     * $$degree
     */
    const expand = {props};
    const keys = ['$$path', '$$checkState', '$$disableState', '$$degree'];
    const now = pick(props.node, keys);
    const prev = pick(this.props.node, keys);
    return !isEqual(now, prev) || expand !== this.props.expand;
  }

  renderCheckbox() {
    const {node} = this.props;
    const {$$checkState, $$disableState} = node;
    const checkboxCls = {
      'checkbox': true,
      'checkbox-checked': $$checkState === 1,
      'checkbox-indeterminate': $$checkState === -1,
      'checkbox-disabled': $$disableState === 1,
    };
    return (
      <span className={classNames(checkboxCls)}/>
    );
  }

  renderSwitcher() {
    const {node, onExpand, expand} = this.props;
    const {$$degree} = node;
    const switcherCls = {
      'ant-tree-switcher': true,
      'ant-tree-center_open': expand && $$degree > 0,
      'ant-tree-noline_close': !expand && $$degree > 0,
      'ant-tree-switcher-noop': $$degree === 0,
    };
    return $$degree === 0 ?
      (<span className={classNames(switcherCls)}/>)
      :
      (<span className={classNames(switcherCls)} onClick={onExpand}/>);
  }

  render() {
    const {node, onCheck, nodeText} = this.props;
    return (
      <div style={{verticalAlign: 'middle'}}>
        {this.renderSwitcher()}
        <span style={{cursor: 'pointer'}}
              onClick={onCheck}>{this.renderCheckbox()}{nodeText(node)}</span>
      </div>
    );
  }
}

export default TreeNode;
