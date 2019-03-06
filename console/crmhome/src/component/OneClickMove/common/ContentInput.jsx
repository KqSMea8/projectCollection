import React from 'react';
import { Form, Input, Row, Col, Icon } from 'antd';
import BaseFormComponent from './BaseFormComponent';
import { fixFrameHeight } from '../../../common/utils';

const FormItem = Form.Item;
const isIframe = window.parent !== window;

export default class InputComponent extends BaseFormComponent {
  static defaultProps = {
    max: null,
  }
  constructor(props, ctx) {
    super(props, ctx);
    this.form = ctx.form;
    this.state = {
      initContent: props.data && props.data.length > 0 ? props.data
        : [{ [props.fieldChild.title]: '', [props.fieldChild.content]: [''] }],
    };
  }
  componentDidMount() {
    this.setFormContent();
    setTimeout(fixFrameHeight(), 500);
  }
  // 设置每个表单内容
  setFormContent = () => {
    const { setFieldsValue } = this.form;
    const { title, content } = this.props.fieldChild;
    const { field } = this.props;
    const initContent = this.state.initContent;
    initContent.forEach((item, row) => {
      setFieldsValue({
        [field + row]: item[title],
      });
      item[content].forEach((v, col) => {
        setFieldsValue({
          [field + row + 'c' + col]: v,
        });
      });
    });
    setFieldsValue({
      [field]: initContent,
    });
  }
  // 更新标题
  changeTitle = row => e => {
    const { title } = this.props.fieldChild;
    const initContent = this.state.initContent;
    initContent[row][title] = e.target.value;
    this.setState({
      initContent,
    });
    this.setFormContent();
  }
  // 更新内容
  changeContent = (row, col) => e => {
    const { content } = this.props.fieldChild;
    const initContent = this.state.initContent;
    initContent[row][content][col] = e.target.value;
    this.setState({
      initContent,
    });
    this.setFormContent();
  }
  // 新增内容行
  addCol = row => {
    const { content } = this.props.fieldChild;
    const initContent = this.state.initContent;
    initContent[row][content].push('');
    this.setState({
      initContent,
    });
    this.setFormContent();
    if (isIframe) {
      fixFrameHeight();
    }
  }
  deleteCol = (row, col) => {
    const key = Number(col);
    const RowKey = Number(row);
    const { content } = this.props.fieldChild;
    const initContent = this.state.initContent;
    initContent[RowKey][content].splice(key, 1);
    this.setState({
      initContent,
    });
    this.setFormContent();
    if (isIframe) {
      fixFrameHeight();
    }
  }
  // 新增组
  addRow = () => {
    const { title, content } = this.props.fieldChild;
    const initContent = this.state.initContent;
    initContent.push({ [title]: '', [content]: [''] });
    this.setState({
      initContent,
    }, () => {
      if (isIframe) {
        fixFrameHeight();
      }
    });
    this.setFormContent();
  }
  deleteRow = row => {
    const key = Number(row);
    const initContent = this.state.initContent;
    initContent.splice(key, 1);
    this.setState({
      initContent,
    }, () => {
      if (isIframe) {
        fixFrameHeight();
      }
    });
    this.setFormContent();
  }
  isEmpty = row => (r, v, c) => {
    const { initContent } = this.state;
    const { title, content } = this.props.fieldChild;
    if (initContent[row][content].some(d => d) && !initContent[row][title] ||
      initContent[row][title] && !initContent[row][content].some(d => d)) {
      c('标题和内容必须同时填写');
    }
    c();
  }
  get fetchContent() {
    const { initContent } = this.state;
    const { getFieldProps } = this.form;
    const { content } = this.props.fieldChild;
    const { field, rules, placeholder, maxRow, maxCol } = this.props;
    const myMaxRow = maxRow || 10;
    const myMaxCol = maxCol || 10;
    return initContent.map((item, row) => {
      return (<div key={row}>
        <Row>
          <Col span="21">
            <FormItem style={{ marginBottom: 10 }}>
              <Input placeholder={placeholder.title} {...getFieldProps(field + row, {
                onChange: this.changeTitle(row),
                rules: [...(rules.title || []), this.isEmpty(row)],
              }) } />
            </FormItem>
          </Col>
        </Row>
        {item[content].map((v, col) => {
          return (<Row style={{ marginBottom: 10 }} key={col}>
            <Col span="21">
              <FormItem style={{ marginBottom: 1 }}>
                <Input type="textarea" {...getFieldProps(field + row + 'c' + col, {
                  onChange: this.changeContent(row, col),
                  rules: [...(rules.content || []), this.isEmpty(row)],
                }) } placeholder={placeholder.content} />
              </FormItem>
            </Col>
            <Col span="3">
              {item[content].length - 1 === col && item[content].length < myMaxCol && <Icon type="plus-circle"
                onClick={(e) => { e.preventDefault(); this.addCol(row); }}
                style={{ marginLeft: 5, color: '#0ae', fontSize: 15 }}
              />}
              {item[content].length > 1 && <Icon type="minus-circle-o"
                onClick={(e) => { e.preventDefault(); this.deleteCol(row, col); }}
                style={{ marginLeft: 5, color: '#999', fontSize: 15 }}
              />}
            </Col>
          </Row>);
        })}
        {initContent.length - 1 === row && initContent.length < myMaxRow && <a onClick={(e) => { e.preventDefault(); this.addRow(); }}>增加组</a>}
        {initContent.length - 1 === row && initContent.length < myMaxRow && initContent.length > 1 && <span> | </span>}
        {initContent.length > 1 && <a onClick={(e) => { e.preventDefault(); this.deleteRow(row); }}>删除组</a>}
      </div>);
    });
  }

  commonValidate = (r, values, cb) => {
    const { required, fieldChild, max, label } = this.props;
    if (required) {
      if (!values || !values.length || values.every(d => !d[fieldChild.title])) {
        return cb('请填写');
      }
    }
    if (max && values && values.length && values.reduce((pre, value) => (pre
      + (value[fieldChild.title] || '').length
      + ((value[fieldChild.content] || ['']).join('')).length), 0) > max) {
      return cb(`${label}的标题和内容文字总数不能超过${max}`);
    }
    cb();
  }

  render() {
    const { label, extra, required, labelCol, wrapperCol } = this.props;
    const { getFieldProps } = this.form;
    const { field } = this.props;
    return (
      <FormItem
        label={label}
        required={required}
        extra={extra}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
      >
        <input type="hidden" {...getFieldProps(field, { rules: [this.commonValidate] }) } />
        {this.fetchContent}
      </FormItem>
    );
  }
}
