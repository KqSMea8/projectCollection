/**
 * @component FlexText
 * @description 纯文本按需截断 + 气泡卡片展示全文
 */
import { Popover } from 'antd';
import React, { Component, PropTypes } from 'react';

/**
 * @param {*} text 整体文本
 * @param {*} limit 需要清点出的字符数量（按全角计，半角字符算作0.5）
 * @desc 清点出约定数量（limit）的文本
 */
const countLettersByEnd = (text, limit) => {
  const ELIPSIS = '......';
  /**
   * 全角字符unicode范围
   * @see http://www.zuojj.com/archives/1074.html
   * @see https://en.wikipedia.org/wiki/CJK_Unified_Ideographs
   */
  const SBC_CASE_PATTERN = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff\uff01-\uff5e\uffe0-\uffe5]/;
  let counter = 0;  // 统计已经清点的字符数量（按全角计，半角按0.5计）
  let index = 0;    // 当前字符位置
  const length = text.length;
  let elipsisBoundIndex = 0;  // 省略号左侧字符位置
  let winners = '';
  while (index <= length) {
    if (counter < limit) {
      // 由于省略号占用~1.5个全角字符空间，此处需要记住到达限制前1.5或2个空间的字符的位置
      if (counter + 2 === limit || counter + 1.5 === limit) {
        elipsisBoundIndex = index;
      }
      const char = text.charAt(index);
      if (SBC_CASE_PATTERN.test(char)) {
        counter += 1;
      } else {
        counter += 0.5;
      }
      index++;
    } else {
      break;
    }
  }

  const overflow = length - index;
  if (overflow > 0) {
    winners = text.substr(0, elipsisBoundIndex) + ELIPSIS;
  } else {
    winners = text;
  }

  return {
    overflow,
    winners
  };
};

class FlexText extends Component {
  static propTypes = {
    limit: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
  }
  static defaultProps = {
    limit: 120,
  }
  constructor(props) {
    super(props);
  }
  render() {
    const { text, limit } = this.props;
    const { overflow, winners } = countLettersByEnd(text, limit);
    return overflow > 0
      ?
      <Popover
        content={<div style={{width: '400px'}}>{text}</div>}
        trigger="hover"
      >
        <div>{winners}</div>
      </Popover>
      :
      <div>{text}</div >
    ;
  }
}

export default FlexText;
