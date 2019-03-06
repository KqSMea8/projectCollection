import React, {PropTypes} from 'react';
import {loadArea} from './loadAreaCategory';
import { Cascader } from 'antd';
const defaultDistrict = [{label: '加载中...'}];

const RegionSelect = React.createClass({
  propTypes: {
    value: PropTypes.array,
    url: PropTypes.string,
  },

  getInitialState() {
    return {};
  },

  componentWillMount() {
    loadArea().then((district) => {
      this.setState({
        district,
      });
    });
  },

  render() {
    return (<Cascader
      placeholder="请选择"
      expandTrigger="hover"
      popupPlacement="bottomLeft"
      style={{width: '100%', marginBottom: 5}}
      disabled={!this.state.district}
      options={this.state.district || defaultDistrict} {...this.props}/>);
  },
});

export default RegionSelect;
