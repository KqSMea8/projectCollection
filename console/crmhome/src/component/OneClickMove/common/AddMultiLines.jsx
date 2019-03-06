import React, { PropTypes } from 'react';
import { Form, Input, Row, Col, Icon, Button } from 'antd';
import BaseFormComponent from './BaseFormComponent';
// import Schema from 'async-validator';
import './AddMultiLines.less';

const FormItem = Form.Item;
export default class AddMultiLines extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    maxRow: PropTypes.number,
  }

  static defaultProps = {
    ...BaseFormComponent.defaultProps,
    maxRow: 1000,
  }
  state = {
    errors: [],
  };
  changeTitle = row => e => {
    const { getFieldValue, setFieldsValue, setFields } = this.form;
    const { field } = this.props;
    let values = [{ title: '', remarks: [''] }];
    if (getFieldValue(field) && !!getFieldValue(field).length) {
      values = [...getFieldValue(field)];
    }
    values[row].title = e.target.value;
    if (!e.target.value && values[row].remarks.filter(r => !!r).length) {
      setFields({
        [field]: {
          value: values,
          errors: [new Error('标题和内容必须同时填写')],
        },
      });
    } else {
      setFieldsValue({
        [field]: values,
      });
    }
    this.checkError();
  }
  checkError = () => {
    const { getFieldValue, setFields } = this.form;
    const { field, maxLength } = this.props;
    const values = [...(getFieldValue(field) || [{ title: '', remarks: [''] }])];
    const errors = values.map(item => {
      const obj = {
        title: maxLength && maxLength.title < item.title.length ? `标题限${maxLength.title}个字` : '',
        remarks: item.remarks.map(r => {
          if (maxLength && r.length > maxLength.remarks) {
            return `内容限${maxLength.remarks}个字`;
          }
          return '';
        }),
      };
      return obj;
    });
    this.setState({ errors });
    setFields({
      commodityDetail: {
        value: {},
        errors: [],
      },
    });
  }
  changeCol = (r, i) => e => {
    const { getFieldValue, setFieldsValue, setFields } = this.form;
    const { field } = this.props;
    const values = [...(getFieldValue(field) || [{ title: '', remarks: [''] }])];
    values[r].remarks[i] = e.target.value;
    if (e.target.value && !values[r].title) {
      setFields({
        [field]: {
          value: values,
          errors: [new Error('标题和内容必须同时填写')],
        },
      });
    } else {
      setFieldsValue({
        [field]: values,
      });
    }
    this.checkError();
  }
  addRow = () => {
    const { getFieldValue, setFieldsValue } = this.form;
    const { field } = this.props;
    const values = [...(getFieldValue(field) || [{ title: '', remarks: [''] }])];
    values.push({ title: '', remarks: [''] });
    setFieldsValue({
      [field]: values,
    });
    this.checkError();
  }
  deleteRow = r => () => {
    const { getFieldValue, setFieldsValue } = this.form;
    const { field } = this.props;
    const values = [...(getFieldValue(field) || [{ title: '', remarks: [''] }])];
    values.splice(r, 1);
    setFieldsValue({
      [field]: values,
    });
    this.checkError();
  }
  deleteCol = (r, i) => () => {
    const { getFieldValue, setFieldsValue } = this.form;
    const { field } = this.props;
    const values = [...(getFieldValue(field) || [{ title: '', remarks: [''] }])];
    values[r].remarks.splice(i, 1);
    setFieldsValue({
      [field]: values,
    });
    this.checkError();
  }
  addCol = row => () => {
    const { getFieldValue, setFieldsValue } = this.form;
    const { field } = this.props;
    const values = [...(getFieldValue(field) || [{ title: '', remarks: [''] }])];
    values[row].remarks.push('');
    setFieldsValue({
      [field]: values,
    });
  }
  get fetchContent() {
    const { field, placeholder, maxRow, extra, maxCol } = this.props;
    const { errors } = this.state;
    const { getFieldValue, getFieldProps } = this.form;
    const values = getFieldValue(field) || [];
    if (values.length === 0) {
      values.push({
        title: '',
        remarks: [''],
      });
    }
    const err = !!errors.length ? errors : values.map(r => {
      return {
        title: '',
        remarks: r.remarks.map(() => ''),
      };
    });
    return [<div className="add-multi-lines">
      <FormItem>
        {values.map((value, row) => {
          return (
            <div>
              <Row style={{ marginBottom: 10 }}>
                <Col span="20">
                  <span style={{ display: 'table-cell', width: 50 }}>{`标题${row + 1}`}</span>
                  <FormItem
                    style={{ display: 'table-cell', verticalAlign: 'top', width: '90%' }}
                    validateStatus={err[row].title ? 'error' : 'success'}
                    help={err[row].title || null}
                  >
                    <Input size="large" placeholder={placeholder.title} value={value.title} onChange={this.changeTitle(row)} />
                  </FormItem>
                </Col>
                <Col span="2">{values.length > 1 && <Icon style={{ color: '#999', fontSize: 15, marginLeft: 5 }} type="minus-circle-o" onClick={this.deleteRow(row)} />}</Col>
              </Row>
              {value.remarks.map((item, i) =>
                (<Row key={i} style={{ marginBottom: 10 }}>
                  <Col span="20">
                    <FormItem
                      validateStatus={err[row].remarks[i] ? 'error' : 'success'}
                      help={err[row].remarks[i] || null}
                      style={{ display: 'table-cell', width: 500 }}
                    >
                      <Input size="large" placeholder={placeholder.remarks} value={item} onChange={this.changeCol(row, i)} />
                    </FormItem>
                  </Col>
                  <Col span="2">
                    {value.remarks.length - 1 === i && value.remarks.length < maxCol && <Icon style={{ color: '#0ae', fontSize: 15, marginLeft: 5 }} type="plus-circle" onClick={this.addCol(row)} />}
                    {value.remarks.length > 1 && <Icon style={{ color: '#999', fontSize: 15, marginLeft: 5 }} type="minus-circle-o" onClick={this.deleteCol(row, i)} />}
                  </Col>
                </Row>))}
            </div>
          );
        })}
        <input type="hidden" {...getFieldProps(field, { rules: [this.commonValidate], initialValue: [{ title: '', remarks: [''] }] })} />
      </FormItem>
      {values.length < maxRow && <div style={{ margin: '25px 0' }}>
        <Button onClick={this.addRow} >再加一组</Button>
        <span className="extea-span" >{(extra || []).map(ext => <span>{ext}<br /></span>)}</span>
      </div>}
    </div>];
  }
  commonValidate = (r, values, cb) => {
    if (values && !!values.length) {
      const { maxLength } = this.props;
      values.map(item => {
        if (maxLength && maxLength.title < item.title.length) {
          cb(`标题限${maxLength.title}个字`);
          return;
        }
        item.remarks.map(r1 => {
          if (maxLength && r1.length > maxLength.remarks) {
            cb(`内容限${maxLength.remarks}个字`);
            return;
          }
        });
      });
      values.forEach(item => {
        if (!item.title && item.remarks.filter(ite => !!ite).length ||
          item.title && !item.remarks.filter(ite => !!ite).length) {
          cb('标题和内容必须同时填写');
          return;
        }
      });
    }
    cb();
  }
  render() {
    const { label, required, labelCol, wrapperCol } = this.props;
    return (
      <FormItem
        label={label}
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
      >
        {React.createElement('div', null, ...this.fetchContent)}
      </FormItem>
    );
  }
}
