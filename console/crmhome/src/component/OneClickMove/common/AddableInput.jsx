import React, { PropTypes } from 'react';
import { Form, Input, Row, Col, Icon } from 'antd';
import BaseFormComponent from './BaseFormComponent';
import Schema from 'async-validator';

const FormItem = Form.Item;

export default class AddableInput extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    maxRow: PropTypes.number,
    inputCol: PropTypes.number,
    btnCol: PropTypes.number,
  }

  static defaultProps = {
    ...BaseFormComponent.defaultProps,
    maxRow: 1000,
    styleText: false, // true显示‘增加’文字,false显示‘+’Icon
    inputCol: 19,
    btnCol: 5,
  }

  changeRow = row => e => {
    const { getFieldValue, setFieldsValue } = this.form;
    const { field } = this.props;
    const values = [...(getFieldValue(field) || [])];
    values[row] = e.target.value || '';
    setFieldsValue({
      [field]: values,
    });
    this.form.validateFields([field]);
  }

  // 新增行
  addRow = () => {
    const { getFieldValue, setFieldsValue } = this.form;
    const { field } = this.props;
    const values = [...(getFieldValue(field) || [])];
    values.push('');
    setFieldsValue({
      [field]: values.slice(0, this.props.maxRow),
    });
    this.form.validateFields([field]);
  }

  deleteRow = row => () => {
    const { getFieldValue, setFieldsValue } = this.form;
    const { field } = this.props;
    const fieldData = [...(getFieldValue(field) || [])];
    fieldData.splice(row, 1);
    setFieldsValue({
      [field]: fieldData,
    });
    this.form.validateFields([field]);
  }

  get fetchContent() {
    const { field, placeholder, maxRow, inputCol, btnCol, styleText } = this.props;
    const { getFieldValue, getFieldError } = this.form;
    const values = getFieldValue(field) || [];
    if (values.length === 0) {
      values.push('');
    }
    const errors = [];
    (getFieldError(field) || []).forEach(err => {
      const tmp = err.split('|');
      if (tmp.length === 2) {
        errors[tmp[0]] = tmp[1];
      }
    });
    return values.map((value, row) => {
      return (
        <Row>
          <Col span={inputCol || 22}>
            <FormItem style={{ marginBottom: 10 }}
              validateStatus={errors[row] ? 'error' : 'success'}
              help={errors[row] || null}
            >
              <Input placeholder={placeholder}
                onChange={this.changeRow(row)}
                value={value}
              />
            </FormItem>
          </Col>
          <Col span={btnCol || 2}>
            {values.length - 1 === row && values.length < maxRow && !styleText && (
              <Icon
                style={{ color: '#0ae', fontSize: 15, marginLeft: 5 }}
                type="plus-circle"
                onClick={this.addRow}
              />
            )}
            {values.length > 1 && !styleText && (
              <Icon
                type="minus-circle-o"
                style={{ color: '#999', fontSize: 15, marginLeft: 5 }}
                onClick={this.deleteRow(row)}
              />
            )}
            {values.length - 1 === row && values.length < maxRow && styleText && <a style={{ paddingLeft: 8 }} onClick={this.addRow}>增加</a>}
            {values.length > 1 && styleText && <a style={{ paddingLeft: 8 }} onClick={this.deleteRow(row)}>删除</a>}
          </Col>
        </Row>
      );
    });
  }
  commonValidate = (r, values, cb) => {
    const { required } = this.props;
    if (required) {
      if (!values || !values.length || values.every(d => !d)) {
        return cb('请填写');
      }
    }

    const rowValidator = new Schema({ value: [...this.props.rules] });
    if (values && values.length) {
      values.forEach((v, row) => {
        rowValidator.validate({value: v}, errs => {
          if (errs && errs.length) {
            errs.forEach(err => cb(`${row}|${err.message}`));
          }
        });
      });
    }
    cb();
  }
  render() {
    const { label, extra, required, labelCol, wrapperCol, field } = this.props;
    const { getFieldProps, getFieldError } = this.form;
    const errors = (getFieldError(field) || []).filter(err => err.split('|').length !== 2);
    return (
      <FormItem
        label={label}
        required={required}
        extra={extra}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        validateStatus={errors.length > 0 ? 'error' : 'success'}
        help={this.props.help || errors.join(',')}
      >
        <input type="hidden" {...getFieldProps(field, { rules: [this.commonValidate], initialValue: this.props.defaultValue || [''] }) } />
        {React.createElement('div', null, ...this.fetchContent)}
      </FormItem>
    );
  }
}
