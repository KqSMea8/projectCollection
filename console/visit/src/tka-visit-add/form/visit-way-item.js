import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { List, Picker } from '@alipay/qingtai';

const pickerData = [
  { value: 'VISIT_PHONE', label: '电话' },
  { value: 'VISIT_SPEAK', label: '面谈' },
  { value: 'VISIT_MERCHANT', label: '商户来访' },
  { value: 'VISIT_OTHER', label: '其他' },
];

export default class extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
  };

  onChange = (v) => {
    if (this.props.onChange) {
      this.props.onChange(v[0]);
    }
  };

  render() {
    const { value } = this.props;
    return (<Picker title="选择拜访方式"
      extra={<span className="hint-choose">请选择</span>}
      cols={1}
      data={pickerData}
      value={[value]}
      onChange={this.onChange}>
      <List.Item arrow="horizontal" className="visit-way-time">拜访方式</List.Item>
            </Picker>);
  }
}
