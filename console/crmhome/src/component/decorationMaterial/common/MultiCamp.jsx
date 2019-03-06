import React, { PropTypes } from 'react';

const int = str => parseInt(str, 10);
const getStyle = (elm, style) => getComputedStyle(elm).getPropertyValue(style);

const Clamp = React.createClass({
  propTypes: {
    children: PropTypes.string,
    ellipsis: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    clamp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  },
  getDefaultProps() {
    return {
      ellipsis: '...',
      clamp: 3,
    };
  },
  getInitialState() {
    const { clamp, ellipsis } = this.props;
    this.clampNum = int(clamp);
    if (!this.clampNum || this.clampNum < 0) throw new Error('Invaild clamp number!');
    this.hasCssClamp = ellipsis === '...' && typeof document.body.style.webkitLineClamp !== 'undefined';
    return {};
  },
  componentDidMount() {
    const { wrapper, ellipsis } = this.refs;
    const singleLineHeight = this.getSingleLineHeight(wrapper);
    const maxHeight = singleLineHeight * this.clampNum;
    if (!this.hasCssClamp) {
      const currentHeight = int(getStyle(wrapper, 'height'));
      ellipsis.style.display = 'none';
      if (currentHeight > maxHeight) {
        ellipsis.style.display = '';
        this.textSlice(30, 0, 0, maxHeight);
      }
    }
  },
  getSingleLineHeight(wrapper) {
    let lineHeight = getStyle(wrapper, 'line-height');
    if (!!lineHeight) {
      if (Number(lineHeight) === Number(lineHeight)) {
        lineHeight = int(getStyle(wrapper, 'font-size')) * lineHeight;
      } else {
        lineHeight = int(lineHeight);
      }
    } else {
      lineHeight = int(getStyle(wrapper, 'font-size')) * 1.2;
    }
    return lineHeight;
  },
  textSlice(increase, len, currentHeight, maxHeight) {
    const text = this.props.children;
    const { wrapper, content } = this.refs;
    let _increase;
    let _len;
    if (currentHeight <= maxHeight) {
      if (increase === 1) return;
      _increase = increase;
      _len = len + _increase;
      content.innerText = text.substring(0, _len);
      this.textSlice(_increase, _len, int(getStyle(wrapper, 'height')), maxHeight);
    } else {
      _increase = int(increase / 2) ? int(increase / 2) : 1;
      _len = len - _increase;
      content.innerText = text.substring(0, _len);
      this.textSlice(_increase, _len, int(getStyle(wrapper, 'height')), maxHeight);
    }
  },
  render() {
    const { children, ellipsis } = this.props;
    const hasCssClamp = this.hasCssClamp;
    const wrapperStyle = {
      display: '-webkit-box',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      WebkitLineClamp: this.clampNum,
      WebkitBoxOrient: 'vertical',
    };
    return (<div style={ hasCssClamp ? wrapperStyle : {} } ref="wrapper">
      <span ref="content">{ children }</span>
      { !hasCssClamp ? <span ref="ellipsis">{ ellipsis }</span> : null }
    </div>);
  },
});

export default Clamp;
