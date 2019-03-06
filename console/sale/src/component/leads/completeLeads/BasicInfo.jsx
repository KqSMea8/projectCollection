import React, {PropTypes} from 'react';
import classnames from 'classnames';
import { Form, Input, Checkbox, InputNumber, Button, Col, Row, Radio } from 'antd';
const FormItem = Form.Item;
import PayType from './PayType';
import ShopTime from './ShopTime';
import AreaCategoryRows from '../../../common/AreaCategory/AreaCategoryRows';
import BrandSelect from '../../../common/BrandSelect';
import { noBracket, telephone } from '../../../common/validatorUtils';
import { Upload, normalizeUploadValue, normalizeUploadValueOne } from '../../../common/Upload';
import { checkAddressCollect, commonCheck } from '../../../common/validatorUtils';
import { remoteLog } from '../../../common/utils';
const RadioGroup = Radio.Group;

const BasicInfo = React.createClass({
  propTypes: {
    form: PropTypes.object,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
    visible: PropTypes.bool,
    defaultData: PropTypes.object,
    data: PropTypes.object,
  },

  componentWillMount() {
    this.fieldWarningAlert = null;
    /*
    (<FormItem
      label={<div style={{height: 1}}></div>}
      labelCol={{span: 4}}
      wrapperCol={{span: 14}}
      help>
      <div style={{marginTop: -10}}>
        {<span style={{color: '#f60'}}>该字段属于敏感字段，修改后需经过审批通过才生效</span>}
      </div>
    </FormItem>);
    */
    this.props.form.setFieldsInitialValue(this.props.defaultData);
  },

  onOk() {
    remoteLog('LEADS_COMPLETE_NEXT2');
    this.props.form.validateFieldsAndScroll((...args) => {
      if (!args[0]) {
        this.checkAll(() => {
          this.props.onOk(...args);
        });
      }
    });
  },
  checkAll(callback) {
    const { area, address } = this.props.form.getFieldsValue();
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

  checkSubShopInfo(rule, value, callback) {
    this.props.form.validateFields(['name'], {'force': true});
    callback();
  },

  checkShopInfo(rule, value, callback) {
    const {getFieldValue} = this.props.form;
    const branchName = getFieldValue('branchName');
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
  /*eslint-disable */
  render() {
    /*eslint-enable */
    const rootStyle = this.props.visible ? {} : {display: 'none'};
    const { getFieldProps, getFieldError } = this.props.form;
    const { defaultData } = this.props;
    const { isSystem } = defaultData;
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
          <Form horizontal>
            <FormItem
              label="品牌名称："
              validateStatus={classnames({error: !!getFieldError('brandId')})}
              labelCol={{span: 4}}
              wrapperCol={{span: 7}}>
              <BrandSelect
                brandName={defaultData.brandName}
                {...getFieldProps('brandId', {
                  validateFirst: true,
                  rules: [{
                    message: '此处必填',
                    required: true,
                  }],
                })}
                disabled={isSystem === 'true'}
                placeholder="品牌简称，如：金钱豹"
              />
            </FormItem>
            {window.APP.userType !== 'BUC' && isSystem !== 'true' ? this.fieldWarningAlert : null}
            <FormItem
              label="门店名称："
              required
              labelCol={{span: 4}}
              help
            >
              <Row>
                <Col span="7" style={{marginRight: 10}}>
                  <FormItem
                    validateStatus={classnames({error: !!getFieldError('name')})}
                    help={getFieldError('name') || true}>
                    <Input
                      placeholder="例：海底捞"
                      {...getFieldProps('name', {
                        validateFirst: true,
                        rules: [{
                          required: true,
                          message: '此处必填',
                        },
                        noBracket, this.checkShopInfo],
                      })}
                      disabled={isSystem === 'true'}
                    />
                  </FormItem>
                </Col>
                <Col span="7">
                  <FormItem
                    validateStatus={classnames({error: !!getFieldError('branchName')})}
                    help={getFieldError('branchName') || true}>
                    <Input placeholder="选填，例：延安店"
                      {...getFieldProps('branchName', {
                        rules: [{
                          max: 20,
                          message: '限20个字符',
                        }, noBracket, this.checkSubShopInfo],
                      })}
                      disabled={isSystem === 'true'}
                    />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col offset="4">
                  <p style={{lineHeight: '16px'}}>如当前商户有分店，请把店铺所在街道/商圈/美食城/大学城填为分店名，如：<span style={{color: '#F90'}}>文一路店</span></p>
                  <p style={{lineHeight: '16px'}}>结合门店名称则在用户端显示为：<span style={{color: '#F90'}}>肯德基(文一路店)</span></p>
                  <p style={{color: '#F90'}}>每个名称限20个字，请严格按照以上格式填写门店名称，避免错填格式与其他门店重复，导致开店失败</p>
                </Col>
              </Row>
            </FormItem>
            {window.APP.userType !== 'BUC' && isSystem !== 'true' ? this.fieldWarningAlert : null}

            <AreaCategoryRows form={this.props.form} shopType="COMMON" areaDisabled={isSystem === 'true'} />
            {window.APP.userType !== 'BUC' ? this.fieldWarningAlert : null}

            <FormItem
              label="门店电话："
              labelCol={{span: 4}}
              style={{marginTop: '24px'}}
              required
            >
              <Row>
                <Col span="3" style={{marginRight: 10}}>
                  <FormItem
                    validateStatus={classnames({error: !!getFieldError('contactsPhone1')})}
                    help={getFieldError('contactsPhone1') || true}>
                    <Input placeholder="例:020-33333333"
                      {...getFieldProps('contactsPhone1', {
                        validateFirst: true,
                        rules: [{
                          message: '此处必填',
                          required: true,
                        }, telephone, this.checkPhone],
                      })}/>
                  </FormItem>
                </Col>
                <Col span="3" style={{marginRight: 10}}>
                  <FormItem
                    validateStatus={classnames({error: !!getFieldError('contactsPhone2')})}
                    help={getFieldError('contactsPhone2') || true}>
                    <Input placeholder="例:13411993535"
                      {...getFieldProps('contactsPhone2', {
                        validateFirst: true,
                        rules: [telephone, this.checkPhone],
                      })}/>
                  </FormItem>
                </Col>
                <Col span="3" style={{marginRight: 10}}>
                  <FormItem
                    validateStatus={classnames({error: !!getFieldError('contactsPhone3')})}
                    help={getFieldError('contactsPhone3') || true}>
                    <Input placeholder="第三个电话"
                      {...getFieldProps('contactsPhone3', {
                        validateFirst: true,
                        rules: [telephone, this.checkPhone],
                      })}/>
                  </FormItem>
                </Col>
                <Col span="3" style={{marginRight: 10}}>
                  <FormItem
                    validateStatus={classnames({error: !!getFieldError('contactsPhone4')})}
                    help={getFieldError('contactsPhone4') || true}>
                    <Input placeholder="第四个电话"
                      {...getFieldProps('contactsPhone4', {
                        validateFirst: true,
                        rules: [telephone, this.checkPhone],
                      })}/>
                  </FormItem>
                </Col>
                <Col span="3" style={{marginRight: 10}}>
                  <FormItem
                    validateStatus={classnames({error: !!getFieldError('contactsPhone5')})}
                    help={getFieldError('contactsPhone5') || true}>
                    <Input placeholder="第五个电话"
                      {...getFieldProps('contactsPhone5', {
                        validateFirst: true,
                        rules: [telephone, this.checkPhone],
                      })}/>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col offset="4">
                  <p style={{lineHeight: '16px'}}>门店座机或手机号码,支持纯数字、"-"，限制20个字符</p>
                </Col>
              </Row>
            </FormItem>

            <PayType form={this.props.form} defaultData={defaultData} />

            <FormItem
              label="品牌logo："
              validateStatus={
              classnames({
                error: !!getFieldError('logoId'),
              })}
              required
              help={getFieldError('logoId') || '仅支持上传一张。不超过10M。格式：bmp，png，jpeg，gif。建议尺寸在500px＊500px以上（更容易通过审核）'}
              labelCol={{span: 4}}
              wrapperCol={{span: 18}}
              >
              <Upload
                exampleList={[
                  {name: '客户端示例', url: 'https://t.alipayobjects.com/images/rmsweb/T1hbtgXhdbXXXXXXXX.jpg'},
                ]}
                {...getFieldProps('logoId', {
                  valuePropName: 'fileList',
                  normalize: normalizeUploadValueOne,
                  rules: [{
                    required: true,
                    message: '仅支持上传一张',
                    max: 1,
                    type: 'array',
                  }],
                })}/>
            </FormItem>
            <FormItem
              label="门店首图："
              validateStatus={
              classnames({
                error: !!getFieldError('cover'),
              })}
              required
              help={getFieldError('cover') || '仅支持上传一张，不超过10M。格式：bmp，png，jpeg，gif。建议尺寸在2000px＊1500px以上（更容易通过审核） 可首选优质菜品图作为首图，首图会在手机支付宝中重点展示'}
              labelCol={{span: 4}}
              wrapperCol={{span: 14}}
            >
              <Upload
              exampleList={[
                  {name: '客户端示例', url: 'https://zos.alipayobjects.com/rmsportal/VZyAFILMgzFYYrV.jpg'},
              ]}
              {...getFieldProps('cover', {
                valuePropName: 'fileList',
                normalize: normalizeUploadValueOne,
                rules: [{
                  required: true,
                  message: '仅支持上传一张',
                  max: 1,
                  type: 'array',
                }],
              })}/>
            </FormItem>
            <FormItem
              label="门头照与内景照："
              validateStatus={
                classnames({
                  error: !!getFieldError('picture'),
                })}
              required
              help={getFieldError('picture') || pictureDetailCopy}
              labelCol={{span: 4}}
              wrapperCol={{span: 14}}>
              <Upload
                exampleList={[
                  {name: '门头照示例', url: 'https://t.alipayobjects.com/images/rmsweb/T1QCFfXXRcXXXXXXXX.jpg'},
                  {name: '内景照示例', url: 'https://t.alipayobjects.com/images/rmsweb/T1ZRRfXf4qXXXXXXXX.jpg'},
                ]}
                {...getFieldProps('picture', {
                  valuePropName: 'fileList',
                  normalize: normalizeUploadValue,
                  rules: [{
                    required: true,
                    type: 'array',
                    message: '此处必填',
                  }, {
                    min: 3,
                    max: 10,
                    type: 'array',
                    message: '最少3张',
                  }],
                })}/>
            </FormItem>

            <FormItem style={{marginTop: 20}}
              label="主要联系人："
              labelCol={{span: 4}}
              wrapperCol={{span: 18}}>
              <Input placeholder="请输入"
                {...getFieldProps('contactsName', {
                  validateTrigger: 'onBlur',
                  rules: [{
                    message: '联系人姓名不可为空',
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
              <RadioGroup {...getFieldProps('contactsJob', {
                rules: [{
                  message: '联系人角色不可为空',
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
              <Input {...getFieldProps('contactsKPTel', {
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

            <FormItem
              label="机具编号："
              validateStatus={
                classnames({
                  error: !!getFieldError('posId'),
                })}
              labelCol={{span: 4}}
              wrapperCol={{span: 12}}
            >
              <Input placeholder="请选择（非必填项）" {...getFieldProps('posId')} />
            </FormItem>

            <FormItem
              label="门店编号："
              validateStatus={
                classnames({
                  error: !!getFieldError('outShopId'),
                })}
              labelCol={{span: 4}}
              wrapperCol={{span: 12}}
              extra={<div style={{lineHeight: 2, marginTop: '5px'}}>请输入商家自定义的门店编号，支持中文，例如：hangzhou001xiangshen002</div>}
            >
              <Input placeholder="请输入" {...getFieldProps('outShopId')} />
            </FormItem>

            <ShopTime form={this.props.form} defaultData={defaultData} />
            <FormItem
              label="人均价格："
              validateStatus={
                classnames({
                  error: !!getFieldError('perPay'),
                })}
              help={getFieldError('perPay') || '限正整数，不支持小数点'}
              labelCol={{span: 4}}
              wrapperCol={{span: 4}}>
              <InputNumber
                min={1}
                {...getFieldProps('perPay', {
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
            <Button type="primary" size="large" style={{marginRight: 12}} onClick={this.onOk}>下一步</Button>
          </div>
        </div>
      </div>
    );
  },
});

export default Form.create()(BasicInfo);
