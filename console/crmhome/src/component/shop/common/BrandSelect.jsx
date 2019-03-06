import {Select} from 'antd';
import React, {PropTypes} from 'react';
import ajax from '../../../common/ajax';
import debounce from 'lodash.debounce';

const Option = Select.Option;

function fetchData(brandName) {
  ajax({
    url: '/shop/crm/brandSearch.json',
    data: {brandName},
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
      brands = brands.map((b) => {
        // b.reserved=true;
        if (b.reserved && this.props.brandProtect) {
          b.name = (<div style={{ position: 'relative' }}>
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
            >被保护</span>
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
    brandProtect: PropTypes.string,
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
    const brandProtect = this.props.brandProtect;
    const options = data.map((row) => {
      let brandOption = '';
      if (brandProtect) {
        brandOption = <Option key={row.id} disabled={row.reserved}>{row.name}</Option>;
      } else {
        brandOption = <Option key={row.id}>{row.name}</Option>;
      }
      return brandOption;
    });
    const {value, brandName} = this.props;
    const brandContent = (this.brandName || brandName);
    if (value && brandContent && !data.filter(d => d.id === value)[0]) {
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
