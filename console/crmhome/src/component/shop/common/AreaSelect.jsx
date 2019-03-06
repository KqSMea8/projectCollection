import React, { PropTypes } from 'react';
import { Cascader } from 'antd';
import { getArea, getAreaWithAll, getAreaWithAllDistrict } from './AreaCategory/getArea';

const AreaSelect = React.createClass({
  propTypes: {
    value: PropTypes.array,
    disabled: PropTypes.bool,
    withAll: PropTypes.bool,
    WithAllDistrict: PropTypes.bool,
    placeholder: PropTypes.string,
  },

  getInitialState() {
    return {
      areas: [],
      loading: false,
    };
  },

  componentWillMount() {
    let promise;
    if (this.props.withAll) {
      promise = getAreaWithAll();
    } else if (this.props.WithAllDistrict) {
      promise = getAreaWithAllDistrict();
    } else {
      promise = getArea();
    }
    this.setState({
      loading: true,
    });
    promise.then((response) => {
      this.setState({
        areas: response.areas,
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
      options={this.state.areas}/>);
  },
});

export default AreaSelect;
