import {Select} from 'antd';
import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import debounce from 'lodash.debounce';
import {appendOwnerUrlIfDev} from '../utils';

const Option = Select.Option;

function fetchData(spaceName) { // 参数spaceName 是获取的输入的值
  ajax({
    url: appendOwnerUrlIfDev('/manage/querySpace.json'),
    data: {spaceName},
    success: (data) => {
      if (data.status === 'succeed') {
        this.setState({
          data: data.result || [],
        });
      }
    },
    error: () => {
    },
  });
}

const ZhanWeiSelect = React.createClass({
  propTypes: {
    spacesArrayData: PropTypes.array,
  },

  getInitialState() {
    this.fetchData = debounce(fetchData.bind(this), 500);
    return {
      data: [],
    };
  },

  render() {
    const {data} = this.state;
    // 如果是修改岗位约束,则把回显的数据事先放在展位的下面.
    if (this.props.spacesArrayData) {
      const spacesArrayData = this.props.spacesArrayData;
      for (let i = 0; i < spacesArrayData.length; i++) {
        data.push(spacesArrayData[i]);
      }
    }
    const options = data.map((row) => {
      // 返回的数据结构
      // {
      //   "spaceCode": "1475129658157",
      //   "spaceName": "信用借还-广告位1"
      //  }
      return <Option key={row.spaceCode}>{row.spaceName}<br/><span style={{color: 'gray'}}>{row.spaceCode}</span></Option>;
    });

    return (<Select
      tags
      showSearch
      onSearch={this.fetchData}
      filterOption={false}
      notFoundContent=""
      placeholder="请输入展位名称"
      {...this.props}
    >
      {options}
    </Select>);
  },
});

export default ZhanWeiSelect;
