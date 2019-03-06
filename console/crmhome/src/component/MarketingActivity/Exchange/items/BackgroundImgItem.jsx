import React from 'react';
import { Form } from 'antd';
import FormItemBase from './FormItemBase';
import UploadCropPic from '../../BuyGive/UploadCropPic';
import classnames from 'classnames';
import { ImgCropModal } from 'hermes-react';
const Preview = ImgCropModal.Preview;
const FormItem = Form.Item;
const FIELD_NAME = 'logoImg';

class BackgroundImgItem extends FormItemBase {
  static displayName = 'exchange-background-img';
  static fieldName = FIELD_NAME;
  get initialValue() {
    let initialFiles = [];
    if (this.props.initialData && this.props.initialData[FIELD_NAME]) {
      initialFiles = this.props.initialData[FIELD_NAME];
    }
    return initialFiles || [];
  }
  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const uploadOption = {
      maxSize: 2048, // 上传文件最大尺寸,单位为KB
      // triggerText: '商品封面图(2000*1500)',
      rate: 4 / 3, // 裁剪的虚线框的宽/高比
      initWidth: 0.8,
      requiredSize: {width: 2000, height: 1500},  // 要求的最小尺寸
      style: {width: 400, height: 300},
      getPicInfo: (positionInfo) => {
        const {width, height, url} = positionInfo;
        // 裁剪后的照片，按照长的一边作为基准展示，短的一边则裁剪或两边留白
        const fillType = width > height ? 'width' : 'height';
        return (<div style={{display: 'inline-block', marginLeft: 30, verticalAlign: 'top'}}>
          <div style={{'marginBottom': 10}}><p>您上传的图片将会自动适配为以下两种尺寸</p></div>
          <div style={{'marginBottom': 5, 'color': '#999'}}>展示在券详情页</div>
          <Preview
            url={url}
            fillType={fillType}
            style={{width: 16 / 9 * 100, height: 100, background: '#fff', marginBottom: 20, border: '1px solid #ccc'}}
            crop={positionInfo}
          />
          <div style={{'marginBottom': 5, 'color': '#999'}}>展示在店铺详情页</div>
          <Preview
            url={url}
            fillType={fillType}
            style={{width: 100, height: 100, background: '#fff', marginBottom: 20, border: '1px solid #ccc'}}
            crop={positionInfo}
          />
        </div>);
      },
    };

    console.log(this.initialValue);

    return (
      <FormItem {...this.itemLayout}
        label="背景图片"
        help={<p>大小：不超过 2M。格式：bmp、png、jpeg、jpg、gif<br />建议尺寸：924px * 380px</p>}
        validateStatus={classnames({ error: !!getFieldError(FIELD_NAME) })}
        extra={!!getFieldError(FIELD_NAME) && <p className="ft-red">{getFieldError(FIELD_NAME)}</p>}
      >
        <UploadCropPic {...getFieldProps(FIELD_NAME, {  // 背景图片
          initialValue: this.initialValue,
          rules: [
            (r, v, cb) => {
              if (v && v.length > 0) {
                cb();
              } else {
                cb(new Error('请上传图片'));
              }
            },
          ],
        }) } {...uploadOption} />
      </FormItem>
    );
  }
}

export default BackgroundImgItem;
