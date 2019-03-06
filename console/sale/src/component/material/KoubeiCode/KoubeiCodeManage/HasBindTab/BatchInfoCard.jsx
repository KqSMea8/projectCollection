import React, { PropTypes } from 'react';
import './BatchInfoCard.less';

const BatchInfoCard = ({ record }) => (
  <div className="batch-info-card">
    <div className="thumbnail">
      <img src={record.templateImageURL} alt="物料缩略图"/>
    </div>
    <div className="text">
      <dl>
        <dt>生成样式/类型</dt>
        <dd>{record.stuffAttrName}</dd>
        <dt>生成数量</dt>
        <dd>{record.quantity}个</dd>
        <dt>生成提交人</dt>
        <dd>{record.applicantPrincipalName}</dd>
        <dt>生成备注</dt>
        <dd>{record.remark}</dd>
      </dl>
    </div>
  </div>
);

BatchInfoCard.propTypes = {
  record: PropTypes.object,
};

BatchInfoCard.defaultProps = {
  record: {},
};

export default BatchInfoCard;
