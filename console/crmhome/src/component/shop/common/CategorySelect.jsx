import React, { PropTypes } from 'react';
import { Cascader } from 'antd';
import { getCategory, getCategoryWithAll } from './AreaCategory/getCategory';

// 本组件根据给定的 cityId，获得指定地区的品类；全品类查询使用 AllCategorySelect
const CategorySelect = React.createClass({
  propTypes: {
    value: PropTypes.array,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    withAll: PropTypes.bool,
    cityId: PropTypes.string,
  },

  getInitialState() {
    return {
      categories: null,
      loading: false,
    };
  },

  componentWillReceiveProps(newProps) {
    const cityId = newProps.cityId;
    if (!cityId) {
      return;
    }
    const promise = this.props.withAll ? getCategoryWithAll(cityId) : getCategory(cityId);
    this.setState({
      categories: null,
      loading: true,
    });
    promise.then((response) => {
      this.setState({
        categories: response.categories,
        loading: false,
      });
    });
  },

  render() {
    return (<Cascader
      {...this.props}
      expandTrigger="hover"
      style={{width: '100%'}}
      placeholder={this.state.loading ? '加载中…' : this.props.placeholder}
      disabled={this.props.disabled || this.state.loading}
      options={this.state.categories}/>);
  },
});

export default CategorySelect;
