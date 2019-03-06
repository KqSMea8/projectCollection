import React, { PropTypes } from 'react';
import { Progress } from 'antd';

const ProgressMessage = React.createClass({
  propTypes: {
    percent: PropTypes.number,
    text: PropTypes.string,
    visible: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      percent: 0,
      text: '',
      visible: false,
    };
  },

  getInitialState() {
    return {};
  },

  render() {
    const display = this.props.visible ? 'block' : 'none';
    return (
      // HACK 父元素 .ant-tabs 设置了 overflow: hidden，所以必须设置 .ant-message 在父元素范围内
      // TODO 将此组件添加为 react 容器子元素
      <div className="ant-message" style={{top: 240}}>
        <div className="ant-message-notice" style={{display}}>
          <div className="ant-message-notice-content" style={{minWidth: '300px'}}>
            <div className="ant-message-custom-content">
              <Progress type="line" percent={this.props.percent} />
              <p style={{color: '#999'}}>{this.props.text}</p>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default ProgressMessage;
