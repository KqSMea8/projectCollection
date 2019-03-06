import React from 'react';
import { Form } from 'antd';
import UploadCropPic from './UploadCropPic';
import BaseFormComponent from './BaseFormComponent';
import './formItemUploadHack.less';

const FormItem = Form.Item;
export default class UpGoodsImage extends BaseFormComponent {
  get loadComponent() {
    const { getFieldProps } = this.form;
    const { field, rules, max = 1, uploadOption } = this.props;
    const dom = [];
    for (let i = 0; i < max; i++) {
      dom.push(
        <div key={i} style={{display: 'inline-block', float: 'left', height: 118}}>
          <UploadCropPic {...uploadOption}
            {...getFieldProps(field + i, {
              rules,
            })}
          />
        </div>
      );
    }
    return dom;
  }
  get loadExtra() {
    const { extra } = this.props;
    let extraText = [];
    if (Array.isArray(extra)) {
      extraText = extra.map((item, index) => {
        return <p key={index}>{item}</p>;
      });
    }
    return extraText;
  }
  render() {
    const { label, required, labelCol, wrapperCol, field, rules, max = 1, uploadOption } = this.props;
    const { getFieldProps } = this.form;
    return (
      <FormItem
        style={{ minHeight: 96 }}
        label={label}
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
      >
        <FormItem prefixCls="ant-form-item upload-img">
          {max === 1 ? <UploadCropPic {...uploadOption } style={{ width: 430, height: 430 }}
            {...getFieldProps(field, {
              rules,
            })}/> : this.loadComponent}
        </FormItem>
        <div style={{lineHeight: '16px', color: '#999', marginTop: 25}}>{this.loadExtra}</div>
      </FormItem>
    );
  }
}
