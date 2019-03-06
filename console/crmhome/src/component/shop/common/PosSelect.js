import {Select} from 'antd';
import React, {PropTypes} from 'react';
import ajax from '../../../common/ajax';

const Option = Select.Option;

// 机具选择
const PosSelect = React.createClass({
  propTypes: {
    pid: PropTypes.string,
  },

  getInitialState() {
    return {
      data: [],
    };
  },

  componentDidMount() {
    this.fetchData();
  },

  fetchData() {
    ajax({
      url: '/shop/crm/equipmentList.json',
      data: {
        merchantPid: this.props.pid,
      },
      success: (result) => {
        if (result.status === 'succeed') {
          this.setState({
            data: result.data || [],
          });
        }
      },
      error: () => {},
    });
  },

  render() {
    const {data} = this.state;
    const options = data.map((row) => {
      return <Option key={row.id}>{row.name}</Option>;
    });
    return (<Select
      multiple
      allowClear
      filterOption={false}
      readOnly
      searchPlaceholder="请选择"
      notFoundContent="没有任何数据"
      {...this.props}>
      {options}
    </Select>);
  },
});

export default PosSelect;
