import React, {PropTypes} from 'react';
import {Form, Select} from 'antd';
import moment from 'moment';
import RangePickerAddable from '../../../../common/RangePickerAddable';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14},
};

const ForbiddenDateFormItem = React.createClass({
  propTypes: {
    form: PropTypes.object,
    data: PropTypes.object,
    isEdit: PropTypes.bool,
    isCampaignStart: PropTypes.bool,
    disableTypeChange: PropTypes.bool,
  },

  render() {
    const isOnline = this.props.isCampaignStart && this.props.isEdit;
    const {data, disabled, disableTypeChange} = this.props;
    const {getFieldProps, getFieldValue} = this.props.form;
    const forbiddenDateType = getFieldValue('forbiddenDateType') || '1';
    return (<FormItem
      label="不可用日期："
      {...formItemLayout}>
      {isOnline ? <p className="ant-form-text">{data.forbiddenDateType === '1' ? '不限制' : '指定日期'}</p> :
      <Select placeholder="请选择" {...getFieldProps('forbiddenDateType')} disabled={disabled || disableTypeChange}>
        <Option key="1">不限制</Option>
        <Option key="2">指定日期</Option>
      </Select>}
      {!disabled ? <div style={{display: forbiddenDateType === '2' ? 'block' : 'none', marginTop: 16}}>
        {isOnline ? (data.forbiddenDate || []).map((date, i) => {
          return [
            moment(date[0]).format('YYYY-MM-DD'),
            ' ～ ',
            moment(date[1]).format('YYYY-MM-DD'),
            <br key={i}/>,
          ];
        }) : <RangePickerAddable form={this.props.form} prefix="forbiddenDate"/>}
      </div> : null}
    </FormItem>);
  },
});

export default ForbiddenDateFormItem;
