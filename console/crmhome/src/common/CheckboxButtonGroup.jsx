import React, {PropTypes} from 'react';
import {Button} from 'antd';

const CheckboxButtonGroup = React.createClass({
  propTypes: {
    options: PropTypes.array,
    onChange: PropTypes.func,
    value: PropTypes.array,
  },

  getInitialState() {
    return {
      value: this.props.value || [],
    };
  },

  onClick(val, type) {
    let value = this.state.value;
    if (type === 'primary') {
      value = value.filter((v) => {
        return v !== val;
      });
    } else {
      if (value.indexOf(val) < 0) {
        value = value.concat(val);
      }
    }
    this.setState({
      value,
    });
    this.props.onChange(value);
  },

  render() {
    const {options} = this.props;
    const {value} = this.state;
    const buttonList = (options || []).map((option, i) => {
      const type = value.indexOf(option.value) >= 0 ? 'primary' : 'ghost';
      return (<Button key={i}
        style={{marginRight: 8}}
        type={type}
        onClick={this.onClick.bind(this, option.value, type)}>
        {option.label}
      </Button>);
    });
    return (<div className="hermes-checkbox-button-group">{buttonList}</div>);
  },
});

export default CheckboxButtonGroup;
