import React, { PropTypes } from 'react';
import { Row, Col, Form, Button, Select } from 'antd';
import CreateBtn from './CreateBtn';

const FormItem = Form.Item;
const Option = Select.Option;

const CaterinForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
    options: PropTypes.array,
    categoryOptions: PropTypes.array,
    goodsCategoryOptions: PropTypes.array,
  },

  getInitialState() {
    return {
      options: [],
      info: {},
    };
  },


  onSearch() {
    const info = this.props.form.getFieldsValue();
    this.props.onSearch(info);
  },
  getProfessionValue(value) {
    this.props.getProfessionValue(value);
  },

  render() {
    const { getFieldProps } = this.props.form;
    return (
      <Form horizontal className="advanced-search-form" form={this.props.form} style={{ paddingBottom: 0, marginTop: 12 }}>
        <Row key="2">
          <Col span={6} style={{ display: 'relative' }}>
            <FormItem
              label="所属行业："
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}>
              <Select
                {...getFieldProps('industry', {
                  initialValue: 'ALL',
                })}
                style={{ width: 100 }}
                onSelect={this.getProfessionValue}
              >
                {this.props.categoryOptions.map(opt => (
                  <Option key={opt.code} value={opt.code}>{opt.name}</Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col span={6} style={{ display: 'relative' }}>
            <FormItem
              label="商品状态："
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}>
              <Select
                {...getFieldProps('status', {
                  initialValue: '',
                })}
                style={{ width: 100 }}
              >
                {this.props.options.map(opt => (
                  <Option key={opt.key} value={opt.key}>{opt.name}</Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col span={6} offset={6}>
            <div style={{ float: 'right', paddingRight: 18 }}>
              <Button type="primary" onClick={this.onSearch}>搜索</Button>
              <CreateBtn/>
            </div>
          </Col>
        </Row>
      </Form>
    );
  },
});

export default Form.create()(CaterinForm);
