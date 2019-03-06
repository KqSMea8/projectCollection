import React, {PropTypes} from 'react';
import {Steps, Modal, Spin} from 'antd';
import ajax from '../../../common/ajax';
import objectAssign from 'object-assign';
import SelectMerchant from './SelectMerchant';
import InputShopInfo from './InputShopInfo';
import InputCertifyInfo from './InputCertifyInfo';
import {format, padding, yyyyMMddToDate} from '../../../common/dateUtils';
import ConfirmOut from '../common/ConfirmOut';
import {keepSession} from '../../../common/utils';
import CategoryChangeSignUtil from '../common/AreaCategory/categoryChangeSignUtil';

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

const errorMessageMap = {
  INVALID_PARAMETER: '参数无效',
  SYSTEM_ERROR: '系统异常',
  BRAND_NOT_EXISTS: '店铺创建场景下品牌不存在',
  CATOGORY_NOT_EXISTS: '门店品类不存在',
  ILLEGAL_BIZ_ORDER_STATUS: '流水订单状态非法',
  OPERATOR_NOT_PERMISSION: '暂无权限',
  STAFF_MERCHANT_RELATION_INVALID: '没有找到员工、商户关系',
  STAFF_JOB_NOT_EXIST: '暂无权限',
  SHOP_OPERATOR_AREA_NOT_INIT: '您的岗位尚未配置区域约束，暂无法操作',
  AREA_NOT_MATCH: '该门店所在的区域不在您的服务区域内，暂无法操作',
  SHOP_OPERATOR_CATEGORY_NOT_INIT: '您的岗位尚未配置类目约束，暂无法操作',
  SHOP_OPERATOR_CATEGORY_NOT_MATCH: '该门店所属类目不在您的服务范围内，暂无法操作',
  LICENSE_EXPIRES: '您提交的营业执照已过期',
  LICENSE_PRINCIPAL_NOT_MATCH: '您提交的营业执照信息与你的账号不一致',
  LICENSE_ADDRESS_NOT_MATCH: '您提交的营业执照信息地址有误',
  LICENSE_CHECK_FAIL: '您提交的营业执照存在问题，请重新提交',
  LICENSE_IS_REQUIRED: '请填写营业执照认证信息',
  CERTIFICATE_IS_REQUIRED: '请填写许可证认证信息',
  SHOP_CATEGORY_NOT_MATCH_CITY: '暂无权限',
  SHOP_BRAND_PROTECTED: '您提交的品牌已受保护，无法创建',
  LOCATION_VALIDATE_FAIL: '您填写的地址与地图定位差距太大，请修改',
  EXIST_FORBIDDEN_WORD: '您填写的内容包含敏感词，请修改',
  MERCHANT_NOT_EXIST: '商户不存在',
  SHOP_CTU_RISK: '当前门店存在风险，请联系口碑客服人员',
  UNIQUE_CONSTRAINT_SHOP_ERROR: '门店已存在，请确认后重新填写',
  UNIQUE_CONSTRAINT_IMPLEMENTID_ERROR: '机具号已存在，请确认后重新填写',
  UNIQUE_CONSTRAINT_OUTSHOPID_ERROR: '门店编号已存在，请确认后重新填写',
  SHOP_JUDGE_FAIL: <span>门店已存在，请联系口碑<a target="_blank" href="https://cschannel.alipay.com/portal.htm?sourceId=556">在线客服</a></span>,
  SHOP_STATUS_CANOT_MODIFY: '门店状态无法修改',
  PROVINCE_CITY_CANOT_MODIFY: '省市信息不允许修改',
  CATEGORY_CANOT_MODIFY: '类目信息不允许修改',
  NOT_ALLOWED_CONCURRENT_MODIFY: '门店修改审核中，无法操作',
  SHOP_STAFF_RELATION_CHECK_FAIL: '暂无权限',
  LEADS_NOT_EXIST: 'leads不存在',
  LEADS_STATUS_CAN_NOT_OP: '当前leads状态无法修改',
  SHOP_CREATE_INFO_NOT_MATCH_LEADS: 'leads开店部分信息跟leads不一致',
  NOT_SUPPORTED_BUSINESS: '系统异常',
  SHOP_INVALID_STATUS: '当前门店状态异常，无法操作',
  OPERATOR_AREA_NOT_INIT: '您的岗位尚未配置权限，暂无法操作',
  OPERATOR_CATEGORY_NOT_INIT: '您的岗位尚未配置类目约束，暂无法操作',
  CATEGORY_NOT_MATCH: '该门店所属行业不在您的服务范围内，暂无法操作',
  ORIGINAL_PRINCIPAL_RELATION_NOT_EXIST: '当前员工与门店不存在关联，无需操作',
  TARGET_PRINCIPAL_RELATION_EXIST: '当前门店与员工的关系已存在，无需重复操作',
  LEADS_HAS_RELEASE: '该门店对应leads已被释放回公海，请重新认领',
  LICENSE_CODE_REPEAT_ERROR: '该证照已被使用，不可重复用于开店。',
  BRAND_CATEGORY_NOT_MATCH: '您选择的品牌不属于该类目，请重新选择',
  LEADS_NOT_BELONG: '该leads已不在您的私海中，无法继续开店',
  SHOP_HAS_SURROUNDED_MALL: '该门店已归属该综合体，无需重复操作',
  SHOP_HAS_SURROUNDED_ANOTHER_MALL: '该门店已归属其他综合体，无法添加',
  MERCHANT_CAN_NOT_SIGN_KOUBEI: '您当前账户已签约支付宝，无法继续开店，请更换其他账户来开店或拨打400-826-7710热线，咨询或免费解约',
};

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
      currentStep: 0, // 当前步骤
      pageConfig: {},
      showMerchantSelect: false,
      pids: [],
      data: {}, // 表单数据
      defaultData: {}, // 表单默认数据
      loading: false,
      canSubmit: true,
    };
  },

  componentWillMount() {
    keepSession();
    CategoryChangeSignUtil.clearChangeSignConfirmedFlag();

    // 修改门店
    if (this.props.params.shopId) {
      this.setPageConfig({
        shopId: this.props.params.shopId,
        modifyMode: 1,
      });
      this.fetch({
        url: '/shop/crm/initModify.json',
        params: { id: this.props.params.shopId },
      });
      return;
    }
    this.setPageConfig();
    // 历史门店 > 重新开店
    if (this.props.params.historyShopId) {
      this.fetch({
        url: '/shop/crm/historyInitCreateOrder.json',
        params: { orderId: this.props.params.historyShopId },
      });
      return;
    }
    // 待开门店 > 重新开店
    if (this.props.location.query.id) {
      this.fetch({
        url: '/shop/crm/initCreateOrder.json',
        params: { id: this.props.location.query.id },
      });
      return;
    }
    // 创建门店
    ajax({
      url: '/shop/crm/merchantSelect.json',
      method: 'get',
    }).then((response) => {
      // 如果商户列表不为空，显示选择商户界面
      if (response.pids && response.pids.length > 0) {
        this.setState({
          pids: response.pids,
          showMerchantSelect: true,
        });
      }
      this.setState({
        loading: false,
        defaultData: this.transformDefaultData({
          payType: 'online_pay',
          certificateValidTime: '', // yyyy-MM-dd 或 yyyyMMdd 格式，用 dateUtils/yyyyMMddToDate 转换成 Date 对象，下同
          licenseValidTime: '',
          bindingPublic: true,
        }),
      });
    });
  },

  setPageConfig(data) {
    // 获取创建/修改页面配置（例如是否显示银行卡号输入框）
    ajax({
      url: '/shop/crm/shopCreateConfig.json',
      method: 'get',
      data,
    }).then((response) => {
      this.setState({
        pageConfig: response,
      });
    });
  },

  fetch(options) {
    this.setState({ loading: true });
    ajax({
      url: options.url,
      method: 'get',
      data: options.params,
      type: 'json',
    }).then((result) => {
      const defaultData = this.transformDefaultData(result.data);
      this.setState({
        loading: false,
        defaultData,
        data: { partnerId: defaultData.partnerId },
      });
    }).catch((result) => {
      Modal.error({
        title: '系统出错',
        content: result.resultMsg,
      });
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
    let formData = objectAssign(this.state.data, values);
    if (this.state.currentStep >= (this.state.showMerchantSelect ? 2 : 1)) {
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
      defaultData.licenseValidTime = yyyyMMddToDate(defaultData.licenseValidTime);
    }
    if (defaultData.certificateValidTime === '长期') {
      defaultData.certificateValidTimeType = '2';
      delete defaultData.certificateValidTime;
    } else {
      defaultData.certificateValidTimeType = '1';
      defaultData.certificateValidTime = yyyyMMddToDate(defaultData.certificateValidTime);
    }
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
    if (!formData.park) {
      delete formData.parkRadio;
      delete formData.tollParkMessage;
    }
    if (!formData.wifi) {
      delete formData.wifiName;
      delete formData.wifiPassword;
    }
    return formData;
  },

  save(formData) {
    const shopId = this.props.params.shopId;
    const orderId = this.props.location.query.id;
    const leadsId = this.state.defaultData.leadsId;
    if (shopId) {
      formData.shopId = shopId;
      this.edit(formData);
      return;
    }
    if (orderId) {
      formData.refOrderId = orderId;
    }
    if (leadsId) {
      formData.leadsId = leadsId;
    }
    if (this.state.showMerchantSelect) { // 操作员不走校验改签逻辑
      this.create(formData);
    } else {
      this.checkChangeSignAndCreate(formData);
    }
  },

  checkChangeSignAndCreate(formData) {
    this.setState({canSubmit: false});

    CategoryChangeSignUtil.checkChangeSign({
      partnerId: formData.partnerId,
      categoryId: formData.categoryId,
      shouldChangeSign: (resultData) => {
        this.setState({canSubmit: true});
        CategoryChangeSignUtil.showShouldChangeSignConfirmWithCheckConfirmed({
          categoryId: formData.categoryId,
          checkSignApiData: resultData,
          okText: '同意改签并提交',
          okCallback: () => {
            formData.signType = resultData.signType;
            formData.orderNum = resultData.orderNum;
            formData.alipayAccount = resultData.alipayAccount;
            this.create(formData);
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

  create(formData) {
    this.submit({
      url: '/shop/crm/createShop.json',
      formData,
      actionText: '创建',
      successText() {
        return '提交成功。口碑将于1~3个工作日完成处理，请耐心等待';
      },
    });
  },

  edit(formData) {
    this.submit({
      url: '/shop/crm/modifyShop.json',
      formData,
      actionText: '修改',
      successText(auditing) {
        return auditing ? '提交成功。部分敏感字段需审批后才能生效，非敏感字段修改即刻生效。敏感字段的审批将在1~3个工作日内完成，请耐心等待' : '请移步到我的门店里查看';
      },
    });
  },

  submit({url, formData, actionText, successText}) {
    const shopId = this.props.params.shopId;
    this.setState({
      canSubmit: false,
    });
    ajax({
      url: url,
      method: 'post',
      data: {
        _input_charset: 'utf-8',
        ...formData,
      },
    }).then((response) => {
      if (response && response.status === 'succeed') {
        this.setState({
          canSubmit: true,
        });
        Modal.success({
          title: '提交成功',
          content: successText(response.auditing),
          okText: shopId ? '知道了' : '知道了，关闭窗口',
          onOk: shopId ? () => {
            this.noConfirmOut = true;
            location.href = '#/shop';
          } : this.closeWindow,
        });
      } else {
        throw new Error(response);
      }
    }).catch((reason) => {
      this.setState({
        canSubmit: true,
      });
      Modal.error({
        title: actionText + '失败',
        content: errorMessageMap[reason.resultCode] || reason.resultMsg,
        okText: '知道了',
      });
    });
  },

  render() {
    const isEdit = !!this.props.params.shopId || !!this.props.params.historyShopId;
    const {currentStep, data, defaultData, pageConfig, showMerchantSelect, loading, canSubmit} = this.state;
    const commonProps = {
      isEdit,
      data,
      defaultData,
      pageConfig,
      showMerchantSelect,
      onOk: this.nextStep,
    };
    const wrapperStyle = {padding: '24px 120px 0 120px'};
    return (<div>
      <div className="app-detail-header">{isEdit ? '修改门店' : '创建单个门店'}</div>
      <div className="kb-detail-main">
        {
          loading && <div style={{textAlign: 'center', marginTop: 80}}><Spin/></div>
        }
        {
          !loading && (showMerchantSelect ?
            (<div>
              <div style={wrapperStyle}>
                <Steps current={currentStep}>
                  <Step title="选择/填写商户" />
                  <Step title="填写门店" />
                  <Step title="提供认证信息" />
                </Steps>
                <SelectMerchant {...commonProps} pids={this.state.pids} visible={currentStep === 0}/>
                <InputShopInfo {...commonProps} onCancel={this.prevStep} visible={currentStep === 1}/>
                <InputCertifyInfo {...commonProps} onCancel={this.prevStep} canSubmit={canSubmit} visible={currentStep === 2}/>
              </div>
            </div>) :
            (<div>
              <div style={wrapperStyle}>
                <Steps current={currentStep}>
                  <Step title="填写门店" />
                  <Step title="提供认证信息" />
                </Steps>
                <InputShopInfo {...commonProps} onCancel={this.prevStep} visible={currentStep === 0} checkChangeSign={!isEdit}/>
                <InputCertifyInfo {...commonProps} onCancel={this.prevStep} canSubmit={canSubmit} visible={currentStep === 1}/>
              </div>
            </div>))
        }
      </div>
    </div>);
  },
});

export default NewShop;
