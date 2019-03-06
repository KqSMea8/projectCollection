import React, {PropTypes} from 'react';
import {Input, Select} from 'antd';
import ajax from './ajax';
const Option = Select.Option;

const CustomizeLabel = '自定义';

const BrandName = React.createClass({
  propTypes: {
    placeholder: PropTypes.string,
  },

  getInitialState() {
    return {
      list: [],
      value: this.props.value || '',
      disabled: this.props.disabled || false,
    };
  },

  componentDidMount() {
    const url = '/goods/itempromo/queryShopName.json';
    ajax({
      url: url,
      method: 'POST',
      type: 'json',
      success: (res) => {
        const list = res && Array.isArray(res.shopNames) ? res.shopNames : [];
        list.push(CustomizeLabel);
        this.setState({
          list,
        });
        if (this.props.getIsRetail && res.isRetail) {
          this.props.getIsRetail(res.isRetail);
        }
      },
      error: (res) => {
        this.setState({
          list: [CustomizeLabel],
        });
        if (this.props.getIsRetail && res.isRetail) {
          this.props.getIsRetail(res.isRetail);
        }
      },
    });
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
      disabled: nextProps.disabled,
    });
  },

  onSelectChange(val) {
    this.setState({
      value: val,
    });

    this.onChange(val);
  },

  onInputChange(e) {
    this.setState({
      value: e.target.value,
    });

    this.onChange(e.target.value);
  },

  onChange(val) {
    const realVal = val === CustomizeLabel ? '' : val;
    this.props.onChange(realVal);
  },

  render() {
    const { value, list, disabled } = this.state;
    const { placeholder } = this.props;

    let selectVal = '';
    let inputVal = '';

    if (list.indexOf(value) >= 0 && value !== CustomizeLabel) {
      selectVal = value;
    } else {
      selectVal = CustomizeLabel;
      inputVal = value === CustomizeLabel ? '' : value;
    }
    return (
      <div>
        <Select style={{ width: 150 }}
          placeholder="请选择"
          value={selectVal}
          onChange={this.onSelectChange}
          disabled={disabled}
          size="large"
        >
          {list.map((item, index) => <Option key={item + index} value={item}>{item}</Option>)}
        </Select>
        {
          selectVal === CustomizeLabel &&
          <div style={{display: 'inline-block', verticalAlign: 'bottom', marginLeft: 10}}>
            <Input size="large" style={{width: 180}} placeholder={placeholder || '请输入品牌名称'}
              value={inputVal} onChange={(e) => {this.onInputChange(e);}} disabled={disabled}
            />
          </div>
        }
      </div>
    );
  },
});

export default BrandName;
