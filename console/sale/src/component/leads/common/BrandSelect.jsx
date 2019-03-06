import {Select} from 'antd';
import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import debounce from 'lodash.debounce';

const Option = Select.Option;

function fetchData(brandName) {
  ajax({
    url: `${window.APP.crmhomeUrl}/shop/koubei/brandSearch.json`,
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
        if (b.reserved) {
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
    brandName: PropTypes.string,
    value: PropTypes.object,
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
    this.props.onChange({
      id,
      name: elem.props.children,
    });
  },

  render() {
    const {data} = this.state;
    const options = data.map((row) => {
      return <Option key={row.id} disabled={row.reserved}>{row.name}</Option>;
    });
    const {value} = this.props;
    if (value && !data.filter(d => d.id === value.id)[0]) {
      options.push(<Option key={value.id}>{value.name}</Option>);
    }
    return (<Select
      showSearch
      allowClear
      onSearch={this.fetchData}
      filterOption={false}
      onSelect={this.handleSelect}
      notFoundContent=""
      placeholder="请输入"
      disabled={this.props.disabled}
      {...this.props}
      onChange={undefined}
      value={value && value.id}
    >
      {options}
    </Select>);
  },
});

export default BrandSelect;
