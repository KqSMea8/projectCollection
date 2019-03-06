import {Select} from 'antd';
import React from 'react';
const Option = Select.Option;

const MaterialAcceptanceBizSourceSelect = React.createClass({
  getInitialState() {
    /**
     * TODO
     * @张佋 @楚吴 此处的活动类型应改为服务端接口活动，本次服务端没有发布，跟随下次迭代技改
     */
    return {
      data: {
        'ALL': '全部',
        'ACTIVITY_CODEMATERIAL': '码物料',
        'ACTIVITY_MOGANSHAN': '活动物料-收入月增计划',
        'ACTIVITY_KOUBEIKA': '活动物料-口碑卡88折',
        'ACTIVITY_APPORDER1': '餐饮app点餐活动1期',
        'ACTIVITY_KTVBOOKING4AUG': 'KTV预订8月活动物料',
      },
    };
  },

  componentDidMount() {
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
      {options}
    </Select>);
  },
});

export default MaterialAcceptanceBizSourceSelect;
