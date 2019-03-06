import { Select } from 'antd';
import React, { PropTypes } from 'react';
import ajax from 'Utility/ajax';
import debounce from 'lodash.debounce';
// import {appendOwnerUrlIfDev} from './utils';
const Option = Select.Option;

function fetchData(brandName) {
  const isName = !this.props.isName;
  ajax({
    // url: `${window.APP.crmhomeUrl}/shop/koubei/brandSearch.json`,
    // url: 'http://crmhome-fm.d4721.alipay.net/shop/koubei/brandSearch.json',
    // url: appendOwnerUrlIfDev('/shop/koubei/brandSearch.json'),
    url: window.APP.crmhomeUrl + '/shop/koubei/brandSearch.json',
    data: { brandName },
    success: (data = {}) => {
      let brands = data.brands || [];
      const otherBrand = data.otherBrand;
      if (brands.length > 6) {
        brands = brands.slice(0, 6);
      }
      if (otherBrand) {
        brands.push({
          id: otherBrand.id,
          name: otherBrand.name,
          reserved: false,
        });
      }
      brands = brands.filter(c => !!c.id);
      brands = brands.map(b => {
        if (b.reserved && isName) {
          b.name = (
            <div style={{ position: 'relative' }}>
              {b.name}
              <span
                style={{
                  padding: 2,
                  borderRadius: 5,
                  position: 'absolute',
                  top: 1,
                  right: 1,
                  background: 'gray',
                  color: 'white',
                }}
              >
                被保护
              </span>
            </div>
          );
        }
        return b;
      });
      this.setState({
        data: brands,
      });
    },
    error: () => {},
  });
}

const BrandSelect = React.createClass({
  propTypes: {
    brandName: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    isName: PropTypes.bool,
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
    const { data } = this.state;
    const options = data.map(row => {
      return (
        <Option
          key={this.props.isName ? row.name : row.id}
          disabled={row.reserved && !this.props.isName}
        >
          {row.name}
        </Option>
      );
    });
    const { value, brandName } = this.props;
    const brandContent = brandName || this.brandName;
    if (value && brandContent && !data.filter(d => d.id === value)[0]) {
      options.push(
        <Option key={this.props.isName ? brandContent : value}>
          {brandContent}
        </Option>
      );
    }
    return (
      <Select
        showSearch
        allowClear
        onSearch={this.fetchData}
        filterOption={false}
        onSelect={this.handleSelect}
        notFoundContent=""
        placeholder="请输入"
        disabled={this.props.disabled}
        {...this.props}
      >
        {options}
      </Select>
    );
  },
});

export default BrandSelect;
