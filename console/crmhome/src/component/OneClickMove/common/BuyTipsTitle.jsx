import React from 'react';
import { Form, Input } from 'antd';

export default class Title extends React.Component {
  handleChange = v => {
    this.props.onChange(v, this.props.index);
  }

  render() {
    return (
      <Form.Item>
        <Input value={this.props.value} onChange={this.handleChange} placeholder={this.props.placeholder} />
      </Form.Item>
    );
  }
}
