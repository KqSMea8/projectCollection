import React from 'react';
import { Form, Select, InputNumber, Row, Col } from 'antd';
import { pick } from 'lodash';
import Base from './BaseFormComponent';

const FormItem = Form.Item;
const Option = Select.Option;

export default class MinimumAmount extends Base {
  static propTypes = {
    ...Base.propTypes,
  }
  static defaultProps = {
    ...Base.defaultProps,
    label: '使用条件',
    rules: [],
  }

  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      type: !!ctx.form.getFieldValue(props.field) ? '1' : '0',
    };
  }

  onSelectChange = v => {
    this.setState({ type: v });
    if (v === '0') {
      this.form.setFieldsValue({
        [this.props.field]: '',
      });
    }
  }

  render() {
    const fmProps = pick(this.props, ['label', 'labelCol', 'wrapperCol', 'help', 'extra', 'required']);
    const err = this.form.getFieldError(this.props.field);
    fmProps.validateStatus = err ? 'error' : undefined;
    fmProps.help = fmProps.help || err;
    return (
      <FormItem
        {...fmProps}
      >
        <Row gutter={4}>
          <Col span={7}>
            <Select onChange={this.onSelectChange} value={this.state.type}>
              <Option key="0">不限制</Option>
              <Option key="1">设置最低消费</Option>
            </Select>
          </Col>
          {this.state.type === '1' && (
            <Col span={17} offset={0}>
              消费满&nbsp;
              <InputNumber min={0} step={0.01}
                {...this.form.getFieldProps(this.props.field, {
                  rules: [...this.props.rules || []],
                  normalize: (v = '') => { return v.toString(); },
                }) }
              />
              元可用
          </Col>
          )}
        </Row>
      </FormItem>
    );
  }
}
