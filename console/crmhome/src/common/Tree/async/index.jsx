import '../index.css';
import React, { Component } from 'react';
import RightModel from '../async/rightmodel.jsx';
import LeftModel from '../async/leftmodel.jsx';
import Node from './treenode.jsx';
import { Row, Col, Icon, Spin } from 'antd';
import { cloneDeep, filter, includes, uniq, without, noop } from 'lodash';
import classNames from 'classnames';

const TRUE = 1;
const FALSE = 0;
const INDETERMINATE = -1;
const NOOP = -1;

const DEFAULT_NODE_TEXT = (node) => node.name;

class Tree extends Component {
  static defaultProps = {
    onExpand: noop,
    onCheck: noop,
    onChange: noop,
    checked: [],
    disabled: [],
    showCheckAll: true,
    nodeText: DEFAULT_NODE_TEXT,
  };

  constructor(props) {
    super(props);
    const { rightData, leftData, checked, fetch } = props;
    this.disabled = props.disabled;
    this.rightModel = new RightModel({ source: rightData });
    this.leftModel = new LeftModel({ source: leftData, fetch });
    this.state = {
      leftExpandKey: [],
      rightExpandKey: [],
      fetching: true,
      checked,
    };
  }

  componentDidMount() {
    const { leftModel, rightModel } = this;
    leftModel.fetch('#').then(() => {
      rightModel.addChildren(leftModel.toJSON(), '#');
      this.setState({
        fetching: false,
      });
    });
  }

  componentWillReceiveProps(props) {
    const { leftData, rightData, checked, disabled, fetch } = props;
    if (disabled !== this.props.disabled) {
      this.disabled = disabled;
    }
    if (rightData !== this.props.rightData && leftData !== this.props.leftData) {
      this.leftModel = new LeftModel({ source: leftData, fetch });
      this.rightModel = new RightModel({ source: rightData });
      this.setState({ fetching: true });
      this.leftModel.fetch('#').then(() => {
        this.rightModel.addChildren(this.leftModel.toJSON(), '#');
        this.setState({
          fetching: false,
          leftExpandKey: [],
          checked,
        });
      });
    } else {
      if (leftData !== this.props.leftData) {
        this.leftModel = new LeftModel({ source: leftData, fetch });
        this.setState({ fetching: true });
        this.leftModel.fetch('#').then(() => {
          this.rightModel.addChildren(this.leftModel.toJSON(), '#');
          this.setState({
            fetching: false,
            leftExpandKey: [],
            checked,
          });
        });
      }
      if (rightData !== this.props.rightData) {
        this.rightModel = new RightModel({ source: rightData });
        this.rightModel.addChildren(this.leftModel.toJSON());
        this.setState({
          checked,
        });
      }
    }
  }

  onCheck(id, isRight) {
    const { leftModel, rightModel } = this;
    const { onCheck, onChange } = this.props;
    const { checked, rightExpandKey } = this.state;
    if (!isRight) {
      let method = 'uncheck';
      if (this.checkState(id) === FALSE) {
        method = 'check';
      }
      if (method === 'check') {
        if (leftModel.needFetch(id, true)) {
          this.setState({
            fetching: true,
          });
        }
        leftModel.fetch(id, true).then(() => {
          rightModel.addChildren(leftModel.toJSON(), '#');
          const lids = leftModel.lids(id);
          const dlids = leftModel.dlids(id);
          this.disabled = uniq(this.disabled.concat(dlids));
          const checkedLids = filter(lids, (item) => {
            let rtn = false;
            if (!includes(this.disabled, item)) {
              rtn = true;
            }
            return rtn;
          });
          const newChecked = uniq(checked.concat(checkedLids));
          this.setState({
            checked: newChecked,
            fetching: false,
          });
          onCheck(id);
          onChange(newChecked, rightModel);
        });
      } else {
        const lids = leftModel.lids(id).filter((cid) => {
          return !includes(this.disabled, cid);
        });
        const newChecked = checked.filter((cid) => {
          return !includes(lids, cid);
        });
        if (includes(rightExpandKey, id)) {
          this.setState({
            rightExpandKey: without(rightExpandKey, id),
            fetching: false,
          });
        }
        this.setState({
          checked: newChecked,
        });
        onCheck(id);
        onChange(newChecked, rightModel);
      }
    } else {
      let newChecked;
      if (rightModel.isLeaf(id)) {
        newChecked = without(checked, id);
      } else {
        const lids = rightModel.lids(id).filter((cid) => {
          return !includes(this.disabled, cid);
        });
        newChecked = checked.filter((cid) => {
          return !includes(lids, cid);
        });
      }
      if (includes(rightExpandKey, id)) {
        this.setState({
          rightExpandKey: without(rightExpandKey, id),
          fetching: false,
        });
      }
      this.setState({
        checked: newChecked,
      });
      onCheck(id);
      onChange(newChecked, rightModel);
    }
  }

  onExpand(id, isRight = false) {
    const { onExpand } = this.props;
    const { leftModel } = this;
    const { leftExpandKey, rightExpandKey } = this.state;
    if (!isRight) {
      if (leftModel.needFetch(id)) {
        this.setState({
          fetching: true,
        });
      }
      leftModel.fetch(id).then(() => {
        const dlids = leftModel.dlids(id);
        this.disabled = uniq(this.disabled.concat(dlids));
        onExpand(id);
        if (includes(leftExpandKey, id)) {
          this.setState({
            leftExpandKey: without(leftExpandKey, id),
            fetching: false,
          });
        } else {
          this.setState({
            leftExpandKey: [...leftExpandKey, id],
            fetching: false,
          });
        }
      });
    } else {
      if (includes(rightExpandKey, id)) {
        this.setState({
          rightExpandKey: without(rightExpandKey, id),
          fetching: false,
        });
      } else {
        this.setState({
          rightExpandKey: [...rightExpandKey, id],
          fetching: false,
        });
      }
    }
  }

  getRoot() {
    const nodeProps = {};
    nodeProps.expandState = NOOP;
    nodeProps.checkState = this.checkState('#');
    nodeProps.disableState = this.disableState('#');
    nodeProps.content = '全选';
    const onCheck = this.onCheck.bind(this, '#', false);
    const node = (<Node {...{ ...nodeProps, onCheck }} />);
    return node;
  }

  getNode(id, isRight) {
    let rtn = '';
    const { nodeText } = this.props;
    const { leftModel, rightModel } = this;
    const { leftExpandKey, rightExpandKey } = this.state;
    const nodeProps = {};
    if (isRight) {
      const data = rightModel.get(id);
      const _state = includes(rightExpandKey, id) ? TRUE : FALSE;
      nodeProps.expandState = data.count > 0 ? _state : NOOP;
      nodeProps.checkState = TRUE;
      nodeProps.disableState = this.disableState(id, true);
      nodeProps.content = nodeText(cloneDeep(data), isRight);
    } else {
      const data = leftModel.get(id);
      const _state = includes(leftExpandKey, id) ? TRUE : FALSE;
      nodeProps.expandState = data.count > 0 ? _state : NOOP;
      nodeProps.checkState = this.checkState(id);
      nodeProps.disableState = this.disableState(id);
      nodeProps.content = nodeText(cloneDeep(data));
    }
    const onCheck = this.onCheck.bind(this, id, isRight);
    const onExpand = this.onExpand.bind(this, id, isRight);
    const node = (<Node {...{ ...nodeProps, onCheck, onExpand }} />);
    if (nodeProps.expandState === TRUE) {
      rtn = (<li key={ id }>{ node }{ this.renderChildren(id, isRight) }</li>);
    } else {
      rtn = (<li key={ id }>{ node }</li>);
    }
    return rtn;
  }

  checkState(id, isRight = false) {
    const { leftModel, rightModel } = this;
    const { checked } = this.state;
    let lids;
    if (isRight) {
      lids = rightModel.lids(id);
    } else {
      lids = leftModel.lids(id);
    }
    let $$state = FALSE;
    if (lids && lids.length > 0) {
      $$state = INDETERMINATE;
      const allIsTrue = lids.every((lid) => {
        return includes(checked, lid);
      });
      const allIsFalse = lids.every((lid) => {
        return !includes(checked, lid);
      });
      if (allIsTrue && leftModel.allFetched(id)) {
        $$state = TRUE;
      }
      if (allIsFalse) {
        $$state = FALSE;
      }
    }
    return $$state;
  }

  disableState(id, isRight) {
    const { leftModel, rightModel } = this;
    const { checked } = this.state;
    let lids;
    if (isRight) {
      lids = rightModel.lids(id).filter((cid) => {
        return includes(checked, cid);
      });
    } else {
      lids = leftModel.lids(id);
    }
    let $$state = FALSE;
    if (lids && lids.length > 0) {
      $$state = INDETERMINATE;
      const allIsTrue = lids.every((lid) => {
        return includes(this.disabled, lid);
      });
      const allIsFalse = lids.every((lid) => {
        return !includes(this.disabled, lid);
      });
      if (allIsTrue) {
        $$state = TRUE;
      }
      if (allIsFalse) {
        $$state = FALSE;
      }
    }
    return $$state;
  }

  renderChildren(id, isRight = false) {
    const { leftModel, rightModel } = this;
    let cids = [];
    let isLeaf = true;
    if (!isRight) {
      cids = leftModel.cids(id);
      isLeaf = leftModel.isLeaf(id);
    } else {
      cids = rightModel.cids(id).filter((cid) => {
        return this.checkState(cid, true) !== FALSE;
      });
      isLeaf = rightModel.isLeaf(id);
    }
    const treeCls = {
      'ant-tree': id === '#',
      'ant-tree-child-tree': id !== '#',
      'ant-tree-child-tree-open': id !== '#',
    };
    return isLeaf ? '' : (
      <ul className={ classNames(treeCls) }>
        {
          cids.map((cid) => {
            return this.getNode(cid, isRight);
          })
        }
      </ul>
    );
  }

  render() {
    const { leftModel } = this;
    const { showCheckAll } = this.props;
    const { checked, fetching } = this.state;
    const { notFound, onlyLeft } = this.props;
    const notFoundContent = notFound ? notFound() : (
      <div className="not-leaf">
        <Icon type="meh" /> Not Found
      </div>
    );
    const left = (
      <div className="node-container">
        <div className="header">
          {showCheckAll ? this.getRoot() : false}
          <span style={{ verticalAlign: 16 }}>共 {leftModel.totalLeafCount()}</span>
        </div>
        <Spin spinning={fetching}>
          <div className="content">
            { leftModel.cids('#').length === 0 ? notFoundContent : this.renderChildren('#')}
          </div>
        </Spin>
      </div>
    );
    let right = false;
    if (!onlyLeft) {
      right = (
        <div className="node-container">
          <div className="header" style={{ paddingLeft: 25 }}>已选 {checked.length}</div>
          <div className="content">
            { this.renderChildren('#', true) }
          </div>
        </div>
      );
    }
    return onlyLeft ? left : (
      <Row>
        <Col span="12" style={{ paddingRight: 4 }}>
          {left}
        </Col>
        <Col span="12" style={{ paddingLeft: 4 }}>
          {right}
        </Col>
      </Row>
    );
  }
}

export default Tree;
