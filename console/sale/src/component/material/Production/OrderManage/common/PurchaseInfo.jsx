import React from 'react';
import { Row, Col } from 'antd';
import { OrderStatusText } from '../../common/enums';
import moment from 'moment';
import './PurchaseInfo.less';

const BigShow = props => {
  const { number, label } = props;
  const readable = num => {
    if (isNaN(num)) return num;
    const parts = [];
    const [round, decimal] = num.toString().split('.');
    // split round part into 3-len parts
    const partsCnt = Math.floor(round.length / 3);
    for (let i = 1; i <= partsCnt; i++) {
      parts.unshift(round.substr(-3));
    }
    // the last part short than 3
    const remainLength = round.length - partsCnt * 3;
    if (remainLength > 0) {
      parts.unshift(round.substr(0, round.length - partsCnt * 3));
    }
    return `${parts.join(',')}${decimal ? '.' : ''}${decimal ? decimal : ''}`;
  };
  return (
    <div className="big-show">
      <span className="number">{readable(number)}</span>
      <span className="label">{label}</span>
    </div>
  );
};

const PurchaseInfo = props => {
  const {
    produceOrderId, purchaseQuantity, stockQuantity, assignedQuantity, status, purchaserName, gmtCreate
  } = props.data;
  return (
    <div className="material-purchase-info">
      <Row>
        <Col span={9}>
          <ul>
            <li>采购单号：{produceOrderId}</li>
            <li>采购员：{purchaserName}</li>
            <li>采购时间：{moment(gmtCreate).format('YYYY-MM-DD HH:mm:ss')}</li>
          </ul>
          <div className="badge-status">{OrderStatusText[status]}</div>
        </Col>
        <Col span={5}>
          <BigShow label="采购数量" number={purchaseQuantity}/>
        </Col>
        <Col span={5}>
          <BigShow label="拟库存数量" number={stockQuantity}/>
        </Col>
        <Col span={5}>
          <BigShow label="已分配数量" number={assignedQuantity}/>
        </Col>
      </Row>
    </div>
  );
};

export default PurchaseInfo;
