import {Input, Select} from 'antd';
import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import './RecordSelect.less';

const Option = Select.Option;

function fetchData(customerName) {
  const type = this.state.type;
  const isPosSale = this.props.isPosSale === 'true' ? 1 : 0;
  const queryData = { customerName, type };
  if (isPosSale === 1) {
    queryData.isSelf = '1'; // PosLeads 默认搜自己
    if (this.state.type === 'SHOP') {
      queryData.isPosShop = isPosSale;
    }
  }
  ajax({
    url: `${window.APP.kbservcenterUrl}/sale/visitrecord/queryVisitObj.json`,
    data: queryData,
    success: (data = {}) => {
      const brands = data.data.visitObjList || [];
      this.setState({data: brands});
    },
    error: () => {
    },
  });
}
const VisitSelect = React.createClass({
  propTypes: {
    customerName: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    type: PropTypes.string,
    result: PropTypes.func,
    isPosSale: PropTypes.string,
  },

  getInitialState() {
    this.fetchData = debounce(fetchData.bind(this), 500);
    return {
      data: [],
      focus: false,
      type: this.props.type,
    };
  },

  componentDidMount() {
    this.fetchData('');
  },

  handleFocus() {
    this.fetchData('');
  },
  handleSelect(id, elem) {
    if (this.props.type === 'BRAND') {
      this.brandName = elem.props.children;
    } else {
      this.props.onChange(elem.props.value);
      this.shopName = elem.props.children[0];
      this.ownerName = elem.props.children[1];
    }
  },
  handleChange(value) {
    this.setState({type: value});
    this.props.result(value);
    this.props.onChange(undefined);
    this.fetchData('');
  },
  render() {
    const {data} = this.state;
    const props = Object.assign({}, this.props);
    delete props.onChange;
    const options = data.map((p) => {
      let option;
      if (this.props.type === 'BRAND' ) {
        option = <Option key={p.value}>{p.label}</Option>;
      } else {
        option = <Option key={p.value} value={p.value}>{p.label}{p.ownerName ? '-' + p.ownerName : ''}</Option>;
      }
      return option;
    });
    const {value, brandName} = this.props;
    const brandContent = (brandName || this.brandName);
    if (value && brandContent && !data.filter(d => d.value === value)[0] && this.props.type === 'BRAND') {
      options.push(<Option key={value}>{brandContent}</Option>);
    }
    if (this.shopName && value && !data.filter(d => d.value === value)[0] && this.props.type !== 'BRAND' ) {
      options.push(<Option key={value} value={value}>{this.shopName}{this.ownerName ? '-' + this.ownerName : ''}</Option>);
    }
    const searchCls = classNames({
      'ant-search-input': true,
      'ant-search-input-focus': this.state.focus,
    });
    return (<div>
        { this.props.type === 'BRAND' ?
          <Select showSearch
                  allowClear
                  onFocus={this.handleFocus}
                  onSearch={this.fetchData}
                  filterOption={false}
                  onSelect={this.handleSelect}
                  notFoundContent=""
                  placeholder="请输入"
                  disabled={this.props.disabled}
                  {...this.props}>
                  {options}
          </Select> :
          <div className="ant-search-input-wrapper visit-input-wrapper" style={{width: '75%'}}>
            <Input.Group className={searchCls}>
              <div className="ant-input-group-wrap">
              <Select defaultValue={this.props.type} style={{ width: 92 }} onChange={this.handleChange}>
                <Option value="SHOP">门店</Option>
                  {
                    this.props.isPosSale === 'true' ? [
                      <Option value="POS_LEADS" key="POS_LEADS">POS Leads</Option>,
                    ] : [
                      <Option value="SHOP" key="SHOP">门店</Option>,
                      <Option value="PRIVATE_LEADS" key="PRIVATE_LEADS">leads</Option>,
                    ]}
                </Select>
              </div>
              <Select showSearch
                      onSearch={this.fetchData}
                      filterOption={false}
                      // onFocus={this.handleFocus}
                      onSelect={this.handleSelect}
                      onChange={this.onChange}
                      notFoundContent=""
                      placeholder="搜索店名"
                      disabled={this.props.disabled}
                {...props}>
                {options}
              </Select>
            </Input.Group>
          </div>
        }
      </div>
    );
  },
});

export default VisitSelect;
