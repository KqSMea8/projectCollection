import React, { Component } from 'react';
import { Form, Button, Col, Row } from 'antd';
import UserSelect from '../../../../../common/UserSelect';
import StuffSelect from '../../common/StuffSelect';
import { USER_TYPE } from '../../common/enums';
const FormItem = Form.Item;

class FilterForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        const { stuff, staff } = values;
        const [ , templateNickName ] = stuff || ['', ''];
        this.props.onSubmit({
          templateNickName,
          applicant: staff ? staff.id : '',
        });
      }
    });
  }

  handleReset(e) {
    e.preventDefault();
    this.props.form.resetFields();
    this.handleSubmit(e);
  }

  render() {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form
        horizontal
        className="advanced-search-form"
        onSubmit={this.handleSubmit}
      >
        <Row >
          <Col span="8">
            <FormItem
              {...formItemLayout}
              label="模板类型："
            >
              <StuffSelect
                {...getFieldProps('stuff')}
              />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
              {...formItemLayout}
              label="生成人："
            >
              <UserSelect
                allowClear
                disabled={window.APP.userType === USER_TYPE.BUC}
                {...getFieldProps('staff', {})}
              />
            </FormItem>
          </Col>
          <Col span="8">
            <div style={{float: 'right'}}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: 12 }}
              >
                搜索
              </Button>
              <Button
                type="ghost"
                htmlType="reset"
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
