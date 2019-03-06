import React from 'react';
import { Tag } from 'antd';

const labelValueMap = {
  '0': '全部用户',
  '1': '学生用户',
  '2': '生日用户',
};

export default ({type = '0'}) => {
  const text = labelValueMap[type];
  if (type === '0') return <span>{text}</span>;
  return <Tag color="yellow">{text}</Tag>;
};
