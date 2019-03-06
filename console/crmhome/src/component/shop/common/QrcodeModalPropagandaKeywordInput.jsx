import React, {PropTypes} from 'react';
import {Button, Form, Input} from 'antd';
import './QrcodeModalPropaganda.less';

const FormItem = Form.Item;

const QrcodeModalPropagandaKeywordInput = React.createClass({
  propTypes: {
    onSubmit: PropTypes.func,
  },

  handleSubmit() {
    const keyword = this.props.form.getFieldValue('keyword') || '';
    this.props.onSubmit(keyword);
  },

  render() {
    const { form } = this.props;
    const { getFieldProps } = form;
    return (
      <Form inline form={form}>
        <FormItem className="__qrcode-propaganda-input"
          label="关键字："
          help="如：海底捞(西湖店)，设置搜索的关键字“海底捞”、“西湖店”、“火锅”，帮助用户更准确搜到您的门店。">
          <Input placeholder="请从门店名称中取关键字作为搜搜" {...getFieldProps('keyword')}/>
        </FormItem>
        <Button type="primary" onClick={this.handleSubmit}>生成二维码</Button>
      </Form>);
  },
});

export default Form.create()(QrcodeModalPropagandaKeywordInput);
