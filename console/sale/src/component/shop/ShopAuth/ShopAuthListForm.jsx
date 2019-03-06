import React, {PropTypes} from 'react';
import {Row, Col, Form, Input, Button} from 'antd';
import UserSelect from '../../../common/UserSelect';

const FormItem = Form.Item;

const ShopAuthListForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
  },

  onSearch() {
    const info = {...this.props.form.getFieldsValue()};
    if (info.staffId) {
      info.staffId = info.staffId.id;
    }
    this.props.onSearch(info);
  },

  reset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },

  render() {
    const {getFieldProps} = this.props.form;
    return (
      <Form horizontal className="advanced-search-form">
        <Row>
          <Col span="8">
            <FormItem
              label="员工名称："
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}>
              <UserSelect
                style={{width: '100%'}}
                {...getFieldProps('staffId')}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              label="门店名称："
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}>
              <Input {...getFieldProps('shopName')} placeholder=""/>
            </FormItem>
          </Col>
          <Col span="8">
            <div style={{float: 'right'}}>
              <Button type="primary" style={{marginRight: 12}} onClick={this.onSearch}>搜索</Button>
              <Button type="ghost" style={{marginRight: 12}} onClick={this.reset}>清除条件</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  },
});

export default Form.create()(ShopAuthListForm);
