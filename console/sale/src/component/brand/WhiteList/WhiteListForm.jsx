import React, {PropTypes} from 'react';
import {Button, Form, Select, Row, Col, Input, message} from 'antd';
import permission from '@alipay/kb-framework/framework/permission';
import ajax from 'Utility/ajax';

const FormItem = Form.Item;
const Option = Select.Option;

const WhiteListForm = React.createClass({

  propTypes: {
    form: PropTypes.object,
    onSearch: PropTypes.func,
  },

  getInitialState() {
    return {
      industryName: [],
    };
  },

  componentDidMount() {
    this.getIndustryName();
  },

  getIndustryName() {
    if (permission('BRANDRETAILE_QUERY')) {
      ajax({
        type: 'json',
        url: '/sale/brandRetailer/queryBrandRetailerCategory.json',
        method: 'get',
        success: (res) => {
          if (res.status === 'succeed') {
            this.setState({
              industryName: res.data,
            });
          }
        },
        error: () => {
          message.error('获取行业失败');
        },
      });
    }
  },

  getIndustry() {
    this.getIndustryName();
  },

  handleSubmit(e) {
    e.preventDefault();
    const params = this.props.form.getFieldsValue();
    this.props.onSearch(params);
  },

  handleClear(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },

  render() {
    const {getFieldProps} = this.props.form;
    const {industryName} = this.state;
    const Options = industryName && industryName.map((item, i) => {
      return (<Option value={item} key={i}>{item}</Option>);
    });
    return (
      <div style={{}}>
        <Form horizontal onSubmit={this.handleSubmit} className="advanced-search-form">

          <Row>
            <Col span="8">
              <FormItem
                label="pid："
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}>
                <Input {...getFieldProps('pid')} placeholder="请输入" />
              </FormItem>
            </Col>

            <Col span="8">
              <FormItem
                label="商户名称："
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}>
                <Input {...getFieldProps('displayName')} placeholder="请输入"/>
              </FormItem>
            </Col>

            <Col span="8" onClick={this.getIndustry}>
              <FormItem
                label="行业："
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}>
                <Select
                  placeholder="请选择"
                  allowClear
                  {...getFieldProps('industryName')}>
                  {Options}
                </Select>
              </FormItem>
            </Col>

          </Row>

          <Row>
            <Col span="8" offset="16" style={{textAlign: 'right'}}>
              <Button type="primary" htmlType="submit">搜索</Button>
              <Button onClick={this.handleClear}>清除条件</Button>
            </Col>
          </Row>
        </Form>
      </div>);
  },
});

export default Form.create()(WhiteListForm);
