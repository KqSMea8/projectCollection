import React, {PropTypes} from 'react';
import { Input, Row, Col, Button, Form } from 'antd';
const FormItem = Form.Item;

const MyBrandsForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
  },

  handleSubmit(e) {
    e.preventDefault();
    const info = {...this.props.form.getFieldsValue()};
    this.props.onSearch(info);
  },

  render() {
    const {getFieldProps} = this.props.form;
    return (<div>
      <Form horizontal className="advanced-search-form">
        <Row>
          <Col span="24">
            <FormItem
              labelCol={{span: 2}}
              wrapperCol={{span: 22}}
              label="搜索：">
              <Input {...getFieldProps('brandName')} placeholder="搜索品牌名" style={{width: '30%'}}/>
              <Button type="ghost" onClick={this.handleSubmit} style={{marginLeft: '10px'}} >搜索</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>);
  },
});

export default Form.create()(MyBrandsForm);
