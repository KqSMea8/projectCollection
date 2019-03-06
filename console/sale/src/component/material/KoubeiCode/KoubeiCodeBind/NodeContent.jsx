import React from 'react';

export default props => (
  <div
    style={{
      display: 'inline-block',
      width: '100%',
    }}
  >
    <span style={{ display: 'inline-block', width: 150, whiteSpace: 'normal' }}>{props.name}</span>
    <span style={{ marginLeft: 20, color: '#FF9900', verticalAlign: 'top', display: 'inline-block' }}>{props.tableCnt} 桌</span>
  </div>
);
