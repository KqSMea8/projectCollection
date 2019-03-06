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
      <div className="ant-message">
        <div className="ant-message-notice" style={{display: display, left: '50%'}}>
          <div className="ant-message-notice-content" style={{minWidth: '300px', right: '50%'}}>
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
