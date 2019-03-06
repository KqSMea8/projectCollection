import React, { Component } from 'react';
import { Form, Input, Select, Row, Col, Button } from 'antd';
import { StuffType, StuffTypeText } from '../../../common/enum';
import { getStuffAttributeList } from '../../../common/api';
const FormItem = Form.Item;
const Option = Select.Option;

class FilterForm extends Component {
  constructor() {
    super();
  }

  state = {
    stuffAttrList: []
  };

  componentDidMount() {
    getStuffAttributeList()
      .then(res => this.setState({stuffAttrList: res.data}))
      .catch(() => {});
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
    const { stuffAttrList } = this.state;
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
                {...getFieldProps('templateName', {
                })}
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
                {...getFieldProps('merchantName', {
                })}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="物料属性"
            >
              <Select
                {...getFieldProps('stuffAttrId', {
                })}
              >
                <Option value="" key="">全部</Option>
                {stuffAttrList.map(s => <Option value={s.stuffAttrId} key={s.stuffAttrId}>{s.stuffAttrName}</Option>)}
              </Select>
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
                {...getFieldProps('templateId', {
                })}
                placeholder="请输入"
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              label="物料类型"
            >
              <Select
                {...getFieldProps('stuffType', {
                })}
              >
                <Option key="" value="">全部</Option>
                {Object.keys(StuffType).map(k => <Option value={k} key={k}>{StuffTypeText[k]}</Option>)}
              </Select>
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
