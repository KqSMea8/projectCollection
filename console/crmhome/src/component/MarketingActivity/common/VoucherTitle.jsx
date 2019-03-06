import React from 'react';

export default (props) => (
  <div className="coupon-info">
    <img src={props.logo} />
    <div className="coupon-detail">
      <h4>{props.voucherName}</h4>
      <p>活动时间：{props.startTime} ~ {props.endTime}</p>
      {props.children}
    </div>
  </div>
);
