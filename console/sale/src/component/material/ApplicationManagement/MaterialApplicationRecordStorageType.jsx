import {Select} from 'antd';
import React from 'react';
const Option = Select.Option;

const MaterialApplicationRecordStorageType = React.createClass({
  getInitialState() {
    return {
      data: {
        'CITY': '城市',
        'KA': 'KA',
        'YUNZONG': '云纵',
      },
    };
  },

  render() {
    const {data} = this.state;
    const options = [];
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        options.push(<Option key={key}>{data[key]}</Option>);
      }
    }
    return (<Select {...this.props}>
      <option key="ALL" value="">全部</option>
      {options}
    </Select>);
  },
});

export default MaterialApplicationRecordStorageType;
