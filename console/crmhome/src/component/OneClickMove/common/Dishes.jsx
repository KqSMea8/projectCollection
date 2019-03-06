import React from 'react';
import { Form, Input, Row, Col, Button, Icon } from 'antd';
import BaseFormComponent from './BaseFormComponent';
import { fixFrameHeight, numberToChinese } from '../../../common/utils';
// import PhotoPicker from '../../../common/PhotoPicker.jsx';
import ImagePicker from './ImagePicker';
import { cloneDeep } from 'lodash';
import './Dishes.less';
import './formItemUploadHack.less';

const FormItem = Form.Item;
const isIframe = window.parent !== window;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 15 },
};
const formItemLayout2 = {
  wrapperCol: { span: 23 },
};

export default class Dishes extends BaseFormComponent {
  constructor(props, ctx) {
    super(props, ctx);
    this.form = ctx.form;
  }
  componentDidMount() {
    this.setFormInitContent();
    setTimeout(fixFrameHeight(), 500);
  }
  setFormInitContent = () => {
    const { setFieldsValue, getFieldValue } = this.form;
    const { field } = this.props;
    const localFieldValue = getFieldValue([field]);
    const fakeField = !!localFieldValue && localFieldValue.length > 0 ? localFieldValue : [{
      desc: '',
      title: '',
      imageUrls: [],
    }];
    setFieldsValue({
      [field]: fakeField,
    });
  }

  // 设置每个表单内容
  setFormContent = (val) => {
    const { setFieldsValue, setFields } = this.form;
    const { field, title, desc, images, fieldOuter } = this.props;
    if (Array.isArray(val)) {
      val.forEach((item, row) => {
        setFieldsValue({
          [field + row + 'title']: item[title.field],
          [field + row + 'desc']: item[desc.field],
          [field + row + 'images']: item[images.field],
        });
      });
      setFieldsValue({
        [field]: val,
      });
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
  // 更新标题
  changeTitle = row => e => {
    // console.log(e.target.value)
    const { field, title } = this.props;
    const { getFieldValue } = this.form;
    const curFieldValue = cloneDeep(getFieldValue([field]));
    curFieldValue[Number(row)][title.field] = e.target.value;
    this.setFormContent(curFieldValue);
  }
  // 更新内容
  changeDesc = (row) => e => {
    // console.log(e.target.value)
    const { field, desc } = this.props;
    const { getFieldValue } = this.form;
    const curFieldValue = cloneDeep(getFieldValue([field]));
    curFieldValue[Number(row)][desc.field] = e.target.value;
    this.setFormContent(curFieldValue);
  }
  changeImage = (row) => e => {
    // console.log(e)
    const { field, images } = this.props;
    const { getFieldValue } = this.form;
    const curFieldValue = cloneDeep(getFieldValue([field]));
    curFieldValue[Number(row)][images.field] = e;
    this.setFormContent(curFieldValue);
  }
  // 新增组
  addRow = () => {
    const { title, desc, images, field } = this.props;
    const { getFieldValue } = this.form;
    const curFieldValue = cloneDeep(getFieldValue([field]));
    curFieldValue.push({ [title.field]: '', [desc.field]: '', [images.field]: [] });
    if (isIframe) {
      fixFrameHeight();
    }
    this.setFormContent(curFieldValue);
  }
  deleteRow = row => {
    const key = Number(row);
    const { field } = this.props;
    const { getFieldValue } = this.form;
    const curFieldValue = cloneDeep(getFieldValue([field]));
    curFieldValue.splice(key, 1);
    if (isIframe) {
      fixFrameHeight();
    }
    this.setFormContent(curFieldValue);
  }
  get fetchContent() {
    const { getFieldProps, getFieldValue } = this.form;
    const { field, title, desc, images } = this.props;
    const localFieldValue = getFieldValue([field]);
    const fakeField = !!localFieldValue ? localFieldValue : [{
      desc: '',
      title: '',
      imageUrls: [],
    }];
    const imagePropsRules = images.rules;
    const max = images.max;
    const self = this;

    return fakeField.map((item, row) => {
      let dishTitle = '菜品' + numberToChinese(row + 1);
      // 泛行业的图片详情lable
      if (this.props.industry === 'SERV_INDUSTRY') {
        dishTitle = '服务' + numberToChinese(row + 1);
      }
      return (<div key={row}>
        <Row>
          <Col span="9" className="dish-title">
            <FormItem style={{ marginBottom: 10, height: 32 }} label={dishTitle} {...formItemLayout}>
              <Input placeholder={title.placeholder} {...getFieldProps(field + row + 'title', {
                onChange: this.changeTitle(row),
                rules: [...title.rules],
              }) } />
            </FormItem>
            <FormItem style={{ marginBottom: 10, height: 32 }} {...formItemLayout2}>
              <Input {...getFieldProps(field + row + 'desc', {
                onChange: this.changeDesc(row),
                rules: [...desc.rules],
              }) } placeholder={desc.placeholder} />
            </FormItem>
          </Col>
          <Col span="14" className="smaller-photo-picker">
            <FormItem {...formItemLayout2} prefixCls="ant-form-item upload-img">
              <ImagePicker multiple max={max} {...getFieldProps(field + row + 'images', { onChange: self.changeImage(row), rules: imagePropsRules }) } />
            </FormItem>
          </Col>
          <Col span="1" className="dish-ctl">
            {(row !== 0 || fakeField.length > 1) && <Icon style={{ color: '#999', fontSize: 15 }} type="minus-circle-o" onClick={(e) => { e.preventDefault(); this.deleteRow(row); }} />}
          </Col>
        </Row>
        {fakeField.length - 1 === row && fakeField.length < 10 &&
          <div style={{ margin: '12px 0' }}><Button onClick={(e) => { e.preventDefault(); this.addRow(); }}>新增图片组</Button><span className="dish-tips">最多可添加10组图片，每组可添加3张图片</span></div>}
      </div>);
    });
  }

  render() {
    const { label, extra, required, labelCol, wrapperCol } = this.props;
    return (
      <FormItem
        label={label}
        required={required}
        extra={extra}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
      >
        {/* <input type="hidden" {...getFieldProps(field, {rules: rules})} /> */}
        {this.fetchContent}
      </FormItem>
    );
  }
}
