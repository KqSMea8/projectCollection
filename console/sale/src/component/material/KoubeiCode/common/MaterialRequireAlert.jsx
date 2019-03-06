import React from 'react';
import { Alert } from 'antd';
import { DOWNLOAD_GUIDE__URL } from '../common/constants';

const MaterialRequireAlert = () => {
  return (
    <Alert
      showIcon
      type="info"
      message="制作要求"
      description={(
        <span>
          <em style={{ color: '#f90', fontStyle: 'normal' }}>为保证物料的材质，请务必按照口碑要求的物料打印规范进行制作，点击查看 </em>
          <a
            style={{ color: '#0ae', fontStyle: 'normal' }}
            href={DOWNLOAD_GUIDE__URL}
            target="_blank"
          >
            物料材质要求
          </a>
        </span>
      )}
    />
  );
};

export default MaterialRequireAlert;
