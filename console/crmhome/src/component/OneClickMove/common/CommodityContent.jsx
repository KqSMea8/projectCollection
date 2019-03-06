import React from 'react';
import { Form, Input, Row, Col, Button, Icon } from 'antd';
import BaseFormComponent from './BaseFormComponent';
import { fixFrameHeight, numberToChinese } from '../../../common/utils';
import componentGetter from '../common/ComponentGetter';
import {cloneDeep} from 'lodash';
import './CommodityContent.less';


const FormItem = Form.Item;
const isIframe = window.parent !== window;
const formItemLayout = {
  labelCol: { span: 3},
  wrapperCol: { span: 17 },
};

const formItemLayout2 = {
  labelCol: { span: 4},
  wrapperCol: { span: 19 },
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
    const {getFieldValue} = this.form;
    const {field} = this.props;
    let contentsField = cloneDeep(getFieldValue(field));
    if (!contentsField || !contentsField.length) {
      contentsField = [{
        title: '',
        itemUnits: [{
          name: '',
          price: '',
          amount: null,
          unit: '',
          spec: '',
        }],
      }];
    }
    this.setGroupContent(contentsField);
  }
  setGroupContent = (input) => {
    const {setFieldsValue} = this.form;
    const {field, title, group, col1, col2, col3, col4, col5} = this.props;
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
    const {fieldOuter} = this.props;
    const {setFields} = this.form;
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
    const {supplementary} = this.props;
    return (<Row>
      {
        componentGetter({ ...formItemLayout, ...cloneDeep(supplementary)})
      }
    </Row>);
  }

   get fetchContent() {
     const {getFieldProps, getFieldValue} = this.form;
     const {field, title, group, col1, col2, col3, col4, col5, maxRow, maxCol, maxColTotal, extra} = this.props;
     const localFieldValue = getFieldValue(field);
     const fakeField = !!localFieldValue ? localFieldValue : [{
       [group.field]: [],
       [title.field]: '',
     }];
     return fakeField.map((item, row) => {
       return (<div key={row} className="content-wrapper">
        <Row>
          <Row style={{marginBottom: 10}}>
            <Col span="22">
               <FormItem style={{marginBottom: 10}} label={`标题${numberToChinese(row + 1)}`} {...formItemLayout2}>
                <Input placeholder={title.placeholder} {...getFieldProps(field + row + 'title', {
                  onChange: this.changeTitle(row),
                  rules: [...title.rules],
                })}/>
              </FormItem>
            </Col>
            <Col span="2">{fakeField.length > 1 && <Icon style={{color: '#999', fontSize: 15, marginLeft: 5}} type="minus-circle-o" onClick={ (e) => {e.preventDefault(); this.deleteRow(row); }} /> }</Col>
          </Row>
          <Row>
          <Col span="22">
            <Row>
              <Col span="7">{col1.name}</Col>
              <Col span="3">{col2.name}</Col>
              <Col span="3">{col3.name}</Col>
              <Col span="3">{col4.name}</Col>
              <Col span="6">{col5.name}</Col>
              <Col span="2" />
            </Row>
            {item[group.field].map((v, col) => {
              return (<FormItem style={{marginBottom: 10}} key={`${row}-${col}`}>
                      <Col span="7">
                        <FormItem style={{marginBottom: 10}}>
                          <Input placeholder={col1.placeholder} {...getFieldProps(field + row + 'group' + col + col1.field, {
                            onChange: this.changeContent(row, col, col1.field),
                            rules: [...col1.rules],
                          })}/>
                        </FormItem>
                      </Col>
                      <Col span="3">
                        <FormItem style={{marginBottom: 10}}>
                          <Input placeholder={col2.placeholder} {...getFieldProps(field + row + 'group' + col + col2.field, {
                            onChange: this.changeContent(row, col, col2.field),
                            rules: [...col2.rules],
                          })}/>
                        </FormItem>
                      </Col>
                      <Col span="3">
                        <FormItem style={{marginBottom: 10}}>
                          <Input placeholder={col3.placeholder} {...getFieldProps(field + row + 'group' + col + col3.field, {
                            onChange: this.changeContent(row, col, col3.field),
                            rules: [...col3.rules],
                          })}/>
                        </FormItem>
                      </Col>
                      <Col span="3">
                        <FormItem style={{marginBottom: 10}}>
                          <Input placeholder={col4.placeholder} {...getFieldProps(field + row + 'group' + col + col4.field, {
                            onChange: this.changeContent(row, col, col4.field),
                            rules: [...col4.rules],
                          })}/>
                        </FormItem>
                      </Col>
                      <Col span="6">
                        <FormItem style={{marginBottom: 10}}>
                          <Input placeholder={col5.placeholder} {...getFieldProps(field + row + 'group' + col + col5.field, {
                            onChange: this.changeContent(row, col, col5.field),
                            rules: [...col5.rules],
                          })}/>
                        </FormItem>
                      </Col>
                      <Col span="2">
                      {item[group.field].length - 1 === col && item[group.field].length < maxCol && (fakeField.length * item[group.field].length < maxColTotal) && <Icon style={{color: '#0ae', fontSize: 15, marginLeft: 5}} type="plus-circle" onClick={ (e) => {e.preventDefault(); this.addCol(row); }} />}
                      {item[group.field].length > 1 && <Icon style={{color: '#999', fontSize: 15, marginLeft: 5}} type="minus-circle-o" onClick={ (e) => {e.preventDefault(); this.deleteCol(row, col); }} />}
                      </Col>
                    </FormItem>);
            })}
          </Col>
          </Row>
        </Row>
        {fakeField.length - 1 === row && fakeField.length < maxRow && (fakeField.length * item[group.field].length < maxColTotal ) &&
        <div><Button onClick={ (e) => {e.preventDefault(); this.addRow(); }}>新增内容组</Button><span style={{marginLeft: 6}}>{extra}</span></div>}
      </div>);
     });
   }

  // 更新内容
  changeContent = (row, col, whichCol) => e => {
    const {getFieldValue} = this.form;
    const {group, field} = this.props;
    const contentsField = cloneDeep(getFieldValue(field));
    contentsField[Number(row)][group.field][Number(col)][whichCol] = e.target.value;
    this.setFormContent(contentsField);
  }

  // 更新标题
  changeTitle = row => e => {
    const {getFieldValue} = this.form;
    const {field, title} = this.props;
    const contentsField = cloneDeep(getFieldValue(field));
    contentsField[Number(row)][title.field] = e.target.value;
    this.setFormContent(contentsField);
  }

  // 新增组
  addRow = () => {
    const {getFieldValue} = this.form;
    const {field, title, group, col1, col2, col3, col4, col5} = this.props;
    const contentsField = cloneDeep(getFieldValue(field));
    contentsField.push({[title.field]: '', [group.field]: [{
      [col1.field]: null, [col2.field]: null, [col3.field]: null, [col4.field]: null, [col5.field]: null,
    }]});
    if (isIframe) {
      fixFrameHeight();
    }
    this.setFormContent(contentsField);
  }
  deleteRow = row => {
    const {getFieldValue} = this.form;
    const {field} = this.props;
    const contentsField = cloneDeep(getFieldValue(field));
    const key = Number(row);
    contentsField.splice(key, 1);
    if (isIframe) {
      fixFrameHeight();
    }
    this.setFormContent(contentsField);
  }
  addCol = row => {
    const {getFieldValue} = this.form;
    const {field, group, col1, col2, col3, col4, col5} = this.props;
    const contentsField = cloneDeep(getFieldValue(field));

    contentsField[Number(row)][group.field].push({
      [col1.field]: null,
      [col2.field]: null,
      [col3.field]: null,
      [col4.field]: null,
      [col5.field]: null,
    });
    this.setFormContent(contentsField);
    if (isIframe) {
      fixFrameHeight();
    }
  }
  deleteCol = (row, col) => {
    const {getFieldValue} = this.form;
    const {field, group} = this.props;
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
      <div style={{width: '100%'}} className="content-outer">
      <FormItem
        label={label}
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
      >
        {this.fetchContent}
      </FormItem>
      {this.getAddableInput}
      </div>
    );
  }
}
