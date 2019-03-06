import React from 'react';
import PropTypes from 'prop-types';
import { Form, TreeSelect } from 'antd';
import { DigitalFeedbackAllText, DigitalGroupingText, DigitalFeedbackTypeGrouped, DigitalFeedbackStatusText } from '../common/enum';
import { getDigitalFeedback } from '../common/api';

export default class DigitalFeedback extends React.Component {

  static propTypes = {
    value: PropTypes.object, // { 名字：值 }
    onChange: PropTypes.func,
    merchantId: PropTypes.string, // 选中的商户id
  };

  constructor(props) {
    super(props);
    // 原始 treeData
    this.originTreeData = Object.entries(DigitalFeedbackTypeGrouped).map(([groupType, typeObj]) => {
      const types = Object.keys(typeObj);
      return {
        label: DigitalGroupingText[groupType],
        value: groupType,
        children: types.map(type => ({
          label: DigitalFeedbackAllText[type],
          value: type,
        })),
      };
    });
  }
  componentWillReceiveProps(next) {
    if (next.merchantId !== this.props.merchantId) {
      this.props.onChange(null);
      if (next.merchantId) {
        getDigitalFeedback(next.merchantId).then(res => {
          this.props.onChange(res.data);
        });
      }
    }
  }
  onChange(statusType, value) {
    const filterValueArray = this.getFilterValueArray(statusType);
    const newValue = { ...this.props.value };
    filterValueArray.forEach(feedback => {
      delete newValue[feedback];
    });
    value.forEach(feedback => {
      if (!newValue[feedback]) newValue[feedback] = statusType;
    });
    const valueNotChange = Object.values(newValue).length === Object.values(this.props.value || {}).length;
    if (valueNotChange) { // 数据没变化，认为是需要取消全选
      filterValueArray.forEach(feedback => {
        delete newValue[feedback];
      });
    }
    this.props.onChange(newValue);
  }
  // 返回这个状态的反馈
  getFilterValueArray(filterStatusType) {
    const value = this.props.value || {};
    const feedBackTypes = [];
    Object.entries(value).forEach(([feedBackType, statusType]) => {
      if (statusType === filterStatusType) {
        feedBackTypes.push(feedBackType);
      }
    });
    return feedBackTypes;
  }
  // 构造 treeData，设置 disable
  getTreeData(statusType) {
    const value = this.props.value || {};
    const statusFeedBackTypes = this.getFilterValueArray(statusType);
    return this.originTreeData.map(group => {
      const children = group.children.map(item => ({
        ...item,
        disabled: value[item.value] && statusFeedBackTypes.indexOf(item.value) === -1,
      }));
      const enableChildren = children.filter(child => !child.disabled);
      return {
        ...group,
        disabled: enableChildren.length === 0,
        children,
      };
    });
  }

  static validator(rule, value, callback) {
    if (!value) {
      callback(); // 未填写由另一个必填的 rule 来校验
      return;
    }
    const needLength = Object.keys(DigitalFeedbackAllText).length;
    if (Object.values(value).filter(v => v).length < needLength) {
      callback(new Error('请完善数字化程度反馈'));
      return;
    }
    callback();
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const tProps = {
      multiple: true,
      treeCheckable: true,
      showCheckedStrategy: TreeSelect.SHOW_CHILD,
      searchPlaceholder: '点击选择',
    };
    return (<div>
      {Object.entries(DigitalFeedbackStatusText).map(([statusType, statusName]) => (
        <Form.Item {...formItemLayout} label={statusName} key={statusType}>
          <TreeSelect
            {...tProps}
            disabled={!this.props.merchantId}
            treeData={this.getTreeData(statusType)}
            value={this.getFilterValueArray(statusType)}
            onChange={this.onChange.bind(this, statusType)}
          />
        </Form.Item>
      ))}
    </div>);
  }
}
