import React from 'react';
import { Input, Form, Row, Col, Icon } from 'antd';
import BaseFormComponent from './BaseFormComponent';
import BindArgs from './BindArgs';

const FormItem = Form.Item;

export default class BuyTips extends BaseFormComponent {
  static defaultProps = {
    label: '更多须知内容',
    rules: [],
    values: [{ title: '', content: [''] }],
    subField: {
      title: 'key',
      content: 'value',
    },
  };

  commonValidate = (r, values, cb) => {
    const { maxRow, maxCol, subField } = this.props;
    const { title, content } = subField;
    if ((values || []).some((item) => {
      const t = item[title];
      const c = item[content];
      const rtn = (!!t && !!t.trim() && !c) || (!!c && !!c.join('').trim() && !t);
      return rtn;
    })) {
      return cb('标题和内容必须同时填写');
    }

    if ((values || []).some(d => {
      return d[title] && /[\\"]/.test(d[title]);
    })) {
      return cb('请勿输入特殊字符（英文双引号"反斜杠\\）');
    }

    if (values.length > maxRow) {
      return cb(`不能超过 ${maxRow} 组`);
    }

    if (values.some(v => v[content] && v[content].length > 1000)) {
      return cb(`每组内容不能超过 ${maxCol}`);
    }

    if (values.reduce((rtn, d) => rtn + d[title].length + (d[content] || []).join('').length, 0) > 2000) {
      return cb('总字数不能超过2000');
    }

    cb();
  }

  handleTitleChange = ({ i }, e) => {
    const { title } = this.props.subField;
    const values = this.values;
    values[i] = { ...(values[i] || {}), [title]: e.target.value };
    this.form.setFieldsValue({
      [this.props.field]: values,
    });
    this.form.validateFields([this.props.field]);
  }

  handleContentChange = ({ i, j }, e) => {
    const { content } = this.props.subField;
    const values = this.values;
    values[i] = { ...(values[i] || {}) };
    values[i][content] = [...(values[i][content] || [])];
    values[i][content][j] = e.target.value;
    this.form.setFieldsValue({
      [this.props.field]: values,
    });
    this.form.validateFields([this.props.field]);
  }

  addCol = ({ i }) => {
    const values = this.values;
    const { content } = this.props.subField;
    values[i][content].push('');
    this.form.setFieldsValue({
      [this.props.field]: values,
    });
  }

  deleteCol = ({ i, j }) => {
    const values = this.values;
    const { content } = this.props.subField;
    values[i][content] = [...(values[i][content] || [])];
    values[i][content].splice(j, 1);
    this.form.setFieldsValue({
      [this.props.field]: values,
    });
  }

  addRow = () => {
    const values = this.values;
    const { title, content } = this.props.subField;
    values.push({
      [title]: '', [content]: [''],
    });
    this.form.setFieldsValue({
      [this.props.field]: values,
    });
  }

  deleteRow = ({ i }) => {
    const values = this.values;
    values.splice(i, 1);
    this.form.setFieldsValue({
      [this.props.field]: values,
    });
  }

  get values() {
    const { title, content } = this.props.subField;
    const v = this.form.getFieldValue(this.props.field);
    return v && v.filter(d => !!d[title]).length > 0 ? v : [{ [title]: '', [content]: [''] }];
  }

  render() {
    const { label, labelCol, wrapperCol, required, field, extra, rules } = this.props;
    const { getFieldProps } = this.form;
    const { content, title } = this.props.subField;
    return (
      <FormItem required={required} extra={extra} label={label} labelCol={labelCol} wrapperCol={wrapperCol}>
        <input type="hidden" {...getFieldProps(field, { rules: [this.commonValidate, ...rules] })} />
        {React.Children.toArray(this.values.map((value, i, array) => {
          const t = value[title];
          const cs = value[content];
          return (
            <div>
              <Row>
                <Col span={21}>
                  <FormItem style={{ marginBottom: 10 }}>
                    <BindArgs targets={['onChange']} i={i}>
                      <Input
                        placeholder="标题，限 15 字"
                        value={t}
                        onChange={this.handleTitleChange}
                      />
                    </BindArgs>
                  </FormItem>
                </Col>
              </Row>
              {React.Children.toArray(cs.map((c, j) => {
                return (
                  <Row style={{ marginBottom: 1 }}>
                    <Col span={21}>
                      <FormItem style={{ marginBottom: 1 }}>
                        <BindArgs targets={['onChange']} i={i} j={j}>
                          <Input
                            type="textarea"
                            value={c}
                            onChange={this.handleContentChange}
                          />
                        </BindArgs>
                      </FormItem>
                    </Col>

                    <Col span="3">
                      {cs.length - 1 === j && cs.length < this.props.maxCol && (
                        <BindArgs targets={['onClick']} i={i}>
                          <Icon type="plus-circle"
                            onClick={this.addCol}
                            style={{ marginLeft: 5, color: '#0ae', fontSize: 15 }}
                          />
                        </BindArgs>
                      )}
                      {cs.length > 1 && (
                        <BindArgs targets={['onClick']} i={i} j={j}>
                          <Icon type="minus-circle-o"
                            onClick={this.deleteCol}
                            style={{ marginLeft: 5, color: '#999', fontSize: 15 }}
                          />
                        </BindArgs>
                      )}
                    </Col>
                  </Row>
                );
              }))}
              {array.length - 1 === i && array.length < this.props.maxRow && <a onClick={this.addRow}>增加组</a>}
              {array.length - 1 === i && array.length < this.props.maxRow && array.length > 1 && <span> | </span>}
              {array.length > 1 && <BindArgs targets={['onClick']} i={i}><a onClick={this.deleteRow}>删除组</a></BindArgs>}
            </div>
          );
        }))}
      </FormItem>
    );
  }
}
