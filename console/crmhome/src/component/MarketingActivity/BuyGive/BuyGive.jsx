import React, { PropTypes } from 'react';
import { Row, Col, Icon, Breadcrumb, Form, Button, Input, DatePicker, Radio, InputNumber, Select, message, Modal, Spin, Alert } from 'antd';
import ajax from '../../../common/ajax';
import { customLocation, isArrayRepeated, convertServerNumber, keepSession } from '../../../common/utils';
import { getPhotoId } from '../common/coupon/util';
import { dateLaterThanToday } from '../../../common/dateUtils';
import moment from 'moment';
import classnames from 'classnames';
import UploaderClip from './UploaderClip';
import UploadCropPic from './UploadCropPic';
// import SelectShop from './SelectShop';
import SelectShops from '../../../common/SelectShops/indexs';
import {flattenData} from '../../../common/SelectShops/ShopSelectBox';
import InputAddable from './InputAddable';
import Goods from './Goods';
import Simulator from './Simulator';
import BrandName from './BrandName';
// import * as _ from 'lodash';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

import { ImgCropModal } from 'hermes-react';
const Preview = ImgCropModal.Preview;

let sourceData = {};
let sourceChannel = '';
let sourceType = '';
let globalParams = {};
let isSubmiting = false;

import './BuyGive.less';

const node = document.getElementById('J_isFromKbServ');
const isFromKb = node && node.value === 'true';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16, offset: 1 },
};

const BuyGive = React.createClass({
  propTypes: {
    params: PropTypes.object,
    location: PropTypes.object,
  },

  getInitialState() {
    this.isEdit = !!this.props.params.id;
    return {
      actionType: this.props.params.mode, // add | edit | copy
      copyModalVisible: false,
      initData: {},
      canSubmit: true,
      confirmModal: false,
      testConfig: { // 默认配置
        testDays: 14,
        voucherRelativeDays: 3,
      },
      errorModal: false,
      isLoading: true,
      coverPreviewModal: false,
      logoPreviewModal: false,
      isCampaignStart: false,   // 活动是否已开始
    };
  },

  componentWillMount() {
    keepSession();
  },

  componentDidMount() {
    if (this.props.params.id) {
      // 请求详情
      ajax({
        url: '/goods/itempromo/campaignDetail.json',
        method: 'get',
        type: 'json',
        data: {
          campId: this.props.params.id,
        },
        success: res => {
          if (res && res.result) {
            // const formatViewData = this.transformDataToView(res.discountForm);
            sourceChannel = res.discountForm.sourceChannel;
            sourceType = res.discountForm.sourceType;

            const formatViewData = this.transFormDetailToView(res.discountForm);
            sourceData = {...formatViewData};

            // 增加活动状态
            sourceData.campaignStart = res.discountForm.campaignStart;
            sourceData.selectedShops = res.discountForm.cityShopVOs;
            this.setState({
              isLoading: false,
              initData: sourceData,
              isCampaignStart: res.discountForm.campaignStart,
            });
            this.props.form.setFieldsValue(formatViewData);
          } else {
            message.error(res && res.errorMsg ? res.errorMsg : '获取活动信息失败');
          }
        },
        error: (error) => {
          if (error && error.resultMsg) {
            message.warning(error.resultMsg);
          } else {
            message.warning('系统繁忙，请稍后重试。');
          }
        },
      });
    }

    // 请求测试配置参数
    ajax({
      url: '/goods/itempromo/getTestActivityProperties.json',
      method: 'get',
      type: 'json',
      success: res => {
        if (res.status !== 'succeed') return;
        this.setState({
          testConfig: {
            testDays: res.testDays,
            voucherRelativeDays: res.voucherRelativeDays,
          },
        });
      },
    });
  },

  componentWillUnmount() {
    isSubmiting = false;
  },

  showLogoPreviewModal(e) {
    e.preventDefault();
    this.setState({logoPreviewModal: true});
  },

  showCoverPreviewModal(e) {
    e.preventDefault();
    this.setState({coverPreviewModal: true});
  },

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, fields) => {
      if (!!errors) {
        return;
      }
      const params = this.transformViewToData(fields);
      globalParams = params; // 给后面弹层创建副本使用

      if (this.props.params.id) {
        this.postData(params, false); // 修改
      } else {
        this.createCopeConfirm(params);
      }
    });
  },
  /*eslint-disable */
  transformViewToData(fields) {
     /*eslint-enable */
    const params = {...fields};
    // 后台参数需要
    params.sendRules.buySkus = params.vouchers.itemIds;
    params.sendRules.sendSkus = params.vouchers.itemIds;

    // 转化无限制为 '999999999', 修改时后台要求如此。
    if (params.switch.joinLimit === 'nolimit') { params.participateLimited = '999999999'; }
    if (params.switch.dayJoinLimit === 'nolimit') { params.dayParticipateLimited = '999999999'; }
    if (params.switch.sendAmountLimited === 'nolimit') { params.vouchers.budgetAmount = '999999999'; }
    if (params.switch.totalLimit === 'nolimit') { params.itemDiscountRule.totalLimitCnt = '999999999'; }
    if (params.switch.singleLimit === 'nolimit') { params.sendRules.limitCnt = '999999999'; }

    params.itemDiscountRule.sendRules = [params.sendRules];
    params.vouchers.itemDiscountRule = params.itemDiscountRule;

    delete params.switch;
    delete params.itemDiscountRule;
    delete params.sendRules;

    // 门店数据解析
    const shopList = params.shopList;
    if (shopList.shopType && shopList.shopType === 'select') {
      params.shopType = shopList.shopType;
      // 生成shopIds，后台接口需要冗余的数据
      const shopIds = shopList.checked.map(item => {
        return item.id;
      });
      params.vouchers.shopIds = shopIds;
      params.shopIds = shopIds;
    } else if (shopList.shopType && shopList.shopType === 'upload') {
      params.shopType = shopList.shopType;
      params.logId = shopList.logId;
      params.vouchers.logId = shopList.logId;
      params.vouchers.shopType = shopList.shopType;
    } else {
      // 默认
      // 场景： 用户修改，追加门店为未打开浮层，
      // 重新组装数据给后端
      let shopIds;
      if (shopList) {
        shopIds = flattenData(shopList);
        shopIds = shopIds.map(item => {
          return item.id;
        });
      }
      params.vouchers.shopIds = shopIds;
      params.shopIds = shopIds;
    }
    // 生成shopIds，后台接口需要冗余的数据
    // const shopIds = params.shopList.map(item => {
    //   return item.id;
    // });

    // params.vouchers.shopIds = shopIds;
    // params.shopIds = shopIds;

    // 处理券logo图片
    params.vouchers.voucherLogo = params.vouchers.voucherLogoArr[0].id;
    delete params.vouchers.voucherLogoArr;

    // 处理活动封面图
    params.vouchers.voucherImg = params.vouchers.voucherImgArr[0].id;
    delete params.vouchers.voucherImgArr;

    // 商品详情图片
    params.vouchers.itemDetailImgs = [];
    if (params.vouchers.itemDetailImgOne) {
      params.vouchers.itemDetailImgs.push(params.vouchers.itemDetailImgOne);
    }
    if (params.vouchers.itemDetailImgTwo) {
      params.vouchers.itemDetailImgs.push(params.vouchers.itemDetailImgTwo);
    }

    delete params.vouchers.itemDetailImgOne;
    delete params.vouchers.itemDetailImgTwo;

    if (params.vouchers.validTimeType === 'RELATIVE') {
      delete params.vouchers.validTimeFrom;
      delete params.vouchers.validTimeTo;
    } else {
      delete params.vouchers.validPeriod;
    }

    // 活动名称取商品名称
    params.campName = params.vouchers.itemName;

    // 默认值设置
    params.vouchers.effectType = '0'; // 生效方式，默認传0
    // 如果没有donateFlag没有值传进来说明是不需要领取,则是否可转赠的默认传0 否则走正常页面选择逻辑
    if (!params.vouchers.donateFlag) {
      params.vouchers.donateFlag = '0';
    }
    if (!!this.props.params.id) {// 如果是修改的话,把donateFlag删除,即不允许修改
      delete params.vouchers.donateFlag;
    }
    params.sendNum = 1;
    params.vouchers.vouchersType = 'BUY_A_SEND_A';
    params.vouchers.voucherName = params.vouchers.itemName;

    return params;
  },

  transFormDetailToView(d) {
    const v = d.voucherVOs[0];
    const i = v.itemDiscountRule;
    const s = i.sendRules[0];

    const viewData = {
      'startTime': d.startTime,
      'endTime': d.endTime,
      'type': d.autoPurchase ? 'REAL_TIME_SEND' : 'DIRECT_SEND',
      'participateLimited': convertServerNumber(d.participateLimited),
      'dayParticipateLimited': convertServerNumber(d.dayParticipateLimited),
      'vouchers.brandName': v.subTitle,
      'vouchers.voucherLogoArr': [{
        id: getPhotoId(v.logo),
        uid: getPhotoId(v.logo),
        url: v.logo,
        status: 'done',
      }],
      'vouchers.itemName': v.itemName,
      'vouchers.itemIds': v.itemIds,
      'vouchers.itemDetail': v.itemText,
      'vouchers.voucherImgArr': [{
        id: getPhotoId(v.voucherImg),
        uid: getPhotoId(v.voucherImg),
        url: v.voucherImg,
        status: 'done',
      }],
      'vouchers.itemLink': v.itemLink,
      'vouchers.descList': v.useInstructions,
      'vouchers.itemDetailImgs': v.itemHeadImg,
      'vouchers.budgetAmount': convertServerNumber(d.budgetAmount),
      'itemDiscountRule.itemSendType': i.itemSendType,
      'itemDiscountRule.totalLimitCnt': convertServerNumber(i.totalLimitCnt),
      'sendRules.buyCnt': convertServerNumber(s.buyCnt),
      'sendRules.sendCnt': convertServerNumber(s.sendCnt),
      'sendRules.buySkus': s.buySkus,
      'sendRules.sendSkus': s.sendSkus,
      'sendRules.limitCnt': convertServerNumber(s.limitCnt),
    };
    // 是否可以转赠 这个地方是一个小小的坑,与其他地方不太一样
    if (v.donateFlag === 'true') {
      viewData['vouchers.donateFlag'] = '1';
    }
    if (v.donateFlag === 'false') {
      viewData['vouchers.donateFlag'] = '0';
    }
    // 门店id回显
    viewData['vouchers.shopList'] = d.shopIds.map(item => {
      return {
        id: item,
        shopId: item,
      };
    });

    // 如果下发了validPeriod 则为相对时间
    if (v.relativeTime) {
      viewData['vouchers.validTimeType'] = 'RELATIVE';
      viewData['vouchers.validPeriod'] = convertServerNumber(v.relativeTime);
    } else {
      viewData['vouchers.validTimeType'] = 'FIXED';
      viewData['vouchers.validTimeFrom'] = v.startTime;
      viewData['vouchers.validTimeTo'] = v.endTime;
    }

    // 商品详情图片
    if (v.itemHeadImg && Array.isArray(v.itemHeadImg)) {
      if (v.itemHeadImg[0]) {
        viewData['vouchers.itemDetailImgOne'] = getPhotoId(v.itemHeadImg[0]);
      }

      if (v.itemHeadImg[1]) {
        viewData['vouchers.itemDetailImgTwo'] = getPhotoId(v.itemHeadImg[1]);
      }
    }

    // 生成switch开关
    viewData['switch.joinLimit'] = convertServerNumber(d.participateLimited) ? 'limit' : 'nolimit';
    viewData['switch.dayJoinLimit'] = convertServerNumber(d.dayParticipateLimited) ? 'limit' : 'nolimit';
    viewData['switch.sendAmountLimited'] = convertServerNumber(d.budgetAmount) ? 'limit' : 'nolimit';
    viewData['switch.totalLimit'] = convertServerNumber(i.totalLimitCnt) ? 'limit' : 'nolimit';
    viewData['switch.singleLimit'] = convertServerNumber(s.limitCnt) ? 'limit' : 'nolimit';

    // 把undefined属性都去掉
    for (const pro in viewData) {
      if (viewData[pro] === undefined) {
        delete viewData[pro];
      }
    }

    return viewData;
  },

  postData(params, isCopyTest) {
    if (isCopyTest) {
      params.isCopyTest = isCopyTest;
    }

    const url = this.props.params.id ? '/goods/itempromo/modifyCampaign.json' : '/goods/itempromo/createCampaign.json';
    this.setState({canSubmit: false});
    let jsonObj = {};
    if (this.props.params.id) {
      // 修改
      jsonObj = {
        campId: this.props.params.id,
        sourceType: sourceType,
        sourceChannel: sourceChannel,
        jsonDataStr: JSON.stringify(params),
      };
    } else {
      // 创建
      jsonObj = {
        submitType: isCopyTest ? 'createAndTest' : 'submit',
        jsonDataStr: JSON.stringify(params),
      };
    }

    if (isSubmiting) {
      return;
    }

    isSubmiting = true;

    ajax({
      url,
      data: jsonObj,
      method: 'POST',
      type: 'json',
      success: () => {
        // 创建成功后跳转列表如果网络慢也会有一定时间，这个时间段内还是不允许再次提交。
        message.success('创建成功');
        // this.setState({canSubmit: true});
        customLocation('/goods/itempromo/activityList.htm');
      },
      error: (data) => {
        isSubmiting = false;
        // this.setState({canSubmit: true});
        // Modal error嵌入iframe时无法调整高度
        this.setState({
          canSubmit: true,
          errorModal: true,
          errorTitle: data.errorScene === 'test' ? '创建测试活动副本出错' : '提交出错',
          errorContent: data.resultMsg || data.errorMsg || '',
        });
      },
    });
  },

  createCopeConfirm() {
    this.setState({
      'confirmModal': true,
    });
  },

  handleComfirmSubmit() {
    this.setState({
      canSubmit: false,
      confirmModal: false,
    });
    this.postData(globalParams, false);
  },

  showTestModal() {
    this.setState({
      confirmModal: false,
      copyModalVisible: true,
    });
  },

  handleCopyModalOk() {
    // 创建测试并提交
    this.setState({copyModalVisible: false, canSubmit: false});
    this.postData(globalParams, true);
  },

  changeType(e) {
    if (e.target.value === 'REAL_TIME_SEND') { // 当选择无需用户领取时 是否转赠默认值是0
      this.props.form.setFieldsValue({'vouchers.donateFlag': '0'});
    } else {
      this.props.form.setFieldsValue({'vouchers.donateFlag': '1'});
    }
  },

  /*eslint-disable */
  render() {
    /*eslint-enable */
    const { getFieldProps, getFieldError, validateFields, getFieldValue } = this.props.form;
    const today = moment();
    const actionType = this.props.params.id ? 'edit' : 'create';
    const { initData, testConfig } = this.state;
    const { campaignStart } = initData;

    // 修改规则：活动未开始，都能修改，活动已开始限制修改
    let isDisabled = false;
    if (actionType === 'edit' && campaignStart) {// 此处的campaignStart为true表示活动已开始
      isDisabled = true;
    }

    let modalTop = 100;
    if (window.top !== window) {
      modalTop = window.top.scrollY - 100;
    }

    /** ----------------------- 活动基本信息 ----------------------------- */
    const startTimeProps = getFieldProps('startTime', {
      rules: [
        { required: true, message: '请选择活动开始时间' },
        { validator: (rule, value, callback) => {
          if (!getFieldValue('endTime')) {
            callback();
          } else {
            const startDate = moment(value);
            const endDate = moment(getFieldValue('endTime'));

            if (!startDate.isBefore(endDate)) {
              callback([new Error('开始时间应该早于结束时间')]);
              return;
            }
            if (!endDate.isBefore(startDate.clone().add(10, 'years'))) {
              callback(new Error('活动时间最长为 10 年'));
              return;
            }

            if (getFieldError('endTime')) {
              validateFields(['endTime'], {force: true});
            }

            callback();
          }
        } },
      ],
      initialValue: today.clone().format('YYYY-MM-DD 00:00'),
      getValueFromEvent: (date, dateString) => dateString,
    });

    const endTimeProps = getFieldProps('endTime', {
      rules: [
        { required: true, message: '请选择活动结束时间' },
        { validator: (rule, value, callback) => {
          if (!getFieldValue('startTime')) {
            callback();
          } else {
            const startDate = moment(getFieldValue('startTime'));
            const endDate = moment(value);

            if (!startDate.isBefore(endDate)) {
              callback([new Error('结束时间应该大于开始时间')]);
              return;
            }
            if (endDate.isAfter(startDate.clone().add(10, 'years'))) {
              callback(new Error('活动时间最长为 10 年'));
              return;
            }

            // 如果已上架，时间只能后延
            if (isDisabled) {
              if (endDate.isBefore(moment(initData.endTime))) {
                callback([new Error('活动结束时间只可后延')]);
                return;
              }
            }

            if (getFieldError('startTime')) {
              validateFields(['startTime'], {force: true});
            }
            callback();
          }
        }},
      ],
      initialValue: today.clone().add(1, 'month').format('YYYY-MM-DD 23:59'),
      getValueFromEvent: (date, dateString) => dateString,
    });

    const typeProps = getFieldProps('itemDiscountRule.itemSendType', {
      initialValue: 'BUY_A_SEND_A',
    });


    /** ------------------------ 活动商品设置 start ------------------------ */
    const minimumAmountProps = getFieldProps('sendRules.buyCnt', {
      rules: [
        { required: true, type: 'number', message: '请填写购买商品件数' },
        { validator: (rule, value, callback) => {
          const sendNum = getFieldValue('sendRules.sendCnt');

          if (sendNum && value) {
            if (sendNum > value) {
              callback(new Error('送的数量不能大于买的数量'));
              return;
            }
          }

          if (getFieldError('sendRules.sendCnt')) {
            validateFields(['sendRules.sendCnt'], {force: true});
          }

          callback();
        } },
      ],
    });

    const sendNumProps = getFieldProps('sendRules.sendCnt', {
      rules: [
        { required: true, type: 'number', message: '请填写优惠商品件数' },
        { validator: (rule, value, callback) => {
          const minimumAmount = getFieldValue('sendRules.buyCnt');

          if (minimumAmount && value) {
            if (value > minimumAmount) {
              callback(new Error('送的数量不能大于买的数量'));
              return;
            }
          }

          if (getFieldError('sendRules.buyCnt')) {
            validateFields(['sendRules.buyCnt'], {force: true});
          }
          callback();
        } },
      ],
      initialValue: 1,
    });

    const brandNameProps = getFieldProps('vouchers.brandName', {
      rules: [
        { required: true, message: '请填写品牌名称' },
        { max: 20, message: '最多 20 个字符' },
      ],
    });

    const brandLogoProps = getFieldProps('vouchers.voucherLogoArr', {
      rules: [
        { required: true, message: '请上传品牌Logo' },
      ],
      initialValue: [],
    });

    const itemNameProps = getFieldProps('vouchers.itemName', {
      rules: [
        { required: true, message: '请填写商品名称' },
        { max: 20, message: '最多 20 个字符' },
      ],
    });

    const goodsIdsProps = getFieldProps('vouchers.itemIds', {
      rules: [
        { required: true, type: 'array', message: '请填写商品SKU编码' },
        { validator: (rule, value, callback) => {
          if (value && value.length > 500) {
            callback(new Error('最多输入500个商品SKU编码'));
          }

          if (value && isArrayRepeated(value)) {
            callback(new Error('不能输入重复的商品编码'));
          }

          callback();
        }},
      ],
      initialValue: [],
    });

    const itemDetailProps = getFieldProps('vouchers.itemDetail', {
      rules: [
        { required: true, message: '请填写商品详情' },
        { max: 120, message: '最多 120 个字符' },
      ],
    });

    const firstBrandLogoProps = getFieldProps('vouchers.voucherImgArr', {
      rules: [
        { required: true, message: '请至少上传1张商品封面图' },
      ],
      initialValue: [],
    });

    const secondBrandLogoProps = getFieldProps('vouchers.itemDetailImgOne', {
      rules: [
        { required: false, message: '请上传商品详情图' },
      ],
    });

    const thirdBrandLogoProps = getFieldProps('vouchers.itemDetailImgTwo', {
      rules: [
        { required: false, message: '请上传商品详情图' },
      ],
    });

    const goodsDetailLinkProps = getFieldProps('vouchers.itemLink', {
      rules: [
        { validator: (rule, value, callback) => {
          const reg = new RegExp(/^(http|https|alipays)\:\/\/[^\s]+$/ig);
          if ( value && !reg.test(value) ) {
            callback([new Error('链接格式不正确，请以"http://"、"https://"或"alipays://"开头填写')]);
            return;
          }
          callback();
        } },
      ],
    });
    /** ------------------------ 活动商品设置 end ------------------------ */

    /** ------------------------ 活动规则设置 start ------------------------ */
    const totalLimitProps = getFieldProps('switch.totalLimit', {
      initialValue: 'limit',
      rules: [
        {
          validator: (rule, value, callback) => {
            if (getFieldValue('sendRules.limitCnt')) {
              validateFields(['sendRules.limitCnt'], {force: true});
            }
            callback();
          },
        },
      ],
    });

    const totalLimitCntProps = getFieldValue('switch.totalLimit') === 'limit' ? getFieldProps('itemDiscountRule.totalLimitCnt', {
      rules: [
        {
          required: getFieldValue('switch.totalLimit') === 'limit',
          type: 'number',
          message: '请输入1笔订单最多几件商品享受优惠',
        },
        {
          validator: (rule, value, callback) => {
            if (getFieldValue('sendRules.limitCnt')) {
              validateFields(['sendRules.limitCnt'], {force: true});
            }
            callback();
          },
        },
      ],
    }) : {};

    const singleLimitProps = getFieldProps('switch.singleLimit', {
      initialValue: 'limit',
      rules: [
        {
          validator: (rule, value, callback) => {
            if (getFieldError('sendRules.limitCnt')) {
              validateFields(['sendRules.limitCnt'], {force: true});
            }
            callback();
          },
        },
      ],
    });

    const limitCntProps = getFieldValue('switch.singleLimit') === 'limit' ? getFieldProps('sendRules.limitCnt', {
      rules: [
        {
          required: getFieldValue('switch.singleLimit') === 'limit',
          type: 'number',
          message: '请输入1笔订单同一SKU商品最多送几件',
        },
        {
          validator: (rule, value, callback) => {
            if (getFieldValue('switch.totalLimit') === 'limit' && getFieldValue('switch.singleLimit') === 'limit'
              && getFieldValue('itemDiscountRule.totalLimitCnt') && value
              && getFieldValue('itemDiscountRule.totalLimitCnt') < value) {
              callback(new Error('单个SKU赠送商品限制不能大于优惠商品最多件数'));
            }
            callback();
          },
        },
      ],
    }) : {};

    const needReceiveProps = getFieldProps('type', {
      initialValue: 'REAL_TIME_SEND',
      onChange: this.changeType,
    });

    const joinLimitProps = getFieldProps('switch.joinLimit', {
      initialValue: 'nolimit',
      rules: [
        {
          validator: (rule, value, callback) => {
            if (getFieldValue('dayParticipateLimited')) {
              validateFields(['dayParticipateLimited'], {force: true});
            }

            callback();
          },
        },
      ],
    });

    const joinLimitCountProps = getFieldValue('switch.joinLimit') === 'limit' ? getFieldProps('participateLimited', {
      rules: [
        {
          required: getFieldValue('switch.joinLimit') === 'limit',
          type: 'number',
          message: '请填写累计限制数量',
        },
        {
          validator: (rule, value, callback) => {
            if (isDisabled && (value < initData.participateLimited)) {
              callback([new Error('此处只能增加')]);
            }
            if (getFieldValue('dayParticipateLimited')) {
              validateFields(['dayParticipateLimited'], {force: true});
            }

            callback();
          },
        },
      ],
    }) : {};

    const dayJoinLimitProps = getFieldProps('switch.dayJoinLimit', {
      initialValue: 'nolimit',
      rules: [
        {
          validator: (rule, value, callback) => {
            if (getFieldError('dayParticipateLimited')) {
              validateFields(['dayParticipateLimited'], {force: true});
            }
            callback();
          },
        },
      ],
    });

    const dayJoinLimitCountProps = getFieldValue('switch.dayJoinLimit') === 'limit' ? getFieldProps('dayParticipateLimited', {
      rules: [
        {
          required: getFieldValue('switch.dayJoinLimit') === 'limit',
          type: 'number',
          message: '请填写每天限制数量',
        },
        {
          validator: (rule, value, callback) => {
            if (isDisabled && (value < initData.dayParticipateLimited)) {
              callback([new Error('此处只能增加')]);
            }

            if (getFieldValue('switch.joinLimit') === 'limit' && getFieldValue('switch.dayJoinLimit') === 'limit'
              && value && getFieldValue('participateLimited')
              && value > getFieldValue('participateLimited')) {
              callback(new Error('每天限制数量不能大于累计限制数量'));
            }

            callback();
          },
        },
      ],
    }) : {};

    const validTimeTypeProps = getFieldProps('vouchers.validTimeType', {
      initialValue: 'RELATIVE',
    });

    const validPeriodProps = getFieldValue('vouchers.validTimeType') === 'RELATIVE' ? getFieldProps('vouchers.validPeriod', {
      rules: [
        {
          required: getFieldValue('vouchers.validTimeType') === 'RELATIVE',
          type: 'number',
          message: '请填写券有效期',
        },
        {
          validator: (rule, value, callback) => {
            if (isDisabled) {
              if (initData['vouchers.validPeriod'] && value < initData['vouchers.validPeriod']) {
                callback([new Error('券有效期只可延长')]);
              }
            }
            callback();
          },
        },
      ],
      initialValue: 30,
    }) : {};

    const validTimeFromProps = getFieldValue('vouchers.validTimeType') === 'FIXED' ? getFieldProps('vouchers.validTimeFrom', {
      rules: [
        {
          required: getFieldValue('vouchers.validTimeType') === 'FIXED',
          message: '请选择开始时间',
        },
        { validator: (rule, value, callback) => {
          if (!getFieldValue('vouchers.validTimeTo')) {
            callback();
          } else {
            const startDate = moment(value);
            const endDate = moment(getFieldValue('vouchers.validTimeTo'));


            if (!startDate.isBefore(endDate)) {
              callback([new Error('开始时间应该早于结束时间')]);
              return;
            }
            if (!endDate.isBefore(startDate.clone().add(10, 'years'))) {
              callback(new Error('券有效期跨度必须小于 10 年'));
              return;
            }

            const activityStart = moment(getFieldValue('startTime'));
            if (startDate.isBefore(activityStart)) {
              callback([new Error('开始时间要晚于活动的开始时间')]);
              return;
            }

            if (getFieldError('vouchers.validTimeTo')) {
              validateFields(['vouchers.validTimeTo'], {force: true});
            }
            callback();
          }
        } },
      ],
      initialValue: today.clone().add(7, 'day').format('YYYY-MM-DD HH:mm'),
      getValueFromEvent: (date, dateString) => dateString,
    }) : {};

    const validTimeToProps = getFieldValue('vouchers.validTimeType') === 'FIXED' ? getFieldProps('vouchers.validTimeTo', {
      rules: [
        {
          required: getFieldValue('vouchers.validTimeType') === 'FIXED',
          message: '请选择结束时间',
        },
        { validator: (rule, value, callback) => {
          if (!getFieldValue('vouchers.validTimeFrom')) {
            callback();
          } else {
            const startDate = moment(getFieldValue('vouchers.validTimeFrom'));
            const endDate = moment(value);
            const activityEnd = moment(getFieldValue('endTime'));

            if (!startDate.isBefore(endDate)) {
              callback([new Error('开始时间应该早于结束时间')]);
              return;
            }
            if (!endDate.isBefore(startDate.clone().add(10, 'years'))) {
              callback(new Error('券有效期跨度必须小于 10 年'));
              return;
            }

            if (getFieldValue('endTime') && activityEnd.isAfter(endDate)) {
              callback([new Error('结束时间要晚于活动结束时间')]);
              return;
            }

            if (isDisabled) {
              if (initData['vouchers.validTimeTo'] && endDate.isBefore(initData['vouchers.validTimeTo'])) {
                callback([new Error('券有效期结束时间只可后延')]);
                return;
              }
            }

            if (getFieldError('vouchers.validTimeFrom')) {
              validateFields(['vouchers.validTimeFrom'], {force: true});
            }

            callback();
          }
        } },
      ],
      initialValue: today.clone().add(38, 'day').format('YYYY-MM-DD HH:mm'),
      getValueFromEvent: (date, dateString) => dateString,
    }) : {};

    const sendAmountLimitedProps = getFieldProps('switch.sendAmountLimited', {
      initialValue: 'nolimit',
    });

    const sendAmountProps = getFieldValue('switch.sendAmountLimited') === 'limit' ? getFieldProps('vouchers.budgetAmount', {
      rules: [
        {
          required: getFieldValue('switch.sendAmountLimited') === 'limit',
          type: 'number',
          message: '请填写总发放量',
        },
        {
          validator: (rule, value, callback) => {
            if (isDisabled && (value < initData['vouchers.budgetAmount'])) {
              callback([new Error('发放总量只可增加')]);
            }

            callback();
          },
        },
      ],
    }) : {};

    const descListProps = getFieldProps('vouchers.descList', {
      rules: [
        { required: false, type: 'array', message: '' },
      ],
      initialValue: [''],
    });

    /** ------------------------ 活动规则设置 end ------------------------ */
    if (this.state.isLoading && actionType === 'edit') {
      return (<div style={{margin: '30px 0 0 30px'}}><Spin spinning={this.state.isLoading} /></div>);
    }
    let shopUrl;
    const isEdit = this.isEdit;
    if (isEdit) {
      shopUrl = '/goods/itempromo/getShopsByCityForNewCamp.json?campId=' + this.props.params.id;
    }
    const {isCampaignStart} = this.state;
    const logoUploadOption = {
      maxSize: 2048, // 上传文件最大尺寸,单位为KB
      triggerText: '品牌logo  (500*500)',
      rate: 1, // 裁剪的虚线框的宽/高比
      initWidth: 0.8,
      requiredSize: {width: 500, height: 500},  // 要求的最小尺寸
      getPicInfo: (positionInfo) => {
        const {width, height, url} = positionInfo;
        // 裁剪后的照片，按照长的一边作为基准展示，短的一边则裁剪或两边留白
        const fillType = width > height ? 'width' : 'height';
        return (<div style={{display: 'inline-block', marginLeft: 30, verticalAlign: 'top'}}>
          <div style={{'marginBottom': 10}}><p>您上传的图片将会自动适配为以下尺寸</p></div>
          <div style={{'marginBottom': 5, 'color': '#999'}}>品牌logo</div>
          <Preview
            url={url}
            fillType={fillType}
            picStyle={{borderRadius: '100%', border: '1px solid #ddd', overflow: 'hidden'}}
            style={{width: 100, height: 100, background: '#fff', marginBottom: 20}}
            crop={positionInfo}
          />
        </div>);
      },
    };

    const paperUploadOption = {
      maxSize: 2048, // 上传文件最大尺寸,单位为KB
      triggerText: '商品封面图(2000*1500)',
      rate: 4 / 3, // 裁剪的虚线框的宽/高比
      initWidth: 0.8,
      requiredSize: {width: 2000, height: 1500},  // 要求的最小尺寸
      style: {width: 400, height: 300},
      getPicInfo: (positionInfo) => {
        const {width, height, url} = positionInfo;
        // 裁剪后的照片，按照长的一边作为基准展示，短的一边则裁剪或两边留白
        const fillType = width > height ? 'width' : 'height';
        return (<div style={{display: 'inline-block', marginLeft: 30, verticalAlign: 'top'}}>
          <div style={{'marginBottom': 10}}><p>您上传的图片将会自动适配为以下两种尺寸</p></div>
          <div style={{'marginBottom': 5, 'color': '#999'}}>展示在券详情页</div>
          <Preview
            url={url}
            fillType={fillType}
            style={{width: 16 / 9 * 100, height: 100, background: '#fff', marginBottom: 20, border: '1px solid #ccc'}}
            crop={positionInfo}
          />
          <div style={{'marginBottom': 5, 'color': '#999'}}>展示在店铺详情页</div>
          <Preview
            url={url}
            fillType={fillType}
            style={{width: 100, height: 100, background: '#fff', marginBottom: 20, border: '1px solid #ccc'}}
            crop={positionInfo}
          />
        </div>);
      },
    };

    return (
      <div className="kb-activity-create">
        <pre style={{display: 'none'}}>
          {
            JSON.stringify(this.props.form.getFieldsValue(), null, '\t')
          }
        </pre>
        <h2 className="kb-page-title">
          买一送一
          {isFromKb && !this.isEdit && (
            <a
              target="_blank"
              href="https://cstraining.alipay.com/mobile/dingdingkb/articleDetail.htm?__nc=0&articleId=10095&tntInstId=KOUBEI_SALE_TRAINING"
              style={{ fontSize: '14px', float: 'right', fontWeight: '200', paddingRight: '20px' }}
            >
              <Icon type="info-circle" style={{ color: '#2db7f5' }} /> 小贴士：如何获得更多返佣？
            </a>
          )}
        </h2>
        <div className="kb-detail-main">
          <Breadcrumb separator=">">
            <Breadcrumb.Item><a href="/goods/itempromo/activityManageV2.htm">通用营销工具</a></Breadcrumb.Item>
            <Breadcrumb.Item>买一送一</Breadcrumb.Item>
          </Breadcrumb>
          <div className="detail-wrap">
            <div className="form-wrap">
              {
                window.APP.isProvider === 'true' && window.__fd_commission_data && window.__fd_commission_data.show ?
                  <Alert message={<span>{window.__fd_commission_data.message}<a href={window.__fd_commission_data.link} target="_blank">点击查看详情</a></span>} type="info" showIcon />
                  :
                  null
              }
              <Form horizontal onSubmit={this.handleSubmit} form={this.props.form}>
                {/* 活动基本信息 start */}
                <div className="title-split">
                  <span>活动基本信息</span>
                </div>
                <FormItem label="活动类型：" {...layout} required>
                  <Input type="hidden" {...typeProps} />
                  <p>买一送一（买A送A）</p>
                  <p style={{lineHeight: 1.5}}>购买同一SKU的A商品2件时，可以免付1件A，支持设置其他如买二送一、买三送一等优惠力度活动</p>
                </FormItem>
                <FormItem label="活动时间：" {...layout} required
                  help={getFieldError('startTime') || getFieldError('endTime')}
                  validateStatus={
                    classnames({
                      error: !!(getFieldError('startTime') || getFieldError('endTime')),
                    })
                  }
                >
                  <DatePicker {...startTimeProps} showTime format="yyyy-MM-dd HH:mm" placeholder="开始时间"
                    disabledDate={dateLaterThanToday} disabled={isDisabled} />
                  <span style={{ margin: '0 5px', color: '#ccc' }}>－</span>
                  <DatePicker {...endTimeProps} showTime format="yyyy-MM-dd HH:mm" placeholder="结束时间"
                    disabledDate={dateLaterThanToday} />
                </FormItem>
                <FormItem label="适用门店：" {...layout} required>
                  <SelectShops actityType="buyGive"
                  selectedShops={initData.selectedShops}
                  form={this.props.form}
                  canReduce={!isCampaignStart}
                  isEdit={this.isEdit}
                  shopUrl={shopUrl} {...getFieldProps('shopList', {
                    initialValue: initData.selectedShops,
                    rules: [
                            { validator: (rule, value, callback) => {
                              if (value === undefined || value.length === 0) {
                                callback('至少选择一家门店');
                                return;
                              }
                              callback();
                            }},
                    ],
                  })}/>
                </FormItem>
                {/* 活动基本信息 end */}

                {/* 活动商品设置 start */}
                <div className="title-split">
                  <span>活动商品设置</span>
                </div>
                <FormItem label="优惠力度：" {...layout} required
                  help={getFieldError('sendRules.buyCnt') || getFieldError('sendRules.sendCnt')}
                  validateStatus={
                    classnames({
                      error: !!(getFieldError('sendRules.buyCnt') || getFieldError('sendRules.sendCnt')),
                    })
                  }
                >
                  <span style={{paddingRight: '10px'}}>同一件SKU商品买</span>
                  <InputNumber {...minimumAmountProps} disabled={isDisabled} min={1} max={9999} step="1" />
                  <span style={{paddingRight: '10px'}}>件，送</span>
                  <InputNumber {...sendNumProps} disabled min={1} max={9999} step="1" />
                  <span>件</span>
                </FormItem>
                <FormItem label="品牌名称：" {...layout} required>
                  <BrandName {...brandNameProps} placeholder="请输入品牌名称" />
                </FormItem>
                <FormItem label="品牌logo：" {...layout} required
                  help={getFieldError('vouchers.voucherLogoArr')}
                  validateStatus={
                    classnames({
                      error: !!getFieldError('vouchers.voucherLogoArr'),
                    })
                  }
                >
                  <div className="clearfix">
                    <UploadCropPic {...brandLogoProps} {...logoUploadOption} />
                  </div>
                  <p className="tip">
                    请上传1张品牌logo，大小不超过2M，格式：bmp, png, jpeg, jpg, gif<br />
                    <a href="#" onClick={this.showLogoPreviewModal}>查看图片用在哪？</a>
                  </p>
                </FormItem>
                <FormItem label="活动商品名称：" {...layout} required>
                  <Input {...itemNameProps} placeholder="如，莫斯利安酸奶，20字以内" />
                </FormItem>
                <FormItem label="商品SKU编码：" {...layout} required>
                  <Goods {...goodsIdsProps} />
                  <p style={{lineHeight: 1.5}}>若输入多个商品编码，多个商品均会享受优惠，请按<span style={{color: '#f50'}}>回车键</span>进行间隔</p>
                </FormItem>
                <FormItem label="活动商品详情：" {...layout} required>
                  <Input {...itemDetailProps} type="textarea" placeholder="商品内容简介，如“买1件海飞丝去屑护肤洗发水清爽去油型200ml，送1件海飞丝去屑护肤洗发水清爽去油型200ml”，120字以内" />
                </FormItem>
                <FormItem label="活动商品图片：" {...layout} required
                  help={getFieldError('vouchers.voucherImgArr') || getFieldError('vouchers.itemDetailImgOne') || getFieldError('vouchers.itemDetailImgTwo')}
                  validateStatus={
                    classnames({
                      error: !!(getFieldError('vouchers.voucherImgArr') || getFieldError('vouchers.itemDetailImgOne') || getFieldError('vouchers.itemDetailImgTwo')),
                    })
                  }
                >
                  <div className="clearfix">
                    <div style={{display: 'inline-block', verticalAlign: 'top'}}>
                      <UploadCropPic {...firstBrandLogoProps} {...paperUploadOption} uploadText="商品封面图" aspectRatio={[924, 380]} />
                    </div>
                    <div style={{display: 'inline-block', verticalAlign: 'top'}}>
                      <UploaderClip {...secondBrandLogoProps} uploadText="商品详情图" />
                    </div>
                    <div style={{display: 'inline-block', verticalAlign: 'top'}}>
                      <UploaderClip {...thirdBrandLogoProps} uploadText="商品详情图" />
                    </div>
                  </div>
                  <p className="tip">
                    请至少上传1张商品封面图，单张大小不超过2M，格式: bmp, png, jpeg, jpg, gif<br />
                    <a href="#" onClick={this.showCoverPreviewModal}>查看图片用在哪？</a>
                  </p>
                </FormItem>
                <FormItem label="更多商品详情：" {...layout}>
                  <Input {...goodsDetailLinkProps} placeholder="包含商品介绍的链接，如：http://www.alipay.com"/>
                </FormItem>
                {/* 活动商品设置 end */}

                {/* 活动规则设置 start */}
                <div className="title-split">
                  <span>活动规则设置</span>
                </div>
                <FormItem label="1笔订单最多几件商品享受优惠：" {...layout} required
                  help={getFieldValue('switch.totalLimit') === 'limit' && getFieldError('itemDiscountRule.totalLimitCnt')}
                  validateStatus={
                    classnames({
                      error: getFieldValue('switch.totalLimit') === 'limit' &&
                        (getFieldError('itemDiscountRule.totalLimitCnt') || (getFieldValue('sendRules.limitCnt') && getFieldError('sendRules.limitCnt'))),
                    })
                  }
                >
                  <Row>
                    <Col span="7">
                      <Select {...totalLimitProps} disabled={isDisabled} style={{ width: 120 }} placeholder="请选择">
                        <Option value="nolimit">不限制</Option>
                        <Option value="limit">限制</Option>
                      </Select>
                    </Col>
                    <Col span="17">
                      {
                        getFieldValue('switch.totalLimit') === 'limit' &&
                        <div style={{ marginLeft: 10, display: 'inline-block' }}>
                          <InputNumber {...totalLimitCntProps} min={1} max={9999} step="1" disabled={isDisabled} /> 件商品
                        </div>
                      }
                    </Col>
                  </Row>
                </FormItem>
                <FormItem label="1笔订单同一SKU商品最多送几件" {...layout} required
                  help={getFieldValue('switch.singleLimit') === 'limit' && getFieldError('sendRules.limitCnt')}
                  validateStatus={
                    classnames({
                      error: getFieldValue('switch.singleLimit') === 'limit' && !!getFieldError('sendRules.limitCnt'),
                    })
                  }
                >
                  <Row>
                    <Col span="7">
                      <Select {...singleLimitProps} style={{ width: 120 }} placeholder="请选择" disabled={isDisabled}>
                        <Option value="nolimit">不限制</Option>
                        <Option value="limit">限制</Option>
                      </Select>
                    </Col>
                    <Col span="17">
                      {
                        getFieldValue('switch.singleLimit') === 'limit' &&
                        <div style={{ marginLeft: 10, display: 'inline-block' }}>
                          <InputNumber {...limitCntProps} min={1} max={9999} step="1" disabled={isDisabled} /> 件商品
                        </div>
                      }
                    </Col>
                  </Row>
                </FormItem>
                <FormItem label="券是否需要领取：" {...layout} required>
                  <RadioGroup {...needReceiveProps} disabled={isDisabled}>
                    <Radio key="a" value="REAL_TIME_SEND">不需要领取</Radio>
                    <Radio key="b" value="DIRECT_SEND">需要领取</Radio>
                  </RadioGroup>
                </FormItem>
                {
                  getFieldValue('type') === 'DIRECT_SEND' ?
                  <FormItem
                    label="是否可以转赠："
                    {...layout}>
                    {actionType === 'edit' ? <p className="ant-form-text">{initData['vouchers.donateFlag'] === '1' ? '是' : '否'}</p> :
                    <RadioGroup {...getFieldProps('vouchers.donateFlag', {
                      rules: [{
                        required: true,
                        message: '是否可以转赠为必选项',
                      }],
                    })}>
                      <Radio value="1">是</Radio>
                      <Radio value="0">否</Radio>
                    </RadioGroup>}
                  </FormItem> : null
                }
                {
                  getFieldValue('type') === 'REAL_TIME_SEND' ?
                    <div>
                      <FormItem label="活动期间每人累计可参与几次：" {...layout} required
                        help={getFieldValue('switch.joinLimit') === 'limit' && getFieldError('participateLimited')}
                        validateStatus={
                          classnames({
                            error: getFieldValue('switch.joinLimit') === 'limit' &&
                              (getFieldError('participateLimited') || (getFieldValue('dayParticipateLimited') && getFieldError('dayParticipateLimited'))),
                          })
                        }
                      >
                        <Row>
                          <Col span="7">
                            <Select {...joinLimitProps} style={{ width: 120 }} placeholder="请选择"
                              disabled={isDisabled && initData['switch.joinLimit'] === 'nolimit'}
                            >
                              <Option value="nolimit">不限制</Option>
                              <Option value="limit">限制</Option>
                            </Select>
                          </Col>
                          <Col span="17">
                            {
                              getFieldValue('switch.joinLimit') === 'limit' &&
                              <div style={{ marginLeft: 10, display: 'inline-block' }}>
                                <InputNumber {...joinLimitCountProps} min={1} max={9999} step="1"/> 次/人
                              </div>
                            }
                          </Col>
                        </Row>
                      </FormItem>
                      <FormItem label="活动期间每人每天可参与几次：" {...layout} required
                        help={getFieldValue('switch.dayJoinLimit') === 'limit' && getFieldError('dayParticipateLimited')}
                        validateStatus={
                          classnames({
                            error: getFieldValue('switch.dayJoinLimit') === 'limit' && (getFieldError('switch.dayJoinLimit') || getFieldError('dayParticipateLimited')),
                          })
                        }
                      >
                        <Row>
                          <Col span="7">
                            <Select {...dayJoinLimitProps} style={{ width: 120 }} defaultValue="limit" placeholder="请选择"
                              disabled={isDisabled && initData['switch.dayJoinLimit'] === 'nolimit'}
                            >
                              <Option value="nolimit">不限制</Option>
                              <Option value="limit">限制</Option>
                            </Select>
                          </Col>
                          <Col span="17">
                            {
                              getFieldValue('switch.dayJoinLimit') === 'limit' &&
                              <div style={{ marginLeft: 10, display: 'inline-block' }}>
                                <InputNumber {...dayJoinLimitCountProps} min={1} max={9999} step="1"/> 次/人/日
                              </div>
                            }
                          </Col>
                        </Row>
                      </FormItem>
                    </div>
                      :
                    <div>
                      <FormItem label="活动期间每人累计可领券几张：" {...layout} required
                        help={getFieldError('participateLimited')}
                        validateStatus={
                          classnames({
                            error: getFieldError('participateLimited') || getFieldError('switch.dayJoinLimit') || getFieldError('dayParticipateLimited'),
                          })
                        }
                      >
                        <Row>
                          <Col span="7">
                            <Select {...joinLimitProps} style={{ width: 120 }} placeholder="请选择"
                              disabled={isDisabled && initData['switch.joinLimit'] === 'nolimit'}
                            >
                              <Option value="nolimit">不限制</Option>
                              <Option value="limit">限制</Option>
                            </Select>
                          </Col>
                          <Col span="17">
                            {
                              getFieldValue('switch.joinLimit') === 'limit' &&
                              <div style={{ marginLeft: 10, display: 'inline-block' }}>
                                <InputNumber {...joinLimitCountProps} min={1} max={9999} step="1"/> 张/人
                              </div>
                            }
                          </Col>
                        </Row>
                      </FormItem>
                      <FormItem label="活动期间每人每天可领券几张：" {...layout} required
                        help={getFieldError('switch.dayJoinLimit') || getFieldError('dayParticipateLimited')}
                        validateStatus={
                          classnames({
                            error: getFieldError('switch.dayJoinLimit') || getFieldError('dayParticipateLimited'),
                          })
                        }
                      >
                        <Row>
                          <Col span="7">
                            <Select {...dayJoinLimitProps} style={{ width: 120 }} defaultValue="limit" placeholder="请选择"
                              disabled={isDisabled && initData['switch.dayJoinLimit'] === 'nolimit'}
                            >
                              <Option value="nolimit">不限制</Option>
                              <Option value="limit">限制</Option>
                            </Select>
                          </Col>
                          <Col span="17">
                            {
                              getFieldValue('switch.dayJoinLimit') === 'limit' &&
                              <div style={{ marginLeft: 10, display: 'inline-block' }}>
                                <InputNumber {...dayJoinLimitCountProps} min={1} max={9999} step="1"/> 张/人/日
                              </div>
                            }
                          </Col>
                        </Row>
                      </FormItem>
                      <FormItem label="券有效期：" {...layout} required>
                        <Col span="7">
                          <Select {...validTimeTypeProps} style={{ width: 120 }} placeholder="请选择" size="large"
                            disabled={isDisabled}
                          >
                            <Option value="RELATIVE">相对时间</Option>
                            <Option value="FIXED">指定时间</Option>
                          </Select>
                        </Col>
                        <Col span="17">
                          { getFieldValue('vouchers.validTimeType') === 'RELATIVE' ?
                            <FormItem style={{ marginBottom: 0 }}
                              help={getFieldError('vouchers.validPeriod')}
                              validateStatus={
                                classnames({
                                  error: !!getFieldError('vouchers.validPeriod'),
                                })
                              }
                            >
                              领取后 <InputNumber {...validPeriodProps} min={1} max={365} /> 日内有效
                            </FormItem>
                            :
                            <FormItem style={{ marginBottom: 0 }}
                              help={getFieldError('vouchers.validTimeFrom') || getFieldError('vouchers.validTimeTo')}
                              validateStatus={
                                classnames({
                                  error: !!(getFieldError('vouchers.validTimeFrom') || getFieldError('vouchers.validTimeTo')),
                                })
                              }
                            >
                              <DatePicker {...validTimeFromProps} showTime format="yyyy-MM-dd HH:mm" disabledDate={dateLaterThanToday} placeholder="开始时间"
                                style={{ width: 140 }} disabled={isDisabled} />
                              <span style={{ margin: '0 5px', color: '#ccc' }}>－</span>
                              <DatePicker {...validTimeToProps} showTime format="yyyy-MM-dd HH:mm" disabledDate={dateLaterThanToday} placeholder="结束时间"
                                style={{ width: 140 }}/>
                            </FormItem>
                          }
                        </Col>
                      </FormItem>
                    </div>
                }
                <div>
                  <FormItem label="发放总量：" {...layout} required>
                    <Col span="7">
                      <Select {...sendAmountLimitedProps} style={{ width: 120 }} defaultValue="limit" placeholder="请选择"
                        disabled={isDisabled && initData['switch.sendAmountLimited'] === 'nolimit'}
                      >
                        <Option value="nolimit">不限制</Option>
                        <Option value="limit">设定总数</Option>
                      </Select>
                    </Col>
                    <Col span="17">
                      {
                        getFieldValue('switch.sendAmountLimited') === 'limit' &&
                        <FormItem style={{ marginLeft: 10, display: 'inline-block' }}
                          help={getFieldError('vouchers.budgetAmount')}
                          validateStatus={
                            classnames({
                              error: !!getFieldError('vouchers.budgetAmount'),
                            })
                          }
                        >
                          <span style={{marginRight: 10}}>最多发放</span>
                          <InputNumber {...sendAmountProps} min={1} max={999999998} step="1"/> 张
                        </FormItem>
                      }
                    </Col>
                  </FormItem>
                  <FormItem label="使用说明：" {...layout}>
                    <InputAddable {...descListProps} placeholder="请输入使用说明，100字以内" />
                  </FormItem>
                </div>
                {/* 活动规则设置 end */}

                <FormItem wrapperCol={{ span: 16, offset: 7 }}>
                  <Button type="primary" htmlType="submit" loading={!this.state.canSubmit}>
                    提 交
                  </Button>
                  { actionType === 'create' &&
                    <p>
                      <Icon type="info-circle" style={{color: '#2db7f5'}} /> 提交活动时可同时创建测试活动
                    </p>
                  }
                  </FormItem>
              </Form>
            </div>
            <Simulator form={this.props.form} />
          </div>
        </div>
        <Modal
          style={{top: modalTop}}
          visible={this.state.confirmModal}
          title="提交确认"
          onCancel={() => {this.setState({confirmModal: false});}}
          footer={[
            <Button key="back" type="primary" size="large" loading={!this.state.canSubmit} onClick={this.handleComfirmSubmit}>仅创建正式活动</Button>,
            <Button key="submit" type="ghost" size="large" onClick={this.showTestModal}>
              同时创建正式活动和测试活动
            </Button>,
          ]}
        >
          <div style={{padding: '10px 20px', fontSize: 14}}>
            <p>您可以在提交正式活动时同时创建一个当前可用的测试活动用于测试，测试活动仅白名单可见</p>
          </div>
        </Modal>
        <Modal style={{top: modalTop}} title="同时创建正式活动和测试活动" visible={this.state.copyModalVisible}
          onCancel={() => {this.setState({copyModalVisible: false});}}
          footer={[
            <Button key="back" type="primary" size="large" loading={!this.state.canSubmit} onClick={this.handleCopyModalOk}>确认</Button>,
            <Button key="submit" type="ghost" size="large" onClick={() => {this.setState({copyModalVisible: false});}}>
             取消
            </Button>,
          ]}
        >
          <p style={{color: '#999'}}>
            提交成功后，将同时生成测试活动，测试活动不影响正式上架的活动，且仅对白名单内的用户可见
            &nbsp;&nbsp;<a href="/goods/itempromo/testList.htm" target="_blank">配置白名单</a>
          </p>
          <div style={{padding: '10px 20px', fontSize: 14}}>
            <p>
              <Icon type="info-circle" style={{color: '#2db7f5'}} />  测试相关信息
            </p>
            <br />
            <p>
              测试开始时间：{moment().format('YYYY-MM-DD 00:00')}<br />
              测试结束时间：{moment().add(testConfig.testDays, 'day').format('YYYY-MM-DD 23:59')}
            </p>
            <br />
            <p>
              券库存：{getFieldValue('vouchers.shopList') && getFieldValue('vouchers.shopList').length * 10}<br />
              券有效期：领取后{testConfig.voucherRelativeDays}天内有效
            </p>
            <br />
            <p>
              测试方法：使用测试名单的账号打开支付宝客户端，在活动店铺的页面领取优惠并验证核销
            </p>
          </div>

          <p style={{color: '#999'}}>
            您可以在活动管理页面查看测试活动的详情
          </p>
        </Modal>
        <Modal
          width="900"
          style={{top: modalTop}}
          visible={this.state.coverPreviewModal}
          title="图片在支付宝口碑中的展示位置"
          onCancel={() => {this.setState({coverPreviewModal: false});}}
          footer={null}
        >
          <div className="preview-flex">
            <div>
              <h5>商品封面图 | <span className="span-pos">展示在券详情页</span></h5>
              <img src="https://zos.alipayobjects.com/rmsportal/xqCqqCqZgXMZVaAfJQnC.png" width="250" alt=""/>
            </div>
            <div>
              <h5>商品封面图 | <span className="span-pos">展示在店铺详情页</span></h5>
              <img src="https://zos.alipayobjects.com/rmsportal/tyInQdEknMUJeWQXTAIA.png" width="250" alt=""/>
            </div>
            <div>
              <h5>商品详情图 | <span className="span-pos">展示在券详情的商品详情页</span></h5>
              <img src="https://zos.alipayobjects.com/rmsportal/hCmhSxhRjEFOJBbFmxac.png" width="250" alt=""/>
            </div>
          </div>
        </Modal>
        <Modal
          width="340"
          style={{top: modalTop}}
          visible={this.state.logoPreviewModal}
          title="图片在支付宝口碑中的展示位置"
          onCancel={() => {this.setState({logoPreviewModal: false});}}
          footer={null}
        >
          <div className="preview-flex">
            <div>
              <h5>品牌logo图 | <span className="span-pos">展示在卡包页</span></h5>
              <img src="https://zos.alipayobjects.com/rmsportal/FUOxuBzlqAderEQNGkLQ.png" width="270" alt=""/>
            </div>
          </div>
        </Modal>
        <Modal
          style={{top: modalTop}}
          visible={this.state.errorModal}
          title="提示"
          onCancel={() => {this.setState({errorModal: false});}}
          footer={[
            <Button key="back" type="primary" size="large" onClick={ () => {this.setState({errorModal: false});}}>确定</Button>,
          ]}
        >
          <div style={{padding: '10px 20px', fontSize: 14}}>
            <div style={{float: 'left', marginRight: 10, marginTop: 10}}>
              <Icon type="cross-circle" style={{color: 'red', fontSize: 24}} />
            </div>
            <p>{this.state.errorTitle}</p>
            <p style={{color: '#999', fontSize: 12}}>{this.state.errorContent}</p>
          </div>
        </Modal>
      </div>
    );
  },
});

export default Form.create()(BuyGive);
