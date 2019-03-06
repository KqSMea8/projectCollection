import React, {PropTypes} from 'react';
import { Cascader } from 'antd';

const RegionSelect = React.createClass({
  propTypes: {
    value: PropTypes.array,
    url: PropTypes.string,
    data: PropTypes.array,
    disabled: PropTypes.bool,
    style: PropTypes.object,
  },

  getInitialState() {
    return {};
  },

  render() {
    const props = {placeholder: '请选择', ...this.props};
    return (
      <Cascader
      {...props}
      expandTrigger="hover"
      style={this.props.style || {width: '100%'}}
      disabled={this.props.disabled || !this.props.data || !this.props.value}
      options={this.props.data || []}/>
    );
  },
});

export default RegionSelect;
