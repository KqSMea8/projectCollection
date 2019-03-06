import Tree from 'hermes-treeselect';
import React, {PropTypes} from 'react';
import {Modal} from 'antd';

const ShopModal = React.createClass({
  propTypes: {
    onCancel: PropTypes.func,
    onChange: PropTypes.func,
    visible: PropTypes.bool,
    treeData: PropTypes.array,
    previousShopID: PropTypes.array,
    shopInfos: PropTypes.array,
  },

  getInitialState() {
    this.checked = [];
    this.status = false;
    return null;
  },

  onChange(model) {
    this.checked = model.checked().map(item => model.database[item]);
    this.status = true;
  },

  onOk() {
    const {shopInfos} = this.props;
    if (this.status === false) {
      if (shopInfos && this.checked.length === 0) {
        this.checked = shopInfos;
      }
    } else {
      this.props.onChange(this.checked);
    }
    this.props.onCancel();
  },

  nodeText(node, isResult) {
    const {name, $$count, $$checkedLeafCount, $$leafCount} = node;
    let rtn;
    if (isResult) {
      rtn = (<span>{$$count === 0 ? `${name}` : `${name} (${$$checkedLeafCount})`}</span>);
    } else {
      rtn = (<span>{$$count === 0 ? `${name}` : `${name} (${$$leafCount})`}</span>);
    }
    return rtn;
  },

  render() {
    const {onCancel, treeData, previousShopID} = this.props;
    return (<Modal visible={this.props.visible} onOk={this.onOk} onCancel={onCancel} title="选择门店" width="700px">
      <Tree
        onChange={(...args) => { this.onChange(...args); }}
        treeData={treeData}
        nodeText = {this.nodeText}
        checked={previousShopID}
      />
    </Modal>);
  },
});

export default ShopModal;
