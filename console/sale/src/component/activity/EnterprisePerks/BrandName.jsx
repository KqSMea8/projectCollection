import React, {PropTypes} from 'react';
import {Input, Select} from 'antd';
const Option = Select.Option;

const BrandName = React.createClass({
  propTypes: {
    BrandOptions: PropTypes.any,
  },

  getInitialState() {
    return {
      disabled: true, // 初始化为输入框不可见
      value: this.props.value || '',
    };
  },

  onSelectChange(val) {
    if (val !== '自定义') {
      this.setState({
        disabled: true,
      });
    } else {
      this.setState({
        disabled: false,
      });
    }
    this.onChange(val);
    this.setState({
      value: val,
      selectVal: val,
    });
  },

  onInputChange(e) {
    this.setState({
      value: e.target.value,
    });
    this.onChange(e.target.value);
  },

  onChange(val) {
    const realVal = val === '自定义' ? '' : val;
    this.props.onChange(realVal); // 这个方法可以控制上层文件获取到值 和 value 配合使用
  },

  render() {
    const { disabled } = this.state;
    const { BrandOptions } = this.props;
    BrandOptions.push(<Option key="自定义">自定义</Option>);
    return (
      <div>
        <Select style={{ width: 200 }}
          placeholder="请选择"
          onChange={this.onSelectChange}
          size="large"
        >
          {BrandOptions}
        </Select>
        {
          !disabled &&
          <div style={{display: 'inline-block', verticalAlign: 'bottom', marginLeft: 10}}>
            <Input size="large" style={{width: 180}} placeholder="请输入品牌名称" onChange={this.onInputChange} disabled={disabled} />
          </div>
        }
      </div>
    );
  },
});

export default BrandName;
