import React, { Component } from 'react';
import { Cascader } from 'antd';
import { apiGetStuffTemplateList, apiGetStuffAttrList } from '../api';
import find from 'lodash/find';

const composeCascaderTree = (list, config) => {
  function parseGroup(group) {
    const nodes = [];
    group.nickNameList.forEach(n => {
      const template = find(list, {nickName: n});
      if (template) {
        nodes.push({
          label: template.label,
          value: n,
        });
      }
    });
    return nodes;
  }

  const tree = [];
  config.forEach(v => {
    v.children.forEach(v1 => {
      const node = {
        label: `${v.name}/${v1.name}`,
        value: v1.id,
        children: [],
      };
      v1.children.forEach(g => {
        node.children = node.children.concat(parseGroup(g));
      });
      tree.push(node);
    });
  });

  tree.push(
    {label: '全部', value: ''}
  );

  return tree;
};

class StuffSelect extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    tree: [],
  };

  componentDidMount() {
    Promise.all([apiGetStuffAttrList(), apiGetStuffTemplateList()])
      .then(([stuffTemplateConfig, stuffTemplateList]) => {
        this.setState({
          tree: composeCascaderTree(stuffTemplateList, stuffTemplateConfig),
        });
      });
  }

  render() {
    return (
      <Cascader
        placeholder="请选择"
        style={{width: '100%'}}
        options={this.state.tree}
        {...this.props}
      />
    );
  }
}

export default StuffSelect;


