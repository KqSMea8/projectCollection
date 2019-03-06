import React, {PropTypes} from 'react';
import {Input, Button, Form, Row, Col, Select} from 'antd';

const inviteStatusList = [
  {key: 'CONFIRMED', value: '已确认'},
  {key: 'UNCONFIRMED', value: '待确认'},
];

const activityStatusList = [
  {key: 'PLAN_ONGOING', value: '招商中'},
  {key: 'STARTED_UNAVAILABLE', value: '已发布未开始'},
  {key: 'STARTED_AVAILABLE', value: '已发布已开始'},
  {key: 'CLOSED', value: '已结束'},
  {key: 'DISABLED', value: '已废弃'},
];


const FormItem = Form.Item;
const Option = Select.Option;

const PayFormQF = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
  },

  displayRender(label) {
    return label[label.length - 1];
  },

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) return;
      this.props.onSearch(values);
    });
  },

  handleClear(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },

  checkDescription(rule, value, callback) {
    const patrn = /^[^~%_\\\\]{1}[^~%_\\\\]{0,}$/;
    if (value && !patrn.exec(value) ) {
      callback(new Error('搜索内容不能包含~、%、_、\\\等特殊符号'));
    }
    callback();
  },

  render() {
    const { getFieldProps } = this.props.form;

    return (
    <div>
      <Form inline form={this.props.form} onSubmit={this.handleSubmit} className="advanced-search-form">
        <Row key="1">
          <Col span={'8'}>
            <FormItem label="活动名称：">
              <Input size="default"
                     style={{ width: 240 }}
                     placeholder="请输入活动名称"
                {...getFieldProps('activityName', {
                  rules: [
                    this.checkDescription,
                  ],
                })}
              />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              style={{marginLeft: 10}}
              id="statusSelect"
              label="邀约状态：">
              <Select id="inviteStatus"
                      placeholder="请选择状态"
                      style={{ width: 240}}
                      size="default"
                      {...getFieldProps('inviteStatus', {
                        initialValue: '',
                      })}
              >
                <Option value="">所有邀约状态</Option>
                {
                  inviteStatusList.map((p) => {
                    return <Option key={p.key}>{p.value}</Option>;
                  })
                }
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              style={{marginRight: 0, float: 'right'}}
              id="statusSelect"
              label="活动状态：">
              <Select id="statusSelect"
                      placeholder="请选择状态"
                      style={{ width: 240 }}
                      size="default"
                      {...getFieldProps('activityStatus', {
                        initialValue: '',
                      })}
              >
                <Option value="">所有活动状态</Option>
                {
                  activityStatusList.map((p) => {
                    return <Option key={p.key}>{p.value}</Option>;
                  })
                }
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row key="2" style={{marginTop: 10}}>
          <Col span="24">
            <div style={{float: 'right'}}>
              <Button type="primary" onClick={this.handleSubmit}>搜索</Button>
              <Button type="ghost" onClick={this.handleClear}>清除</Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>);
  },
});

export default Form.create()(PayFormQF);
