import React from 'react';
import { Alert } from 'antd';

export default ({ auditData, itemDetailImages }) => {
  if (!auditData.pictureDetails || Object.keys(auditData.pictureDetails).length === 0) {
    return null;
  }

  const errors = itemDetailImages.reduce((rtn, {uid}, i) => {
    if (auditData.pictureDetails[uid]) {
      rtn.push({
        index: i,
        msg: auditData.pictureDetails[uid],
      });
    }
    return rtn;
  }, []);

  return errors.length > 0 ? (
    <Alert
      message={(
        <ul style={{ display: 'inline-block', verticalAlign: 'top' }}>
          {React.Children.toArray(errors.map(d => <li>第 {d.index + 1} 张：{d.msg}</li>))
          }
        </ul>
      )}
      type="warning"
      showIcon
    />
  ) : <span />;
};
