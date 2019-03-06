import React, {PropTypes} from 'react';
import {Form, Button, Input, Checkbox, Radio, Alert, DatePicker, Spin} from 'antd';
import ajax from 'Utility/ajax';
import classnames from 'classnames';
import { formOption } from '../../../common/formOption';
import { remoteLog } from '../../../common/utils';
import { Upload, normalizeUploadValue, normalizeUploadValueOne } from '../../../common/Upload';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const CertifyInfo = React.createClass({
  propTypes: {
    form: PropTypes.object,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
    visible: PropTypes.bool,
    defaultData: PropTypes.object,
    data: PropTypes.object,
    canSubmit: PropTypes.bool,
  },

  getInitialState() {
    return {
      loading: true,
      needBusinessLicense: true,
      needCertificateLicense: true,
      canSubmit: this.props.canSubmit,
    };
  },

  componentWillMount() {
    this.fieldWarningAlert = null;
    /*
    (<FormItem
      label={<div style={{height: 1}}></div>}
      labelCol={{span: 4}}
      wrapperCol={{span: 14}}
      help>
      <div style={{marginTop: -25}}>
        <span style={{color: '#f60'}}>该字段属于敏感字段，修改后需经过审批通过才生效</span>
      </div>
    </FormItem>);
    */
    this.setFieldsInitialValue();
  },

  componentWillUpdate(nextProps) {
    if (this.props.visible !== nextProps.visible && nextProps.visible) {
      this.fetchPermits();
    }
    if (this.props.canSubmit !== nextProps.canSubmit) {
      this.setState({
        canSubmit: nextProps.canSubmit,
      });
    }
  },

  onOk() {
    remoteLog('LEADS_COMPLETE_SUBMIT');
    this.props.form.validateFieldsAndScroll(this.props.onOk);
  },

  setFieldsInitialValue() {
    const fieldNameList = [
      'licensePictureId',
      'licenseValidTimeType',
      'licenseValidTime',
      'licenseSeq',
      'licenseName',
      'certificatePictureId',
      'certificateValidTimeType',
      'certificateValidTime',
      'authorizationPictureId',
      'otherAuthorizationId',
      'bindingPublic',
    ];
    const values = {};
    fieldNameList.forEach((name) => {
      values[name] = this.props.defaultData[name];
    });
    this.props.form.setFieldsInitialValue(values);
  },

  disabledDate(value) {
    if (!value) {
      return false;
    }
    return value.getTime() < Date.now();
  },

  checkValidTime(fieldName, required, rule, value, callback) {
    if (required) {
      this.props.form.validateFields([fieldName], {force: true});
    }
    callback();
  },

  checkValidTimeType(fieldName, required, rule, value, callback) {
    if (required) {
      const time = this.props.form.getFieldValue(fieldName);
      if (value === '1' && !time) {
        callback(new Error('此处必填'));
        return;
      }
    }
    callback();
  },

  fetchPermits() {
    const {data} = this.props;
    const params = {
      cityId: data.cityId = data.area ? data.area[1] : '',
      categoryId: data.categoryId ? data.categoryId[data.categoryId.length - 1] : '',
    };
    this.setState({
      loading: true,
    });
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/showShopPermits.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        this.setFieldsInitialValue();
        if (result.status === 'succeed') {
          this.setState({
            needBusinessLicense: result.needBusinessLicense,
            needCertificateLicense: result.needCertificateLicense,
          });
        } else {
          this.setState({
            needBusinessLicense: true,
            needCertificateLicense: true,
          });
        }
        this.setState({
          loading: false,
        });
      },
      error: () => {
        this.setFieldsInitialValue();
        this.setState({
          loading: false,
        });
      },
    });
  },

  render() {
    const rootStyle = this.props.visible ? {} : {display: 'none'};
    const {getFieldProps, getFieldError} = this.props.form;
    const {loading, needBusinessLicense, needCertificateLicense, canSubmit} = this.state;
    return (
      <div style={rootStyle}>
        {
          loading && <div style={{textAlign: 'center', marginTop: 80}}><Spin/></div>
        }
        <div style={{padding: '48px 0', minHeight: 200, display: loading ? 'none' : 'block'}}>
          <Form horizontal>
            <FormItem
              required={needBusinessLicense}
              label="营业执照："
              labelCol={{span: 4}}
              wrapperCol={{span: 14}}>
              <FormItem
                validateStatus={
                classnames({
                  error: !!getFieldError('licensePictureId'),
                })}
                help={getFieldError('licensePictureId') || true}>
                <Upload
                  exampleList={[
                    {name: '个体工商户示例', url: 'https://t.alipayobjects.com/tfscom/T1PCpfXa8cXXXXXXXX.jpg'},
                    {name: '企业示例', url: 'https://t.alipayobjects.com/tfscom/T1kmdfXmtgXXXXXXXX.jpg'},
                  ]}
                  {...getFieldProps('licensePictureId', {
                    valuePropName: 'fileList',
                    normalize: normalizeUploadValueOne,
                    rules: [{
                      required: needBusinessLicense,
                      type: 'array',
                    }],
                  })} />
              </FormItem>
              <Alert
                message=""
                description="上传营业执照的照片，营业执照的经营者姓名需要与用户真实姓名一致"
                type="warning" />
              <FormItem
                validateStatus={
                  classnames({
                    error: !!getFieldError('licenseValidTimeType'),
                  })}
                required={needBusinessLicense}
                help={getFieldError('licenseValidTimeType') || true}
                wrapperCol={{span: 14}}>
                <RadioGroup {...getFieldProps('licenseValidTimeType', {
                  rules: [this.checkValidTimeType.bind(this, 'licenseValidTime', needBusinessLicense)],
                })}>
                  <Radio value="1">有效期至&nbsp;
                    <div style={{display: 'inline-block'}}>
                      <DatePicker disabledDate={this.disabledDate} {...getFieldProps('licenseValidTime', {
                        rules: [{type: 'date'}, this.checkValidTime.bind(this, 'licenseValidTimeType', needBusinessLicense)],
                      })} />
                    </div>
                  </Radio>
                  <Radio value="2">长期有效</Radio>
                </RadioGroup>
              </FormItem>
            </FormItem>

            {this.fieldWarningAlert}

            <FormItem
              label="营业执照编号："
              validateStatus={
              classnames({
                error: !!getFieldError('licenseSeq'),
              })}
              required={needBusinessLicense}
              help={(getFieldError('licenseSeq'))}
              labelCol={{span: 4}}
              wrapperCol={{span: 14}}>
              <Input
                {...getFieldProps('licenseSeq', {
                  validateFirst: true,
                  rules: [{
                    required: needBusinessLicense,
                    message: '此处必填',
                  }, {
                    max: 50,
                    message: '限50个字',
                  }],
                })}
                placeholder=""/>
            </FormItem>

            <FormItem
              label="营业执照名称："
              validateStatus={
              classnames({
                error: !!getFieldError('licenseName'),
              })}
              required={needBusinessLicense}
              help={(getFieldError('licenseName'))}
              labelCol={{span: 4}}
              wrapperCol={{span: 14}}>
              <Input
                {...getFieldProps('licenseName', {
                  validateFirst: true,
                  rules: [{
                    required: needBusinessLicense,
                    message: '此处必填',
                  }, {
                    max: 50,
                    message: '限50个字',
                  }],
                })}
                placeholder="营业执照上的名称"/>
            </FormItem>

            <FormItem
              required={needCertificateLicense}
              label="行业许可证："
              labelCol={{span: 4}}
              wrapperCol={{span: 14}}>
              <FormItem
                validateStatus={
                  classnames({
                    error: !!getFieldError('certificatePictureId'),
                  })}
                help={getFieldError('certificatePictureId') || true}>
                <Upload
                  exampleList={[
                    {name: '查看示例', url: 'https://t.alipayobjects.com/tfscom/T1GRNfXm0nXXXXXXXX.jpg'},
                  ]}
                  {...getFieldProps('certificatePictureId', {
                    valuePropName: 'fileList',
                    normalize: normalizeUploadValueOne,
                    rules: [{
                      required: needCertificateLicense,
                      message: '此处必填',
                      type: 'array',
                    }],
                  })} />
              </FormItem>
              <Alert
                message=""
                description={<p>餐饮行业需上传餐饮服务许可证，面包蛋糕类商户如办理了食品流通许可证，也可上传食品流通许可证；烟酒，进口食品等特色商品，需要相应的营业许可证，点击此处<a target={'_blank'} href={window.APP.kbservcenterUrl + '/support/license4category.htm'}>查看当前经营品类所需证书</a></p>}
                type="warning" />
              <FormItem
                validateStatus={
                  classnames({
                    error: !!getFieldError('certificateValidTimeType'),
                  })}
                required={needCertificateLicense}
                help={getFieldError('certificateValidTimeType') || true}
                wrapperCol={{span: 14}}>
                <RadioGroup {...getFieldProps('certificateValidTimeType', {
                  validateFirst: true,
                  rules: [this.checkValidTimeType.bind(this, 'certificateValidTime', needCertificateLicense)],
                })}>
                  <Radio value="1">有效期至&nbsp;
                    <div style={{display: 'inline-block'}}>
                      <DatePicker disabledDate={this.disabledDate} {...getFieldProps('certificateValidTime', {
                        rules: [{type: 'date'}, this.checkValidTime.bind(this, 'certificateValidTimeType', needCertificateLicense)],
                      })} />
                    </div>
                  </Radio>
                  <Radio value="2">长期有效</Radio>
                </RadioGroup>
              </FormItem>
            </FormItem>
            {this.fieldWarningAlert}

            <h3 className="kb-form-sub-title">
              <div className="kb-form-sub-title-line"></div>
            </h3>

            <FormItem
              label="授权函："
              labelCol={{span: 4}}
              wrapperCol={{span: 14}}>
              <FormItem
                validateStatus={
                  classnames({
                    error: !!getFieldError('authorizationPictureId'),
                  })}
                help={getFieldError('authorizationPictureId') || true}>
                <div style={{marginBottom: 10}}>
                  <a href="https://t.alipayobjects.com/L1/92/1159/1435734895811.docx" target="_blank">下载授权函模板</a>
                </div>
                <Upload
                  exampleList={[
                    {name: '个体工商户示例', url: 'https://t.alipayobjects.com/images/rmsweb/T12rNgXeNtXXXXXXXX.jpg'},
                    {name: '企业示例', url: 'https://t.alipayobjects.com/images/rmsweb/T1GclgXl8jXXXXXXXX.jpg'},
                  ]}
                  {...getFieldProps('authorizationPictureId', {
                    validateFirst: true,
                    valuePropName: 'fileList',
                    normalize: normalizeUploadValueOne,
                    rules: [{
                      required: false,
                      message: '此处必填',
                      type: 'array',
                    }],
                  })} />
              </FormItem>
              <Alert
                message=""
                description="授权函由受托人签字及授权公司盖章，需要和支付宝实名认证的姓名一致（个体工商户可无公司盖章）"
                type="warning" />
            </FormItem>

            {this.fieldWarningAlert}

            <FormItem
              label="其他证明："
              validateStatus={
              classnames({
                error: !!getFieldError('otherAuthorizationId'),
              })}
              help={(getFieldError('otherAuthorizationId') || '资质证明照也可上传')}
              labelCol={{span: 4}}
              wrapperCol={{span: 14}}>
              <Upload
                exampleList={[
                  {name: '个体工商户示例', url: 'https://t.alipayobjects.com/images/rmsweb/T12rNgXeNtXXXXXXXX.jpg'},
                  {name: '企业示例', url: 'https://t.alipayobjects.com/images/rmsweb/T1GclgXl8jXXXXXXXX.jpg'},
                ]}
                {...getFieldProps('otherAuthorizationId', {
                  validateFirst: true,
                  valuePropName: 'fileList',
                  normalize: normalizeUploadValue,
                })} />
            </FormItem>
          </Form>
          <div style={{padding: '24px 0 24px 160px', margin: '48px -16px 0 -16px', borderTop: '1px solid #e4e4e4'}}>
            <label>
              <Checkbox
                {...getFieldProps('bindingPublic',
                  {valuePropName: 'checked'})
                }
              >
              开通服务窗，服务客户更便捷，阅读并同意</Checkbox><a href="https://os.alipayobjects.com/rmsportal/IrOzniYBzROaDhh.html" target="_blank">《门店和服务窗信息同步授权函》</a>
            </label>
          </div>
          <div style={{padding: '24px 0 48px 237px', margin: '0 -16px', borderTop: '1px solid #e4e4e4'}}>
            <Button type="ghost" size="large" style={{marginRight: 12}} onClick={this.props.onCancel}>上一步</Button>
            <Button type="primary" size="large" style={{marginRight: 12}} onClick={this.onOk} loading={!canSubmit}>提交申请</Button>
          </div>
        </div>
      </div>
    );
  },
});

export default Form.create(formOption)(CertifyInfo);
