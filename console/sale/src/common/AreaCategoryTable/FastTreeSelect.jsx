import React from 'react';
import { TreeSelect } from 'antd';
import { generateTree } from '../utils';
const treeProps = {
  multiple: true,
  treeCheckable: true,
  dropdownStyle: { maxHeight: 200, overflow: 'auto' },
};

const treeGenerator = generateTree()
  .title(d => d.label).key(d => d.value);

export default class FastTreeSelect extends React.Component {
  constructor(props) {
    super(props);
    this.lastData = props.data;
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.value + '' !== this.props.value + ''
      || nextProps.areaConstraintTypeInfo !== this.props.areaConstraintTypeInfo
      || nextProps.disabled !== this.props.disabled
      || nextProps.showCheckedStrategy !== this.props.showCheckedStrategy
      || nextProps.data !== this.lastData;
  }
  render() {
    const { data } = this.props;
    this.lastData = data;
    return <TreeSelect {...this.props} {...treeProps}>{treeGenerator.create(data)}</TreeSelect>;
  }
}
