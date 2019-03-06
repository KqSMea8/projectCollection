import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import { Select } from 'antd';
import debounce from 'lodash.debounce';

const Option = Select.Option;

const ProviderSelect = React.createClass({
  propTypes: {
    form: PropTypes.object,
    value: PropTypes.object,
    onChange: PropTypes.func,
    userType: PropTypes.string, // ALIPAY、YUNZONG、BUC
  },

  getInitialState() {
    return {
      list: [],
    };
  },

  componentWillMount() {
    const self = this;
    const {value} = this.props;
    self.value = value ? value : {};
    self.searchProvides = debounce((name) => {
      ajax({
        url: this.props.userType !== 'YUNZONG' ? '/sale/merchant/merchantservicelist.json' : '/sale/merchant/yunzongCityManagerList.json',
        data: this.props.userType !== 'YUNZONG' ? {merchantName: name} : {yunzongCityManagerName: name},
        success(res) {
          if (res.data) {
            self.setState({list: res.data});
          }
        },
      });
    }, 500);
  },

  onSearch(value) {
    this.searchProvides(value);
  },

  onSelect(id, elem) {
    this.props.onChange(elem.props.object);
  },

  onChange(v) {
    if (!v) {
      this.props.onChange({});
    }
  },

  render() {
    const props = Object.assign({}, this.props);
    delete props.onChange;
    const options = this.state.list.map((item, index) => {
      return <Option key={index} value={item.key} object={item}>{item.merchantName}<br />{item.partnerId}</Option>;
    });

    if (props.value) {
      props.value = props.value.merchantName;
    }
    return (<Select
      {...props}
      allowClear
      showSearch
      filterOption={false}
      onSearch={this.onSearch}
      onChange={this.onChange}
      onSelect={this.onSelect}>
      {options}
    </Select>);
  },
});

export default ProviderSelect;
