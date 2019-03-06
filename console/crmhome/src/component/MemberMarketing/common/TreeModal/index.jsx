import React from 'react';
import { Modal } from 'antd';
import CoupleTree from '../CoupleTree';
import './style.less';

class TreeModal extends React.Component {
  static propTypes = {
    defaultTreeData: React.PropTypes.array.isRequired,
    defaultCheckedSymbols: React.PropTypes.array.isRequired,
    loadChildren: React.PropTypes.func,

    visible: React.PropTypes.bool.isRequired,
    modalProps: React.PropTypes.object.isRequired,
  }

  static defaultProps = {
    defaultTreeData: [],
    defaultCheckedSymbols: [],
    loadChildren: () => Promise.resolve(),
  }

  constructor(props) {
    super(props);
    const { defaultTreeData, defaultCheckedSymbols } = props;
    this.traverse(defaultTreeData);
    const checkedKeys = defaultCheckedSymbols.map(symbol => this.keys[symbol]);
    this.state = {
      treeData: defaultTreeData,
      checkedKeys,
    };
    this.checkedKeys = checkedKeys;
  }

  componentWillUpdate(nextProps, nextState) {
    const { treeData, checkedKeys } = nextState;
    this.traverse(treeData, checkedKeys);
  }

  onLoadData(treeNode) {
    const { eventKey, children } = treeNode.props;
    const { loadChildren } = this.props;
    const { treeData } = this.state;

    if (children.length) {
      return Promise.resolve();
    }
    let symbol = '';
    Object.keys(this.keys).every(symbol2 => {
      if (this.keys[symbol2] === eventKey) {
        symbol = symbol2;
        return false;
      }
      return true;
    });
    return new Promise(resolve => {
      loadChildren(symbol).then(children2 => {
        if (children2) {
          let subData = treeData;
          const keyArray = eventKey.split('-');
          keyArray.slice(1, -1).map(i => subData = subData[i].children);
          subData[keyArray.pop()].children = children2;
          this.setState({ treeData });
          resolve();
        }
      });
    });
  }

  onCheck(checkedKeys, e) {
    const record = [];
    const keys = checkedKeys.sort().
      filter(key => {
        record.push(key);
        const parentKey = key.split('-').slice(0, -1).join('-');
        if (record.includes(parentKey)) {
          return false;
        }
        return true;
      });
    this.setState({ checkedKeys: keys });
    const { children } = e.node.props;
    if (children) {
      this.onLoadData(e.node);
    }
  }

  onOk() {
    const { checkedKeys, treeData } = this.state;
    const { onOk } = this.props.modalProps;
    const checkedSymbols = [].concat(...checkedKeys.map(key => this.symbols[key]));
    this.checkedKeys = checkedKeys;
    onOk(checkedSymbols, checkedKeys, treeData);
  }

  onCancel() {
    const { onCancel } = this.props.modalProps;
    this.setState({ checkedKeys: this.checkedKeys });
    onCancel();
  }

  traverse(treeData, checkedKeys = [], parentKey = '0') {
    treeData.map((item, i) => {
      const key = `${parentKey}-${i}`;
      const { symbol = key, children } = item;
      if (children) {
        this.traverse(children, checkedKeys, key);
        const childrenSymbols = children.map((child, j) => {
          const key2 = `${key}-${j}`;
          return this.symbols[key2];
        });
        this.symbols[key] = [].concat(...childrenSymbols);
        item.count = children.reduce((prev, child) => prev + child.count, 0) || item.count;
        item.checkedCount = children.length ?
          children.reduce((prev, child) => prev + child.checkedCount, 0) : item.count;
        item.disabled = children.some(child => !!child.disabled) || !!item.disabled;
      } else {
        this.symbols[key] = [symbol];
        item.count = 1;
        let checked = false;
        checkedKeys.every(checkedKey => {
          const checkedKey2 = `${checkedKey}-`;
          const key2 = `${key}-`;
          if (key2.startsWith(checkedKey2)) {
            checked = true;
            return false;
          }
          return true;
        });
        item.checkedCount = checked ? 1 : 0;
      }
      this.keys[symbol] = key;
    });
  }

  symbols = {}

  keys = {}

  checkedKeys = []

  render() {
    const { visible, modalProps } = this.props;
    const { treeData, checkedKeys } = this.state;
    const treeProps = {
      treeData,
      checkedKeys,
      onCheck: ::this.onCheck,
      onLoadData: ::this.onLoadData,
    };
    const modalProps2 = { ...modalProps };
    if (!modalProps2.width) {
      modalProps2.width = 660;
    }
    if (window.top !== window) {
      modalProps2.style = {top: window.top.scrollY - 100};
    }
    return (
      <Modal { ...modalProps2 } visible={visible} onOk={::this.onOk} onCancel={::this.onCancel}>
        <CoupleTree { ...treeProps } />
      </Modal>
    );
  }
}

export default TreeModal;
