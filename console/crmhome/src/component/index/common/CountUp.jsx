import React, { PropTypes } from 'react';

let raf = null;
let lastTime = 0;
const vendors = ['webkit', 'moz', 'ms', 'o'];
for (let x = 0; x < vendors.length && !raf; ++x) {
  raf = window[`${vendors[x]}RequestAnimationFrame`];
}
if (!raf) {
  raf = callback => {
    const currTime = new Date().getTime();
    const timeToCall = Math.max(0, 16 - (currTime - lastTime));
    const id = window.setTimeout(() => callback(currTime + timeToCall), timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
}

const CountUp = React.createClass({
  propTypes: {
    children: PropTypes.any,
    startVal: PropTypes.number,
    duration: PropTypes.number,
    decimals: PropTypes.number,
    useEasing: PropTypes.bool,
    useGrouping: PropTypes.bool,
  },
  getDefaultProps() {
    return {
      startVal: 0,
      duration: 1,
      decimals: 0,
      useEasing: true,
      useGrouping: false,
    };
  },
  getInitialState() {
    const { startVal, children } = this.props;
    this.inputNum = Number(children);
    this.endVal = this.inputNum;
    this.countDown = startVal > this.endVal;
    return {
      frameVal: isNaN(this.inputNum) ? children : startVal,
    };
  },
  componentDidMount() {
    if (!isNaN(this.inputNum)) {
      raf(this.count);
    }
  },
  easeOutExpo(t, b, c, d) {
    return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
  },
  printValue(val) {
    const { decimals, useGrouping } = this.props;
    let frameVal = val.toFixed(decimals);
    if (useGrouping) {
      const arr = String(frameVal).split('.');
      frameVal = `${arr[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,')}${(arr[1] ? '.' + arr[1] : '')}`;
    }
    this.setState({
      frameVal,
    });
  },
  count(timestamp) {
    let { startTime } = this;
    const { endVal, count, easeOutExpo, countDown } = this;
    const { startVal, duration, useEasing } = this.props;
    let { frameVal } = this.state;
    if (!startTime) this.startTime = startTime = timestamp;
    if (countDown) {
      if (useEasing) {
        frameVal = startVal - easeOutExpo(timestamp - startTime, 0, startVal - endVal, duration * 1000);
      } else {
        frameVal = startVal - ((startVal - endVal) * ((timestamp - startTime) / (duration * 1000)));
      }
      frameVal = frameVal > endVal ? frameVal : endVal;
    } else {
      if (useEasing) {
        frameVal = easeOutExpo(timestamp - startTime, startVal, endVal - startVal, duration * 1000);
      } else {
        frameVal = startVal + (endVal - startVal) * ((timestamp - startTime) / (duration * 1000));
      }
      frameVal = frameVal < endVal ? frameVal : endVal;
    }
    this.printValue(frameVal);
    if (frameVal !== endVal) raf(count);
  },
  render() {
    const { frameVal } = this.state;
    return <span>{ frameVal }</span>;
  },
});

export default CountUp;
