import React, {PropTypes} from 'react';
import {Form, Select} from 'antd';
import MultiActiveTime from './MultiActiveTime';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
};

const AvailableTimeFormItem = React.createClass({
  propTypes: {
    form: PropTypes.object,
    data: PropTypes.object,
    isEdit: PropTypes.bool,
    isCampaignStart: PropTypes.bool,
  },

  render() {
    const {max = 3, data} = this.props;
    const {getFieldProps, getFieldValue} = this.props.form;
    const availableTimeType = getFieldValue('availableTimeType') || '1';
    const isOnline = this.props.isCampaignStart && this.props.isEdit;
    return (<FormItem
      required
      label="使用时段："
      {...formItemLayout}>
      {isOnline ? <p className="ant-form-text">{availableTimeType === '1' ? '不限制' : '指定时间'}</p> :
      <Select placeholder="请选择" {...getFieldProps('availableTimeType', {
        initialValue: (data.bsnParams && data.bsnParams.availableTimeType) ? data.bsnParams.availableTimeType : '1',
      })}>
        <Option key="1">不限制</Option>
        <Option key="2">指定时间</Option>
      </Select>}
      {availableTimeType === '2' &&
      <FormItem help style={{display: 'block', marginTop: 8}}>
        <MultiActiveTime max={max} form={this.props.form} data={data}/>
      </FormItem>}
    </FormItem>);
  },
});

export default AvailableTimeFormItem;
