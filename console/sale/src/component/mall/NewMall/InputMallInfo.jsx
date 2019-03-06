import React, {PropTypes} from 'react';
import {Col, Form, Button, Input, Row, Alert, Radio, DatePicker, InputNumber} from 'antd';
import classnames from 'classnames';
import '../style.less';
import ShopTime from '../../../common/ShopTime';
import {commonCheck, checkAddressCollect, telephone} from '../../../common/validatorUtils';
import BrandSelect from './BrandSelect';
import AreaCategoryRows from '../../../common/AreaCategory/AreaCategoryRows';
import PhotoPicker from '../../../common/PhotoPicker';
import {formOption} from '../../../common/formOption';
import {remoteLog} from '../../../common/utils';
import ShopTimeUtil from '../../../common/shopTimeUtil';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

const InputShopInfo = React.createClass({
  propTypes: {
    form: PropTypes.object,
    isEdit: PropTypes.bool,
    isOrder: PropTypes.bool,
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
    this.fieldWarningAlert = (<Row style={{ marginBottom: '10px' }}>
      <Col span={14} offset={4}>
        {this.props.isEdit && <span style={{color: '#f60'}}>该字段属于敏感字段，修改后需经过审批通过才生效</span>}
      </Col>
    </Row>);
    this.props.form.setFieldsInitialValue(this.props.defaultData);
  },
  componentWillUpdate(nextProps) {
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

  checkSubShopInfo(rule, value, callback) {
    this.props.form.validateFields(['headShopName'], {'force': true});
    callback();
  },

  checkShopInfo(rule, value, callback) {
    const {getFieldValue} = this.props.form;
    const branchName = getFieldValue('shopName');
    if (!value && branchName) {
      commonCheck('branchShopName', { branchShopName: branchName}, callback);
    } if (branchName) {
      commonCheck('headAndBranchShopName', {headShopName: value, branchShopName: branchName}, callback);
    } else {
      commonCheck('headShopName', {headShopName: value}, callback);
    }
  },

  checkPhone(rule, value, callback) {
    if (value) {
      commonCheck('phone', {phones: value}, callback);
    } else {
      callback();
    }
  },

  checkAll(callback) {
    const {area, address} = this.props.form.getFieldsValue();
    if (area && area.length === 3 && address) {
      const [provinceId, cityId, districtId] = area;
      checkAddressCollect({
        address,
        provinceId,
        cityId,
        districtId,
      }, callback);
    }
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
  render() {
    const rootStyle = this.props.visible ? {} : {display: 'none'};
    const {getFieldProps, getFieldError, getFieldValue} = this.props.form;
    const {defaultData, data} = this.props;
    const {needBusinessLicense, canSubmit} = this.state;
    const isLeads = !!defaultData.leadsId;
    return (
      <div style={rootStyle}>
        <div style={{padding: '24px 0', minHeight: 200}}>
          <Form horizontal>

            <h3 className="kb-form-sub-title">
              <div className="kb-form-sub-title-icon"></div>
              <span className="kb-form-sub-title-text">基本属性</span>
              <div className="kb-form-sub-title-line"></div>
            </h3>

            <FormItem
              label="门店名称："
              required
              labelCol={{span: 4}}
              wrapperCol={{span: 18}}
              validateStatus={classnames({error: !!getFieldError('headShopName')})}
              help={getFieldError('headShopName') || true}
            >
            <Row>
              <Col span="6" style={{marginRight: 10}}>
                <Input
                  placeholder="例：海底捞"
                  {...getFieldProps('headShopName', {
                    validateTrigger: 'onBlur',
                    validateFirst: true,
                    rules: [{
                      required: true,
                      message: '此处必填',
                    }, {
                      max: 20,
                      message: '输入的最大长度为20个字符',
                    }, this.checkShopInfo],
                  })}/>
                </Col>
               <Col span="6">
                <Input
                  placeholder="选填，例：延安店"
                  {...getFieldProps('shopName', {
                    validateTrigger: 'onBlur',
                    validateFirst: true,
                    rules: [this.checkSubShopInfo],
                  })}/>
                  </Col>
              </Row>
              <p style={{lineHeight: '16px', marginTop: '8px'}}>如当前商户有分店，请把店铺所在街道/商圈/美食城/大学城填为分店名，如：<span style={{color: '#F90'}}>文一路店</span></p>
              <p style={{lineHeight: '16px'}}>结合门店名称则在用户端显示为：<span style={{color: '#F90'}}>肯德基(文一路店)</span></p>
              <p style={{color: '#F90'}}>每个名称限20个字，请严格按照以上格式填写门店名称，避免错填格式与其他门店重复，导致开店失败</p>
            </FormItem>

            {this.fieldWarningAlert}

            <AreaCategoryRows form={this.props.form} shopType="MALL" showDesc disabled={isLeads} categoryDisabled={defaultData.canModifyCategory}/>

            <Col offset="4">
              <div style={{margin: '10px 0', color: '#fa0'}}>请先选择品类再输入品牌名称</div>
            </Col>
              <FormItem
                label="品牌名称："
                validateStatus={classnames({error: !!getFieldError('brandId')})}
                required
                help={getFieldError('brandId')}
                labelCol={{span: 4}}
                wrapperCol={{span: 7}}>
                <BrandSelect
                  categoryId={getFieldValue('categoryId')}
                  brandName={defaultData.brandName}
                  {...getFieldProps('brandId', {
                    validateFirst: true,
                    rules: [{
                      required: true,
                      message: '此处必填',
                    }],
                  })}
                  disabled={!(getFieldValue('categoryId') && getFieldValue('categoryId').length > 0)}
                  placeholder="请输入品牌名称"/>
              </FormItem>

            <FormItem
              label="品牌Logo："
              validateStatus={
                classnames({
                  error: !!getFieldError('logoId'),
                })}
              required
              help={getFieldError('logoId') || '仅支持上传一张。不超过10M。格式：bmp，png，jpeg，gif。建议尺寸在500px＊500px以上（更容易通过审核）'}
              labelCol={{span: 4}}
              wrapperCol={{span: 14}}>
              <PhotoPicker
                pid={data.partnerId}
                modalTitle="上传品牌Logo"
                defaultFileList={defaultData.logoList}
                exampleList={[
                  {name: '查看示例', url: 'https://t.alipayobjects.com/images/rmsweb/T1hbtgXhdbXXXXXXXX.jpg'},
                ]}
                {...getFieldProps('logoId', {
                  validateFirst: true,
                  rules: [{
                    required: true,
                    type: 'array',
                    message: '此处必填',
                  }],
                })}/>
            </FormItem>
            <div style={{height: '20px'}}></div>
            <FormItem
              label="商圈电话："
              help={getFieldError('mobileNo')}
              labelCol={{span: 4}}
              wrapperCol={{span: 12}}>
              <Input placeholder="例:020-33333333"
                {...getFieldProps('mobileNo', {
                  validateTrigger: 'onBlur',
                  validateFirst: true,
                  rules: [{
                    required: true,
                    message: '此处必填',
                  }, telephone, this.checkPhone],
                })}/>
            </FormItem>

            <FormItem
              label="门店首图："
              validateStatus={
              classnames({
                error: !!getFieldError('coverId'),
              })}
              required
              extra={<div style={{lineHeight: 1.5}}><span style={{color: '#fa0'}}>仅支持上传一张</span>,不超过10M。格式：bmp，png，jpeg，gif。建议尺寸在2000px＊1500px以上（更容易通过审核<br/>可首选优质菜品图作为首图，首图会在手机支付宝中重点展示</div>}
              help={getFieldError('coverId')}
              labelCol={{span: 4}}
              wrapperCol={{span: 14}}>
              <PhotoPicker
                pid={data.partnerId}
                modalTitle="上传门店首图"
                defaultFileList={defaultData.coverList}
                exampleList={[
                  {name: '客户端示例', url: 'https://t.alipayobjects.com/images/rmsweb/T1aG4gXntiXXXXXXXX.jpg'},
                ]}
                {...getFieldProps('coverId', {
                  validateFirst: true,
                  rules: [{
                    required: true,
                    type: 'array',
                    message: '此处必填',
                  }],
                })}/>
            </FormItem>

            {this.fieldWarningAlert}

            <FormItem
              label="门店内景："
              validateStatus={
              classnames({
                error: !!getFieldError('pictureDetailId'),
              })}
              required
              extra={<div style={{lineHeight: 1.5}}>须上传3~10张，不超过10M。格式：bmp，png，jpeg，gif。建议尺寸在2000px＊1500px以上（更容易通过审核)<br/><span style={{color: '#fa0'}}>上传照片中需要包含一张门头照片，如无门头照片将会审核失败</span>
            </div>}
              help={getFieldError('pictureDetailId')}
              labelCol={{span: 4}}
              wrapperCol={{span: 14}}>
              <PhotoPicker
                pid={data.partnerId}
                multiple
                min={3}
                max={10}
                modalTitle="上传门店内景"
                defaultFileList={defaultData.pictureDetailList}
                exampleList={[
                  {name: '门头照示例', url: 'https://t.alipayobjects.com/images/rmsweb/T1QCFfXXRcXXXXXXXX.jpg'},
                  {name: '内景照示例', url: 'https://t.alipayobjects.com/images/rmsweb/T1ZRRfXf4qXXXXXXXX.jpg'},
                ]}
                {...getFieldProps('pictureDetailId', {
                  validateFirst: true,
                  rules: [{
                    required: true,
                    type: 'array',
                    message: '此处必填',
                  }, {
                    min: 3,
                    type: 'array',
                    message: '最少3张',
                  },
                    {
                      max: 10,
                      type: 'array',
                      message: '最多10张',
                    },
                  ],
                })}/>
            </FormItem>

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
                <PhotoPicker
                  pid={data.partnerId}
                  modalTitle="上传营业执照"
                  defaultFileList={defaultData.licensePictureList}
                  exampleList={[
                    {name: '个体工商户示例', url: 'https://t.alipayobjects.com/tfscom/T1PCpfXa8cXXXXXXXX.jpg'},
                    {name: '企业示例', url: 'https://t.alipayobjects.com/tfscom/T1kmdfXmtgXXXXXXXX.jpg'},
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
                  <Radio value="1">有效期至
                  </Radio>
                  <div style={{display: 'inline-block'}}>
                    <DatePicker
                      style={{marginRight: 8}}
                      disabledDate={this.disabledDate}
                      {...getFieldProps('licenseValidTime', {rules: [{type: 'date'},
                      this.checkValidTime.bind(this, 'licenseValidTimeType', needBusinessLicense)],
                    })} />
                  </div>
                  <Radio value="2">长期有效</Radio>
                </RadioGroup>
              </FormItem>
            </FormItem>

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
                placeholder="营业执照编号"/>
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
              label="其他证明："
              validateStatus={
              classnames({
                error: !!getFieldError('otherAuthorizationId'),
              })}
              help={(getFieldError('otherAuthorizationId') || '资质证明照也可上传')}
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

            {this.fieldWarningAlert}


            <FormItem
              required
              label="年营业总额："
              validateStatus={
              classnames({
                error: !!getFieldError('annualTurnover'),
              })}
              help={(getFieldError('annualTurnover'))}
              labelCol={{span: 4}}
              wrapperCol={{span: 20}}>
              <InputNumber min={0.00} step={0.01} {...getFieldProps('annualTurnover', {
                rules: [{
                  required: true,
                  message: '此处必填',
                  type: 'number',
                }],
              })} mountNode/>
                  <span style={{width: '50px', height: '32px', background: '#ddd', display: 'inline-block', marginLeft: '-16px', textAlign: 'center', borderRadius: '5px'}}>亿元</span>
            </FormItem>

            <FormItem
              required
              label="总营业面积："
              validateStatus={
              classnames({
                error: !!getFieldError('businessArea'),
              })}
              help={(getFieldError('businessArea'))}
              labelCol={{span: 4}}
              wrapperCol={{span: 20}}>
              <InputNumber min={0.00} step={0.01} {...getFieldProps('businessArea', {
                rules: [{
                  required: true,
                  message: '此处必填',
                  type: 'number',
                }],
              })} mountNode/>
              <span style={{width: '70px', height: '32px', background: '#ddd', display: 'inline-block', marginLeft: '-16px', textAlign: 'center', borderRadius: '5px'}}>万平方米</span>
            </FormItem>

            <FormItem
              required
              label="日均交易笔数："
              validateStatus={
              classnames({
                error: !!getFieldError('dailyTradeCnt'),
              })}
              help={(getFieldError('dailyTradeCnt'))}
              labelCol={{span: 4}}
              wrapperCol={{span: 20}}>
              <InputNumber min={0} step={1} {...getFieldProps('dailyTradeCnt', {
                rules: [{
                  required: true,
                  message: '此处必填',
                  type: 'number',
                }],
              })} mountNode/>
                  <span style={{width: '50px', height: '32px', background: '#ddd', display: 'inline-block', marginLeft: '-16px', textAlign: 'center', borderRadius: '5px'}}>笔</span>
            </FormItem>

            <FormItem
              required
              label="GMV："
              validateStatus={
              classnames({
                error: !!getFieldError('gmv'),
              })}
              help={(getFieldError('gmv'))}
              labelCol={{span: 4}}
              wrapperCol={{span: 20}}>
              <InputNumber min={0.00} step={0.01} {...getFieldProps('gmv', {
                rules: [{
                  required: true,
                  message: '此处必填',
                  type: 'number',
                }],
              })} mountNode/>
                  <span style={{width: '50px', height: '32px', background: '#ddd', display: 'inline-block', marginLeft: '-16px', textAlign: 'center', borderRadius: '5px'}}>元</span>
            </FormItem>

            <FormItem
              required
              label="各行业门店数："
              validateStatus={
              classnames({
                error: !!getFieldError('restaurantShopCnt') || !!getFieldError('universalShopCnt') || !!getFieldError('fastConsumeShopCnt') || !!getFieldError('payShopCnt'),
              })}
              help={(getFieldError('restaurantShopCnt') || getFieldError('universalShopCnt') || getFieldError('fastConsumeShopCnt') || getFieldError('payShopCnt'))}
              labelCol={{span: 4}}
              wrapperCol={{span: 20}}>
              <Row>
                <Col span={'8'}>
                  <div>
                    <p style={{marginRight: 10, width: 84, float: 'left'}}>餐饮类门店数</p>
                    <InputNumber min={0} {...getFieldProps('restaurantShopCnt', {
                      rules: [{
                        required: true,
                        message: '门店数必填',
                        type: 'number',
                      }],
                    })} />
                  <p className="mallBusiness">家</p>
                  </div>
                </Col>
                <Col span={'8'} offset={'2'}>
                  <div>
                    <p style={{marginRight: 10, width: 84, float: 'left'}}>泛行业类门店数</p>
                    <InputNumber min={0} {...getFieldProps('universalShopCnt', {
                      rules: [{
                        required: true,
                        message: '门店数必填',
                        type: 'number',
                      }],
                    })} />
                  <p className="mallBusiness">家</p>
                  </div>

                </Col>
              </Row>
              <Row style={{marginTop: 20}}>
                <Col span={'8'}>
                  <div>
                    <p style={{marginRight: 10, width: 84, float: 'left'}}>快消类门店数</p>
                    <InputNumber min={0} {...getFieldProps('fastConsumeShopCnt', {
                      rules: [{
                        required: true,
                        message: '门店数必填',
                        type: 'number',
                      }],
                    })} />
                    <p className="mallBusiness">家</p>
                  </div>

                </Col>
                <Col span={'8'} offset={'2'}>
                  <div>
                    <p style={{marginRight: 10, width: 84, float: 'left'}}>支付类门店数</p>
                    <InputNumber style={{height: 32}} min={0} {...getFieldProps('payShopCnt', {
                      rules: [{
                        required: true,
                        message: '门店数必填',
                        type: 'number',
                      }],
                    })} />
                    <p className="mallBusiness">家</p>
                  </div>

                </Col>
              </Row>
            </FormItem>


            <FormItem
              label="主要联系人："
              labelCol={{span: 4}}
              wrapperCol={{span: 18}}>
              <Input placeholder="请输入"
                {...getFieldProps('kpName', {
                  rules: [{
                    message: '联系人不可为空',
                    required: true,
                  }, {
                    max: 20,
                    message: '限20个字符',
                  }],
                })}/>
            </FormItem>

            <FormItem
              label="联系人角色："
              labelCol={{span: 4}}
              wrapperCol={{span: 18}}>
              <RadioGroup {...getFieldProps('kpJob', {
                rules: [{
                  message: '联系人职位不可为空',
                  required: true,
                }],
              })}>
                <Radio value= "SHOP_KEEPER">店长</Radio>
                <Radio value= "SHOP_BOSS">老板</Radio>
                <Radio value= "SHOP_OTHER">其他</Radio>
              </RadioGroup>
            </FormItem>

            <FormItem
              label="联系人电话："
              labelCol={{span: 4}}
              extra={<div style={{lineHeight: 1.5}}>请输入11位手机号码或座机号，座机号需填写区号-电话，如：<span style={{color: '#F90'}}>010-12345678</span>
            </div>}
              wrapperCol={{span: 18}}>
              <Input {...getFieldProps('kpTelNo', {
                validateFirst: true,
                rules: [{
                  message: '联系人电话不可为空',
                  required: true,
                }, {
                  max: 100,
                  message: '限100个字符',
                }, telephone, this.checkPhone],
              })}
                     placeholder="例如钉钉，旺旺等可以联系商家的有效联系方式"/>
            </FormItem>

            <h3 className="kb-form-sub-title">
              <div className="kb-form-sub-title-icon"></div>
              <span className="kb-form-sub-title-text">补充信息</span>
              <div className="kb-form-sub-title-line"></div>
            </h3>

            <ShopTime {...getFieldProps('businessTime', {
              valuePropName: 'times',
              initialValue: defaultData.businessTime,
              rules: [ShopTimeUtil.validationTimesCross],
            })}
            />

          </Form>
          <div style={{padding: '12px 0 24px 0', margin: '48px -16px 0 -16px', borderTop: '1px solid #e4e4e4'}}>
          </div>
          <Row>
            <Col offset="4">
              <Button type="ghost" size="large" style={{marginRight: 12}} onClick={this.props.onCancel}>上一步</Button>
              <Button type="primary" size="large" style={{marginRight: 12}} onClick={this.onOk} loading={!canSubmit}>提交申请</Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  },
});

export default Form.create(formOption)(InputShopInfo);
