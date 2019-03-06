import React, {PropTypes} from 'react';
import { DatePicker, Input, Row, Col, Button, Form, message} from 'antd';
import {format} from '../../../common/dateUtils';

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;

const BrandListForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
  },

  onSearch(e) {
    e.preventDefault();
    const pid = this.props.form.getFieldValue('pid');
    if (!pid) return message.warn('品牌商PID不能为空');
    const info = {...this.props.form.getFieldsValue()};
    if (info.dateRange) {
      info.startDateStr = format(info.dateRange[0]);
      info.endDateStr = format(info.dateRange[1]);
      delete info.dateRange;
    }
    this.props.onSearch(info);
  },

  reset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },

  render() {
    const {getFieldProps} = this.props.form;
    return (<div>
      <Form horizontal className="advanced-search-form">
        <Row>
          <Col span="8">
            <FormItem
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                required
                label="PID(必填)："><Input {...getFieldProps('pid')} />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                label="活动名称："><Input {...getFieldProps('activityName')} />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                label="创建时间：">
              <RangePicker {...getFieldProps('dateRange')} showTime={false}/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6"><div style={{height: 1}}></div></Col>
          <Col span="10" offset="8">
            <div style={{float: 'right'}}>
              <Button type="primary" onClick={this.onSearch}>搜索</Button>
              <Button onClick={this.reset}>清除条件</Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>);
  },
});

export default Form.create()(BrandListForm);
