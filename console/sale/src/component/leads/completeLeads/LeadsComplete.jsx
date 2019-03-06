import React, {PropTypes} from 'react';
import {Form, Spin, Modal, message, Steps} from 'antd';
const Step = Steps.Step;
import { Lifecycle, History } from 'react-router';
import ConfirmOut from '../common/ConfirmOut';
import DuplicateLeadsModel from '../common/DuplicateLeadsModel';
import ajax from 'Utility/ajax';
import {format, padding, toDate} from '../../../common/dateUtils';
import permission from '@alipay/kb-framework/framework/permission';
import ErrorPage from '../../../common/ErrorPage';

import BasicInfo from './BasicInfo';
import CertifyInfo from './CertifyInfo';

const serviceFields = [
  'park',
  'wifi',
  'box',
  'noSmoke',
];

export function formatTime(d) {
  return d && typeof d !== 'string' ? (padding(d.getHours()) + ':' + padding(d.getMinutes())) : d;
}

const LeadsComplete = React.createClass({
  propTypes: {
    form: PropTypes.object,
    params: PropTypes.object,
  },
  mixins: [Lifecycle, History],
  getInitialState() {
    return {
      currentStep: 1,
      data: {}, // 表单数据
      defaultData: {}, // 表单默认数据
      loading: true,
      canSubmit: true,
      showOutModel: false,
      duplicateLeads: {},
      visible: false,
    };
  },
  componentDidMount() {
    const { leadsId } = this.props.params;
    if (leadsId) {
      ajax({
        url: '/sale/leads/queryDetail.json',
        data: {
          leadsId,
          type: 'edit',
        },
        success: (data) => {
          if (!data.data) {
            return;
          }
          let defaultData = {...data.data};

          defaultData = this.transformDefaultData(defaultData);

          this.setState({
            loading: false,
            defaultData,
          });
        },
        error: (e) => {
          if (e.resultMsg) {
            message.warn(e.resultMsg);
          }
          /* setTimeout(() => {
            this.closeWindow();
          }, 4000); */
        },
      });
    }
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
  prevStep() {
    this.setState({
      currentStep: --this.state.currentStep,
    });
  },

  nextStep(error, values) {
    const skip = (location.protocol === 'http:' && /skip/.test(location.search));
    if (!skip && error) {
      return;
    }
    let formData = Object.assign(this.state.data, values);
    if (this.state.currentStep >= 2) {
      formData = this.transformFormData(formData);
      this.save(formData);
      return;
    }

    this.setState({
      data: formData,
      currentStep: ++this.state.currentStep,
    });
  },

  closeWindow() {
    window.close();
  },

  hideOutModel() {
    this.setState({showOutModel: false});
  },

  goToNxet() {
    this.forceGoto = true;
    window.location.hash = this.nextPath;
  },
/*eslint-disable */
  transformDefaultData(data) {
    /*eslint-enable */
    const {cover, pictures, provinceId, cityId, districtId, categoryIds, longitude, latitude} = data;
    const defaultData = {...data};

    const completedInfo = defaultData.isCompleted === 'true' ? defaultData.completedInfo : {};
    //  addressDesc
    // contactsPhone1 .. 5

    // 品牌名称 brandID
    // 门店名称 name, branchName,

    // 门店地址, 省市区,经纬度,详细地址,地址说明
    defaultData.area = [provinceId, cityId, districtId].filter(c => !!c);
    if (longitude) {
      defaultData.map = {
        lng: longitude,
        lat: latitude,
      };
    }

    // 经营品类
    defaultData.categoryId = categoryIds || [];

    // 门店电话
    if (defaultData.contactsPhone) {
      defaultData.contactsPhone.split(',').forEach((value, i) => {
        defaultData['contactsPhone' + (i + 1)] = value;
      });
      delete defaultData.contactsPhone;
    }

    // 默认收款方式
    defaultData.payType = completedInfo.payType || 'online_pay';

    // 品牌logo
    defaultData.logoId = completedInfo.logo && [{
      ...completedInfo.logo,
      uid: -1,
      status: 'done',
    }] || [];

    // 门店首图
    defaultData.cover = [
      {
        ...cover,
        uid: -1,
        status: 'done',
      },
    ];
    // 门店内景
    defaultData.picture = (pictures || []).map((p, index)=> {
      p.uid = -index;
      p.status = 'done';
      return p;
    });

    // 机具编号
    defaultData.posId = completedInfo.posId || '';

    // 门店编号
    defaultData.outShopId = completedInfo.outShopId || '';

    // 营业时段
    defaultData.businessTime = completedInfo.businessTime || '';
    if (defaultData.businessTime) {
      defaultData.timeKeys = defaultData.businessTime.split(',').map((row, key) => {
        const [shopTimeStart, shopTimeEnd] = row.split('-');
        defaultData['shopTimeStart' + key] = shopTimeStart;
        defaultData['shopTimeEnd' + key] = shopTimeEnd;
        if (!defaultData.shopTimeRadio && row === '00:00-23:59') {
          defaultData.shopTimeRadio = true;
        }
        return key;
      });
    }

    defaultData.perPay = completedInfo.perPay ? parseInt(completedInfo.perPay, 10) : undefined;
    if (!completedInfo.perPay || completedInfo.perPay <= 0) {
      delete completedInfo.perPay;
    }

    // 提供服务
    serviceFields.forEach((key) => {
      defaultData[key] = (completedInfo.services && completedInfo.services[key] === 'true');
    });

    // 更多服务
    defaultData.otherService = completedInfo.otherService || '';


    // 营业执照
    defaultData.licensePictureId = completedInfo.licensePicture && [{
      ...completedInfo.licensePicture,
      uid: 0,
      status: 'done',
    }] || [];
    // 营业执照有效期
    defaultData.licenseValidTime = completedInfo.businessLicenseValidTime || '';

    // 营业执照编号
    defaultData.licenseSeq = completedInfo.licenseSeq || '';

    // 营业执照名称
    defaultData.licenseName = completedInfo.licenseName || '';

    if (defaultData.licenseValidTime === '长期') {
      defaultData.licenseValidTimeType = '2';
      delete defaultData.licenseValidTime;
    } else {
      defaultData.licenseValidTimeType = '1';
      defaultData.licenseValidTime = toDate(defaultData.licenseValidTime);
    }

    // 行业许可照
    defaultData.certificatePictureId = completedInfo.certificatePicture && [{
      ...completedInfo.certificatePicture,
      uid: 0,
      status: 'done',
    }] || [];

    // 行业许可照有效期
    defaultData.certificateValidTime = completedInfo.businessCertificateValidTime || '';

    if (defaultData.certificateValidTime === '长期') {
      defaultData.certificateValidTimeType = '2';
      delete defaultData.certificateValidTime;
    } else {
      defaultData.certificateValidTimeType = '1';
      defaultData.certificateValidTime = toDate(defaultData.certificateValidTime);
    }

    // 授权函
    defaultData.authorizationPictureId = completedInfo.authorizationLetterPicture && [{
      ...completedInfo.authorizationLetterPicture,
      uid: 0,
      status: 'done',
    }] || [];

    // 其他证明
    defaultData.otherAuthorizationId = (completedInfo.otherAuthResources || []).map((p, index)=> {
      p.uid = -index;
      p.status = 'done';
      return p;
    });

    // 开通服务窗
    defaultData.bindingPublic = completedInfo.bindingPublic === 'true' || false;

    delete defaultData.completedInfo;

    return defaultData;
  },

  transformFormData(values) {
    const formData = {...values};
    formData.cover = formData.cover.map(p => p.id).join(',');
    formData.picture = formData.picture.map(p => p.id).join(',');
    formData.longitude = formData.map && formData.map.lng;
    formData.latitude = formData.map && formData.map.lat;
    formData.provinceId = formData.area ? formData.area[0] : '';
    formData.cityId = formData.area ? formData.area[1] : '';
    formData.districtId = formData.area ? formData.area[2] : '';
    formData.categoryId = formData.categoryId ? formData.categoryId[formData.categoryId.length - 1] : '';
    delete formData.map;
    delete formData.area;
    delete formData.categoryIds;
    if (formData.licenseValidTimeType === '2') {
      formData.licenseValidTime = '长期';
      delete formData.licenseValidTimeType;
    } else {
      formData.licenseValidTime = format(formData.licenseValidTime);
    }
    if (!formData.licensePictureId) {
      formData.licenseValidTime = '';
    }

    if (formData.certificateValidTimeType === '2') {
      formData.certificateValidTime = '长期';
      delete formData.certificateValidTimeType;
    } else {
      formData.certificateValidTime = format(formData.certificateValidTime);
    }
    if (!formData.certificatePictureId) {
      formData.certificateValidTime = '';
    }

    formData.logoId = formData.logoId.map(p => p.id).join(',');
    formData.licensePictureId = formData.licensePictureId.map(p => p.id).join(',');
    formData.certificatePictureId = formData.certificatePictureId.map(p => p.id).join(',');
    formData.authorizationPictureId = formData.authorizationPictureId.map(p => p.id).join(',');
    formData.otherAuthorizationId = formData.otherAuthorizationId.map(p => p.id).join(',');

    serviceFields.concat('bindingPublic').forEach((key) => {
      formData[key] = !!formData[key];
    });
    if (formData.shopTimeRadio) {
      formData.businessTime = '00:00-23:59';
    } else {
      formData.businessTime = formData.timeKeys.map((key) => {
        const businessTime = formatTime(formData['shopTimeStart' + key]) + '-' + formatTime(formData['shopTimeEnd' + key]);
        delete formData['shopTimeStart' + key];
        delete formData['shopTimeEnd' + key];
        return businessTime;
      }).join(',');
    }
    const mobileNoList = [];
    for (let i = 1; i <= 5; i++) {
      if (formData['contactsPhone' + i]) {
        mobileNoList.push(formData['contactsPhone' + i]);
      }
      delete formData['contactsPhone' + i];
    }
    formData.contactsPhone = mobileNoList.join(',');
    return formData;
  },

  save(formData) {
    const leadsId = this.state.defaultData.leadsId;
    if (leadsId) {
      formData.leadsId = leadsId;
    }
    this.complete(formData);
  },

  complete(formData) {
    this.setState({
      canSubmit: false,
    });
    ajax({
      url: '/sale/leads/complete.json',
      method: 'post',
      data: {
        _input_charset: 'utf-8',
        ...formData,
      },
      success: (result) => {
        this.setState({
          canSubmit: true,
        });
        Modal.success({
          title: '提交成功',
          content: (result.data.hasAudit ? '修改的信息需通过审批后才生效，请耐心等待' : '请移步到私海leads里查看'),
          okText: '知道了，关闭窗口',
          onOk: this.closeWindow,
        });
      },
      error: (result) => {
        this.setState({
          canSubmit: true,
        });
        if (result.resultCode === 'LEADS_JUDGE_FAIL') {
          this.checkDuplicateLeads(result);
        } else {
          Modal.error({
            title: '修改失败',
            content: result.resultMsg || '网络异常,请稍后再试',
            okText: '知道了',
          });
        }
      },
    });
  },
  cancel(e) {
    e.preventDefault();
    window.location.hash = '/private-leads/valid';
  },
  routerWillLeave(nextLocation) {
    this.nextPath = nextLocation.pathname;
    this.setState({showOutModel: !this.forceGoto});
    return !!this.forceGoto;
  },
  render() {
    const { leadsId } = this.props.params;
    const { currentStep, defaultData, data, loading, canSubmit } = this.state;
    const { duplicateLeads } = this.state;
    if (((leadsId) && !permission('LEADS_MODIFY')) || !permission('LEADS_CREATE')) {
      return <ErrorPage type="permission"/>;
    }

    let statusList = [];
    switch (currentStep) {
    case 1:
      statusList = ['process', 'wait'];
      break;
    case 2:
      statusList = ['finish', 'process'];
      break;
    default:
      break;
    }

    const commonProps = {
      data,
      defaultData,
      onOk: this.nextStep,
    };

    return (<div>
      <div className="app-detail-header">补全门店营业信息</div>
      <div className="kb-detail-main">
        {
          loading && <div style={{textAlign: 'center', marginTop: 80}}><Spin /></div>
        }
        {
          !loading && (<div>
          <div style={{padding: '24px 120px 0 120px'}}>
            <Steps current={currentStep}>
              <Step title="填写门店" status={statusList[0]}/>
              <Step title="提供认证信息" status={statusList[1]}/>
            </Steps>
          </div>

          <BasicInfo
            {...commonProps}
            onCancel={this.prevStep}
            visible={currentStep === 1}
          />
          <CertifyInfo
            {...commonProps}
            onCancel={this.prevStep}
            canSubmit={canSubmit}
            visible={currentStep === 2}
          />
          </div>)
        }
      </div>
      {this.state.showOutModel ? <ConfirmOut onCancel={this.hideOutModel} onOk={this.goToNxet}/> : null}
      {this.state.visible ? <DuplicateLeadsModel params={duplicateLeads} visible={this.state.visible} onCancel={this.handleCancel} onAppeal={this.handleOnAppeal.bind(this, duplicateLeads.feedbackId)} onClaim={this.handleOnClaim.bind(this, duplicateLeads.entityId)}/> : null}
    </div>);
  },
});

export default Form.create()(LeadsComplete);
