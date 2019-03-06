import React from 'react';
import { TreeSelect } from 'antd';
import ajax from '@alipay/kb-framework/framework/ajax';
import { transformLCV } from '../../../common/treeUtils';

/**
 * 城市树形选择组件
 */

let dataCache = undefined;

const CityTreeSelect = React.createClass({
  getInitialState() {
    return {
      value: this.props.value,
      data: [],
    };
  },

  componentWillMount() {
    // 获取城市数据
    this.fetch();
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  },

  onChange(value) {
    this.props.onChange(value);
    this.setState({ value });
  },

  fetch() {
    if (dataCache) {
      this.setState({ data: dataCache });
      return;
    }

    ajax({
      url: window.APP.kbsalesUrl + '/queryManagedCityList.json',
      method: 'GET',
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          dataCache = transformLCV(res.data);
          this.setState({
            data: dataCache,
          });
        }
      },
    });
  },

  render() {
    const { data: treeData, value } = this.state;
    const isEmpty = !treeData || treeData.length === 0;
    return (
      <TreeSelect
        style={this.props.style}
        showCheckedStrategy={TreeSelect.SHOW_ALL}
        value={value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={this.state.data}
        onChange={this.onChange}
        disabled={isEmpty}
        placeholder={isEmpty ? '正在加载中...' : '请选择'}
      />
    );
  },
});

export default CityTreeSelect;
