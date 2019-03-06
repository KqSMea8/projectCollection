import React, {PropTypes} from 'react';
import { Slider, Icon } from 'antd';

const IconSlider = React.createClass({
  propTypes: {
    max: PropTypes.number,
    min: PropTypes.number,
    handleChange: PropTypes.func,
  },

  getDefaultProps() {
    return {
      max: 10,
      min: 0,
    };
  },

  getInitialState() {
    return {
      preIconClass: 'anticon-highlight',
      nextIconClass: '',
      sliderValue: 0,
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.lock) {
      this.setState({sliderValue: 0});
    }
  },

  handleChange(v) {
    const isUnLock = v === this.props.max;
    this.setState({
      preIconClass: isUnLock ? '' : 'anticon-highlight',
      nextIconClass: isUnLock ? 'anticon-highlight' : '',
      sliderValue: v,
    });

    this.props.handleChange(isUnLock);
  },

  render() {
    return (
      <div className="iconWrapper">
        <Icon className={this.state.preIconClass} type="lock" />
        <Icon className={this.state.nextIconClass} type="unlock" />
        <Slider {...this.props} onChange={this.handleChange} value={this.state.sliderValue} step={1} tipFormatter={null}/>
      </div>
    );
  },
});

export default IconSlider;
