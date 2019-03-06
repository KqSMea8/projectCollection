import React from 'react';
import { Form, Input, Row, Col, Button, Icon, Select, InputNumber } from 'antd';
import BaseFormComponent from '../BaseFormComponent';
import { fixFrameHeight } from '../../../../common/utils';
import componentGetter from '../ComponentGetter';
import { cloneDeep } from 'lodash';
import './content.less';


const FormItem = Form.Item;
const Option = Select.Option;
const isIframe = window.parent !== window;
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 17 },
};


export default class CommodityContent extends BaseFormComponent {
  constructor(props, ctx) {
    super(props, ctx);
    this.form = ctx.form;
  }
  componentDidMount() {
    this.setFormInitContent();
    setTimeout(fixFrameHeight(), 500);
  }
  setFormInitContent = () => {
    const { getFieldValue } = this.form;
    const { field, col4 } = this.props;
    let contentsField = cloneDeep(getFieldValue(field));
    const unitInit = col4.initialValue || '';
    if (!contentsField || !contentsField.length) {
      contentsField = [{
        title: '',
        itemUnits: [{
          name: '',
          price: '',
          amount: '',
          unit: unitInit,
          spec: '',
        }],
      }];
    }
    this.setGroupContent(contentsField);
  }
  setGroupContent = (input) => {
    const { setFieldsValue } = this.form;
    const { field, title, group, col1, col2, col3, col4, col5 } = this.props;
    if (Array.isArray(input)) {
      input.forEach((item, row) => {
        if (Array.isArray(item[group.field])) {
          item[group.field].forEach((inneritem, col) => {
            setFieldsValue({
              [field + row + 'group' + col + col1.field]: inneritem[col1.field],
              [field + row + 'group' + col + col2.field]: inneritem[col2.field],
              [field + row + 'group' + col + col3.field]: inneritem[col3.field],
              [field + row + 'group' + col + col4.field]: inneritem[col4.field],
              [field + row + 'group' + col + col5.field]: inneritem[col5.field],
            });
          });
        }
        setFieldsValue({
          [field + row + 'title']: item[title.field],
        });
      });
    }
    setFieldsValue({
      [field]: input,
    });
  }
  // 设置每个表单内容
  setFormContent = (val) => {
    const { fieldOuter } = this.props;
    const { setFields } = this.form;
    if (val) {
      this.setGroupContent(val);
      if (fieldOuter) {
        setFields({
          [fieldOuter]: {
            value: {},
            errors: [],
          },
        });
      } else {
        setFields({
          commodityDetail: {
            value: {},
            errors: [],
          },
        });
      }
    }
  }

  get getAddableInput() {
    const { supplementary } = this.props;
    return (<Row>
      {
        componentGetter({ ...formItemLayout, ...cloneDeep(supplementary) })
      }
    </Row>);
  }
  get getAddMultiLines() {
    const { commodityDescription } = this.props;
    return (<Row>
      {
        componentGetter({ ...formItemLayout, ...cloneDeep(commodityDescription) })
      }
    </Row>);
  }
  get fetchContent() {
    const { getFieldProps, getFieldValue } = this.form;
    const { field, title, group, col1, col2, col3, col4, col5, maxRow, maxCol, maxColTotal, extra } = this.props;
    const localFieldValue = getFieldValue(field);
    const fakeField = !!localFieldValue ? localFieldValue : [{
      [group.field]: [],
      [title.field]: '',
    }];
    return fakeField.map((item, row) => {
      return (<div key={row} className="content-wrapper">
        <Row>
          <Row>
            <Col span="20">
              <span style={{ display: 'inline-block' }}>{`分类${row + 1}`}</span>
              <FormItem style={{ display: 'inline-block', verticalAlign: 'top', width: '90%', float: 'right' }}>
                <Input placeholder={title.placeholder} {...getFieldProps(field + row + 'title', {
                  onChange: this.changeTitle(row),
                  rules: [...title.rules],
                })} />
              </FormItem>
            </Col>
            <Col span="2">{fakeField.length > 1 && <Icon style={{ color: '#999', fontSize: 15, marginLeft: 5 }} type="minus-circle-o" onClick={(e) => { e.preventDefault(); this.deleteRow(row); }} />}</Col>
          </Row>
          <Row>
            <Col span="22">
              <Row>
                <Col span="7">{col1.name}</Col>
                <Col span="3">{col2.name}</Col>
                <Col span="3">{col3.name}</Col>
                <Col span="4">{col4.name}</Col>
                <Col span="5">{col5.name}</Col>
                <Col span="2" />
              </Row>
              {item[group.field].map((v, col) => {
                const unit = v.unit ? [v.unit] : [];
                return (<FormItem style={{ marginBottom: 10 }} key={`${row}-${col}`}>
                  <Col span="7">
                    <FormItem>
                      <Input placeholder={col1.placeholder} {...getFieldProps(field + row + 'group' + col + col1.field, {
                        onChange: this.changeContent(row, col, col1.field),
                        rules: [...col1.rules],
                      })} />
                    </FormItem>
                  </Col>
                  <Col span="3">
                    <FormItem>
                      <Input placeholder={col2.placeholder} {...getFieldProps(field + row + 'group' + col + col2.field, {
                        onChange: this.changeContent(row, col, col2.field),
                        rules: [...col2.rules],
                      })} />
                    </FormItem>
                  </Col>
                  <Col span="3">
                    <FormItem>
                      <InputNumber placeholder={col3.placeholder} {...getFieldProps(field + row + 'group' + col + col3.field, {
                        onChange: this.changeNum(row, col, col3.field),
                        rules: [...col3.rules],
                      })} style={{ width: '100%', marginTop: -3 }} />
                    </FormItem>
                  </Col>
                  <Col span="4">
                    <FormItem>
                      <Select tags placeholder={col4.placeholder} {...getFieldProps(field + row + 'group' + col + col4.field, {
                        onChange: this.changeSelect(row, col, col4.field),
                        rules: [...col4.rules],
                      })} value={unit} style={{ width: '95%', marginTop: -3 }}>
                        {(col4.options || []).map((ite) => <Option key={ite.key} value={ite.key}>{ite.value}</Option>)}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span="5">
                    <FormItem>
                      <Input placeholder={col5.placeholder} {...getFieldProps(field + row + 'group' + col + col5.field, {
                        onChange: this.changeContent(row, col, col5.field),
                        rules: [...col5.rules],
                      })} style={{ width: '95%' }}/>
                    </FormItem>
                  </Col>
                  <Col span="2">
                    {item[group.field].length - 1 === col && item[group.field].length < maxCol && (fakeField.length * item[group.field].length < maxColTotal) && <Icon style={{ color: '#0ae', fontSize: 15, marginRight: 5 }} type="plus-circle" onClick={(e) => { e.preventDefault(); this.addCol(row); }} />}
                    {item[group.field].length > 1 && <Icon style={{ color: '#999', fontSize: 15 }} type="minus-circle-o" onClick={(e) => { e.preventDefault(); this.deleteCol(row, col); }} />}
                  </Col>
                </FormItem>);
              })}
            </Col>
          </Row>
        </Row>
        {fakeField.length - 1 === row && fakeField.length < maxRow && (fakeField.length * item[group.field].length < maxColTotal) &&
          <div><Button style={{ marginLeft: 3 }} onClick={(e) => { e.preventDefault(); this.addRow(); }}>再加一组</Button><span style={{ marginLeft: 6, color: '#999' }}>{extra}</span></div>}
      </div>);
    });
  }

  // 更新内容
  changeContent = (row, col, whichCol) => e => {
    const { getFieldValue } = this.form;
    const { group, field } = this.props;
    const contentsField = cloneDeep(getFieldValue(field));
    contentsField[Number(row)][group.field][Number(col)][whichCol] = e.target.value;
    this.setFormContent(contentsField);
  }

  changeNum = (row, col, whichCol) => v => {
    const { getFieldValue } = this.form;
    const { group, field } = this.props;
    const contentsField = cloneDeep(getFieldValue(field));
    contentsField[Number(row)][group.field][Number(col)][whichCol] = v;
    this.setFormContent(contentsField);
  }
  changeSelect = (row, col, whichCol) => value => {
    let v = '';
    if (!!value.length) {
      v = value[value.length - 1];
    }
    const { getFieldValue } = this.form;
    const { group, field } = this.props;
    const contentsField = cloneDeep(getFieldValue(field));
    contentsField[Number(row)][group.field][Number(col)][whichCol] = v;
    this.setFormContent(contentsField);
  }

  // 更新标题
  changeTitle = row => e => {
    const { getFieldValue } = this.form;
    const { field, title } = this.props;
    const contentsField = cloneDeep(getFieldValue(field));
    contentsField[Number(row)][title.field] = e.target.value;
    this.setFormContent(contentsField);
  }

  // 新增组
  addRow = () => {
    const { getFieldValue } = this.form;
    const { field, title, group, col1, col2, col3, col4, col5 } = this.props;
    const contentsField = cloneDeep(getFieldValue(field));
    const unitInit = col4.initialValue || '';
    contentsField.push({
      [title.field]: '', [group.field]: [{
        [col1.field]: null, [col2.field]: null, [col3.field]: '', [col4.field]: unitInit, [col5.field]: null,
      }],
    });
    if (isIframe) {
      fixFrameHeight();
    }
    this.setFormContent(contentsField);
  }
  deleteRow = row => {
    const { getFieldValue } = this.form;
    const { field } = this.props;
    const contentsField = cloneDeep(getFieldValue(field));
    const key = Number(row);
    contentsField.splice(key, 1);
    if (isIframe) {
      fixFrameHeight();
    }
    this.setFormContent(contentsField);
  }
  addCol = row => {
    const { getFieldValue } = this.form;
    const { field, group, col1, col2, col3, col4, col5 } = this.props;
    const contentsField = cloneDeep(getFieldValue(field));
    const unitInit = col4.initialValue || '';
    contentsField[Number(row)][group.field].push({
      [col1.field]: null,
      [col2.field]: null,
      [col3.field]: '',
      [col4.field]: unitInit,
      [col5.field]: null,
    });
    this.setFormContent(contentsField);
    if (isIframe) {
      fixFrameHeight();
    }
  }
  deleteCol = (row, col) => {
    const { getFieldValue } = this.form;
    const { field, group } = this.props;
    const contentsField = cloneDeep(getFieldValue(field));

    const key = Number(col);
    const RowKey = Number(row);
    contentsField[RowKey][group.field].splice(key, 1);
    this.setFormContent(contentsField);
    if (isIframe) {
      fixFrameHeight();
    }
  }

  render() {
    const { label, required, labelCol, wrapperCol } = this.props;
    return (
      <div style={{ width: '100%' }} className="content-outer">
        <FormItem
          label={label}
          required={required}
          labelCol={labelCol}
          wrapperCol={wrapperCol}
        >
          {this.fetchContent}
        </FormItem>
        {this.getAddMultiLines}
        {this.getAddableInput}
      </div>
    );
  }
}
