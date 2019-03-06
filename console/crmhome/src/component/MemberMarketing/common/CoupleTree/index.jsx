import React from 'react';
import { Tree } from 'antd';
import './style.less';

const TreeNode = Tree.TreeNode;


const Tree2 = ({ treeData, checkedKeys, onCheck, onLoadData, onlyChecked }) => {
  const generateNode = (data, parentKey = '0') => data.map((item, i) => {
    const key = `${parentKey}-${i}`;
    const key2 = `${key}-`;
    let checked = false;
    checkedKeys.every(checkedKey => {
      const checkedKey2 = `${checkedKey}-`;
      if (checkedKey2.startsWith(key2) || key2.startsWith(checkedKey2)) {
        checked = true;
        return false;
      }
      return true;
    });
    if (onlyChecked && !checked) {
      return null;
    }
    const { name, children, disabled, count, checkedCount } = item;
    if (children) {
      const childrenNodes = generateNode(children, key);
      const count2 = onlyChecked ? checkedCount : count;
      return (
        <TreeNode key={key} title={`${name} (${count2})`} disableCheckbox={!!disabled}>
          {childrenNodes}
        </TreeNode>
      );
    }
    return (
      <TreeNode key={key} title={name} disableCheckbox={!!disabled} isLeaf />
    );
  }).filter(node => node !== null);

  return (
    <div data-tree2>
      <Tree checkable checkedKeys={checkedKeys} onCheck={onCheck} loadData={onLoadData}>
        {generateNode(treeData)}
      </Tree>
    </div>
  );
};
Tree2.defaultProps = { onlyChecked: false };

const CoupleTree = props => {
  return (
    <couple-tree>
      <Tree2 { ...props } />
      <Tree2 { ...props } onlyChecked />
    </couple-tree>
  );
};

CoupleTree.propTypes = {
  treeData: React.PropTypes.array.isRequired,
  checkedKeys: React.PropTypes.array.isRequired,
  onCheck: React.PropTypes.func.isRequired,
  onLoadData: React.PropTypes.func,
};

export default CoupleTree;
