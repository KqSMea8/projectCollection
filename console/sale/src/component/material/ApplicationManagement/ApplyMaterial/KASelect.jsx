import {Select} from 'antd';
import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import debounce from 'lodash.debounce';
import {appendOwnerUrlIfDev} from '../../../../common/utils';

const Option = Select.Option;

function fetchData(merchantName) {
  ajax({
    url: appendOwnerUrlIfDev('/sale/merchant/merchantListByMerchantName.json'),
    data: {merchantName},
    success: (data = {}) => {
      const brands = data.data || [];
      // if (brands.length > 6) {
      //   brands = brands.slice(0, 6);
      // }
      this.setState({
        data: brands,
      });
    },
    error: () => {
    },
  });
}

const KASelect = React.createClass({
  propTypes: {
    merchantName: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
  },

  getInitialState() {
    this.fetchData = debounce(fetchData.bind(this), 500);
    return {
      data: [],
    };
  },

  handleSelect(merchantId, elem) {
    this.props.onChange({
      merchantId,
      merchantName: elem.props.children,
    });
  },

  render() {
    const {data} = this.state;
    const options = data.map((row) => {
      return <Option key={row.merchantId}>{row.merchantName}</Option>;
    });
    const {value} = this.props;
    if (value && !data.filter(d => d.merchantId === value.merchantId)[0]) {
      options.push(<Option key={value.merchantId}>{value.merchantName}</Option>);
    }
    return (<Select
      disabled= {this.props.disabled}
      showSearch
      allowClear
      onSearch={this.fetchData}
      filterOption={false}
      onSelect={this.handleSelect}
      notFoundContent=""
      placeholder="请输入KA"
      {...this.props}
      onChange={undefined}
      value={value && value.merchantId}
    >
      {options}
    </Select>);
  },
});

export default KASelect;
