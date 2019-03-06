import React, {PropTypes} from 'react';
import { Input, Select, Row, Col, Button, Form } from 'antd';
// import {format} from '../../../common/dateUtils';

const Option = Select.Option;
const FormItem = Form.Item;

const EnterprisePerksForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
  },

  getInitialState() {
    return {};
  },

  onSearch(e) {
    e.preventDefault();
    const info = {...this.props.form.getFieldsValue()};
    // if (info.dateRange) {
    //   info.startDateStr = format(info.dateRange[0]);
    //   info.endDateStr = format(info.dateRange[1]);
    //   delete info.dateRange;
    // }
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
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="活动名称：">
              <Input placeholder="请输入" {...getFieldProps('shopName')} />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="邀约状态：">
              <Select placeholder="请选择"
                {...getFieldProps('type')}>
                <Option value="ALL">全部</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="活动状态：">
              <Select placeholder="请选择"
                {...getFieldProps('status')}>
                <Option value="">全部</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="4" offset="20">
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

export default Form.create()(EnterprisePerksForm);
