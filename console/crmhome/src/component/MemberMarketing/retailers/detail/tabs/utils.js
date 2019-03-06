import React from 'react';
import moment from 'moment';

/**
 * 格式化券可用时段字段
 * @param availableVoucherTime 券可用时段字段
 */
export function formatAvailableTimes(availableVoucherTime) {
  const weekMap = ['一', '二', '三', '四', '五', '六', '日'];
  const resultArray = [];
  if (availableVoucherTime && availableVoucherTime.length > 0) {
    (availableVoucherTime || []).forEach((p) => {
      if (p.dimension && p.dimension === 'D') {
        const times = p.times.split(',');
        resultArray.push(<p>每月{p.values}号{times.join('-')}</p>);
      } else {
        const values = p.values.split(',');
        const times = p.times.split(',');
        const weekValues = values.map((val) => weekMap[val - 1]);
        resultArray.push(<p>{weekValues.join(',')}{times.join('-')}</p>);
      }
    });
  }
  return resultArray;
}

/**
 * 格式化券不可用时段字段
 * @param timeString 券可不用时段字段
 */
export function formatForbiddenDates(timeString) {
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
}

/**
 * 格式化券有效期字段
 * @param voucher 券对象
 */
export function validPeriodReadable(voucher) {
  if (voucher) {
    const { validType, validPeriod, validFromTime, validEndTime } = voucher;
    if (validType === 'RELATIVE') {
      if (validPeriod !== null && validPeriod !== undefined) {
        return `领取后${validPeriod}天内有效`;
      }
    } else if (validType === 'FIXED') {
      if (validFromTime && validEndTime) {
        const formatStr = 'YYYY-MM-DD';
        return `${moment(validFromTime).format(formatStr)} - ${moment(validEndTime).format(formatStr)}`;
      }
    }
  }
  return '未知';
}
