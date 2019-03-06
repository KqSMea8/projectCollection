import React, {PropTypes} from 'react';
import { Input, Row, Col, Button, Form, Select } from 'antd';
import VisitPurposeSelect from '../../record/common/VisitPurposeUserSelect';
const FormItem = Form.Item;

const GatheringshopForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
    userType: PropTypes.string,
  },

  handleSubmit(e) {
    e.preventDefault();
    const values = this.props.form.getFieldsValue();
    if (values.userId) {
      values.userId = (values.userId.loginName && values.userId.id ) || '';
    }
    this.props.onSearch(values);
  },

  handleClear(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },

  render() {
    const {getFieldProps, getFieldValue} = this.props.form;
    const userType = this.props.userType === 'BUC' ? false : true;
    return (<div>
      <Form horizontal onSubmit={this.handleSubmit} className="advanced-search-form">
        <Row>
          <Col span="8">
            <FormItem
              label="商户名称："
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}>
              <Input {...getFieldProps('merchantName')} placeholder="请输入商户名称"/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="商户PID："
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}>
              <Input {...getFieldProps('merchantPid')} placeholder="请输入商户pid" />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="商户来源："
            labelCol={{span: 6}}
            wrapperCol={{span: 18}}>
              <Select {...getFieldProps('source')} placeholder="请选择">
                <Option value="">全部</Option>
                <Option value="PAN_INDUSTRY">泛行业服务商</Option>
                <Option value="CATERING_FMCG">城市服务商</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="16">
            <FormItem
             labelCol={{span: 3}}
             wrapperCol={{span: 21}}
             label="归属人：">
              <Col span="3" style={{minWidth: 130}}>
                <Select size="large" style={{ width: 120 }} {...getFieldProps('userType', {
                  initialValue: this.props.userType === 'BUC' ? 'BD' : 'PROVIDER',
                })}>
                  <Option value="BD" disabled={userType}>归属内部BD</Option>
                  <Option value="PROVIDER">归属服务商</Option>
                  <Option value="P_STAFF">归属服务商小二</Option>
                </Select>
              </Col>
              <Col span="18">
                <VisitPurposeSelect {...getFieldProps('userId')} placeholder="请输入" userType={getFieldValue('userType')} gatheringShop="gatheringShop"/>
              </Col>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8" offset="16" style={{textAlign: 'right'}}>
            <Button type="primary" htmlType="submit">搜索</Button>
            <Button type="ghost" onClick={this.handleClear}>清除条件</Button>
          </Col>
        </Row>
      </Form>
    </div>);
  },
});

export default Form.create()(GatheringshopForm);
