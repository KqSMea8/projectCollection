import React, { Component } from 'react';
import { Form, Input, Row, Col, Button } from 'antd';
const FormItem = Form.Item;
import isEmpty from 'lodash/isEmpty';

class FilterForm extends Component {
  constructor() {
    super();
  }

  state = {
    stuffAttrList: []
  };

  componentWillReceiveProps(next) {
    const { initial, form } = this.props;
    if (isEmpty(next.initial) && !isEmpty(initial)) {
      form.resetFields();
    }
  }

  handleSubmit = () => {
    const { validateFields } = this.props.form;
    const { onSubmit } = this.props;
    validateFields((errors, values) => {
      if (!errors) {
        const filter = {
          ...values,
        };
        onSubmit(filter);
      }
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const { getFieldProps } = this.props.form;
    const { loading } = this.props;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form
        horizontal
        className="advanced-search-form"
      >
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="模板名称"
            >
              <Input
                {...getFieldProps('templateName')}
                placeholder="请输入"
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="申请单号"
            >
              <Input
                {...getFieldProps('orderId')}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="物流单号"
            >
              <Input
                {...getFieldProps('logisticOrderNo')}
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="模板ID"
            >
              <Input
                {...getFieldProps('templateId')}
                placeholder="请输入"
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="仓库"
            >
              <Input
                {...getFieldProps('storageName')}
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8} offset={16}>
            <div style={{float: 'right'}}>
              <Button
                loading={loading}
                type="primary"
                onClick={this.handleSubmit}
                style={{ marginRight: 12 }}
              >
                搜索
              </Button>
              <Button
                type="ghost"
                onClick={this.handleReset}
                style={{ marginRight: 12 }}
              >
                清除条件
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(FilterForm);
