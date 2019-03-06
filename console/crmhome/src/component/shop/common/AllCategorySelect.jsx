import React, { PropTypes } from 'react';
import { Cascader } from 'antd';
import ajax from '../../../common/ajax';
import { transformLCV, addAll } from './treeUtils';

const CategorySelect = React.createClass({
  propTypes: {
    value: PropTypes.array,
    placeholder: PropTypes.string,
    withAll: PropTypes.bool,
  },

  getInitialState() {
    return {
      categories: [],
      loading: true,
    };
  },

  componentWillMount() {
    ajax({
      url: '/crm/queryAllCategory.json',
      method: 'get',
    }).then((response) => {
      let categories = transformLCV(response.data);
      if (this.props.withAll) {
        categories = addAll(categories);
      }
      this.setState({
        categories,
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
