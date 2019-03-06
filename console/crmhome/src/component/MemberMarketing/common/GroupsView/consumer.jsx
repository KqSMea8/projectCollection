import React from 'react';
import { itemLabelMap } from '../../config/GroupItem';

function valueMap(key, value) {
  if (value === undefined) {
    return '不限制';
  }
  let newValue = value;
  if (key === 'tradeCycle') {
    newValue = `${value}天以内`;
  }
  if (key === 'tradeAmount') {
    newValue = `${value[0] / 100}元-${value[1] / 100}元`;
  }
  if (key === 'tradeCount') {
    newValue = `${value[0]}次-${value[1]}次`;
  }
  if (key === 'tradePerPrice') {
    newValue = `${value[0] / 100}元-${value[1] / 100}元`;
  }
  return newValue;
}

const GroupViewConsumer = props => {
  const keys = Object.keys(props).filter(key => itemLabelMap.hasOwnProperty(key));
  const lastLine = keys.length % 3 ? keys.length - keys.length % 3 : keys.length - 3;
  const items = keys.map((key, i) => {
    return (
      <div key={key} data-last-line={i >= lastLine}>
        <label>{itemLabelMap[key]}</label>
        <span>{valueMap(key, props[key])}</span>
      </div>
    );
  });
  return (
    <groups-view-consumer>
      <div><span>消费行为</span></div>
      <div>{items}</div>
    </groups-view-consumer>
  );
};

GroupViewConsumer.propTypes = {
  tradeCycle: React.PropTypes.number,
  tradeAmount: React.PropTypes.array,
  tradeCount: React.PropTypes.array,
  tradePerPrice: React.PropTypes.array,
};

export default GroupViewConsumer;
