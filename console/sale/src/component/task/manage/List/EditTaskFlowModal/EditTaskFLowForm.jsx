import React from 'react';
import {Form, Input} from 'antd';

import {TaskFlowStatus} from '../../../common/enum';

class EditTaskFLowForm extends React.Component {
  render() {
    const {getFieldProps, getFieldValue} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 12}
    };
    const nameProps = getFieldProps('name', {
      rules: [
        {required: true, max: 8, message: '必填，最多8个字'},
      ]
    });
    const descProps = getFieldProps('description', {
      rules: [
        {max: 20, message: '最多20个字'},
      ]
    });
    const status = getFieldValue('status');
    return (
      <Form>
        <input hidden {...getFieldProps('status')} />
        <input hidden {...getFieldProps('bizType')} />
        <Form.Item label="任务流名称" {...formItemLayout} required>
          <Input {...nameProps} placeholder="最多8个字" disabled={status === TaskFlowStatus.ONGOING}/>
        </Form.Item>
        <Form.Item label="任务流描述" {...formItemLayout}>
          <Input {...descProps} placeholder="描述任务的大致执行要求或价值，最多20个字"/>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create({withRef: true})(EditTaskFLowForm);
