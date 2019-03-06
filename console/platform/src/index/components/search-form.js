import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Form, Input } from 'antd';

const { func, object } = PropTypes;

const FormItem = Form.Item;

@Form.create()
export default class SearchForm extends PureComponent {
  static propTypes = {
    onSearch: func,
    form: object,
  }

  handleSearch = () => {
    this.props.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.props.onSearch(values);
    });
  }

  render() {
    const { getFieldProps } = this.props.form;
    return (
      <Form className="search-form" horizontal>
        <Row>
          <Col span="12">
            <FormItem label="名称："
              labelCol={{ span: 2 }}
              wrapperCol={{ span: 12 }} >
              <Input {...getFieldProps('name')} placeholder="请输入" />
            </FormItem>
          </Col>
          <Col span="1" offset="10" style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={this.handleSearch}>搜索</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
