import React, {PropTypes} from 'react';
import {Input, Button, Form, Row, Col} from 'antd';
// import {activityTypeList, activityStatusList} from '../../config/AllStatus';


const FormItem = Form.Item;
// const Option = Select.Option;

const PayForm = React.createClass({
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
        {/* <FormItem id="typeSelect"
                  label="类型：">
          <Select id="typeSelect"
                  placeholder="请选择类型"
                  style={{ width: 200 }}
                  size="default"
            {...getFieldProps('type', {
              initialValue: 'ALL',
            })}
          >
            <Option key="ALL">所有活动类型</Option>
            {
              activityTypeList.map((p) => {
                return <Option key={p.key}>{p.value}</Option>;
              })
            }
          </Select>
        </FormItem>

        <FormItem
          id="statusSelect"
          label="状态：">
          <Select id="statusSelect"
                  placeholder="请选择状态"
                  style={{ width: 200 }}
                  size="default"
            {...getFieldProps('status', {
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
        </FormItem>*/}
        <Row key="2" style={{marginLeft: '15px'}}>
          <Col span="8">
            <FormItem label="活动名称：">
              <Input size="large"
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
            <FormItem label="">
              <div></div>
            </FormItem>
          </Col>
          <Col span="8">
            <div style={{float: 'right', marginRight: '15px'}}>
              <Button type="primary" onClick={this.handleSubmit}>搜索</Button>
              <Button type="ghost" onClick={this.handleClear}>清除条件</Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>);
  },
});

export default Form.create()(PayForm);
