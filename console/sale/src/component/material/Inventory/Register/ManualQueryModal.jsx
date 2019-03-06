import React, { Component } from 'react';
import { Modal, Form, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class ManualQueryModal extends Component {
  constructor() {
    super();
  }

  handleOk = () => {
    const {form, submitQuery} = this.props;
    form.validateFields((errors, values) => {
      if (!errors) {
        submitQuery(values);
      }
    });
  };

  handleCancel = () => {
    location.hash = '#/material/applicationManagement/applicationRecord/koubei';
  };

  render() {
    const {visible, expressProviderList} = this.props;
    const {getFieldProps} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 4, offset: 4},
      wrapperCol: {span: 12},
    };
    return (
        <Modal
          width={480}
          visible={visible}
          title="入库"
          closable={false}
          maskClosable={false}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form horizontal>
            <FormItem
              {...formItemLayout}
              required
              label="物流公司"
            >
              <Select
                {...getFieldProps('expressProvider', {
                  rules: [
                    {
                      required: true,
                      message: '请选择物流公司'
                    }
                  ]
                })}
              >
                {expressProviderList.map( p => <Option value={p.code} key={p.code}>{p.name}</Option>)}
              </Select>
            </FormItem>
            <FormItem
              {...formItemLayout}
              required
              label="物流单号"
            >
              <Input
                {...getFieldProps('expressNo', {
                  rules: [
                    {
                      required: true,
                      message: '请填写物流单号'
                    }
                  ]
                })}
              />
            </FormItem>
          </Form>
        </Modal>
    );
  }
}

export default Form.create()(ManualQueryModal);
