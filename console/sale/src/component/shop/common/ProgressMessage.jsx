import React, { PropTypes } from 'react';
import {Alert} from 'antd';

const ProgressMessage = React.createClass({
  propTypes: {
    percent: PropTypes.number,
    text: PropTypes.string,
    visible: PropTypes.bool,
  },

  getDefaultProps() {
    return {
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
        <div className="ant-message-notice" style={{display: display, left: '50%', transform: 'translateX(-50%)'}}>
          <div style={{minWidth: '300px', right: '50%'}}>
            <Alert message={this.props.text} type="info" showIcon />
          </div>
        </div>
      </div>
    );
  },
});

export default ProgressMessage;
