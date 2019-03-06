import React, {PropTypes} from 'react';
import {Steps, Modal, Spin, message} from 'antd';
import ajax from 'Utility/ajax';
import permission from '@alipay/kb-framework/framework/permission';
import ErrorPage from '../../../common/ErrorPage';
import SelectMerchant from './SelectMerchant';
import InputShopInfo from './InputShopInfo';
import InputCertifyInfo from './InputCertifyInfo';
import {format, padding, toDate} from '../../../common/dateUtils';
import ConfirmOut from '../../../common/ConfirmOut';
import errorMessageMap from '../../../common/ApiErrorMsgMap';
import CategoryChangeSignUtil from '../../../common/AreaCategory/categoryChangeSignUtil';
import CreateShopRateModal from '../common/CreateShopRateModal';

const Step = Steps.Step;

const imageFields = [
  'logoId',
  'coverId',
  'pictureDetailId',
  'licensePictureId',
  'certificatePictureId',
  'authorizationPictureId',
  'otherAuthorizationId',
];

const serviceFields = [
  'park',
  'wifi',
  'box',
  'noSmoke',
];

export function formatTime(d) {
  return d && typeof d !== 'string' ? (padding(d.getHours()) + ':' + padding(d.getMinutes())) : d;
}

const NewShop = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  mixins: [ConfirmOut],
  getInitialState() {
    return {
      currentStep: 0, // 当前步骤（0：选择/填写商户；1：填写门店；2：提供认证信息；）
      data: {}, // 表单数据
      defaultData: {}, // 表单默认数据
      RateData: {},
      loading: false,
      canSubmit: true,
      isFromSupport: this.props.route.path === 'shop/edit-for-support/:shopId',
    };
  },

  componentWillMount() {
    // 修改
    if (this.props.params.shopId) {
      this.setState({
        currentStep: 1,
      });
      this.fetch(true);
      return;
    }
    // 待开门店》新建
    if (this.props.params.id) {
      this.setState({
        currentStep: 1,
      });
      this.fetch();
      return;
    }
    // 新建
    this.setState({
      loading: false,
      defaultData: this.transformDefaultData({
        payType: 'online_pay',
        certificateValidTime: '',
        licenseValidTime: '',
        bindingPublic: true,
      }),
    });
    CategoryChangeSignUtil.clearRememberChangeSignConfirmedFlag();
  },

/**
 * 获取接口url （在修改情况下且有admin权限则使用新接口）
 */
  getApiUrl() {
    const apiUrl = {
      [true]: ['/shop/koubei/initModifyForAdmin.json', '/shop/koubei/modifyShopForAdmin.json'],
      [false]: ['/shop/koubei/initModify.json', '/shop/koubei/modifyShop.json'],
    };
    const isEdit = !!this.props.params.shopId;
    const isAdmain = (!!permission('PERMISSION_SHOP_MODIFY_ADMIN') || this.state.isFromSupport) && isEdit;
    return apiUrl[isAdmain];
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
      this.setState({
        formData: formData,
      });
      // 费率
      if (this.props.params.shopId) {
        this.save(formData);
      } else {
        this.queryLoginRole(formData);
      }
      return;
    }
    this.setState({
      data: formData,
      currentStep: ++this.state.currentStep,
      categoryId: formData.categoryId,
    });
  },
  // 查询费率
  queryLoginRole(formData) {
    const data = {
      categoryId: formData.categoryId,
      pid: this.props.pId,
      type: 'CREATE_SHOP',
    };
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/queryStandardRate.json',
      method: 'get',
      data: data,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          this.setState({
            RateData: result.data,
            RateVisible: result.data.needShowRate,
          });
          if (!result.data.needShowRate) {
          //   formData.rate = this.rate;
            this.save(this.state.formData);
          }
        }
      },
      error: (result) => {
        if (result.status === 'failed') {
          message.error(result.resultMsg, 2.5);
          // this.handleCancel();
          // this.setState({submitButtonDisable: false});
        }
      },
    });
  },

  closeWindow() {
    window.close();
  },

/* eslint-disable */
  transformDefaultData(data) {
/* eslint-enable */
    const {provinceId, cityId, districtId, categoryIds, longitude, latitude} = data;
    const defaultData = {...data};
    defaultData.area = [provinceId, cityId, districtId].filter(c => !!c);
    defaultData.categoryId = categoryIds;
    if (longitude) {
      defaultData.map = {
        lng: longitude,
        lat: latitude,
      };
    }
    defaultData.posId = defaultData.posId || [];
    imageFields.forEach((key) => {
      const listKey = key.slice(0, -2) + 'List';
      if (defaultData[listKey]) {
        defaultData[key] = [];
        defaultData[listKey] = defaultData[listKey].map((row) => {
          defaultData[key].push(row.id);
          return {
            sourceId: row.id,
            url: row.url,
          };
        });
      } else {
        defaultData[listKey] = [];
      }
    });
    serviceFields.forEach((key) => {
      defaultData[key] = (defaultData.services && defaultData.services[key] === 'true');
    });
    delete defaultData.services;

    if (defaultData.mobileNo) {
      defaultData.mobileNo.split(',').forEach((value, i) => {
        defaultData['mobileNo' + (i + 1)] = value;
      });
    }
    defaultData.perPay = defaultData.perPay ? parseInt(defaultData.perPay, 10) : undefined;
    if (!defaultData.perPay || defaultData.perPay <= 0) {
      delete defaultData.perPay;
    }
    if (defaultData.licenseValidTime === '长期') {
      defaultData.licenseValidTimeType = '2';
      delete defaultData.licenseValidTime;
    } else {
      defaultData.licenseValidTimeType = '1';
      defaultData.licenseValidTime = toDate(defaultData.licenseValidTime);
    }
    if (defaultData.certificateValidTime === '长期') {
      defaultData.certificateValidTimeType = '2';
      delete defaultData.certificateValidTime;
    } else {
      defaultData.certificateValidTimeType = '1';
      defaultData.certificateValidTime = toDate(defaultData.certificateValidTime);
    }
    if (defaultData.keyPerson) {
      defaultData.kpName = defaultData.keyPerson.kpName;
      defaultData.kpJob = defaultData.keyPerson.kpJob;
      defaultData.kpTelNo = defaultData.keyPerson.kpTelNo;
    }
    return defaultData;
  },

/* eslint-disable */
  transformFormData(values) {
/* eslint-enable */
    const formData = {...values};
    formData.longitude = formData.map && formData.map.lng;
    formData.latitude = formData.map && formData.map.lat;
    formData.provinceId = formData.area ? formData.area[0] : '';
    formData.cityId = formData.area ? formData.area[1] : '';
    formData.districtId = formData.area ? formData.area[2] : '';
    formData.categoryId = formData.categoryId ? formData.categoryId[formData.categoryId.length - 1] : '';
    delete formData.map;
    delete formData.area;
    delete formData.categoryIds;
    delete formData.keyPerson;
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
    imageFields.concat('posId').forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key] = formData[key].join(',');
      }
      const listKey = key.slice(0, -2) + 'List';
      delete formData[listKey];
    });
    serviceFields.concat('bindingPublic').forEach((key) => {
      formData[key] = !!formData[key];
    });
    const mobileNoList = [];
    for (let i = 1; i <= 5; i++) {
      if (formData['mobileNo' + i]) {
        mobileNoList.push(formData['mobileNo' + i]);
      }
      delete formData['mobileNo' + i];
    }
    formData.mobileNo = mobileNoList.join(',');
    return formData;
  },

  save(formData) {
    this.setState({
      RateVisible: false,
    });
    const shopId = this.props.params.shopId;
    const orderId = this.props.params.id;
    const leadsId = this.state.defaultData.leadsId;
    if (shopId) {
      formData.shopId = shopId;
      this.edit(formData);
      return;
    }
    if (orderId) {
      formData.refOrderId = orderId;
      if (this.props.params.type === 'again') {
        delete formData.refOrderId;
      }
    }
    if (leadsId) {
      formData.leadsId = leadsId;
    }
    this.checkChangeSignAndCreate(formData);
  },

  checkChangeSignAndCreate(formData) {
    this.setState({canSubmit: false});
    CategoryChangeSignUtil.checkChangeSign({
      partnerId: formData.partnerId,
      categoryId: formData.categoryId,
      shouldChangeSign: (validateDate) => {
        CategoryChangeSignUtil.showShouldChangeSignConfirmWithCheckConfirmed({
          categoryId: formData.categoryId,
          okText: '确定并提交',
          okCallback: () => {
            this.setState({canSubmit: true});
            formData.signType = validateDate.signType;
            formData.orderNum = validateDate.orderNum;
            formData.alipayAccount = validateDate.alipayAccount;
            this.create(formData);
          },
          cancelCallback: () => {
            this.setState({canSubmit: true});
          },
        });
      },
      cantChangeSign: () => {
        this.setState({canSubmit: true});
        CategoryChangeSignUtil.showCantChangeSignAlert();
      },
      alreadySign: () => {
        this.setState({canSubmit: true});
        this.create(formData);
      },
      error: (errorMsg) => {
        this.setState({canSubmit: true});
        Modal.error({
          title: '品类改签校验接口异常',
          content: errorMsg,
          okText: '知道了',
        });
      },
    });
  },
// 新建门店
  create(formData) {
    this.setState({
      canSubmit: false,
    });
    ajax({
      // url: appendOwnerUrlIfDev('/shop/koubei/createShop.json'),
      url: window.APP.crmhomeUrl + '/shop/koubei/createShop.json',
      method: 'post',
      data: {
        _input_charset: 'utf-8',
        ...formData,
      },
      success: () => {
        this.setState({
          canSubmit: true,
        });
        Modal.success({
          title: '提交成功',
          content: '提交成功。口碑将于1~3个工作日完成处理，请耐心等待',
          okText: '知道了，关闭窗口',
          onOk: this.closeWindow,
        });
      },
      error: (result) => {
        this.setState({
          canSubmit: true,
        });
        Modal.error({
          title: '创建失败',
          content: errorMessageMap[result.resultCode] || result.resultMsg,
          okText: '知道了',
        });
      },
    });
  },
// 编辑门店
  edit(formData) {
    this.setState({
      canSubmit: false,
    });
    ajax({
      url: window.APP.crmhomeUrl + this.getApiUrl()[1],
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
          content: (result.auditing ? '提交成功。部分敏感字段需审批后才能生效，非敏感字段修改即刻生效。敏感字段的审批将在1~3个工作日内完成，请耐心等待' : '请移步到我的门店里查看'),
          okText: '知道了',
          onOk: () => {
            this.noConfirmOut = true;
            location.href = this.state.isFromSupport ? '/support/index.htm' : '#/shop';
          },
        });
      },
      error: (result) => {
        this.setState({
          canSubmit: true,
        });
        Modal.error({
          title: '修改失败',
          content: errorMessageMap[result.resultCode] || result.resultMsg,
          okText: '知道了',
        });
      },
    });
  },

  fetch(isEdit) {
    let params;
    if (isEdit) {
      params = {
        id: this.props.params.shopId,
      };
    } else {
      if (this.props.params.type === 'again') {
        params = {
          orderId: this.props.params.id,
        };
      } else {
        params = {
          id: this.props.params.id,
        };
      }
    }
    let url;
    if (isEdit) {
      url = window.APP.crmhomeUrl + this.getApiUrl()[0];
    } else {
      if (this.props.params.type === 'again') {
        url = window.APP.crmhomeUrl + '/shop/koubei/historyInitCreateOrder.json';
      } else {
        url = window.APP.crmhomeUrl + '/shop/koubei/initCreateOrder.json';
      }
    }
    this.setState({
      loading: true,
    });
    ajax({
      url: url,
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        const defaultData = this.transformDefaultData(result.data);
        this.setState({
          loading: false,
          defaultData,
          data: {
            partnerId: defaultData.partnerId,
          },
        });
      },
      error: (result) => {
        Modal.error({
          title: '系统出错',
          content: result.resultMsg,
        });
      },
    });
  },
  handleRateCancel() {
    this.setState({
      RateVisible: false,
    });
  },
  render() {
    const isEdit = !!this.props.params.shopId;
    if (isEdit && !permission('SHOP_MODIFY') || !isEdit && !permission('SHOP_CREATE')) {
      return <ErrorPage type="permission"/>;
    }
    const isOrder = !!this.props.params.id;
    const {currentStep, data, defaultData, loading, canSubmit} = this.state;
    let statusList = [];
    switch (currentStep) {
    case 0:
      statusList = ['process', 'wait', 'wait'];
      break;
    case 1:
      statusList = ['finish', 'process', 'wait'];
      break;
    default:
      statusList = ['finish', 'finish', 'process'];
      break;
    }
    const commonProps = {
      isEdit,
      isOrder,
      data,
      defaultData,
      onOk: this.nextStep,
    };

    const steps = [<Step title="填写门店" status={statusList[1]} key="step1" />, <Step title="提供认证信息" status={statusList[2]} key="step2" />];
    if (isEdit || isOrder) {
      steps.unshift(<Step title="选择/填写商户" status={statusList[0]} key="step0" />);
    }

    return (<div>
      <div className="app-detail-header">{isEdit ? '修改门店' : '创建单个门店'}</div>
      <div className="kb-detail-main">
        {
          loading ? <div style={{textAlign: 'center', marginTop: 80}}><Spin/></div>
          : (
            <div>
              <div style={{padding: '24px 120px 0 120px'}}>
                <Steps current={currentStep}>
                  {steps}
                </Steps>
              </div>
              <SelectMerchant {...commonProps} visible={currentStep === 0}/>
              <InputShopInfo {...commonProps} onCancel={this.prevStep} isFromSupport={this.state.isFromSupport} checkChangeSign={!isEdit}
                visible={currentStep === 1}/>
              <InputCertifyInfo {...commonProps} onCancel={this.prevStep} canSubmit={canSubmit} visible={currentStep === 2}/>
            </div>
          )
        }
        {this.state.RateVisible ? <CreateShopRateModal
          formData={this.state.formData}
          save={this.save} RateData={this.state.RateData}
          handleRateCancel={this.handleRateCancel}
          RateVisible={this.state.RateVisible}/> : null}
      </div>
    </div>);
  },
});

export default NewShop;
