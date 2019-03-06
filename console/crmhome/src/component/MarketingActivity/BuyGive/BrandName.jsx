import React, {PropTypes} from 'react';
import {Input, Select} from 'antd';
import ajax from '../../../common/ajax';
const Option = Select.Option;

const BrandName = React.createClass({
  propTypes: {
    placeholder: PropTypes.string,
  },

  getInitialState() {
    return {
      list: [],
      value: this.props.value || '',
    };
  },

  componentDidMount() {
    const url = '/goods/itempromo/queryShopName.json';
    ajax({
      url: url,
      method: 'POST',
      type: 'json',
      success: (res) => {
        const list = res && res.shopNames ? res.shopNames : [];
        list.push('自定义');
        this.setState({
          list,
        });
      },
      error: () => {
        this.setState({
          list: ['自定义'],
        });
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
    const realVal = val === '自定义' ? '' : val;
    this.props.onChange(realVal);
  },

  render() {
    const { value, list, disabled } = this.state;
    const { placeholder } = this.props;

    let selectVal = '';
    let inputVal = '';

    if (list.indexOf(value) >= 0 && value !== '自定义') {
      selectVal = value;
    } else {
      selectVal = '自定义';
      inputVal = value === '自定义' ? '' : value;
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
          selectVal === '自定义' &&
          <div style={{display: 'inline-block', verticalAlign: 'bottom', marginLeft: 10}}>
            <Input size="large" style={{width: 180}} placeholder={placeholder || '请输入品牌名称'}
              value={inputVal} onChange={this.onInputChange} disabled={disabled}
            />
          </div>
        }
      </div>
    );
  },
});

export default BrandName;
