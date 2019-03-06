import {Select} from 'antd';
import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import debounce from 'lodash.debounce';
import {appendOwnerUrlIfDev} from '../../../common/utils';

const Option = Select.Option;

function fetchData(searchOperatorName) {
  ajax({
    url: appendOwnerUrlIfDev('/sale/merchant/searchJobAndOpratorByName.json'),
    data: {searchOperatorName},
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

const NewManagerSelect = React.createClass({
  propTypes: {
    operatorName: PropTypes.string,
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

  handleSelect(operatorId, elem) {
    this.operatorName = elem.props.children;
  },

  render() {
    const {data} = this.state;
    const options = data.map((row) => {
      return <Option key={row.operatorId + ',' + row.jobId}>{row.operatorName}<br/><span style={{color: 'gray'}}>{row.jobDescription}</span></Option>;
    });
    const {value, operatorName} = this.props;
    const operatorContent = (operatorName || this.operatorName);
    if (value && operatorContent && !data.filter(d => d.operatorId === value.operatorId)[0]) {
      options.push(<Option key={value.operatorId + ',' + value.jobId}>{value.operatorName}</Option>);
    }
    return (<Select
      disabled= {this.props.disabled}
      showSearch
      allowClear
      onSearch={this.fetchData}
      filterOption={false}
      onSelect={this.handleSelect}
      notFoundContent=""
      placeholder="请输入小二的花名/真名"
      {...this.props}
      // onChange={undefined}
      // value={value && value.operatorId}
    >
      {options}
    </Select>);
  },
});

export default NewManagerSelect;
