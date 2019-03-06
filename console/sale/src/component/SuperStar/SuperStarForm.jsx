import React, {PropTypes} from 'react';
import {Button, Form, Select, Row, Col, Input, TreeSelect} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;

class SuperStarForm extends React.Component {

  static propTypes = {
    onSearch: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      activityType: [],
      voucherStatusData: [],
      belongAreaData: [],
      partnerLevelData: [],
      data: [],
    };
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      const params = {
        ...fieldsValue,
      };
      for (const key in params) {
        if (params.hasOwnProperty(key) && !params[key]) {
          delete params[key];
        }
      }
      this.props.onSearch(params);
    });
  }

  handleClear = (e) => {
    e.preventDefault();
    this.props.form.resetFields();
  }

  handleOk = () => {
    this.setState({
      visible: false,
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  render() {
    const {getFieldProps} = this.props.form;
    const {cityList} = this.props;
    const cityOption = cityList.map((item, key) => {
      return (
        <TreeNode value={item.value} title={item.label} key={`select${key}`}>
          {item.children.length > 0 && item.children.map((j) => (
            <TreeNode value={j.value} title={j.label} key={j.value} />
          ))}
        </TreeNode>
      );
    });
    return (
      <div>
        <Form form={this.props.form}>
          <Row>

            <Col span="8">
              <FormItem
                label="品牌名称："
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}>
                <Input {...getFieldProps('name')} placeholder="请输入"/>
              </FormItem>
            </Col>

            <Col span="8">
              <FormItem
                label="商户PID："
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}>
                <Input {...getFieldProps('partnerID')} placeholder="请输入"/>
              </FormItem>
            </Col>

            <Col span="8">
              <FormItem
                label="城市："
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}>
                <TreeSelect
                  {...getFieldProps('cityId')}
                  style={{ width: '100%' }}
                  treeNodeFilterProp="label"
                  showSearch
                  allowClear
                  dropdownStyle={{
                    width: '100%',
                    maxHeight: 350,
                    maxWidth: 300,
                    overflow: 'auto',
                  }}
                >
                  {cityOption}
                </TreeSelect>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <FormItem
                label="状态："
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}>
                <Select
                  {...getFieldProps('status')}>
                  <Option value="all" key="all">全部</Option>
                  <Option value="DRAFT" key="DRAFT">草稿</Option>
                  <Option value="ONSHELF" key="ONSHELF">已上架</Option>
                  <Option value="OFFSHELF" key="OFFSHELF">已下架</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem
                label="品牌ID："
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}>
                <Input {...getFieldProps('brandId')} placeholder="请输入"/>
              </FormItem>
            </Col>
            <Col span="8" style={{textAlign: 'right'}}>
              <Button type="primary" onClick={this.handleSubmit}>搜索</Button>
              <Button onClick={this.handleClear} style={{marginLeft: 10}}>清除条件</Button>
            </Col>
          </Row>
        </Form>
      </div>);
  }
}

export default Form.create()(SuperStarForm);
