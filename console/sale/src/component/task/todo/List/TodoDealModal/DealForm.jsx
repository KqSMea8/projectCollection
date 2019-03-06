import React from 'react';
import {Form, Radio, Input} from 'antd';

const RadioGroup = Radio.Group;

class DealForm extends React.Component {
  render() {
    const { reasonList, resultList, form } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const { getFieldProps, getFieldValue } = form;

    const reason = getFieldValue('reason');

    const reasonProps = getFieldProps('reason', {
      rules: [
        { required: true, message: '选择出现问题的原因' }
      ],
    });
    const resultProps = getFieldProps('result', {
      rules: [
        { required: true, message: '请选择任务是否已经得到解决' }
      ],
    });

    const otherReasonProps = getFieldProps('otherReason', {
      rules: [
        { required: reason === 'OTHER', message: '必填，请描述具体的情况' },
        { max: 100, message: '100字以内' }
      ]
    });
    return (
      <Form>
        <Form.Item
          label="问题是否得到解决"
          required
          {...formItemLayout}
        >
          <RadioGroup {...resultProps}>
            {resultList.map(r => (
              <Radio value={r.id} key={r.id}>{r.name}</Radio>
            ))}
          </RadioGroup>
        </Form.Item>
        <Form.Item
          label="选择出现问题的原因"
          required
          {...formItemLayout}
        >
          <RadioGroup {...reasonProps}>
            {reasonList.map(r => (
              <Radio value={r.id} key={r.id}>{r.name}</Radio>
            ))}
          </RadioGroup>
        </Form.Item>
        {reason === 'OTHER' && (<Form.Item
          label="具体情况"
          required
          {...formItemLayout}
        >
          <Input type="textarea" {...otherReasonProps}/>
        </Form.Item>)}
      </Form>
    );
  }
}

export default Form.create({withRef: true})(DealForm);
