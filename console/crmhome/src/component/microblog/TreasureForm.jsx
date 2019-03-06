import React, {PropTypes} from 'react';
import {Row, Col, Form, Input, Button} from 'antd';

const FormItem = Form.Item;

class TreasureForm extends React.Component {

  static propTypes = {
    onSearch: PropTypes.func,
    form: PropTypes.object,
  };

  onSearch = () => {
    const info = {...this.props.form.getFieldsValue()};
    this.props.onSearch(info);
  }

  onKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.onSearch();
    }
  }

  reset = (e) => {
    e.preventDefault();
    this.props.form.resetFields();
  }

  render() {
    const {getFieldProps} = this.props.form;
    return (
      <div onKeyDown={this.onKeyDown}>
        <Form horizontal className="advanced-search-form" form={this.props.form}>
          <Row>
            <Col span="8">
              <FormItem
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                label="宝贝ID：">
                <Input {...getFieldProps('itemId')} placeholder="请输入"/>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                label="宝贝名称：">
                <Input {...getFieldProps('itemName')} placeholder="请输入"/>
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
      </div>
    );
  }
}

export default Form.create()(TreasureForm);
