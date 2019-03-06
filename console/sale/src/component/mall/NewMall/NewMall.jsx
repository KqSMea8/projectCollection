import React, {PropTypes} from 'react';
import {Steps, Modal, Spin, Breadcrumb} from 'antd';
import ajax from 'Utility/ajax';
import InputMerchantInfo from './InputMerchantInfo';
import InputMallInfo from './InputMallInfo';
import {format, padding, toDate} from '../../../common/dateUtils';
import ConfirmOut from '../../../common/ConfirmOut';
import errorMessageMap from '../../../common/ApiErrorMsgMap';

const Step = Steps.Step;

export function formatTime(d) {
  return d && typeof d !== 'string' ? (padding(d.getHours()) + ':' + padding(d.getMinutes())) : d;
}

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

const NewMall = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  mixins: [ConfirmOut],

  getInitialState() {
    return {
      currentStep: 0, // 当前步骤（0：确认商户信息；1：填写综合体信息；）
      data: {}, // 表单数据
      defaultData: {}, // 表单默认数据
      loading: true,
      canSubmit: true,
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
    if (this.props.params.orderId) {
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
    if (this.state.currentStep >= 1) {
      formData = this.transformFormData(formData);
      this.save(formData);
      return;
    }
    if (this.state.currentStep === 0) {
      this.nextsubmit(formData);
    }
  },
  closeWindow() {
    window.close();
  },
  nextsubmit(formData) {
    const params = {};
    params.alipayUserName = formData.alipayUserName;
    params.merchantName = formData.merchantName;
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/checkMallMerchant.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        this.setState({
          partnerId: result.data,
          currentStep: ++this.state.currentStep,
          data: {
            partnerId: result.data,
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

  transformDefaultData(data) {
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
    defaultData.licenseSeq = data.licenseSeq;
    defaultData.licenseName = data.licenseName;
    if (defaultData.keyPerson) {
      defaultData.kpName = defaultData.keyPerson.kpName;
      defaultData.kpJob = defaultData.keyPerson.kpJob;
      defaultData.kpTelNo = defaultData.keyPerson.kpTelNo;
    }
    if (defaultData.managementInfo) {
      defaultData.businessArea = Number(defaultData.managementInfo.businessArea);
      defaultData.annualTurnover = Number(defaultData.managementInfo.annualTurnover);
      defaultData.restaurantShopCnt = Number(defaultData.managementInfo.restaurantShopCnt);
      defaultData.fastConsumeShopCnt = Number(defaultData.managementInfo.fastConsumeShopCnt);
      defaultData.universalShopCnt = Number(defaultData.managementInfo.universalShopCnt);
      defaultData.payShopCnt = Number(defaultData.managementInfo.payShopCnt);
      defaultData.dailyTradeCnt = Number(defaultData.managementInfo.dailyTradeCnt) || '';
      defaultData.gmv = Number(defaultData.managementInfo.gmv) || '';
    }
    delete defaultData.managementInfo;
    return defaultData;
  },

  transformFormData(values) {
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
    return formData;
  },

  save(formData) {
    const shopId = this.props.params.shopId;
    if (shopId) {
      formData.shopId = shopId;
      formData.shopType = this.state.shopType;
      formData.partnerId = this.state.data.partnerId;
      this.edit(formData);
      return;
    }
    const orderId = this.props.params.orderId;
    if (orderId) {
      formData.refOrderId = orderId;
      formData.shopType = this.state.shopType;
      formData.partnerId = this.state.data.partnerId;
      this.create(formData);
      return;
    }
    formData.shopType = 'MALL';
    this.create(formData);
  },

  create(formData) {
    if (!formData.partnerId) {
      formData.partnerId = this.state.partnerId;
    }
    this.setState({
      canSubmit: false,
    });
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/createShopMall.json',
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
          content: '本次创建的门店需审批后通过才生效，请耐心等待',
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

  edit(formData) {
    this.setState({
      canSubmit: false,
    });
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/modifyShop.json',
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
          content: (result.auditing ? '本次修改的门店需审批后通过才生效，请耐心等待' : '请移步到我的门店里查看'),
          okText: '知道了，关闭窗口',
          onOk: this.closeWindow,
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
      params = {
        id: this.props.params.orderId,
      };
    }
    let url;
    if (isEdit) {
      url = window.APP.crmhomeUrl + '/shop/koubei/initModify.json';
    } else {
      url = window.APP.crmhomeUrl + '/shop/koubei/initCreateOrder.json';
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
          shopType: result.data.shopType,
          defaultData,
          data: {
            partnerId: result.data.partnerId,
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

  render() {
    const isEdit = !!this.props.params.shopId;
    const {currentStep, data, defaultData, loading, canSubmit} = this.state;
    let statusList = [];
    switch (currentStep) {
    case 0:
      statusList = ['process', 'wait'];
      break;
    default:
      statusList = ['finish', 'process'];
      break;
    }
    const commonProps = {
      isEdit,
      data,
      defaultData,
      onOk: this.nextStep,
    };
    return (<div>
      <div className="app-detail-header">
        <Breadcrumb separator=">">
          <Breadcrumb.Item><a href="">我的门店</a></Breadcrumb.Item>
          <Breadcrumb.Item>{this.props.params.shopId ? '修改综合体' : '创建综合体'}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="kb-detail-main">
        {
          loading && <div style={{textAlign: 'center', marginTop: 80}}><Spin/></div>
        }
        {
          !loading && (<div>
            <div style={{padding: '24px 120px 0 120px'}}>
              <Steps current={currentStep}>
                <Step title="确认商户信息" status={statusList[0]}/>
                <Step title="填写综合体信息" status={statusList[1]}/>
              </Steps>
            </div>
            <InputMerchantInfo {...commonProps} onCancel={this.prevStep} visible={currentStep === 0}/>
            {currentStep === 1 && <InputMallInfo {...commonProps} onCancel={this.prevStep} canSubmit={canSubmit} visible={currentStep === 1}/>}
          </div>)
        }
      </div>
    </div>);
  },
});

export default NewMall;
