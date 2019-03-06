import React, {PropTypes} from 'react';
import {Form, Button, Input, Checkbox, Radio, DatePicker, Spin, Row, Col} from 'antd';
import ajax from '../../../common/ajax';
import classnames from 'classnames';
import PhotoPicker from '../common/PhotoPicker';
import {formOption} from '../common/formOption';
import {remoteLog} from '../common/utils';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const InputCertifyInfo = React.createClass({
  propTypes: {
    form: PropTypes.object,
    isEdit: PropTypes.bool,
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
    this.fieldWarningAlert = (<FormItem>
      <Row>
        <Col offset={4}>
          {this.props.isEdit && <span style={{color: '#f60'}}>该字段属于敏感字段，修改后需经过审批通过才生效</span>}
        </Col>
      </Row>
    </FormItem>);
    this.setFieldsInitialValue();
  },

  componentWillUpdate(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this.fetchPermits();
    }
    if (this.props.canSubmit !== nextProps.canSubmit) {
      this.setState({
        canSubmit: nextProps.canSubmit,
      });
    }
  },

  onOk() {
    remoteLog(this.props.isEdit ? 'SHOP_EDIT_SUBMIT' : 'SHOP_NEW_SUBMIT');
    this.props.form.validateFieldsAndScroll(this.props.onOk);
  },

  onFocusLicenseInfo(type) {
    if (type === 'licenseSeq') {
      this.refs.licenseSeqTxt.style.display = 'block';
    } else {
      this.refs.licenseNameTxt.style.display = 'block';
    }
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

  checkLicenseInfo(rule, value, callback) {
    this.refs.licenseSeqTxt.style.display = 'none';
    this.refs.licenseNameTxt.style.display = 'none';
    callback();
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
      url: '/shop/crm/showShopPermits.json',
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
    const {defaultData, data} = this.props;
    const {loading, needBusinessLicense, needCertificateLicense, canSubmit} = this.state;
    const authorCopy = (
        <div>
          <p style={{lineHeight: '16px'}}><span style={{color: '#F90'}}>授权函中的身份证须原文件，且须照示例填写，并保证图片清晰无水印。</span></p>
          <p style={{lineHeight: '16px'}}>个体户的授权签名可免授权公司盖章。</p>
        </div>
      );
    const otherCopy = (
        <div>
          <p style={{lineHeight: '16px'}}><span style={{color: '#F90'}}>除了许可证以外的证明，请上传至此，如：技师证照、动物防疫合格证、高危体育项目批准文件等等。</span></p>
        </div>
      );
    return (
      <div style={rootStyle}>
        {
          loading && <div style={{textAlign: 'center', marginTop: 80}}><Spin/></div>
        }
        <div style={{padding: '48px 0', minHeight: 200, display: loading ? 'none' : 'block'}}>
          <Form horizontal form={this.props.form} className="__fix-ant-form-item">
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
                help={getFieldError('licensePictureId') || '上传营业执照的照片，营业执照的经营者姓名需要与用户真实姓名一致'}>
                <PhotoPicker
                  pid={data.partnerId}
                  modalTitle="上传营业执照"
                  defaultFileList={defaultData.licensePictureList}
                  exampleList={[
                    {name: '个体工商户示例', url: 'https://zos.alipayobjects.com/rmsportal/TRENhvBYJCstYpl.png'},
                    {name: '企业示例', url: 'https://zos.alipayobjects.com/rmsportal/klVbXgzuSSvdlfN.png'},
                  ]}
                  {...getFieldProps('licensePictureId', {
                    validateFirst: true,
                    rules: [{
                      required: needBusinessLicense,
                      type: 'array',
                      message: '此处必填',
                    }],
                  })}/>
              </FormItem>

              <div style={{padding: 9, borderRadius: '6px', marginBottom: '10px', lineHeight: 1.5, border: '1px solid #fec', backgroundColor: '#fff7e6'}}>
                <FormItem
                    label="注册号："
                    validateStatus={
                    classnames({
                      error: !!getFieldError('licenseSeq'),
                    })}
                    required={needBusinessLicense}
                    help={(getFieldError('licenseSeq'))}
                    labelCol={{span: 6}}
                    wrapperCol={{span: 14}}>
                    <Input
                      onFocus={this.onFocusLicenseInfo.bind(this, 'licenseSeq')}
                      {...getFieldProps('licenseSeq', {
                        validateTrigger: 'onBlur',
                        validateFirst: true,
                        rules: [{
                          required: needBusinessLicense,
                          message: '此处必填',
                        }, {
                          max: 50,
                          message: '限50个字',
                        }, this.checkLicenseInfo],
                      })}
                      placeholder=""/>
                    <p style={{lineHeight: '16px', display: 'none', marginTop: 5}} ref="licenseSeqTxt">请按照营业执照上的信息填写</p>
                </FormItem>
                <FormItem
                    label="字号名称或名称："
                    validateStatus={
                    classnames({
                      error: !!getFieldError('licenseName'),
                    })}
                    required={needBusinessLicense}
                    help={(getFieldError('licenseName'))}
                    labelCol={{span: 6}}
                    wrapperCol={{span: 14}}>
                    <Input
                      onFocus={this.onFocusLicenseInfo.bind(this, 'licenseNameTxt')}
                      {...getFieldProps('licenseName', {
                        validateTrigger: 'onBlur',
                        validateFirst: true,
                        rules: [{
                          required: needBusinessLicense,
                          message: '此处必填',
                        }, {
                          max: 50,
                          message: '限50个字',
                        }, this.checkLicenseInfo],
                      })}
                      placeholder="营业执照上的名称"/>
                    <p style={{lineHeight: '16px', display: 'none', marginTop: 5}} ref="licenseNameTxt">请按照营业执照上的字号名称或名称填写；如果个体户的营业执照没有名称，请填写经营者姓名。</p>
                </FormItem>
              </div>

              <FormItem
                validateStatus={
                  classnames({
                    error: !!getFieldError('licenseValidTimeType'),
                  })}
                required={needBusinessLicense}
                help={getFieldError('licenseValidTimeType') || true}
                >
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
              label="授权函："
              labelCol={{span: 4}}
              wrapperCol={{span: 14}}>
              <FormItem
                validateStatus={
                  classnames({
                    error: !!getFieldError('authorizationPictureId'),
                  })}
                help={getFieldError('authorizationPictureId') || authorCopy}>
                <div style={{marginBottom: 10}}>
                  <a href="https://os.alipayobjects.com/rmsportal/PqtAViRaMoalrWG.docx" target="_blank">下载授权函模板</a>
                </div>
                <PhotoPicker
                  pid={data.partnerId}
                  modalTitle="上传授权函"
                  defaultFileList={defaultData.authorizationPictureList}
                  exampleList={[
                    {name: '个体工商户示例', url: 'https://zos.alipayobjects.com/rmsportal/lpowyXkeUkcRZDA.png'},
                    {name: '企业示例', url: 'https://zos.alipayobjects.com/rmsportal/XpjULxuInCHlAVh.png'},
                  ]}
                  {...getFieldProps('authorizationPictureId', {
                    validateFirst: true,
                  })}/>
              </FormItem>
            </FormItem>

            {this.fieldWarningAlert}

            <h3 className="kb-form-sub-title">
              <div className="kb-form-sub-title-line"></div>
            </h3>

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
                help={getFieldError('certificatePictureId') || <span>餐饮行业需上传餐饮服务许可证，面包蛋糕类商户如办理了食品流通许可证，也可上传食品流通许可证；烟酒，进口食品等特色商品，需要相应的营业许可证，点击此处 <a target="_blank" href="https://cshall.alipay.com/takeaway/knowledgeDetail.htm?knowledgeId=201602048066">查看当前经营品类所需证书</a></span>}>
                <PhotoPicker
                  pid={data.partnerId}
                  modalTitle="上传许可证"
                  defaultFileList={defaultData.certificatePictureList}
                  exampleList={[
                    {name: '食品许可证示例', url: 'https://zos.alipayobjects.com/rmsportal/qLTmZYJzXUaMjUM.png'},
                    {name: '卫生许可证示例', url: 'https://zos.alipayobjects.com/rmsportal/eagqBivxthosDHO.png'},
                  ]}
                  {...getFieldProps('certificatePictureId', {
                    validateFirst: true,
                    rules: [{
                      required: needCertificateLicense,
                      type: 'array',
                      message: '此处必填',
                    }],
                  })}/>
              </FormItem>

              <FormItem
                validateStatus={
                  classnames({
                    error: !!getFieldError('certificateValidTimeType'),
                  })}
                required={needCertificateLicense}
                help={getFieldError('certificateValidTimeType') || true}
                >
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

            <FormItem
              label="其他证明："
              validateStatus={
              classnames({
                error: !!getFieldError('otherAuthorizationId'),
              })}
              help={(getFieldError('otherAuthorizationId') || otherCopy)}
              labelCol={{span: 4}}
              wrapperCol={{span: 14}}>
              <PhotoPicker
                pid={data.partnerId}
                multiple
                modalTitle="上传其他证明"
                defaultFileList={defaultData.otherAuthorizationList}
                {...getFieldProps('otherAuthorizationId', {
                  validateFirst: true,
                })}/>
            </FormItem>

          </Form>
          <div style={{padding: '24px 0 24px 160px', margin: '48px -16px 0 -16px', borderTop: '1px solid #e4e4e4'}}>
            <label>
              <Checkbox {...getFieldProps('bindingPublic', {valuePropName: 'checked', initialValue: true})}/>
              开通服务窗，服务客户更便捷，阅读并同意<a href="https://os.alipayobjects.com/rmsportal/IrOzniYBzROaDhh.html" target="_blank">《门店和服务窗信息同步授权函》</a>
            </label>
          </div>
          <div style={{padding: '24px 0 48px 237px', margin: this.props.isEdit ? '48px -16px 0 -16px' : '0 -16px', borderTop: '1px solid #e4e4e4'}}>
            <Button type="ghost" size="large" style={{marginRight: 12}} onClick={this.props.onCancel}>上一步</Button>
            <Button type="primary" size="large" style={{marginRight: 12}} onClick={this.onOk} loading={!canSubmit}>提交申请</Button>
          </div>
        </div>
      </div>
    );
  },
});

export default Form.create(formOption)(InputCertifyInfo);
