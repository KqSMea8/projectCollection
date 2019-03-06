import React from 'react';

export function formatAvailableTimeValue(availableTimeValue) {
  const week = { '1': '一', '2': '二', '3': '三', '4': '四', '5': '五', '6': '六', '7': '日' };
  const availableTimeValueArray = availableTimeValue.split('^');
  const weekCode = availableTimeValueArray[0];
  const sTime = availableTimeValueArray[1];
  const eTime = availableTimeValueArray[2];
  if (weekCode) {
    const weekArray = weekCode.split(',');
    const weekDesc = [];
    weekArray.forEach((p) => {
      weekDesc.push(week[p]);
    });
    if ((sTime !== '' && sTime !== undefined) || (eTime !== '' && eTime !== undefined)) {
      return <p>每周 {weekDesc.join('、')} {sTime} 至 {eTime}</p>;
    }
    return <p>每周 {weekDesc.join('、')}</p>;
  }
  return '';
}
/* eslint-disable */
function formatDateStr(dates) {
  const _dates = dates.concat([]);
  let date;
  let res = '';
  let prev;
  while (date = _dates.shift()) {
    if (prev + 1 === date) {
      if (date + 1 !== _dates[0]) {
        res += '-' + date + '日';
      }
    } else {
      res += ', ' + date + '日';
    }
    prev = date;
  }
  return res.substr(2);
}
/* eslint-enable */

export function formatUsefulTime(availableTimeType, availableTimeValue, availableTimeValues) {
  let res = '不限制';
  if (availableTimeType === '2') {
    const usefulTime = [];
    if (availableTimeValues) {
      availableTimeValues.forEach((item) => {
        usefulTime.push(formatAvailableTimeValue(item));
      });
    } else if (availableTimeValue) {
      usefulTime.push(formatAvailableTimeValue(availableTimeValue));
    }
    res = usefulTime;
  } else if (availableTimeType === '3') {
    if (availableTimeValues) {
      res = availableTimeValues.map((cur) => {
        const tmpArr = cur.split('^');
        const dates = tmpArr[0].split(',').map(d => Number(d));
        const timeStr = `${tmpArr[1]} - ${tmpArr[2]}`;
        return <p>{`每月${formatDateStr(dates)} ${timeStr}可用`}</p>;
      });
    }
  }
  return res;
}

export function formatForbiddenTime(unavailableTimeType, unavailableTimeValues) {
  let res = '不限制';
  if (unavailableTimeType === '2') {
    const usefulTime = [];
    if (unavailableTimeValues) {
      unavailableTimeValues.forEach((item) => {
        usefulTime.push(formatAvailableTimeValue(item));
      });
    }
    res = usefulTime;
  } else if (unavailableTimeType === '3') {
    if (unavailableTimeValues) {
      res = (unavailableTimeValues || []).map((cur) => {
        const tmpArr = cur.split('^');
        const dates = tmpArr[0].split(',').map(d => Number(d));
        const timeStr = `${tmpArr[1]} - ${tmpArr[2]}`;
        return <p>{`每月${formatDateStr(dates)} ${timeStr}可用`}</p>;
      });
    }
  }
  return res;
}

export function formatEachUserReceivedLimitNum(params) {
  const msg = [];
  if (params.receiveSumLimitType === '0') {
    msg.push('不限制领用总数量');
  } else {
    msg.push('限制总张数，最多可领取' + params.receiveSumLimitNum + '张');
  }
  msg.push(<br />);
  if (params.receivePeriodLimitType === '0') {
    msg.push('不限制领用数量');
  } else {
    if (params.receivePeriodLimitType === '1') {
      msg.push('限制每日张数，最多可领取');
    } else if (params.receivePeriodLimitType === '2') {
      msg.push('限制每周张数，最多可领取');
    } else {
      msg.push('限制每月张数，最多可领取');
    }
    msg.push(params.receivePeriodLimitNum + '张');
  }
  return msg;
}

export function formatLimit(data) {
  let msg;
  if (data.useMode === '1') {
    msg = data.participateLimited ? data.participateLimited + '张/人' : '不限制';
  } else {
    msg = data.receiveLimited ? data.receiveLimited + '次/人' : '不限制';
  }
  return msg;
}

export function formatCouponTime(data) {
  let msg;
  if (data.validTimeType === 'RELATIVE') {
    msg = data.useMode === '1' ? '领取后' + data.validPeriod + '分钟内有效' : '领取后' + data.validPeriod + '日内有效';
  } else {
    msg = data.validTimeFrom + '-' + data.validTimeTo;
  }
  return msg;
}

export function formatBuyVoucherCouponTime(data) {
  let msg;
  if (data.validTimeType === 'RELATIVE') {
    msg = data.useMode === '1' ? '购买后' + data.validPeriod + '分钟内有效' : '自购买日起' + data.validPeriod + '日内有效';
  } else {
    msg = data.validTimeFrom + '-' + data.validTimeTo;
  }
  return msg;
}

export function formatIntroduction(data) {
  let msg;
  if (data === '0E-10') {
    msg = 0;
  } else {
    msg = Math.floor(parseFloat(data) * 100);
  }
  return msg;
}

export function formatActivityLinks(data, type) {
  let name = 'activities';
  if (type === 'history') {
    name = 'historyActivities';
  }
  const activities = data[name] || [];
  const hostName = window.APP.ikbservcenterUrl;
  const array = activities.map((item, index) => {
    // 判断类型 新人立减/商品立减活动 返回不同跳转地址
    if (item.activityType === 'BUY_ITEM_CUT') {
      return (<div><a target="_blank" key={index} href={'#/marketing-activity/goods/detail/' + item.activityId + '/' + item.merchantPid}>{item.activityName}</a></div>);
    }
    return (<div><a target="_blank" key={index} href={`${hostName}/market/index.htm#/activities/detail/${item.activityId}/kbservcenter/ACTIVITY`}>{item.activityName}</a></div>);
  });
  return (<div style={{height: activities.length >= 5 ? '98px' : null, overflowY: activities.length > 5 && 'scroll'}}>
    {array}
  </div>);
}

