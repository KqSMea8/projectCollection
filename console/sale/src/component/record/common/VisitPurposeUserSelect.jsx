import {Select} from 'antd';
import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import debounce from 'lodash.debounce';

const Option = Select.Option;

function fetchData(userName) {
  const userType = this.props.userType;
  let url = '/sale/visitrecord/queryVisitPurposeUser.json';
  if (this.props.gatheringShop === 'gatheringShop') {
    url = '/manage/searchUsersWithinManagedScope.json';
  }
  ajax({
    url: url,
    data: {userName, userType},
    success: (data = {}) => {
      const brands = data.data || [];
      this.setState({data: brands});
    },
    error: () => {
    },
  });
}

const VisitPurposeSelect = React.createClass({
  propTypes: {
    value: PropTypes.object,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    type: PropTypes.string,
    userType: PropTypes.string,
    gatheringShop: PropTypes.string,
  },
  getInitialState() {
    this.fetchData = debounce(fetchData.bind(this), 500);
    return {
      data: [],
    };
  },
  componentDidUpdate(prevProps) {
    const self = this;
    if (this.props.userType !== prevProps.userType) {
      self.setState({data: []});
      self.props.onChange(undefined);
    }
  },
  onChange(v) {
    if (!v) {
      this.props.onChange({});
    }
  },
  handleFocus() {
    this.fetchData('');
  },
  handleSelect(id, elem) {
    this.props.onChange(elem.props.object);
  },
  render() {
    const {data} = this.state;
    const props = Object.assign({}, this.props);
    delete props.onChange;
    const options = data.map((p, index) => {
      return <Option key={index} value={p.loginName} object={p}>{p.displayName}<br />{p.displayDesc}</Option>;
    });
    if (props.value) {
      props.value = props.value.displayName;
    }
    return (<Select showSearch
                    allowClear
                    onSearch={this.fetchData}
                    filterOption={false}
                    onFocus={this.handleFocus}
                    onSelect={this.handleSelect}
                    onChange={this.onChange}
                    notFoundContent=""
                    placeholder="请输入"
                    size="large"
                    disabled={this.props.disabled}
      {...props}>
      {options}
    </Select>);
  },
});

export default VisitPurposeSelect;
