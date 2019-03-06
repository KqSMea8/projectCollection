import React, {PropTypes} from 'react';
import {Form, Input, Button, Spin, Col, Row, Modal, message, Radio} from 'antd';
const FormItem = Form.Item;
import { Lifecycle, History } from 'react-router';
import classnames from 'classnames';
import ConfirmOut from './ConfirmOut';
import DuplicateLeadsModel from './DuplicateLeadsModel';
import AreaCategoryRows from '../../../common/AreaCategory/AreaCategoryRows';
import {commonCheck, checkAddressCollect, telephone} from '../../../common/validatorUtils';
import BrandSelect from '../../../common/BrandSelect';
import {Upload, normalizeUploadValue, normalizeUploadValueOne} from '../../../common/Upload';
import ajax from 'Utility/ajax';
import permission from '@alipay/kb-framework/framework/permission';
import ErrorPage from '../../../common/ErrorPage';
import {remoteLog} from '../../../common/utils';
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

const LeadDetailForm = React.createClass({
  propTypes: {
    form: PropTypes.object,
    params: PropTypes.object,
  },
  mixins: [Lifecycle, History],
  getInitialState() {
    return {
      loading: ('leadsId' in this.props.params || 'orderId' in this.props.params ),
      initialValue: {},
      showOutModel: false,
      visible: false,
      duplicateLeads: {},
    };
  },
  componentWillMount() {
    this.fieldWarningAlert = null;
  },
  componentDidMount() {
    const {leadsId, orderId} = this.props.params;
    if (leadsId || orderId) {
      ajax({
        url: leadsId ? '/sale/leads/queryDetail.json' : '/sale/leads/queryOrderDetail.json',
        data: {
          leadsId,
          orderId,
          type: 'edit',
        },
        success: (data) => {
          if (!data.data) {
            return;
          }
          const {cover, provinceId, cityId, districtId,
            categoryIds, longitude, latitude, pictures} = data.data;
          const initialValue = {...data.data};
          initialValue.cover = [
            {
              ...cover,
              uid: -1,
              status: 'done',
            },
          ];
          initialValue.map = {
            lng: longitude,
            lat: latitude,
          };
          initialValue.picture = (pictures || []).map((p, index)=> {
            p.uid = -index;
            p.status = 'done';
            return p;
          });
          initialValue.area = [provinceId, cityId, districtId].filter(c=>!!c);
          initialValue.categoryId = categoryIds || [];

          // 门店电话
          if (initialValue.contactsPhone) {
            initialValue.contactsPhone.split(',').forEach((value, i) => {
              initialValue['contactsPhone' + (i + 1)] = value;
            });
          }
          this.props.form.setFieldsInitialValue(initialValue);
          this.setState({
            loading: false,
            initialValue,
          });
        },
        error: (e) => {
          if (e.resultMsg) {
            message.warn(e.resultMsg);
          }
          this.history.goBack();
          setTimeout(() => {
            window.location.reload();
          });
        },
      });
    }
  },

  onSearch(params) {
    this.setState({
      params,
    });
  },
  // leads判重错误描述
  getStoreDescribe(params) {
    let textMsg = '';
    if (params) {
      textMsg = '您创建的信息与';
      (params.data || []).map((p, index) => {
        if (index < 3) {
          if (p.entityType === 'PUBLIC_LEADS') {
            textMsg += p.shopName + ',' + p.address + '(可认领)、';
          } else if (index === 2) {
            textMsg += p.shopName + ',' + p.address;
          } else {
            textMsg += p.shopName + ',' + p.address + '、';
          }
        }
      });
      textMsg += '重复';
    }
    return textMsg;
  },
  // leads判重
  checkDuplicateLeads(params) {
    let entityId = '';
    let title = '';
    const data = {};
    const textMsg = this.getStoreDescribe(params);
    (params.data || []).map((p) => {
      if (p.entityType === 'PUBLIC_LEADS') {
        entityId = p.entityId;
      }
    });
    if (entityId) {
      title = '公海leads中已存在相同leads';
    } else {
      title = '已存在相同leads/门店';
    }
    data.title = title;
    data.feedbackId = params.feedbackId;
    data.textMsg = textMsg;
    data.entityId = entityId;
    this.setState({
      visible: true,
      duplicateLeads: data,
    });
  },
  handleCancel() {
    this.setState({
      visible: false,
    });
  },
  // 我要申诉
  handleOnAppeal(id) {
    ajax({
      url: '/sale/leads/appeal.json',
      method: 'post',
      data: {feedbackId: id},
      type: 'json',
      success: () => {
        const href = window.APP.antprocessUrl + '/middleground/koubei.htm#/submitted-task';
        const html = (<span>已提交申诉，请到待审批流程中<a href={href} target="_blank" style={{marginLeft: 5, fontWeight: 100}}>查看工单</a></span>);
        Modal.success({
          title: html,
          content: '大约2个工作日完成处理。',
        });
        this.handleCancel();
      },
    });
  },
  // 领取按钮
  handleOnClaim(id) {
    this.forceGoto = true;
    ajax({
      url: '/sale/leads/claim.json',
      method: 'post',
      data: {
        leadsId: id,
      },
      success: (res) => {
        Modal.confirm({
          title: '认领成功',
          content: '',
          okText: '查看leads详情',
          iconClassName: 'check-circle',
          cancelText: '关闭窗口',
          onOk() {
            window.location.hash = '/leads/detail/' + res.data.leadsId + '/detail';
            window.location.reload();
          },
          onCancel() {
            setTimeout(()=> {
              window.location.reload();
            }, 2000);
          },
        });
        this.handleCancel();
      },
    });
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

  hideOutModel() {
    this.setState({showOutModel: false});
  },

  goToNxet() {
    this.forceGoto = true;
    window.location.reload();
    // window.location.hash = this.nextPath;
  },

  routerWillLeave(nextLocation) {
    this.nextPath = nextLocation.pathname;
    this.setState({showOutModel: !this.forceGoto});
    return !!this.forceGoto;
  },

  transformFormData(values) {
    const formData = {...values};
    formData.cover = formData.cover.map(p => p.id).join(',');
    formData.picture = formData.picture.map(p => p.id).join(',');
    formData.longitude = formData.map && formData.map.lng;
    formData.latitude = formData.map && formData.map.lat;
    formData.provinceId = formData.area[0];
    formData.cityId = formData.area[1];
    formData.districtId = formData.area[2];
    formData.categoryId = formData.categoryId[formData.categoryId.length - 1];
    const contactsPhoneList = [];
    for (let i = 1; i <= 5; i++) {
      if (formData['contactsPhone' + i]) {
        contactsPhoneList.push(formData['contactsPhone' + i]);
      }
      delete formData['contactsPhone' + i];
    }
    formData.contactsPhone = contactsPhoneList.join(',');
    return formData;
  },

  create(e) {
    e.preventDefault();
    const self = this;
    remoteLog('LEADS_NEW_SUBMIT');
    this.props.form.submit((callback) => {
      this.props.form.validateFields((error, values)=> {
        if (!error) {
          this.checkAll(() => {
            const formData = this.transformFormData(values);
            if (this.props.params.orderId) {
              formData.refOrderId = this.props.params.orderId;
            }
            if (error || this.forceGoto) {
              return;
            }
            this.forceGoto = true;

            ajax({
              url: '/sale/leads/create.json',
              data: formData,
              method: 'post',
              success: (d) => {
                if (d.status !== 'failed') {
                  if (d.data.hasAudit) {
                    Modal.success({
                      title: '提交成功',
                      content: '信息需通过审批后才生效，请耐心等待',
                      onOk() {
                        if (d.data.result) {
                          window.location.hash = '/leads/detail/' + d.data.result;
                        } else {
                          window.location.hash = '/private-leads/waited';
                        }
                      },
                    });
                  } else {
                    window.location.hash = '/private-leads/valid';
                  }
                } else {
                  self.forceGoto = false;
                  if (d.resultMsg) {
                    message.warn(d.resultMsg);
                  }
                }
                callback();
              },
              error(d) {
                self.forceGoto = false;
                if (d.resultCode === 'LEADS_JUDGE_FAIL') {
                  self.checkDuplicateLeads(d);
                } else {
                  self.forceGoto = false;
                  if (d.resultMsg) {
                    message.warn(d.resultMsg);
                  }
                }
                callback();
              },
            });
          });
        }
      });
    });
  },

  edit(e) {
    e.preventDefault();
    const {leadsId} = this.props.params;
    const self = this;
    this.props.form.submit((callback) => {
      this.props.form.validateFields((error, values)=> {
        const formData = this.transformFormData(values);
        formData.leadsId = leadsId;
        if (error || this.forceGoto) {
          return;
        }
        this.forceGoto = true;
        ajax({
          url: '/sale/leads/modify.json',
          data: formData,
          method: 'post',
          success: (d) => {
            if (d.status !== 'failed') {
              if (d.data.hasAudit) {
                Modal.success({
                  title: '提交成功',
                  content: '信息需通过审批后才生效，请耐心等待',
                  onOk() {
                    if (leadsId) {
                      window.location.hash = '/leads/detail/' + leadsId + '/detail';
                    } else {
                      window.location.hash = '/private-leads/waited';
                    }
                  },
                });
              } else {
                window.location.hash = '/private-leads/valid';
              }
            } else {
              self.forceGoto = false;
              if (d.resultMsg) {
                message.warn(d.resultMsg);
              }
            }
            callback();
          },
          error(d) {
            self.forceGoto = false;
            if (d.resultCode === 'LEADS_JUDGE_FAIL') {
              self.checkDuplicateLeads(d);
            } else {
              self.forceGoto = false;
              if (d.resultMsg) {
                message.warn(d.resultMsg);
              }
            }
            callback();
          },
        });
      });
    });
  },
  cancel(e) {
    e.preventDefault();
    window.location.hash = '/private-leads';
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
    commonCheck('phone', {phones: value}, callback);
  },
  /*eslint-disable */
  render() {
      /*eslint-disable */
    const { leadsId, orderId } = this.props.params;

    const { isSystem } = this.state.initialValue;

    const { duplicateLeads } = this.state;

    if (((leadsId || orderId) && !permission('LEADS_MODIFY')) || !permission('LEADS_CREATE')) {
      return <ErrorPage type="permission"/>;
    }

    if (this.state.loading) {
      return <Spin size="large"/>;
    }
    const { getFieldProps, getFieldError } = this.props.form;
    return (<div>
      <div className="app-detail-header">
        {leadsId ? '修改' : '新增'} leads
      </div>
      <div className="app-detail-content-padding">
        <Form horizontal>
          <FormItem
            required
            label="门店名称："
            validateStatus={classnames({error: getFieldError('name')})}
            help={getFieldError('name')}
            {...formItemLayout}>
            <Row>
              <Col span="6" style={{marginRight: 10}}>
                <Input placeholder="例：海底捞"
                  {...getFieldProps('name', {
                    validateTrigger: 'onBlur',
                    validateFirst: true,
                    rules: [{
                      required: true,
                      message: '此处必填',
                    }, this.checkShopInfo],
                  })}
                  disabled={!!leadsId && isSystem === 'true'}
                />
              </Col>
              <Col span="6">
                <Input placeholder="选填，例：延安店"
                  {...getFieldProps('branchName', {
                    rules: [this.checkSubShopInfo],
                  })}
                  disabled={!!leadsId && isSystem === 'true'}
                />
              </Col>
            </Row>
          </FormItem>
          {!!leadsId && window.APP.userType !== 'BUC' && isSystem !== 'true' ? this.fieldWarningAlert : null}
          <AreaCategoryRows form={this.props.form} shopType="COMMON" disabled={!!leadsId && isSystem === 'true'}/>
          {!!leadsId && window.APP.userType !== 'BUC' && isSystem !== 'true' ? this.fieldWarningAlert : null}

          <FormItem
            label="门店电话："
            required
            {...formItemLayout}
            style={{marginTop: '24px'}}
          >
            <Col span="3" style={{marginRight: 10}}>
              <FormItem
                validateStatus={classnames({error: !!getFieldError('contactsPhone1')})}
                help={getFieldError('contactsPhone1') || true}>
                <Input placeholder="例:020-33333333"
                  {...getFieldProps('contactsPhone1', {
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
                validateStatus={classnames({error: !!getFieldError('contactsPhone2')})}
                help={getFieldError('contactsPhone2') || true}>
                <Input placeholder="例:13411993535"
                  {...getFieldProps('contactsPhone2', {
                    validateTrigger: 'onBlur',
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
                    validateTrigger: 'onBlur',
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
                    validateTrigger: 'onBlur',
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
                    validateTrigger: 'onBlur',
                    validateFirst: true,
                    rules: [telephone, this.checkPhone],
                  })}/>
              </FormItem>
            </Col>
          </FormItem>

          <FormItem
            label="公司名称："
            {...formItemLayout}
          >
            <Input placeholder="输入营业执照上的公司名称"
              {...getFieldProps('companyName', {
                rules: [{
                  message: '此处必填',
                  required: true,
                }, {
                  max: 30,
                  message: '限30个字符',
                }],
              })}/>
          </FormItem>

          <FormItem
            label="品牌名称："
            {...formItemLayout}
            style={{marginTop: '24px'}}
          >
            <BrandSelect
              placeholder="请输入品牌"
              {...getFieldProps('brandId', {
                rules: [{
                  message: '此处必填',
                  required: true,
                }],
              })}
              disabled={!!leadsId && isSystem === 'true'}
              brandName={this.state.initialValue.brandName}
            />
          </FormItem>
          {!!leadsId && window.APP.userType !== 'BUC' && isSystem !== 'true' ? this.fieldWarningAlert : null}

          <FormItem
            label="门店首图："
            extra={<div style={{lineHeight: 1.5}}>仅支持上传一张,不超过10M。格式：bmp，png，jpeg，gif。建议尺寸在2000px＊1500px以上（更容易通过审核） 可首选优质菜品图作为首图，首图会在手机支付宝中重点展示</div>}
            {...formItemLayout}
            help={getFieldError('cover')}
            validateStatus={
            classnames({
              error: !!getFieldError('cover'),
            })}
            required>
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
            required
            label="门头照与内景照："
            {...formItemLayout}
            extra={<div style={{lineHeight: 1.5}}>须上传3张以上,不超过10M。格式：bmp，png，jpeg，gif。建议尺寸在2000px＊1500px以上（更容易通过审核） 上传照片中需要包含一张门头照片，如无门头照片将会审核失败
          </div>}
            help={getFieldError('picture')}
            validateStatus={
            classnames({
              error: !!getFieldError('picture'),
            })}
          >
            <Upload
            exampleList={[
              {name: '门头照示例', url: 'https://t.alipayobjects.com/images/rmsweb/T1QCFfXXRcXXXXXXXX.jpg'},
              {name: '内景照示例', url: 'https://t.alipayobjects.com/images/rmsweb/T1ZRRfXf4qXXXXXXXX.jpg'},
            ]}
            {...getFieldProps('picture', {
              valuePropName: 'fileList',
              normalize: normalizeUploadValue,
              rules: [{
                min: 3,
                required: true,
                message: '须上传3~10张',
                type: 'array',
              }, {
                max: 10,
                message: '不超过10张',
                type: 'array',
              }],
            })} />
          </FormItem>

          <FormItem
            label="主要联系人："
            {...formItemLayout}
          >
            <Input placeholder="请输入"
              {...getFieldProps('contactsName', {
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
            {...formItemLayout}
          >
            <RadioGroup {...getFieldProps('contactsJob', {
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
            {...formItemLayout}
            extra={<div style={{lineHeight: 1.5}}>请输入11位手机号码或座机号，座机号需填写区号-电话，如：<span style={{color: '#F90'}}>010-12345678</span>
          </div>}
          >
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


          <FormItem
            label="其他联系方式："
            {...formItemLayout}
          >
            <Input type="textarea"
                   rows="5"
              {...getFieldProps('otherContacts', {
                rules: [{
                  max: 100,
                  message: '限100个字符',
                }],
              })}
                   placeholder="例如钉钉，旺旺等可以联系商家的有效联系方式"/>
          </FormItem>

          <FormItem
            label="备注："
            {...formItemLayout}
          >
            <Input type="textarea"
              {...getFieldProps('memo', {
                rules: [{
                  max: 200,
                  message: '限200个字符',
                }],
              })}
              rows="5"/>
          </FormItem>
        </Form>
      </div>
      <div style={{padding: '20px 0 40px 237px', borderTop: '1px solid #d9d9d9'}}>
        {
          this.props.params.leadsId || this.props.params.orderId ?
            <Button type="primary" size="large" onClick={this.props.params.orderId ? this.create : this.edit}>修改</Button> :
            <Button type="primary" size="large" onClick={this.create}>创建</Button>
        }
        &nbsp;&nbsp;
        <Button size="large" onClick={this.cancel}>取消</Button>
      </div>
      {this.state.showOutModel ? <ConfirmOut onCancel={this.hideOutModel} onOk={this.goToNxet}/> : null}
      {this.state.visible ? <DuplicateLeadsModel params={duplicateLeads} visible={this.state.visible} onCancel={this.handleCancel} onAppeal={this.handleOnAppeal.bind(this, duplicateLeads.feedbackId)} onClaim={this.handleOnClaim.bind(this, duplicateLeads.entityId)}/> : null}
    </div>);
  },
});

export default Form.create()(LeadDetailForm);
