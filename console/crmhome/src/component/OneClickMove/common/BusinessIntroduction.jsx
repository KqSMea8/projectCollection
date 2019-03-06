import React from 'react';
import { Form, Row } from 'antd';
import componentGetter from '../common/ComponentGetter';
import BaseFormComponent from './BaseFormComponent';
// import PhotoPicker from '../../../common/PhotoPicker.jsx';
import ImagePicker from './ImagePicker';
import { pick, cloneDeep } from 'lodash';
import './formItemUploadHack.less';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 4, offset: 2 },
  wrapperCol: { span: 15 },
};
const formItemLayout2 = {
  wrapperCol: { span: 24 },
};

export default class BusinessIntroduction extends BaseFormComponent {
  static contextTypes = {
    form: React.PropTypes.object.isRequired,
  }
  static defaultProps = {
    modalVisible: false,
  }
  constructor(props, ctx) {
    super(props, ctx);
    this.form = ctx.form;
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.form = nextContext.form;
  }

  // 设置每个表单内容
  setFormContent = (val) => {
    const { setFieldsValue, setFields } = this.form;
    const { introductionImage } = this.props;
    const tarField = introductionImage;

    if (val) {
      setFieldsValue({
        [tarField.field]: val,
      });
      setFields({
        commodityDetail: {
          value: {},
          errors: [],
        },
      });
    }
  }

  changeImage = (e) => {
    this.setFormContent(e);
  }

  render() {
    const { introductionText, introductionImage, extra } = this.props;
    const { getFieldProps } = this.form;
    const formItemProps = pick(this.props, ['label', 'labelCol', 'wrapperCol', 'help', 'required']);
    const imageProps = introductionImage;
    const imagePropsRules = imageProps.rules;
    const max = imageProps.max;
    const renderExtra = () => {
      return {
        __html: extra,
      };
    };
    return (
      <FormItem
        {...formItemProps}
      >
        {/* <input type="hidden" {...getFieldProps(field, { rules })} /> */}
        <Row style={{ marginBottom: 16, height: 32 }}>
          {
            componentGetter({ ...formItemLayout, ...cloneDeep(introductionText) })
          }
        </Row>
        <Row>
          <FormItem {...formItemLayout2} prefixCls="ant-form-item upload-img">
            <ImagePicker max={max} multiple {...getFieldProps(introductionImage.field, { rules: imagePropsRules }) } />
          </FormItem>
        </Row>
        <div style={{ lineHeight: '14px', marginTop: '24px' }} dangerouslySetInnerHTML={renderExtra()}></div>
      </FormItem>);
  }
}
