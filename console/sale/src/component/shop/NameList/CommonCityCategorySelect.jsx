import React, {PropTypes} from 'react';
import {getAreaCategory, getAreaCategoryWithAll, getAreaCategoryWithAllDistrict} from './getAreaCategory';
import { Cascader } from 'antd';
const PLACEHOLDER = '加载中...';

export default function getComponent(type) {
  const CommonAreaCategorySelect = React.createClass({
    propTypes: {
      value: PropTypes.array,
      disabled: PropTypes.bool,
      withAll: PropTypes.bool,
      WithAllDistrict: PropTypes.bool,
      showDistrict: PropTypes.bool,
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
        let _data;
        _data = this.props.showDistrict ? d[type] : this.removeDistric(d.areas);
        this.setState({
          data: _data,
        });
      });
    },

    removeDistric(areas) {
      if (areas) {
        return areas.map((t) => {
          const t2 = {...t};
          t2.children = t2.children.map((t3) => {
            const t4 = {...t3};
            if (t4.children || t4.c) {
              delete t4.children;
              delete t4.c;
            }
            return t4;
          });
          return t2;
        });
      }
    },

    render() {
      return (<Cascader
        {...this.props}
        expandTrigger="hover"
        style={{width: '100%'}}
        placeholder={!this.state.data ? PLACEHOLDER : '请选择'}
        disabled={this.props.disabled || !this.state.data}
        options={this.state.data}/>);
    },
  });
  return CommonAreaCategorySelect;
}
