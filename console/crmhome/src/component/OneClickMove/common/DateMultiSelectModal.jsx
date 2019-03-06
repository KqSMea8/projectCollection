import React, { PropTypes } from 'react';
import { Tag } from 'antd';
import './DateMultiSelectModal.less';
import classnames from 'classnames';
import { hasParent } from '../../../common/utils';

const getAllDays = (() => {
  const res = [];
  for (let i = 1; i <= 31; ++i) {
    res.push(i);
  }
  return () => [...res];
})();

const uniq = (arr = []) => {
  const res = [];
  arr.forEach(d => {
    if (res.indexOf(d) === -1) {
      res.push(d);
    }
  });
  return res;
};

/* eslint-disable */
function formatDateStr(dates = []) {
  const _dates = [...dates].map(d => Number(d)).filter(d => !isNaN(d));
  let date = NaN;
  let prev = NaN;
  let res = [];
  let text = '';
  while (date = _dates.shift()) {
    if (!isNaN(prev) && (prev + 1) === date) {  // 和前一个比是连续的
      if (isNaN(date) || (date + 1) !== _dates[0]) {  // 下一天不连续，则中断
        text += `-${date}日`;
        res.push(text);
      }
    } else {  // 与前一个不连续
      text = `${date}日`;
      if (date + 1 !== _dates[0]) {// 下一天不连续，则中断
        res.push(text);
      }
    }
    prev = date;
  }
  return res;
}
/* eslint-enable */

export default class DateMultiSelectModal extends React.Component {
  static propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    value: [],
    onChange: () => {},
  };

  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      show: false,
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.onBlur);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onBlur);
  }

  onFocus = () => {
    this.setState({
      show: true,
    });
  }

  onBlur = (e) => {
    const dom = this.refs.dateSelect;
    if (!hasParent(e.target, dom) && e.target.className.indexOf('anticon-cross') === -1) { // 关闭 tag 不触发
      this.setState({
        show: false,
      });
    }
  }

  onClose = (txt = '') => {
    let checked = [...(this.props.value || [])].map(d => Number(d));
    const mc = txt.match(/\d{1,2}(?=日)/g);
    if (mc && mc.length) {
      if (!mc[1]) {
        checked = checked.filter(d => d !== Number(mc[0]));
      } else {
        checked = checked.filter(d => d < Number(mc[0]) || d > Number(mc[1]));
      }
      this.props.onChange(checked.map(d => d + ''));
    }
  }

  handlerCheck = v => {
    this.props.onChange(v ? getAllDays() : []);
  }

  checkDate = i => {
    const value = [...(this.props.value || [])];
    const idx = value.indexOf(i);
    if (idx === -1) {
      value.push(i);
    } else {
      value.splice(idx, 1);
    }
    this.props.onChange(uniq(value).sort((a, b) => a - b));
  }

  // determine = () => {
  //   const { check } = this.state;
  //   const value = [];
  //   check.forEach((item, i) => {
  //     if (item) {
  //       value.push(i + 1);
  //     }
  //   });
  //   this.setState({
  //     show: false,
  //     value,
  //   });
  //   this.props.onChange(value);
  // }

  loadingTag = () => {
    const dates = formatDateStr(this.props.value);
    return dates.map((txt) => {
      if (txt) {
        return <Tag key={txt} closable onClose={() => { this.onClose(txt); }}>{txt}</Tag>;
      }
    });
  }

  loadDate = () => {
    const dom = [];
    const values = (this.props.value || []).map(d => d + '');
    for (let i = 1; i <= 31; i++) {
      dom.push(
        <span key={i}
          className={
            classnames('multi-position-child', { check: values.indexOf(i + '') >= 0 })
          }
          onClick={(e) => { e.preventDefault(); this.checkDate(i); }}
        >
          {i}
        </span>
      );
    }
    return dom;
  }

  render() {
    const { show } = this.state;
    return (
      <div className="date-multi-position" ref="dateSelect">
        <div className="date-multi-select select-error" onClick={this.onFocus}>
          {this.loadingTag()}
        </div>
        <div className="multi-position-modal" style={{ display: show ? 'block' : 'none' }}>
          {this.loadDate()}
          <div className="multi-position-botton">
            <a onClick={(e) => { e.preventDefault(); this.handlerCheck(true); }}>全选</a>
            <a onClick={(e) => { e.preventDefault(); this.handlerCheck(false); }}>清空</a>
            <a onClick={(e) => {
              e.preventDefault();
              this.setState({
                show: false,
              }); }}>确定</a>
          </div>
        </div>
      </div>
    );
  }
}
