import React, {PropTypes} from 'react';
import {getAreaCategory, getAreaCategoryWithAll, getAreaCategoryWithAllDistrict} from './getAreaCategory';
import { Cascader } from 'antd';
import { omit } from 'lodash';
const PLACEHOLDER = '加载中...';

export default function getComponent(type) {
  const CommonAreaCategorySelect = React.createClass({
    propTypes: {
      value: PropTypes.array,
      disabled: PropTypes.bool,
      withAll: PropTypes.bool,
      WithAllDistrict: PropTypes.bool,
    },

    getInitialState() {
      return {};
    },

    componentWillMount() {
      let promise;
      if (this.props.withAll) {
        promise = getAreaCategoryWithAll();
      } else {
        promise = this.props.WithAllDistrict ? getAreaCategoryWithAllDistrict() : getAreaCategory();
      }
      promise.then((d) => {
        this.setState({
          data: d[type],
        });
      });
    },

    render() {
      return (<Cascader
        {...omit(this.props, 'withAll', 'withAllDistrict')}
        expandTrigger="hover"
        style={{width: '100%'}}
        placeholder={!this.state.data ? PLACEHOLDER : '请选择'}
        disabled={this.props.disabled || !this.state.data}
        options={this.state.data}/>);
    },
  });
  return CommonAreaCategorySelect;
}
