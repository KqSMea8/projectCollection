import {Select} from 'antd';
import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import debounce from 'lodash.debounce';
import {appendOwnerUrlIfDev} from '../../../common/utils';
const Option = Select.Option;

function fetchData(brandName) {
  ajax({
    url: appendOwnerUrlIfDev('/sale/rebate/getMerchantInfo.json'),
    method: 'post',
    data: {merchantName: brandName},
    success: (data = {}) => {
      let brands = data.data || [];
      // if (brands.length > 6) {
      //   brands = brands.slice(0, 6);
      // }
      brands = brands.filter(c => !!c.merchantId);
      brands = brands.map((b) => {
        if (b.reserved) {
          b.name = (<div style={{ position: 'relative' }}>
            {b.name}
          </div>);
        }
        return b;
      });
      this.setState({
        data: brands,
      });
    },
    error: () => {
    },
  });
}

const BrandSelect = React.createClass({
  propTypes: {
    brandName: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
  },

  getInitialState() {
    this.fetchData = debounce(fetchData.bind(this), 500);
    return {
      data: [],
    };
  },

  handleSelect(id, elem) {
    this.brandName = elem.props.children;
  },
  render() {
    const {data} = this.state;
    const options = data.map((row) => {
      return <Option key={row.partnerId}>{row.merchantName}</Option>;
    });
    const {value, merchantName} = this.props;
    const brandContent = (merchantName || this.brandName);
    if (value && brandContent && !data.filter(d => d.partnerId === value)[0]) {
      options.push(<Option key={value}>{brandContent}</Option>);
    }
    return (<Select showSearch
                    allowClear
                    onSearch={this.fetchData}
                    filterOption={false}
                    onSelect={this.handleSelect}
                    notFoundContent=""
                    placeholder="请输入"
                    disabled={this.props.disabled}
      {...this.props}>
      {options}
    </Select>);
  },
});

export default BrandSelect;
