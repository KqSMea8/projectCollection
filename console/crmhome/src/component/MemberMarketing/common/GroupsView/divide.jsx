import React from 'react';

const enums = {
  '0': 'VIP',
  '1': '常客',
  '2': '新客',
  '3': '过客',
  '4': '流失客',
};

export default (props) => (
  <groups-view-divide>
    <div><span>会员分层</span></div>
    <div>
      <div data-last-line>
        <label>会员分层</label>
        <span>{props.memberGrade && props.memberGrade.length &&
          props.memberGrade.map(i => enums[i]).join('、') || '不限制'}</span>
      </div>
    </div>
  </groups-view-divide>
);
