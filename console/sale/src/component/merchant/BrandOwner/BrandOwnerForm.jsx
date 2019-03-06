import React, {PropTypes} from 'react';
import { Input, Row, Col, Button, Form } from 'antd';
import ajax from 'Utility/ajax';
import BuserviceUserSelect from '@alipay/opbase-biz-components/src/component/user-select/BuserviceUserSelect';
const FormItem = Form.Item;

const BrandOwnerForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
  },

  handleSubmit(e) {
    e.preventDefault();
    const values = this.props.form.getFieldsValue();
    values.staffId = (values.staffId && values.staffId.id) || '';
    this.props.onSearch(values);
  },

  handleClear(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },

  render() {
    const {getFieldProps} = this.props.form;
    return (<div>
      <Form horizontal onSubmit={this.handleSubmit} className="advanced-search-form">
        <Row>
          <Col span="8">
            <FormItem
              label="品牌商PID："
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}>
              <Input {...getFieldProps('partnerId')} placeholder="请输入商户pid" />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="品牌商名称："
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}>
              <Input {...getFieldProps('merchantName')} placeholder="请输入商户名称"/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="归属BD："
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}>
              <BuserviceUserSelect {...getFieldProps('staffId')}
                placeholder="请输入小二花名/真名"
                searchScope="job_scope"
                scopeTarget={window.APP.jobPath}
                ajax={ajax}
                buserviceUrl={window.APP.buserviceUrl} />
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

export default Form.create()(BrandOwnerForm);
