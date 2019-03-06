/* eslint no-loop-func:0 */

const dayInWeek = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const ShopTimeUtil = {
  hourTimeAllDayValues: ['00', '00', '-', '23', '59'],
  /**
   * 解析营业时间
   * @param timeString string
   *     格式： 1-5 10:00-20:00
   *     兼容老数据格式：10:00-20:00
   * @return Array<string>
   *     length:8
   *     解析后的时间 ['1', '-', '5', '10', '00', '-', '20', '00']
   *     老数据格式解析后补上 1-7: ['1', '-', '5', '10', '00', '-', '20', '00']
   */
  parseTimeString(timeString) {
    if (typeof timeString === 'string') {
      const time = timeString.trim();
      let matchs = time.match(/(\d)-(\d) (\d?\d):(\d?\d)-(\d?\d):(\d?\d)/); // 1-3 10:00-18:00
      if (matchs) {
        return [matchs[1], '-', matchs[2], matchs[3], matchs[4], '-', matchs[5], matchs[6]];
      }
      matchs = time.match(/(\d?\d):(\d?\d)-(\d?\d):(\d?\d)/); // 老数据格式 10:00-18:00
      if (matchs) {
        return ['1', '-', '7', matchs[1], matchs[2], '-', matchs[3], matchs[4]];
      }
    }
    return null;
  },
  /**
   * 格式化营业时间展示
   * @param time string
   *     格式： 1-5 10:00-20:00
   * @return string
   *   周一至周五 10:00-20:00
   */
  formatTimeString(time) {
    return ShopTimeUtil.formatTimeValues(ShopTimeUtil.parseTimeString(time));
  },
  /**
   * 格式化日期的显示
   * @param values Array<string>
   *   解析后的星期：['1', '-', '5']
   * @return string
   *   周一至周五
   */
  formatDayInWeekValues(values) {
    if (!values) return '';
    const dayInWeekStart = dayInWeek[parseInt(values[0], 10) - 1];
    const dayInWeekEnd = dayInWeek[parseInt(values[2], 10) - 1];
    return `${dayInWeekStart}至${dayInWeekEnd}`;
  },
  /**
   * 格式化时间的显示
   * @param values Array<string>
   *   时间：['10', '00', '-', '20', '00']
   * @return string
   *   10:00-20:00
   */
  formatHourMinValues(values) {
    if (!values) return '';
    if (ShopTimeUtil.isTimeValuesAllDay(values)) return '全天24小时';
    return `${values[0]}:${values[1]}-${values[3] < values[0] ? `次日${values[3]}` : values[3]}:${values[4]}`;
  },
  /**
   * 格式化日期和时间的显示
   * @param values Array<string>
   *   解析后的日期和时间：['1', '-', '5', '10', '00', '-', '20', '00']
   * @return string
   *   周一至周五 10:00-20:00
   */
  formatTimeValues(values) {
    if (!values) return '';
    return `${ShopTimeUtil.formatDayInWeekValues(values.slice(0, 3))} ${ShopTimeUtil.formatHourMinValues(values.slice(3))}`;
  },
  /**
   * 判断时间是否是全天24小时
   * @param values Array<string>
   *   时间：['00', '00', '-', '23', '59']
   */
  isTimeValuesAllDay(values) {
    if (!values) return false;
    if (values.length === 8) {
      return values.slice(3).join(',') === ShopTimeUtil.hourTimeAllDayValues.join(',');
    }
    if (values.length === 5) {
      return values.join(',') === ShopTimeUtil.hourTimeAllDayValues.join(',');
    }
    return false;
  },
  /**
   * 检查时间是否有交叉
   * @param times Array<string>
   *   ['1-5 10:00-20:00', '6-7 10:00-20:00']
   *     012 3  4 5 6  7    012 3  4 5 6  7  <-- index
   * @return boolean 是否交叉
   */
  checkCross(...times) {
    if (!times || times.length < 2) return false;
    // 时间数据预处理
    const fixTimes = [];
    for (const time of times) {
      const values = ShopTimeUtil.parseTimeString(time).map((value) => parseInt(value, 10)); // 转int
      if (values[6] < values[3]) {
        // 跨日, 劈成两个 例：5-6 18:00-09:00 --> 5-6 18:00-23:59 , 6-7 00:00-09:00
        fixTimes.push([values[0], values[1], values[2], values[3], values[4], values[5], 23, 59]);
        if (values[2] === 7) {
          // 跨周, 劈成三个 例：5-7 18:00-09:00 --> 5-7 18:00-23:59 , 6-7 00:00-09:00 , 1-1 00:00-09:00
          fixTimes.push([values[0] + 1, values[1], values[2], 0, 0, values[5], values[6], values[7]]);
          fixTimes.push([1, values[1], 1, 0, 0, values[5], values[6], values[7]]);
        } else {
          fixTimes.push([values[0] + 1, values[1], values[2] + 1, 0, 0, values[5], values[6], values[7]]);
        }
      } else {
        fixTimes.push(values);
      }
    }
    // 检查两个时间是否有交叉
    function checkTwoTimeValuesCross(timeValues1, timeValues2) {
      if ((timeValues1[0] >= timeValues2[0] && timeValues1[0] <= timeValues2[2])
        || (timeValues2[0] >= timeValues1[0] && timeValues2[0] <= timeValues1[2])) { // 星期交叉
        if ((timeValues1[3] >= timeValues2[3] && timeValues1[3] < timeValues2[6])
          || (timeValues2[3] >= timeValues1[3] && timeValues2[3] < timeValues1[6])) { // 小时交叉
          return true;
        }
        if (timeValues1[6] === timeValues2[3]) { // 小时相等时
          if (timeValues1[7] > timeValues2[4]) return true;
        }
        if (timeValues1[3] === timeValues2[6]) { // 小时相等时
          if (timeValues1[4] < timeValues2[7]) return true;
        }
      }
      return false;
    }
    // 开始检查交叉
    while (fixTimes.length >= 2) {
      const firstTimeValues = fixTimes[0];
      // 把第一个时间依次与其他时间做检查
      for (let i = 1; i < fixTimes.length; i++) {
        const timeValues = fixTimes[i];
        if (checkTwoTimeValuesCross(firstTimeValues, timeValues)) {
          return true;
        }
      }
      fixTimes.splice(0, 1);
    }
    return false;
  },
  validationTimesCross(rule, value, callback) {
    if (!value) {
      callback();
      return;
    }
    const times = value.split(',');
    if (ShopTimeUtil.checkCross(...times)) {
      callback(Error('多个营业时间之间不能有交叉，请检查'));
    } else {
      callback();
    }
  },
};

// if (ShopTimeUtil.checkCross('1-5 10:00-20:00', '6-7 10:00-20:00')) throw Error('error');
// if (ShopTimeUtil.checkCross('1-3 10:00-20:00', '4-5 10:00-22:00', '6-7 10:00-23:00')) throw Error('error');
// if (ShopTimeUtil.checkCross('1-5 10:00-12:00', '1-5 13:00-22:00', '6-7 10:00-23:00')) throw Error('error');
// if (ShopTimeUtil.checkCross('1-5 10:00-13:00', '3-5 13:00-22:00', '6-7 10:00-23:00')) throw Error('error');
// if (ShopTimeUtil.checkCross('1-5 10:00-13:00', '1-3 13:00-22:00', '4-5 14:00-22:00', '6-7 10:00-23:00')) throw Error('error');
// if (ShopTimeUtil.checkCross('6-7 10:00-23:00', '3-5 13:00-22:00', '1-5 12:00-13:00')) throw Error('error');
// if (!ShopTimeUtil.checkCross('1-5 10:00-20:00', '1-5 11:00-18:00')) throw Error('error');
// if (!ShopTimeUtil.checkCross('1-5 10:00-13:10', '3-5 13:00-22:00', '6-7 10:00-23:00')) throw Error('error');
// if (!ShopTimeUtil.checkCross('6-7 10:00-23:00', '3-5 13:00-22:00', '1-5 13:00-22:00')) throw Error('error');
// if (!ShopTimeUtil.checkCross('6-7 10:00-23:00', '1-5 10:00-13:10', '3-5 13:00-22:00')) throw Error('error');
// if (!ShopTimeUtil.checkCross('3-5 13:00-22:00', '6-7 10:00-23:00', '1-5 10:00-13:10')) throw Error('error');
// if (!ShopTimeUtil.checkCross('1-5 10:00-18:00', '3-5 13:00-22:00', '6-7 10:00-23:00')) throw Error('error');
// if (!ShopTimeUtil.checkCross('1-3 10:00-20:00', '4-5 10:00-22:00', '5-7 10:00-23:00')) throw Error('error');
// if (!ShopTimeUtil.checkCross('1-3 10:00-08:00', '4-5 07:00-22:00', '6-7 10:00-23:00')) throw Error('error');
// if (!ShopTimeUtil.checkCross('1-3 06:00-08:00', '4-5 07:00-22:00', '6-7 10:00-07:00')) throw Error('error');
// console.log('check ok');

export default ShopTimeUtil;
