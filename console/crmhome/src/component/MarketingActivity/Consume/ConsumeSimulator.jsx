import React, {PropTypes} from 'react';
import {Form} from 'antd';

const ConsumeSimulator = React.createClass({
  propTypes: {
    form: PropTypes.object,
  },

  render() {
    const simulatorStyle = {
      background: 'url(https://os.alipayobjects.com/rmsportal/PfPBaspZNediTgJ.png) no-repeat',
      position: 'absolute',
      backgroundSize: '223px 397px',
      width: '223px',
      height: '397px',
      top: '37px',
      left: '13px',
    };
    return (
      <div style={{float: 'left', marginLeft: '30px', position: 'relative'}}>
        <div style={simulatorStyle}></div>
        <img src="https://t.alipayobjects.com/tfscom/T1lxlfXeRlXXXXXXXX.png" width="250"/>
        <p style={{fontSize: '12px', textAlign: 'center', color: '#666'}}>支付宝消费送展示页面</p>
      </div>
    );
  },
});

export default Form.create()(ConsumeSimulator);
