import React, {PropTypes} from 'react';
import { Cascader } from 'antd';

const RegionSelect = React.createClass({
  propTypes: {
    value: PropTypes.array,
    url: PropTypes.string,
    data: PropTypes.array,
    disabled: PropTypes.bool,
  },

  getInitialState() {
    return {};
  },

  render() {
    return (
      <Cascader
        {...this.props}
        expandTrigger="hover"
        style={{width: '100%'}}
        disabled={this.props.disabled || !this.props.data }
        options={this.props.data || []}/>
    );
  },
});

export default RegionSelect;
