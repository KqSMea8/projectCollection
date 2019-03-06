import {Select} from 'antd';
import React, {PropTypes} from 'react';

const Option = Select.Option;

const MaterialApplicationRecordApplyStatus = React.createClass({
  // 全部、申请中、审核中、发货中、发货完毕、已验收、已驳回
  propTypes: {
    applycationType: PropTypes.string,
  },
  getInitialState() {
    return {
      data: {
        '800': '待审核',
        '801': '审核不通过',
        '802': '审核通过',
        '803': '采购发货中',
        '804': '发货完成',
        '805': '收货完成',
      },
      alipayData: {
        '502': '申请中',
        '503': '审核中',
        '504': '发货中',
        '501': '发货完毕',
        '500': '已驳回',
      },
    };
  },

  render() {
    const {data, alipayData} = this.state;
    const {applycationType} = this.props;
    const options = [];
    if (applycationType === 'koubei') {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          options.push(<Option key={key}>{data[key]}</Option>);
        }
      }
    } else {
      for (const key in alipayData) {
        if (alipayData.hasOwnProperty(key)) {
          options.push(<Option key={key}>{alipayData[key]}</Option>);
        }
      }
    }
    return (<Select {...this.props} >
      <option key="ALL" value="">全部</option>
      {options}
    </Select>);
  },
});

export default MaterialApplicationRecordApplyStatus;
