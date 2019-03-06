import React, {PropTypes} from 'react';
import {Form, Radio, Checkbox, InputNumber, Input, Button, Breadcrumb, Icon, Modal, Select, DatePicker} from 'antd';
import { DayAvailableNum } from '@alipay/xform';
import { debounce } from 'lodash';
import ajax from '../../../common/ajax';
import { keepSession, customLocation, fixFrameHeight } from '../../../common/utils';
import ConsumeSimulator from './ConsumeSimulator';
import OnlineTimeItem from '../Exchange/items/OnlineTimeItem';
import AvailableTimeFormItem from '../common/coupon/AvailableTimeFormItem';
import ValidTimeFormItem from '../common/coupon/ValidTimeFormItem';
import BudgetAmountFormItem from '../common/coupon/BudgetAmountFormItem';
import UseConditionFormItem from '../common/coupon/UseConditionFormItem';
import BrandName from '../../../common/BrandName';
import InputAddable from '../../../common/InputAddable';
import DeliveryChannels from '../../MemberMarketing/common/DeliveryChannels/index';
import ForbiddenDateFormItem from '../common/coupon/ForbiddenDateFormItem';
import PhotoPicker from '../../../common/PhotoPicker';
import moment from 'moment';
import classnames from 'classnames';
import './index.less';
import {getShopIds} from '../common/coupon/util';
import SelectShops from '../../../common/SelectShops/indexs';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const fixFrameHeightDebounced = debounce(fixFrameHeight, 200);
const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 16},
};

const PayChannels = [
  {
    value: 'USE_NO_LIMIT',
    label: '不限制',
  },
  {
    value: 'USE_ON_CURRENT_PAY_CHANNEL',
    label: '限储值卡付款可享',
  },
  {
    value: 'NOT_ALLOWED_USE',
    label: '储值卡付款不可享',
  },
];

const VouchersCreate = React.createClass({
  propTypes: {
    initData: PropTypes.object,
    allData: PropTypes.object,
    actionType: PropTypes.string,
    form: PropTypes.object,
  },

  getInitialState() {
    this.isEdit = !!this.props.params.id;
    this.data = {};
    const node = document.getElementById('J_isFromKbServ');
    this.isFromKb = node && node.value === 'true';
    const {initData} = this.props;
    return {
      isRetail: '',
      validateStatus: {},
      loading: true,
      canSubmit: true,
      isCampaignStart: initData && initData.campaignStart ? true : false,   // 活动是否已开始
    };
  },

  componentWillMount() {
    const {initData} = this.props;
    let fieldsValue = {
      startTime: moment(moment().format('YYYY-MM-DD') + ' 00:00', 'YYYY-MM-DD HH:mm').toDate(),
      endTime: moment(moment().add(30, 'days').format('YYYY-MM-DD') + ' 23:59', 'YYYY-MM-DD HH:mm').toDate(),
      'forbiddenDateKeys': [0],
      'forbiddenDateType': '1',
      'descListKeys': [0],
      'timeKeys': [0],
      'validTime': [
        moment(moment().format('YYYY-MM-DD') + ' 00:00', 'YYYY-MM-DD HH:mm').toDate(),
        moment(moment().add(3, 'months').format('YYYY-MM-DD') + ' 23:59', 'YYYY-MM-DD HH:mm').toDate(),
      ],
      'availableTimeType': '1',
      'validPeriod': 30,
      'budgetAmountType': '1',
      'budgetAmount': 999999999,
      // 'dayAvailableNum': 999999999,
      'type': 'DIRECT_SEND',
      'validTimeType': 'RELATIVE',
      'effectType': '0',
      'conditionsOfUseType': '2', // 初始化的时候默认展示需要设置使用条件
      'allowUseUserGroup': '0', // 初始化的时候默认设置使用人群限制为全部用户
      'donateFlag': '1', // 是否可转赠标识1是 0否
    };
    if (initData) { // 走编辑的逻辑
      const {availableTimes = [], minimumAmount, actived, forbiddenTime, couponValue, shop: shopIds, validTimeFrom, validTimeTo, budgetAmount, dayAvailableNum, brandName, autoDelayFlag, activityType: type, vouchers, dayReceiveLimited, receiveLimited, validPeriod, voucherNote, allowUseUserGroup, donateFlag } = initData;
      const {descList = [], validTimeType, logoFileId, logoFixUrl} = vouchers && vouchers[0];
      if (minimumAmount) {
        fieldsValue.conditionsOfUseType = '2';
        fieldsValue.minConsume = minimumAmount;
      } else { // 当创建全场代金券的时候没有设置使用条件,则在修改的时候就展示为不限制
        fieldsValue.conditionsOfUseType = '1';
      }
      if (allowUseUserGroup) { // 如果编辑状态下有allowUseUserGroup,则set进fieldsValue里
        fieldsValue.allowUseUserGroup = allowUseUserGroup;
      }
      if (donateFlag) { // 在编辑状态下如果后端返回donateFlag则set进fieldsValue里
        fieldsValue.donateFlag = donateFlag;
      }
      if (allowUseUserGroup === '2' && initData.birthDateFrom && initData.birthDateTo) { // 如果是生日用户则 展示生日的日期的日期
        this.setState({
          showBirthDateFrom: initData.birthDateFrom, // 供编辑状态下展示生日用
          showBirthDateTo: initData.birthDateTo,
        });
      }
      // 有效期时间
      if (validTimeTo && validTimeTo) {
        fieldsValue.validTime = [moment(validTimeFrom).toDate(), moment(validTimeTo).toDate()];
      }
      // 发放总量 只有数量没有类型
      if (Number(budgetAmount) < fieldsValue.budgetAmount) {
        fieldsValue.budgetAmountType = '2';
      }
      // 使用说明
      descList.forEach((item, i) => {
        fieldsValue[`descList${i}`] = item;
        if (fieldsValue.descListKeys[i] === undefined) {
          fieldsValue.descListKeys.push(i);
        }
      });
      // 券不可用日期
      if (forbiddenTime) {
        const forbiddenKeys = [];
        forbiddenTime.split('^').forEach((time, i) => {
          const [from, to] = time.split(',');
          fieldsValue[`forbiddenDate${i}`] = [moment(from).toDate(), moment(to).toDate()];
          forbiddenKeys.push(i);
        });
        fieldsValue.forbiddenDateType = '2';
        fieldsValue.forbiddenDateKeys = forbiddenKeys;
      }
      // 券可用时段
      availableTimes.forEach((time, i) => {
        const {times, values} = time;
        if (fieldsValue.timeKeys[i] === undefined) {
          fieldsValue.timeKeys.push(i);
        }
        if (times && values) {
          const days = values.split(',');
          const dayTimes = times.split(',');
          fieldsValue[`activeTimeStart${i}`] = dayTimes[0];
          fieldsValue[`activeTimeEnd${i}`] = dayTimes[1];
          fieldsValue[`activeTimeWeek${i}`] = days;
        }
      });
      if (availableTimes.length) {
        fieldsValue.availableTimeType = '2';
      } else {
        fieldsValue.availableTimeType = '1';
      }
      // 参与限制,若有参与限制，则打开disable
      if (dayReceiveLimited) {
        fieldsValue.dayParticipateLimitedSwitch = true;
      }
      if (receiveLimited) {
        fieldsValue.participateLimitedSwitch = true;
      }
      // 门店处理
      if (shopIds) {
        fieldsValue.shopIds = shopIds.map(shop => { const {id} = shop; return {id, shopId: id}; });
      }
      fieldsValue = {...fieldsValue, couponValue, voucherNote, brandName, dayParticipateLimited: dayReceiveLimited, dayParticipateLimitedMin: dayReceiveLimited, validPeriod, budgetAmount, dayAvailableNum, autoDelayFlag, type, validTimeType, participateLimitedMin: receiveLimited, participateLimited: receiveLimited, effectType: actived ? '1' : '0', voucherLogo: [{id: logoFileId, url: logoFixUrl, thumbUrl: logoFixUrl}] };
    }
    this.props.form.setFieldsInitialValue(fieldsValue);
    keepSession();
  },

  getIsRetail(isRetail) {
    this.setState({
      isRetail,
    });
  },

  timeToStr(date, formate) {
    if (date instanceof Date) {
      return moment(date).format(formate ? formate : 'YYYY-MM-DD HH:mm');
    }
    return date;
  },

  /*eslint-disable */
  transformFormData(data) { // 提交前的数据format

    const name = `${data.brandName}${data.couponValue}元全场代金券`;
    const newData = {campName: name, sendNum: 1}; // 活动名称，数量固定
    /*eslint-enable */
    newData.type = data.type; // 固定，表示全场代金券
    // 上架下架时间
    newData.startTime = this.timeToStr(data.startTime);
    newData.endTime = this.timeToStr(data.endTime);
    // 券值
    const {couponValue, validTime, voucherNote, brandName, multiUseMode, budgetAmount, addedBudgetAmount, voucherLogo, effectType, validTimeType, validPeriod, forbiddenDateType, limitRule} = data;
    const vouchers = {couponValue, validTimeType, voucherNote, brandName, budgetAmount: addedBudgetAmount ? Number(budgetAmount) + addedBudgetAmount : budgetAmount, effectType, voucherLogo: voucherLogo[0].id, voucherName: name, vouchersType: 'MONEY', descList: []};
    // 使用人群限制
    if (data.allowUseUserGroup) {
      newData.allowUseUserGroup = data.allowUseUserGroup;
    }
    // 生日用户
    if (data.allowUseUserGroup === '2' && data.birthDateFrom && data.birthDateTo) {
      newData.birthDateFrom = this.timeToStr(data.birthDateFrom, 'MM-DD');
      newData.birthDateTo = this.timeToStr(data.birthDateTo, 'MM-DD');
    }
    // 选取门店信息
    const shopType = data.shopIds.shopType;
    if (shopType === 'select') {
      const newShopIds = getShopIds(data.shopIds.checked).filter(d => !!d);
      newData.shopIds = newShopIds;
      vouchers.shopIds = newShopIds;
    } else if (shopType === 'upload') {
      newData.logId = data.shopIds.logId;
      vouchers.logId = data.shopIds.logId;
    } else {
      // 默认
      // 场景： 用户修改，追加门店为未打开浮层，
      // 重新组装数据给后端
      const newShopIds = getShopIds(data.shopIds).filter(d => !!d);
      newData.shopIds = newShopIds;
      vouchers.shopIds = newShopIds;
    }
    vouchers.shopType = shopType;
    newData.shopType = shopType;
    // const newShopIds = getShopIds(data.shopIds).filter(d => !!d);
    // newData.shopIds = newShopIds;

     // 是否自动续期
    if (data.autoDelayFlag) {
      newData.autoDelayFlag = 'Y';
    } else {
      newData.autoDelayFlag = 'N';
    }
    // 参与限制
    if (data.dayParticipateLimitedSwitch) {
      newData.dayParticipateLimited = data.dayParticipateLimited;
    }
    if (data.participateLimitedSwitch) {
      newData.participateLimited = data.participateLimited;
    }
    // 每日发放上限
    // 不是老数据才需要提交数据，老数据没有dayAvailableNum.用户无需用户领取时无需提交dayAvailableNum
    if ((!this.isEdit || !isNaN(this.props.initData.dayAvailableNum)) && data.type !== 'REAL_TIME_SEND') {
      if (!data.dayAvailableNum) {
        newData.dayAvailableNum = 999999999;
      } else {
        newData.dayAvailableNum = data.dayAvailableNum;
      }
    }
    // 如果页面传了是否可以转赠则
    if (data.donateFlag) {
      vouchers.donateFlag = data.donateFlag;
    } else {
      // 如果donateFlag没有值传进来说明是不需要领取,则是否可转赠的默认传0(不可转赠)
      vouchers.donateFlag = '0';
    }
    if (!!this.props.params.id) {// 如果是修改的话,把donateFlag删除,即不允许修改
      delete vouchers.donateFlag;
    }
    if (limitRule) {
      vouchers.limitRule = limitRule;
    }
     // 券有效期
    if (validTimeType === 'RELATIVE') {
      vouchers.validPeriod = validPeriod;
    } else if (validTimeType === 'FIXED' && validTime && validTime.length === 2) {
      vouchers.validTimeFrom = this.timeToStr(validTime[0]);
      vouchers.validTimeTo = this.timeToStr(validTime[1]);
      newData.autoDelayFlag = 'N'; // 确认一下这个逻辑
    }
    // 券可用时段
    if (data.availableTimeType === '2') {
      const times = data.timeKeys.map(key => { return {'values': data[`activeTimeWeek${key}`].join(','), times: `${this.timeToStr(data[`activeTimeStart${key}`], 'HH:mm:ss')},${this.timeToStr(data[`activeTimeEnd${key}`], 'HH:mm:ss')}` }; });
      if (times.length === 1) {
        vouchers.availableTime = times[0];
      } else {
        vouchers.multipAvailableTime = true;
        vouchers.availableTimes = times;
      }
    }
    // 使用条件最小限制
    if (data.minConsume) {
      vouchers.minConsume = data.minConsume;
    }
    // 券不可用日期
    if (forbiddenDateType !== '1') {
      const tempForBidden = [];
      data.forbiddenDateKeys.forEach(key => {
        const dataList = data[`forbiddenDate${key}`];
        if (dataList && dataList.length === 2) {
          tempForBidden.push(`${this.timeToStr(dataList[0], 'YYYY-MM-DD')},${this.timeToStr(dataList[1], 'YYYY-MM-DD')}`);
        }
      });
      vouchers.forbiddenDates = tempForBidden.join('^');
    }
    vouchers.descList = data.descListKeys.map(key => data[`descList${key}`]).filter(item => item);
    newData.vouchers = vouchers;
    newData.multiUseMode = multiUseMode;
    return newData;
  },

  gotoModal() {
    const isKbInput = document.getElementById('J_isFromKbServ');
    const parentFrame = isKbInput && isKbInput.value === 'true' && window.parent;
    if (parentFrame) {
      parentFrame.scrollTo(parentFrame.scrollX, 300);
    }
  },

  gotoListPage(e) {
    e.preventDefault();
    return customLocation('/goods/itempromo/activityList.htm');
  },

  testModal() {
    if (this.isEdit) {
      this.handleSubmit('submit');
    } else {
      this.gotoModal();
      Modal.confirm({
        title: '提交确认',
        content: '您可以在提交正式活动时同时创建一个当前可用的测试活动用于测试，测试活动仅白名单可见',
        okText: '仅创建正式活动',
        cancelText: '同时创建正式活动和测试活动',
        width: 500,
        onOk: () => {
          this.handleSubmit('submit');
        },
        onCancel: () => {
          this.handleSubmit('createAndTest');
        },
      });
    }
  },

  handleSubmit(submitType) {
    this.props.form.validateFieldsAndScroll((error, values)=> {
      if (error && values.type === 'REAL_TIME_SEND') {
        delete error.validTimeType;
        delete error.effectType;
        delete values.validTimeType;
        delete values.effectType;
        delete values.validPeriod;
        delete values.validTime;
        values.validTimeType = 'RELATIVE';
        values.validPeriod = 30;
        values.effectType = '0';
      }
      if (values.birthDate instanceof Array) { // 针对RangePicker 做提交校验
        if (values.birthDate[0] === null) {
          this.setState({
            validateStatus: {
              validateStatus: 'error',
              help: '请输入生日开始和结束时间',
            },
          });
          return;
        }
      }
      if (!!error) {
        return;
      }
      let url;
      if (this.isEdit) {
        url = '/goods/itempromo/modifyCampaign.json';
      } else {
        url = '/goods/itempromo/createDiscountCampaign.json';
      }
      if (values.birthDate instanceof Array) {
        values.birthDateFrom = (values.birthDate)[0];
        values.birthDateTo = (values.birthDate)[1];
      }
      delete values.birthDate;

      if (this.isEdit) { // 在编辑状态下 不用传使用人群限制字段(同时如果是生日用户不用传生日日期)
        delete values.allowUseUserGroup;
        if (this.props.initData.multiUseMode) {
          values.multiUseMode = this.props.initData.multiUseMode;
        }
      }
      if (values.type === 'REAL_TIME_SEND') { // 无论是在编辑状态下,还是在新建状态下,只要是无需用户领取的则一律不用传
        delete values.allowUseUserGroup;
      }
      const postData = {
        submitType,
        jsonDataStr: JSON.stringify(this.transformFormData(values)),
      };
      const isKbInput = document.getElementById('J_isFromKbServ');
      const isParentFrame = isKbInput && isKbInput.value === 'true' && window.parent;
      if (this.isEdit) {
        postData.campId = this.props.params.id;
        postData.sourceType = 'ALIPAY';
        postData.sourceChannel = 'CRMHOME';
      }
      if (this.isEdit && isParentFrame) {
        postData.sourceChannel = 'KOUBEI_SALE';
      }
      this.setState({canSubmit: false});
      ajax({
        method: 'post',
        url,
        data: postData,
        success: () => {
          this.setState({canSubmit: true});
          this.gotoModal();
          Modal.success({
            title: '提交成功',
            content: '',
            onOk: () => {
              customLocation('/goods/itempromo/activityList.htm');
            },
          });
        },
        error: (data) => {
          this.setState({canSubmit: true});
          this.props.form.validateFieldsAndScroll();
          this.gotoModal();
          Modal.error({
            title: '提交失败',
            content: data.resultMsg || data.errorMsg || '',
          });
        },
      });
    });
  },

  checkShop(rule, value, callback) {
    if (value === undefined || value.length === 0) {
      callback('至少选择一家门店');
      return;
    }
    callback();
  },

  checkParticipateLimited(rule, value, callback) {
    this.props.form.validateFields(['dayParticipateLimited'], {force: true});
    callback();
  },

  checkDayParticipateLimited(rule, value, callback) {
    const participateLimitedVal = this.props.form.getFieldValue('participateLimited');
    if (value) {
      if (value < 1 || value > 99) {
        callback('输入大于0，小于100的整数');
        return;
      }
    }
    if (participateLimitedVal) {
      if (Number(participateLimitedVal) < 1 || Number(participateLimitedVal) > 99) {
        callback('输入大于0，小于100的整数');
        return;
      }
    }

    if (value && participateLimitedVal) {
      if (Number(value) > Number(participateLimitedVal)) {
        callback('每天参与次数不能大于总共参与次数');
        return;
      }
    }
    if (this.isEdit && this.state.isCampaignStart) {
      if (participateLimitedVal && Number(participateLimitedVal) < this.data.participateLimited) {
        callback('修改时，不能缩减总共参与次数');
        return;
      }
      if (value && Number(value) < this.data.dayParticipateLimited) {
        callback('修改时，不能缩减每天参与次数');
        return;
      }
    }
    callback();
  },

  checkEffectType(rule, value, callback) {
    if (value === '1' && this.props.form.getFieldValue('validTimeType') === 'FIXED') {
      callback('券有效期为指定时间时不能为否');
    }
    callback();
  },

  birthDateChange(value) {
    if (value[0] === null) {
      this.setState({
        validateStatus: {
          validateStatus: 'error',
          help: '请输入生日开始和结束时间',
        },
      });
    } else {
      this.setState({
        validateStatus: {},
      });
    }
  },

  changeType(e) {
    if (e.target.value === 'REAL_TIME_SEND') { // 当选择无需用户领取时 是否转赠默认值是0
      this.props.form.setFieldsValue({donateFlag: '0'});
    } else {
      this.props.form.setFieldsValue({donateFlag: '1'});
    }
  },

  changeAllowUseUserGroup(value) { // 当选择的是全部用户是 是否转赠默认值是1,其他为0
    if (value !== '0') { // 0是全部
      this.props.form.setFieldsValue({donateFlag: '0'});
    } else {
      this.props.form.setFieldsValue({donateFlag: '1'});
    }
  },

  /* eslint-disable complexity */
  render() { // isCampaignStart 活动是否开始 isEdit 是否在编辑状态
    /* eslint-disable complexity */
    fixFrameHeightDebounced();
    const {isCampaignStart, showBirthDateFrom, showBirthDateTo, isRetail} = this.state;
    const {form, initData: data} = this.props;
    const {getFieldProps, getFieldValue, getFieldError, validateFields} = form;
    const txtInputCls = {width: '67px', marginLeft: '5px', marginRight: '5px'};
    const isEdit = this.isEdit;
    const isOnline = isEdit && isCampaignStart;
    const isKbInput = document.getElementById('J_isFromKbServ');
    const isParentFrame = isKbInput && isKbInput.value === 'true' && window.parent;
    let shopUrl;
    if (isEdit) {
      shopUrl = '/goods/itempromo/getShopsByCityForNewCamp.json?campId=' + this.props.params.id;
    }
    const autoDelayProps = getFieldProps('autoDelayFlag', {
      valuePropName: 'checked',
      initialValue: !isEdit ? true : data.autoDelayFlag === 'Y',
    });
    const isFromKb = this.isFromKb;
    // window.f = this.props.form;
    return (<div>
        {!(isFromKb || isEdit) && <div className="app-detail-header">通用营销工具</div>}
        {isFromKb && !isEdit && (
          <div className="app-detail-header" style={{ textAlign: 'right' }}>
            <a
              href="https://cstraining.alipay.com/mobile/dingdingkb/articleDetail.htm?__nc=0&articleId=10093&tntInstId=KOUBEI_SALE_TRAINING"
              target="_blank"
            >
              <Icon type="info-circle" style={{ color: '#2db7f5' }} /> 小贴士：如何获得更多返佣？
            </a>
          </div>
        )}
        <div className="kb-detail-main" style={{overflow: 'hidden'}}>
          {!(isFromKb || isEdit) && <Breadcrumb>
            <Breadcrumb.Item style={{fontSize: '14px', color: '#0ae'}}>
              <a onClick={this.gotoListPage}><Icon type="circle-o-left" />通用营销工具</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item style={{fontSize: '14px'}}>全场优惠</Breadcrumb.Item>
          </Breadcrumb>}
          <div style={{marginTop: '32px'}}>
            <ConsumeSimulator/>
            <div style={{float: 'left', width: '600px'}}>
              { isEdit || isParentFrame ?
                 null : <div>
                  <ul className="custom-tab fn-clear">
                      <li type="money"><a href="/goods/itempromo/create.htm">全场折扣券</a></li>
                      <li className="selected" ><a>全场代金券</a></li>
                  </ul>
                </div> }
              <Form horizontal form={form} className="market_vouchers_form">
                <FormItem
                  label="券面额："
                  required
                  validateStatus={classnames({error: !!getFieldError('couponValue')})}
                  help={getFieldError('couponValue')}
                  {...formItemLayout}>
                  {isEdit && <p className="ant-form-text">{getFieldValue('couponValue')}元</p>}
                  {!isEdit && <InputNumber min={0.01} max={49999.99} step={0.01} size="large" {...getFieldProps('couponValue', {
                    validateFirst: true,
                    rules: [{
                      required: true,
                      message: '此处必填',
                      type: 'number',
                    }],
                  })}/>}
                  {!isEdit && <span className="ant-form-text">元</span>}
                </FormItem>
                <FormItem
                  label="活动门店："
                  required
                  {...formItemLayout} >
                  <SelectShops form={this.props.form} selectedShops={data && data.cityShop ? data.cityShop : []} canReduce={!isCampaignStart} isEdit={isEdit} shopUrl={shopUrl} {...getFieldProps('shopIds', {
                    initialValue: data && data.cityShop ? data.cityShop : [],
                    rules: [this.checkShop],
                  })}/>
                </FormItem>
                <FormItem
                  label="参与限制："
                  {...formItemLayout}
                  validateStatus={classnames({error: !!getFieldError('dayParticipateLimited')})}
                  help={getFieldError('dayParticipateLimited')}>
                  { isOnline ?
                    <label className="ant-checkbox-vertical">
                    {getFieldValue('participateLimitedMin') ? <div>
                      限定每个用户总共参与
                    <InputNumber {...getFieldProps('participateLimited', {
                      rules: [this.checkParticipateLimited],
                    })} min={getFieldValue('participateLimitedMin')} step={1} style={txtInputCls} />次
                    </div> : '每天参与次数不限'}
                  </label> :
                  <label className="ant-checkbox-vertical">
                    <Checkbox {...getFieldProps('participateLimitedSwitch', {
                      valuePropName: 'checked',
                    })}/>限定每个用户总共参与
                    <InputNumber {...getFieldProps('participateLimited', {
                      rules: [this.checkParticipateLimited],
                    })} min={1} step={1} style={txtInputCls} disabled={!getFieldValue('participateLimitedSwitch')}/>次
                  </label>}

                  { isOnline ?
                    <label className="ant-checkbox-vertical">
                    {getFieldValue('dayParticipateLimitedMin') ? <div>
                      限定每个用户每天参与
                    <InputNumber {...getFieldProps('dayParticipateLimited', {
                      rules: [this.checkDayParticipateLimited],
                    })} min={getFieldValue('dayParticipateLimitedMin')} step={1} style={txtInputCls} />次
                    </div> : '每天参与次数不限'}
                  </label> :
                  <label className="ant-checkbox-vertical">
                    <Checkbox {...getFieldProps('dayParticipateLimitedSwitch', {
                      valuePropName: 'checked',
                    })}/>限定每个用户每天参与
                    <InputNumber {...getFieldProps('dayParticipateLimited', {
                      rules: [this.checkDayParticipateLimited],
                    })} min={1} step={1} style={txtInputCls} disabled={!getFieldValue('dayParticipateLimitedSwitch')}/>次
                  </label>}
                </FormItem>
                <BudgetAmountFormItem form={form} isEdit={isEdit} isCampaignStart={isCampaignStart} data={{budgetAmount: data && data.budgetAmount ? Number(data.budgetAmount) : 0}} />

                {getFieldValue('type') !== 'REAL_TIME_SEND' && (isEdit ? (!isNaN(data.dayAvailableNum) && <FormItem
                  label="每日发放上限"
                  required
                  validateDayAvailableNum
                  {...formItemLayout}>
                  <p className="ant-form-text">{(!getFieldValue('dayAvailableNum') || +getFieldValue('dayAvailableNum') === 999999999) ? '总量不限' : getFieldValue('dayAvailableNum')}</p>
                </FormItem>) : <DayAvailableNum
                  {...formItemLayout}
                  required
                />)}

                <OnlineTimeItem form={form} isOnline={(getFieldValue('type') === 'REAL_TIME_SEND' && isEdit) || isOnline} initialData={data} end={3} />
                <FormItem
                  label="使用方式："
                  {...formItemLayout} required>
                  {isEdit ? <p className="ant-form-text">{getFieldValue('type') === 'REAL_TIME_SEND' ? '无需用户领取' : '需要用户领取'}</p> :
                  <RadioGroup {...getFieldProps('type', {
                    onChange: this.changeType,
                  })}>
                    <Radio value="DIRECT_SEND">需要用户领取</Radio>
                    <Radio value="REAL_TIME_SEND">无需用户领取</Radio>
                  </RadioGroup>}
                </FormItem>
                <div style={{display: getFieldValue('type') !== 'REAL_TIME_SEND' ? 'block' : 'none'}}>
                  <ValidTimeFormItem form={form} isEdit={isEdit} isCampaignStart={isCampaignStart} checkAppend={() => {
                    if (getFieldValue('type') !== 'REAL_TIME_SEND') {
                      validateFields(['effectType'], {force: true});
                    }
                  }} data={{activityTime: [getFieldValue('startTime'), getFieldValue('endTime')], validTime: [moment(data && data.validTimeFrom).toDate(), moment(data && data.validTimeTo).toDate()]}} />
                </div>
                {/** 不可使用日期forbiddenDateType没默认返回  全场代金券编辑的时候，不可切换不可用日期类型（不限制--指定时段） **/}
                <ForbiddenDateFormItem disabled={getFieldValue('type') === 'REAL_TIME_SEND'} disableTypeChange={isEdit} form={form} isEdit={isEdit} isCampaignStart={isCampaignStart} data={{forbiddenDate: data && data.forbiddenTime ? data.forbiddenTime.split('^').map(dates => dates.split(',')) : [], forbiddenDateType: data && data.forbiddenTime ? '2' : '1'}}/>
                <div style={{display: getFieldValue('validTimeType') === 'RELATIVE' || getFieldValue('type') === 'REAL_TIME_SEND' ? 'block' : 'none'}}>
                  <FormItem
                    label="自动续期："
                    extra={isOnline ? '' : '上架时间结束时，若券未送完，则自动延期，每次延期30天'}
                    {...formItemLayout}>
                    {isOnline ? <p className="ant-form-text">{data.autoDelayFlag === 'Y' ? '是' : '否'}</p> :
                    <label className="ant-checkbox-vertical"><Checkbox {...autoDelayProps}>自动延长券上架时间</Checkbox></label>}
                  </FormItem>
                </div>
                <AvailableTimeFormItem disableTypeChange={isEdit} form={form} isEdit={isEdit} isCampaignStart={isCampaignStart} data={data} max={5} />
                {/** 使用条件conditionsOfUseType没默认返回 **/}
                <UseConditionFormItem form={form} isEdit={isEdit} isCampaignStart={isCampaignStart} data={{conditionsOfUseType: data && data.minimumAmount ? '2' : '1', 'minConsume': data && data.minimumAmount ? data.minimumAmount : ''}} min={getFieldValue('couponValue')} minMessage="最低消费需大于等于券面额" />
                <FormItem
                  label="品牌名称："
                  {...formItemLayout}>
                  <BrandName getIsRetail={this.getIsRetail} {...getFieldProps('brandName', {rules: [{
                    required: true,
                    message: '此处必填',
                  }]})} />
                </FormItem>
                <FormItem
                  label="券logo："
                  required
                  extra={<div style={{lineHeight: 1.5}}>建议：优先使用商家logo或品牌logo，不超过2M。格式：bmp，png，jpeg，gif。建议为尺寸不小于500px＊500px的等边矩形</div>}
                  {...formItemLayout}>
                  <PhotoPicker {...getFieldProps('voucherLogo', {
                    rules: [{
                      required: true,
                      message: '此处必填',
                      type: 'array',
                    }, {
                      max: 1,
                      message: '仅支持上传一张',
                      type: 'array',
                    }],
                  }) } />
                </FormItem>

                {
                  isRetail && <FormItem
                    label="是否与其他单品优惠叠加："
                    {...formItemLayout} >
                    {isEdit ? <p className="ant-form-text">{data.multiUseMode === 'MULTI_USE_WITH_SINGLE' ? '叠加' : '不叠加'}</p> :
                      <RadioGroup {...getFieldProps('multiUseMode', {
                        initialValue: 'NO_MULTI',
                        rules: [{
                          required: true,
                          message: '此处必填',
                        }],
                      })}>
                        <Radio value="NO_MULTI">不叠加</Radio>
                        <Radio value="MULTI_USE_WITH_SINGLE">叠加</Radio>
                      </RadioGroup>}
                  </FormItem>
                }

                {/** 使用人群限制 **/}
                <div style={{display: getFieldValue('type') === 'DIRECT_SEND' ? 'block' : 'none' }}>
                  <FormItem
                    label="领取人群限制："
                    {...formItemLayout}>
                    <Select disabled={isEdit} {...getFieldProps('allowUseUserGroup', {
                      onChange: this.changeAllowUseUserGroup,
                      rules: [{
                        required: true,
                        message: '此处必填',
                      }],
                    })}>
                      <Option key="0">全部用户</Option>
                      <Option key="3">新客用户</Option>
                      <Option key="2">生日用户</Option>
                    </Select>
                  </FormItem>
                </div>
                {/** 生日用户专有 **/}
                <div style={{display: (getFieldValue('type') === 'DIRECT_SEND' && getFieldValue('allowUseUserGroup') === '2') ? 'block' : 'none' }}>
                  <FormItem
                    label="指定生日日期："
                    {...this.state.validateStatus}
                    {...formItemLayout}>
                    {
                      isEdit ? <span>{showBirthDateFrom} ~ {showBirthDateTo} 日期范围内用户可享</span> :
                      <div>
                        <RangePicker {...getFieldProps('birthDate', {
                          onChange: this.birthDateChange,
                          rules: [{
                            required: getFieldValue('allowUseUserGroup') === '2' ? true : false,
                            message: '请输入生日开始和结束时间',
                          }],
                        })}
                        format="MM-dd" allowClear />
                        <p style={{height: '20px'}}>若填写<span style={{color: '#ff8208'}}>12月1日~12月1日</span>，则<span style={{color: '#ff8208'}}>12月1日生日</span>的用户可享</p>
                        <p style={{height: '20px'}}>若填写<span style={{color: '#ff8208'}}>12月1日~12月15日</span>，则<span style={{color: '#ff8208'}}>12月1日~12月15日生日</span>的用户可享</p>
                        <p style={{width: '430px'}}>若填写<span style={{color: '#ff8208'}}>12月1日~3月1日</span>，则<span style={{color: '#ff8208'}}>12月1日-12月31日</span>和<span style={{color: '#ff8208'}}>1月1日~3月1日生日</span>的用户可享</p>
                      </div>
                    }
                  </FormItem>
                </div>
                {
                  ((isEdit && data.limitRule) || !isEdit) &&
                    <FormItem
                      label="支付渠道限制："
                      required
                      {...formItemLayout}>
                      <Select disabled={isEdit} {...getFieldProps('limitRule', {
                        rules: [{
                          required: true,
                          message: '此处必填',
                        }],
                        initialValue: isEdit ? data.limitRule : 'USE_NO_LIMIT',
                      })}>
                        {PayChannels.map(p => <Option key={p.value} value={p.value}>{p.label}</Option>)}
                      </Select>
                    </FormItem>
                }
                {
                  getFieldValue('type') === 'DIRECT_SEND' ?
                  <FormItem
                    label="是否可以转赠："
                    {...formItemLayout}>
                    {isEdit ? <p className="ant-form-text">{data.donateFlag === '1' ? '是' : '否'}</p> :
                    <RadioGroup {...getFieldProps('donateFlag', {
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

                <FormItem
                  label="备注："
                  {...formItemLayout}>
                  {isOnline ? <p className="ant-form-text">{getFieldValue('voucherNote')}</p> :
                  <Input placeholder="用于收银系统识别本券，详情请咨询技术支持" disabled={isEdit} {...getFieldProps('voucherNote', {
                    validateFirst: true,
                    rules: [{
                      required: false,
                      message: '此处必填',
                    }, {
                      max: 50,
                      message: '限50个字',
                    }],
                  })}/>}
                </FormItem>
                <FormItem label="使用说明：" {...formItemLayout}>
                  <InputAddable placeholder="请输入使用说明，100字以内" form={form} prefix="descList" />
                </FormItem>
                <DeliveryChannels discountForm={{deliveryChannels: []}} />
                <FormItem wrapperCol={{span: 12, offset: 6}}>
                  <Button type="primary" onClick={() => {this.testModal(); }} loading={!this.state.canSubmit}>提交</Button>
                </FormItem>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default Form.create()(VouchersCreate);
