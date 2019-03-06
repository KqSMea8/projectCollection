import React, {PropTypes} from 'react';
import {Form} from 'antd';

const ConsumeSimulator = React.createClass({
  propTypes: {
    form: PropTypes.object,
    type: PropTypes.string,
  },

  render() {
    const simulatorStyle = {
      background: 'url(https://os.alipayobjects.com/rmsportal/ItFdRsMCKqoShRP.png) no-repeat',
      position: 'absolute',
      backgroundSize: '223px 397px',
      width: '223px',
      height: '397px',
      top: '37px',
      left: '13px',
      display: this.props.type === 'RATE' ? 'none' : 'block',
    };
    const rateSimulatorStyle = {
      background: 'url(https://os.alipayobjects.com/rmsportal/nSOhUQrmdLMBpCc.png) no-repeat',
      position: 'absolute',
      backgroundSize: '223px 397px',
      width: '223px',
      height: '397px',
      top: '37px',
      left: '13px',
      display: this.props.type === 'RATE' ? 'block' : 'none',
    };
    return (
      <div style={{float: 'left', marginLeft: '30px', position: 'relative'}}>
        <div style={rateSimulatorStyle}></div>
        <div style={simulatorStyle}></div>
        <img src="https://t.alipayobjects.com/tfscom/T1lxlfXeRlXXXXXXXX.png" width="250"/>
        <p style={{fontSize: '12px', textAlign: 'center', color: '#666'}}>支付宝展示页面</p>
      </div>
    );
  },
});

export default Form.create()(ConsumeSimulator);
