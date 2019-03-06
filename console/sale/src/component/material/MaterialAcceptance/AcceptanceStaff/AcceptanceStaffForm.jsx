import React, {PropTypes} from 'react';
import { Row, Col, Form, Input, Button } from 'antd';
const FormItem = Form.Item;

const AcceptanceStaffForm = React.createClass({
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
  render() {
    const {getFieldProps} = this.props.form;
    return (<div>
      <Form className="advanced-search-form" horizontal>
        <Row>
          <Col span="8">
            <FormItem
              labelCol={{span: 6}}
              wrapperCol={{span: 18}}
              label="负责任务："><Input placeholder="请输入" {...getFieldProps('name')}/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="验收人："><Input placeholder="请输入" {...getFieldProps('name')}/>
            </FormItem>
          </Col>
          <Col span="5" offset="3" style={{textAlign: 'right'}}>
            <Button type="primary" onClick={this.onSearch}>搜索</Button>
          </Col>
        </Row>
      </Form>
    </div>);
  },
});

export default Form.create()(AcceptanceStaffForm);
