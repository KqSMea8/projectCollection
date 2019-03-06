import React, {PropTypes} from 'react';
import {Input, Button, Form, Select, Cascader} from 'antd';


const FormItem = Form.Item;
const Option = Select.Option;

const ListForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
    brandList: PropTypes.array,
    cateList: PropTypes.array,
  },

  displayRender(label) {
    return label[label.length - 1];
  },

  handleSubmit(e) {
    e.preventDefault();
    const params = this.props.form.getFieldsValue();

    if (params && params.categoryCode) {
      Object.assign(params, {
        categoryCode: params.categoryCode[params.categoryCode.length - 1],
      });
    }

    this.props.onSearch(params);
  },

  handleClear(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },

  render() {
    const { getFieldProps } = this.props.form;

    return (
    <div>
      <Form inline form={this.props.form} onSubmit={this.handleSubmit} className="advanced-search-form">
        <FormItem id="cateSelect"
                  label="品类：">
          <Cascader options={this.props.cateList}
                    expandTrigger="hover"
                    displayRender={this.displayRender}
                    style={{width: 200}}
                    placeholder="请选择品类"
                    size="large"
                    allowClear={false}
            {...getFieldProps('categoryCode')}
          />
        </FormItem>

        <FormItem
          id="brandSelect"
          label="品牌：">
          <Select id="brandSelect"
                  placeholder="请选择品牌"
                  style={{ width: 200 }}
                  size="default"
            {...getFieldProps('brandCode')}
          >
          <Option value="">请选择品牌</Option>
          {this.props.brandList.map((item, key) => {
            return (
              <Option key={key} value={item.brandCode}>{item.name}</Option>
            );
          })}
          </Select>
        </FormItem>

        <FormItem>
          <Input size="large"
                 style={{ width: 300 }}
                 placeholder="请输入商品名称"
            {...getFieldProps('title')}
          />
        </FormItem>

        <Button type="primary" htmlType="submit">搜索</Button>
        <Button type="ghost" onClick={this.handleClear}>清除条件</Button>
      </Form>
    </div>);
  },
});

export default Form.create()(ListForm);
