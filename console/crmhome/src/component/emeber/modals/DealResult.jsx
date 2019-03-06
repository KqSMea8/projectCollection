import React from 'react';
import { Alert, Spin } from 'antd';
export default () => {
  const {result, errorMsg} = window.APP;
  if (result && result === 'true') {
    return (<Alert
      message="表单提交结果"
      description="操作成功"
      type="success"
      showIcon
    />);
  }
  if (result && result === 'false') {
    return (<Alert
      message="表单提交结果"
      description={errorMsg || '操作失败！'}
      type="error"
      showIcon
    />);
  }

  return (<div style={{margin: 80, textAlign: 'center'}}><Spin tip="处理中..." /></div>);
};
