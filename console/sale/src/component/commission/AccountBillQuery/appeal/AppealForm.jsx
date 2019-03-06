import React, {PropTypes} from 'react';
import {Row, Col, Form, Input, Button, DatePicker, Select} from 'antd';
import {format} from '../../../../common/dateUtils';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
import moment from 'moment';
const Option = Select.Option;
const ComplaintOption = [
  {key: '06', text: '申诉中'},
  {key: '07', text: '申诉失败'},
  {key: '03', text: '申诉成功'},
  {key: 'ALL', text: '全部'},
];
const InvoicesQueryForm = React.createClass({
  propTypes: {
    merchantData: PropTypes.array,
    onSearch: PropTypes.func,
    form: PropTypes.object,
  },

  getInitialState() {
    return {
    };
  },
  componentDidMount() {
    this.onSearch();
  },

  onSearch() {
    let info = '';
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      info = values;
      if (info.createTime) {
        const startTime = format(info.createTime[0]).split('-');
        info.startTime = startTime.join('');
        const endTime = format(info.createTime[1]).split('-');
        info.endTime = endTime.join('');
      }
      if (info.applyStatus === 'ALL') {
        info.applyStatus = '';
      }
      delete info.createTime;
      this.props.onSearch(info);
    });
  },

  reset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },
  render() {
    const {getFieldProps} = this.props.form;
    return (
      <Form horizontal className="advanced-search-form">
        <Row key="1">
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="申诉日期：">
            <RangePicker
              style={{width: '100%'}}
              {...getFieldProps('createTime', {initialValue: [moment().add(-3, 'months').toDate(), moment().toDate()]})}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="账单编号："
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}>
              <Input {...getFieldProps('billNo')} placeholder=""/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="申诉状态：">
              <Select placeholder="全部" {...getFieldProps('applyStatus')}>
                {
                  ComplaintOption.map(k => <Option key={k.key} value={k.key}>{k.text}</Option>)
                  }
              </Select>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="6"><div style={{height: 1}}></div></Col>
          <Col span="10" offset="8">
            <div style={{float: 'right'}}>
              <Button type="primary" style={{marginRight: 12}} onClick={this.onSearch}>搜索</Button>
              <Button type="ghost" style={{marginRight: 12}} onClick={this.reset}>清除条件</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  },
});

export default Form.create()(InvoicesQueryForm);
