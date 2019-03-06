import React, {PropTypes} from 'react';
import { Input, Select, Row, Col, Button, Form } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;

const WaitedLeadsForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
  },

  componentDidMount() {
    this.props.onSearch({
      searchType: 'PRIVATE',
      privateType: 'UNEFFECTIVE',
    });
  },

  onSearch(e) {
    e.preventDefault();
    const info = {...this.props.form.getFieldsValue()};
    info.searchType = 'PRIVATE';
    info.privateType = 'UNEFFECTIVE';
    this.props.onSearch(info);
  },

  reset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },
  render() {
    const {getFieldProps} = this.props.form;
    return (<div>
      <Form className="advanced-search-form" horizontal>
        <Row>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="门店名称："><Input placeholder="请输入" {...getFieldProps('name')}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="审核状态：">
              <Select {...getFieldProps('auditStatus', {
                initialValue: '',
              })}>
                <Option key="all" value="">全部</Option>
                <Option value="PROCESSING">审核中</Option>
                <Option value="FAILED">审核驳回</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="5" offset="3" style={{textAlign: 'right'}}>
            <Button type="primary" onClick={this.onSearch}>搜索</Button>
            &nbsp; &nbsp; &nbsp;
            <Button onClick={this.reset}>清除条件</Button>
          </Col>
        </Row>
      </Form>
    </div>);
  },
});

export default Form.create()(WaitedLeadsForm);
