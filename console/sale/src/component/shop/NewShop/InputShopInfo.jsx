import React, {PropTypes} from 'react';
import {Col, Form, Button, Input, InputNumber, Checkbox, Row, Alert, Radio} from 'antd';
import classnames from 'classnames';
import PayType from './PayType';
import ShopTime from '../../../common/ShopTime';
import {commonCheck, checkAddressCollect, telephone} from '../../../common/validatorUtils';
import permission from '@alipay/kb-framework/framework/permission';
import BrandSelect from '../../../common/BrandSelect';
import AreaCategoryRows from '../../../common/AreaCategory/AreaCategoryRows';
import PhotoPicker from '../../../common/PhotoPicker';
import PosSelect from '../../../common/PosSelect';
import {formOption} from '../../../common/formOption';
import {remoteLog} from '../../../common/utils';
import ShopTimeUtil from '../../../common/shopTimeUtil';

const RadioGroup = Radio.Group;

const FormItem = Form.Item;

function generateProblemLabels(problemLabels = {}) {
  const summary = [];
  Object.keys(problemLabels)
    .forEach(key => {
      const reasons = problemLabels[key];
      if (reasons && reasons.length > 0) {
        summary.push(reasons.join('，'));
      }
    });
  return (summary.length > 0 &&
    <Alert message="格式有误" type="warning" showIcon description={
      <span>
        {summary.map((desc, i) => <span key={i}>{desc}；<br /></span>)}
        请保证门店信息准确，提升搜索排序，方便用户查找。修改通过审核后将自动取消信息报错；如有问题，请<a href="https://cschannel.alipay.com/newPortal.htm?scene=kb_0017" target="_blank">点此咨询</a>
      </span>
    } />
  );
}

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
    isFromSupport: PropTypes.bool,
    checkChangeSign: PropTypes.bool, // 是否需要在品类改变的时候 校验改签
  },

  componentWillMount() {
    this.fieldWarningAlert = (<Row style={{ marginBottom: '10px' }}>
      <Col span={14} offset={4}>
        {this.props.isEdit && <span style={{color: '#f60'}}>该字段属于敏感字段，修改后需经过审批通过才生效</span>}
      </Col>
    </Row>);
    this.props.form.setFieldsInitialValue(this.props.defaultData);
  },

  onOk() {
    remoteLog('SHOP_NEW_NEXT2');
    this.props.form.validateFieldsAndScroll((...args) => {
      if (!args[0]) {
        this.checkAll(() => {
          this.props.onOk(...args);
        });
      }
    });
  },

  onFocusSubShopInfo() {
    setTimeout(()=> {
      this.refs.shopNameText.style.display = 'block';
    }, 30);
  },

  checkSubShopInfo(rule, value, callback) {
    this.props.form.validateFields(['headShopName'], {'force': true});
    callback();
  },
  // 限2~20个数字/字母/中文计算
  strlen(str) {
    if (str) {
      return str.length;
    }
    return 0;
  },

  checkShopInfo(rule, value, callback) {
    const {getFieldValue} = this.props.form;
    const branchName = getFieldValue('shopName');
    if (!value && branchName) {
      commonCheck('branchShopName', { branchShopName: branchName}, (errs) => {
        if (errs) {
          callback(errs);
        } else {
          this.checkAll(callback);
        }
      });
    } if (branchName) {
      commonCheck('headAndBranchShopName', {headShopName: value, branchShopName: branchName}, (errs) => {
        if (errs) {
          callback(errs);
        } else {
          this.checkAll(callback);
        }
      });
    } else {
      commonCheck('headShopName', {headShopName: value}, (errs) => {
        if (errs) {
          callback(errs);
        } else {
          this.checkAll(callback);
        }
      });
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
/* eslint-disable */
  render() {
/* eslint-enable */
    const rootStyle = this.props.visible ? {} : {display: 'none'};
    const {getFieldProps, getFieldError} = this.props.form;
    const {isEdit, isOrder, defaultData, data} = this.props;
    const isLeads = !!defaultData.leadsId;
    let canModifyCategory = true;
    if (isEdit && !defaultData.canModifyCategory) {
      canModifyCategory = false;
    }

    const errors = generateProblemLabels(defaultData.shopProblemLabels);
    const disableArea = isEdit && !permission('PERMISSION_SHOP_MODIFY_ADMIN') && !this.props.isFromSupport || isLeads; // 编辑状态下，有小二修改权限的则不对省市区做限制

    const logoCopy = (
        <div>
          <p style={{lineHeight: '16px'}}><span style={{color: '#F90'}}>仅支持上传一张，LOGO将在支付宝-口碑页面展示。</span>不可有水印、须实景图，如上传装修效果图则将被驳回。</p>
          <p style={{lineHeight: '16px'}}>不超过10M，格式：bmp，png，jpeg，gif。建议尺寸在500px＊500px以上（更容易通过审核）</p>
        </div>
      );
    const coverCopy = (
        <div>
          <p style={{lineHeight: '16px'}}><span style={{color: '#F90'}}>仅支持上传一张，首图在支付宝-口碑页面重点展示，</span></p>
          <p style={{lineHeight: '16px'}}>不可有水印、须实景图，如上传装修效果图则将被驳回。</p>
          <p style={{lineHeight: '16px'}}>不超过10M。格式：bmp，png，jpeg，gif。建议尺寸在2000px＊1500px以上（更容易通过审核）</p>
        </div>
      );
    const pictureDetailCopy = (
        <div>
          <p style={{lineHeight: '16px'}}><span style={{color: '#F90'}}>必须上传3张以上，包含1张门头照片，门头照上须有店名，且店名需与填写的门店名称一致。</span></p>
          <p style={{lineHeight: '16px'}}>不可有水印、须实景图，如上传装修效果图则将被驳回。</p>
          <p style={{lineHeight: '16px'}}>不超过10M。格式：bmp，png，jpeg，gif。建议尺寸在2000px＊1500px以上（更容易通过审核）</p>
        </div>
      );
    return (
      <div style={rootStyle}>
        <div style={{padding: '24px 0', minHeight: 200}}>
        {errors}
          <Form horizontal>

            <h3 className="kb-form-sub-title">
              <div className="kb-form-sub-title-icon"></div>
              <span className="kb-form-sub-title-text">基本属性</span>
              <div className="kb-form-sub-title-line"></div>
            </h3>

            <FormItem
              label="品牌名称："
              validateStatus={classnames({error: !!getFieldError('brandId')})}
              required
              help={getFieldError('brandId')}
              labelCol={{span: 4}}
              wrapperCol={{span: 7}}>
              <BrandSelect
                brandName={defaultData.brandName}
                {...getFieldProps('brandId', {
                  validateFirst: true,
                  rules: [{
                    required: true,
                    message: '此处必填',
                  }],
                })}
                disabled={isLeads}
                placeholder="品牌简称，如：金钱豹"/>
            </FormItem>

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
                  disabled={isLeads}
                  {...getFieldProps('headShopName', {
                    validateTrigger: 'onBlur',
                    validateFirst: true,
                    rules: [{
                      required: true,
                      message: '此处必填',
                    }, this.checkShopInfo],
                  })}/>
                </Col>
               <Col span="6">
                <Input
                  placeholder="选填，例：延安店"
                  disabled={isLeads}
                  {...getFieldProps('shopName', {
                    validateTrigger: 'onBlur',
                    validateFirst: true,
                    rules: [this.checkSubShopInfo],
                  })}/>
                  </Col>
              </Row>
              <div style={{display: 'block'}}>
                <p style={{lineHeight: '16px', color: '#F90', marginTop: '8px'}}>请勿填错格式，导致开店失败。正确示例如下：</p>
                <p style={{lineHeight: '16px'}}>1.老何炒面: 主店名=老何炒面，分店名不填</p>
                <p style={{lineHeight: '16px'}}>2.肯德基(大学城店): 主店名=肯德基，分店名=大学城店</p>
                <p style={{lineHeight: '16px'}}>3.兰州拉面(人民美食广场): 主店名=兰州拉面，分店名=人民美食广场</p>
                <p style={{lineHeight: '16px', color: '#F90'}}>括号不需要填写</p>
              </div>
            </FormItem>

            {this.fieldWarningAlert}

            <AreaCategoryRows form={this.props.form} shopType="COMMON" showDesc
              areaDisabled={disableArea} categoryDisabled={canModifyCategory}
              isShopEdit
              checkChangeSign={this.props.checkChangeSign}
              partnerId={data.partnerId}
            />

            <FormItem
              label="门店电话："
              required
              labelCol={{span: 4}} style={{marginTop: '24px'}}>
              <Col span="3" style={{marginRight: 10}}>
                <FormItem
                  validateStatus={classnames({error: !!getFieldError('mobileNo1')})}
                  help={getFieldError('mobileNo1') || true}>
                  <Input placeholder="例:020-33333333"
                    {...getFieldProps('mobileNo1', {
                      validateTrigger: 'onBlur',
                      validateFirst: true,
                      rules: [{
                        required: true,
                        message: '此处必填',
                      }, telephone, this.checkPhone],
                    })}/>
                </FormItem>
              </Col>
              <Col span="3" style={{marginRight: 10}}>
                <FormItem
                  validateStatus={classnames({error: !!getFieldError('mobileNo2')})}
                  help={getFieldError('mobileNo2') || true}>
                  <Input placeholder="例:13411993535"
                    {...getFieldProps('mobileNo2', {
                      validateTrigger: 'onBlur',
                      validateFirst: true,
                      rules: [telephone, this.checkPhone],
                    })}/>
                </FormItem>
              </Col>
              <Col span="3" style={{marginRight: 10}}>
                <FormItem
                  validateStatus={classnames({error: !!getFieldError('mobileNo3')})}
                  help={getFieldError('mobileNo3') || true}>
                  <Input placeholder="第三个电话"
                    {...getFieldProps('mobileNo3', {
                      validateTrigger: 'onBlur',
                      validateFirst: true,
                      rules: [telephone, this.checkPhone],
                    })}/>
                </FormItem>
              </Col>
              <Col span="3" style={{marginRight: 10}}>
                <FormItem
                  validateStatus={classnames({error: !!getFieldError('mobileNo4')})}
                  help={getFieldError('mobileNo4') || true}>
                  <Input placeholder="第四个电话"
                    {...getFieldProps('mobileNo4', {
                      validateTrigger: 'onBlur',
                      validateFirst: true,
                      rules: [telephone, this.checkPhone],
                    })}/>
                </FormItem>
              </Col>
              <Col span="3" style={{marginRight: 10}}>
                <FormItem
                  validateStatus={classnames({error: !!getFieldError('mobileNo5')})}
                  help={getFieldError('mobileNo5') || true}>
                  <Input placeholder="第五个电话"
                    {...getFieldProps('mobileNo5', {
                      validateTrigger: 'onBlur',
                      validateFirst: true,
                      rules: [telephone, this.checkPhone],
                    })}/>
                </FormItem>
              </Col>
            </FormItem>

            <PayType form={this.props.form} defaultData={defaultData} />

            <FormItem
              label="品牌Logo："
              validateStatus={
                classnames({
                  error: !!getFieldError('logoId'),
                })}
              required
              help={getFieldError('logoId') || logoCopy}
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

            <FormItem
              label="门店首图："
              validateStatus={
              classnames({
                error: !!getFieldError('coverId'),
              })}
              required
              help={getFieldError('coverId') || coverCopy}
              labelCol={{span: 4}}
              wrapperCol={{span: 14}}>
              <PhotoPicker
                pid={data.partnerId}
                modalTitle="上传门店首图"
                defaultFileList={defaultData.coverList}
                exampleList={[
                  {name: '客户端示例', url: 'https://zos.alipayobjects.com/rmsportal/VZyAFILMgzFYYrV.jpg'},
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
              label="门头照与内景照："
              validateStatus={
              classnames({
                error: !!getFieldError('pictureDetailId'),
              })}
              required
              help={getFieldError('pictureDetailId') || pictureDetailCopy}
              labelCol={{span: 4}}
              wrapperCol={{span: 14}}>
              <PhotoPicker
                pid={data.partnerId}
                multiple
                min={3}
                modalTitle="上传门头照与内景照"
                defaultFileList={defaultData.pictureDetailList}
                exampleList={[
                  {name: '门头照示例', url: 'https://zos.alipayobjects.com/rmsportal/dOSMWpesoZpxMAq.png'},
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
                  }],
                })}/>
            </FormItem>

            {this.fieldWarningAlert}

            <div style={{height: '18px'}}></div>
            <FormItem
              label="主要联系人："
              labelCol={{span: 4}}
              wrapperCol={{span: 18}}>
              <Input placeholder="请输入"
                {...getFieldProps('kpName', {
                  rules: [{
                    message: '联系人职位不可为空',
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

            {data.partnerId && (<FormItem
              label="机具编号："
              validateStatus={
              classnames({
                error: !!getFieldError('posId'),
              })}
              labelCol={{span: 4}}
              wrapperCol={{span: 12}}>
              <PosSelect pid={data.partnerId} {...getFieldProps('posId', {
                type: 'array',
              })}/>
            </FormItem>)}

            <FormItem
              label="门店编号："
              validateStatus={
                classnames({
                  error: !!getFieldError('outShopId'),
                })}
              help={getFieldError('outShopId')}
              labelCol={{span: 4}}
              wrapperCol={{span: 12}}>
              <Input {...getFieldProps('outShopId', {
                validateFirst: true,
                rules: [{
                  max: 32,
                  message: '限32个字',
                }],
              })}
              placeholder="请输入商家自定义的门店编号，支持中文，例如：hangzhou001xiangshen002"/>
            </FormItem>

            <ShopTime {...getFieldProps('businessTime', {
              valuePropName: 'times',
              initialValue: defaultData.businessTime,
              rules: [ShopTimeUtil.validationTimesCross],
            })}
            />

            <FormItem
              label="人均价格："
              validateStatus={
                classnames({
                  error: !!getFieldError('perPay'),
                })}
              help={getFieldError('perPay') || '限正整数，不支持小数点'}
              labelCol={{span: 4}}
              wrapperCol={{span: 4}}>
              <InputNumber min={1} {...getFieldProps('perPay', {
                validateFirst: true,
                rules: [{
                  type: 'number',
                  max: 99999,
                  message: '数值大于99999',
                }],
              })}
                style={{marginRight: 10}}
                placeholder="请输入"/>
              <span className="ant-form-text">元</span>
            </FormItem>

            <FormItem
              label="提供服务："
              validateStatus={
                classnames({
                  error: !!getFieldError('service'),
                })}
              labelCol={{span: 4}}
              wrapperCol={{span: 12}}
              help>
              <label style={{marginRight: 40}}>
                <Checkbox {...getFieldProps('park', {valuePropName: 'checked'})}>停车位</Checkbox>
              </label>
              <label style={{marginRight: 40}}>
                <Checkbox {...getFieldProps('wifi', {valuePropName: 'checked'})}>WIFI</Checkbox>
              </label>
              <label style={{marginRight: 40}}>
                <Checkbox {...getFieldProps('box', {valuePropName: 'checked'})}>包厢</Checkbox>
              </label>
              <label style={{marginRight: 40}}>
                <Checkbox {...getFieldProps('noSmoke', {valuePropName: 'checked'})}>无烟区</Checkbox>
              </label>
            </FormItem>

            <FormItem
              label="更多服务："
              validateStatus={
                classnames({
                  error: !!getFieldError('otherService'),
                })}
              help={getFieldError('otherService') || '限300个字'}
              labelCol={{span: 4}}
              wrapperCol={{span: 12}}>
              <Input type="textarea" rows="3"
                {...getFieldProps('otherService', {
                  validateFirst: true,
                  rules: [{
                    max: 600,
                    message: '字数超出300字',
                  }],
                })}
                placeholder="其他服务内容：例：满就送－消费送200元送果盘"/>
            </FormItem>

          </Form>
          <div style={{padding: '24px 0 48px 237px', margin: '48px -16px 0 -16px', borderTop: '1px solid #e4e4e4'}}>
            {!(isEdit || isOrder) && <Button type="ghost" size="large" style={{marginRight: 12}} onClick={this.props.onCancel}>上一步</Button>}
            <Button type="primary" size="large" style={{marginRight: 12}} onClick={this.onOk}>下一步</Button>
          </div>
        </div>
      </div>
    );
  },
});

export default Form.create(formOption)(InputShopInfo);
