import React, { PropTypes } from 'react';
import { Form, Input, Row, Col, InputNumber, Select, Icon } from 'antd';
import BaseFormComponent from './BaseFormComponent';

const FormItem = Form.Item;
const Option = Select.Option;
export default class AddService extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    maxLength: PropTypes.number,
  }

  static defaultProps = {
    ...BaseFormComponent.defaultProps,
    maxLength: 20,
  }
  state = {
    errors: [],
  };
  onChange = (type, i, colField) => e => {
    const { getFieldValue, setFieldsValue } = this.form;
    const { field, col1, col2, col3, col4 } = this.props;
    const initArr = [{
      [col1.field]: '', [col2.field]: '', [col3.field]: '', [col4.field]: '',
    }, { [col1.field]: '', [col2.field]: '', [col3.field]: '', [col4.field]: '' }];
    const fieldValue = getFieldValue(field);
    const values = fieldValue && !!fieldValue.length ? fieldValue : initArr;
    if (type === 'change') {
      if (colField === col2.field) {
        values[i][colField] = e;
      } else if (colField === col3.field) {
        values[i][colField] = !!e.length ? e[e.length - 1] : '';
      } else {
        values[i][colField] = e.target.value;
      }
    } else if (type === 'add') {
      values.push({ [col1.field]: '', [col2.field]: '', [col3.field]: '', [col4.field]: '' });
    } else if (type === 'delete') {
      if (values.length > 2) {
        values.splice(i, 1);
      } else {
        values[i] = { [col1.field]: '', [col2.field]: '', [col3.field]: '', [col4.field]: '' };
      }
    }
    setFieldsValue({
      [field]: values,
    });
    this.checkError();
  }
  checkError = () => {
    const { getFieldValue, setFields } = this.form;
    const { field, col1, col2, col3, col4 } = this.props;
    let isRequired = false;
    getFieldValue(field).forEach(v => {
      if (v[col1.field] || v[col2.field] || v[col3.field] || v[col4.field]) {
        isRequired = true;
        return;
      }
    });
    const err = getFieldValue(field).map((item) => {
      const obj = { [col1.field]: '', [col2.field]: '', [col3.field]: '', [col4.field]: '' };
      if (col1.max && item[col1.field].length > col1.max) obj[col1.field] = `${col1.name}限${col1.max}个字`;
      if (col2.max && item[col2.field].length > col2.max) obj[col2.field] = `${col2.name}限${col2.max}个字`;
      if (col3.max && item[col3.field].length > col3.max) obj[col3.field] = `${col3.name}限${col3.max}个字`;
      if (col4.max && item[col4.field].length > col4.max) obj[col4.field] = `${col4.name}限${col4.max}个字`;
      if (isRequired && !item[col1.field]) obj[col1.field] = `请填写${col1.name}`;
      if (isRequired && !item[col2.field]) obj[col2.field] = `请填写${col2.name}`;
      if (isRequired && item[col2.field] && item[col2.field] <= 0) obj[col2.field] = '必须大于0';
      if (isRequired && !item[col3.field]) obj[col3.field] = `请填写${col3.name}`;
      return obj;
    });
    this.setState({ errors: err });
    setFields({
      commodityDetail: {
        value: {},
        errors: [],
      },
    });
  }
  get fetchContent() {
    const { field, maxLength, col1, col2, col3, col4 } = this.props;
    const { errors } = this.state;
    const { getFieldValue } = this.form;
    const localFieldValue = getFieldValue(field);
    const fakeField = !!localFieldValue && localFieldValue.length ? localFieldValue : [{
      [col1.field]: '',
      [col2.field]: '',
      [col3.field]: '',
      [col4.field]: '',
    }, {
      [col1.field]: '',
      [col2.field]: '',
      [col3.field]: '',
      [col4.field]: '',
    }];
    return [<div>
      <Row>
        <Col span="7">{col1.name}</Col>
        <Col span="3">{col2.name}</Col>
        <Col span="4">{col3.name}</Col>
        <Col span="6">{col4.name}</Col>
        <Col span="2" />
      </Row>
      {fakeField.map((item, i) => {
        const unit = item[col3.field] ? [item[col3.field]] : [];
        return (
          <Row key={i}>
            <Col span="7">
              <FormItem style={{ marginBottom: 10, paddingRight: 5 }}
                validateStatus={errors[i] && errors[i][col1.field] ? 'error' : 'success'}
                help={errors[i] && errors[i][col1.field] || null}
              >
                <Input placeholder={col1.placeholder} value={item[col1.field]} onChange={this.onChange('change', i, col1.field)} />
              </FormItem>
            </Col>
            <Col span="3">
              <FormItem style={{ marginBottom: 10, paddingRight: 5 }}
                validateStatus={errors[i] && errors[i][col2.field] ? 'error' : 'success'}
                help={errors[i] && errors[i][col2.field] || null}
              >
                <InputNumber value={item[col2.field]} placeholder={col2.placeholder} onChange={this.onChange('change', i, col2.field)} style={{ width: '100%', marginTop: -3 }} step={0.1} />
              </FormItem>
            </Col>
            <Col span="4">
              <FormItem style={{ marginBottom: 10, paddingRight: 5 }}
                validateStatus={errors[i] && errors[i][col3.field] ? 'error' : 'success'}
                help={errors[i] && errors[i][col3.field] || null}
              >
                <Select tags placeholder={col3.placeholder} value={unit} onChange={this.onChange('change', i, col3.field)} style={{ width: '100%', marginTop: -3 }}>
                  {(col3.options || []).map((ite) => <Option key={ite.key} value={ite.key}>{ite.value}</Option>)}
                </Select>
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem style={{ marginBottom: 10 }}
                validateStatus={errors[i] && errors[i][col4.field] ? 'error' : 'success'}
                help={errors[i] && errors[i][col4.field] || null}
              >
                <Input placeholder={col4.placeholder} value={item[col4.field]} onChange={this.onChange('change', i, col4.field)} />
              </FormItem>
            </Col>
            <Col span="2">
              {fakeField.length < maxLength && fakeField.length - 1 === i && <Icon style={{ color: '#0ae', fontSize: 15, marginLeft: 5 }} type="plus-circle" onClick={this.onChange('add')} />}
              <Icon style={{ color: '#999', fontSize: 15, marginLeft: 5 }} type="minus-circle-o" onClick={this.onChange('delete', i)} />
            </Col>
          </Row>
        );
      })}
    </div>];
  }
  commonValidate = (r, values, cb) => {
    const { col1, col2, col3, col4, label } = this.props;
    if (!!this.state.errors.length) {
      this.checkError();
      const errs = this.state.errors.filter(v => v[col1.field] || v[col2.field] || v[col3.field] || v[col4.field]);
      if (!!errs.length) {
        cb(`请输入正确的${label}`);
      }
    }
    cb();
  }
  render() {
    const { label, extra, required, labelCol, wrapperCol, field, col1, col2, col3, col4 } = this.props;
    const { getFieldProps } = this.form;
    const initArr = [{
      [col1.field]: '', [col2.field]: '', [col3.field]: '', [col4.field]: '',
    }, { [col1.field]: '', [col2.field]: '', [col3.field]: '', [col4.field]: '' }];
    return (
      <FormItem
        label={label}
        required={required}
        extra={extra}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
      >
        <input type="hidden" {...getFieldProps(field, {rules: [this.commonValidate], initialValue: initArr})} />
        {React.createElement('div', null, ...this.fetchContent)}
      </FormItem>
    );
  }
}
