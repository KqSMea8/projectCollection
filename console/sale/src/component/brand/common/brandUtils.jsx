import React from 'react';

export const weekList = [
  {value: '7', label: '周日'},
  {value: '1', label: '周一'},
  {value: '2', label: '周二'},
  {value: '3', label: '周三'},
  {value: '4', label: '周四'},
  {value: '5', label: '周五'},
  {value: '6', label: '周六'},
];

export const weekMap = {};
weekList.forEach((row) => {
  weekMap[row.value] = row.label;
});

export const formatForbiddenVoucherTime = (timeString) => {
  const resultArray = [];
  if (timeString) {
    const timeArray = timeString.split('^');
    if (timeArray && timeArray.length > 0) {
      timeArray.forEach((item) => {
        const itemArray = item.split(',');
        if (itemArray && itemArray.length > 0) {
          resultArray.push(<p>{itemArray[0]}~{itemArray[1]}</p>);
        }
      });
    }
  }
  return resultArray;
};

export const formatAvailableVoucherTime = (availableVoucherTime) => {
  const resultArray = [];
  if (availableVoucherTime && availableVoucherTime.length > 0) {
    (availableVoucherTime || []).forEach((p) => {
      const values = p.values.split(',');
      const times = p.times.split(',');
      const weekValues = values.map((val) => {
        return weekMap[val];
      });
      resultArray.push(<p>{weekValues.join(',')}<span style={{marginLeft: '5px'}}></span>{times.join('-')}</p>);
    });
  }
  return resultArray;
};
