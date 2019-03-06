import React, {PropTypes} from 'react';
import {Form, Radio, Input, Button, Modal, Alert, Checkbox, message} from 'antd';
import ajax from '../../../../common/ajax';
import { keepSession, customLocation } from '../../../../common/utils';
import OnlineTimeItem from '../common/OnlineTimeItem';
// import InputAddable from '../../../../common/InputAddable';
import moment from 'moment';
// import classnames from 'classnames';
import {getShopIds} from '../../common/coupon/util';
import ValidTimeFormItem from '../common/ValidTimeFormItem';
// import SelectShops from '../../../../common/SelectShops/indexs';
import SelectShops from '../common/shopTab/ShopTab';
import ConsumeSimulator from './ConsumeSimulator';
import LimitInvolve from '../common/LimitInvolve';
import AvailableTimeFormItem from '../common/AvailableTimeFormItem';
import UseInfo from '../common/UseInfo';
import OtherRules from './OtherRules';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
// const Option = Select.Option;
// const fixFrameHeightDebounced = debounce(fixFrameHeight, 200);
const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 16},
};

// const PayChannels = [
//   {
//     value: 'USE_NO_LIMIT',
//     label: '不限制',
//   },
//   {
//     value: 'USE_ON_CURRENT_PAY_CHANNEL',
//     label: '限储值卡付款可享',
//   },
//   {
//     value: 'NOT_ALLOWED_USE',
//     label: '储值卡付款不可享',
//   },
// ];

const SingleTemplateCreate = React.createClass({
  propTypes: {
    initData: PropTypes.object,
    allData: PropTypes.object,
    actionType: PropTypes.string,
    form: PropTypes.object,
    renderType: PropTypes.func,
    getList: PropTypes.func,
  },

  getInitialState() {
    this.data = {};
    const node = document.getElementById('J_isFromKbServ');
    this.isFromKb = node && node.value === 'true';
    const {initData} = this.props;
    return {
      isEdit: initData && initData.templateNo ? false : true,
      isRetail: '',
      validateStatus: {},
      loading: true,
      canSubmit: true,
      showCityShopModel: false,
      initData: this.props.initData,
      relationList: [],
    };
  },

  componentWillMount() {
    const fieldsValue = {
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
      'type': 'DIRECT_SEND',
      'validTimeType': 'RELATIVE',
      'effectType': '0',
      'allowUseUserGroup': '0', // 初始化的时候默认设置使用人群限制为全部用户
      'donateFlag': '1', // 是否可转赠标识1是 0否
    };
    this.props.form.setFieldsInitialValue(fieldsValue);
    keepSession();
    if (this.props.initData.templateNo) {
      this.getTemplateRelation();
    }
  },

  componentDidUpdate(prevProps) {
    if (this.props.initData !== prevProps.initData) {
      this.editInitData(this.props.initData.templateNo);
      if (this.props.initData.templateNo) {
        this.getTemplateRelation();
      }
    }
  },

  onCancel() {
    const {initData: data} = this.props;
    if (data && data.templateNo) {
      this.renderCancel();
    } else {
      this.props.renderType();
    }
  },

  getIsRetail(isRetail) {
    this.setState({
      isRetail,
    });
  },

  getTemplateRelation() {
    ajax({
      method: 'get',
      url: window.APP.kbretailprod + '/gateway.htm?biz=supermarket.retailer&action=/templateRelation/query',
      data: {
        data: JSON.stringify({templateNo: this.props.initData.templateNo}),
      },
      success: (res) => {
        this.setState({
          relationList: res.templateRelationModelList,
        });
      },
    });
  },

  editInitData(id) {
    const {initData} = this.props;
    this.setState({
      initData: id ? initData : {},
      isEdit: initData && initData.templateNo ? false : true,
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
    const {couponValue, validTime, voucherNote, brandName, multiUseMode, budgetAmount, addedBudgetAmount, effectType, validTimeType, validPeriod, forbiddenDateType, limitRule} = data;
    const vouchers = {couponValue, validTimeType, voucherNote, brandName, budgetAmount: addedBudgetAmount ? Number(budgetAmount) + addedBudgetAmount : budgetAmount, effectType, voucherName: name, vouchersType: 'MONEY', descList: []};

    // 选取门店信息
    const shopType = data.shopIds.shopType;
    if (shopType === 'select') {
      const newShopIds = data.shopIds.checked;
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
      const times = data.timeKeys.map(key => { return {'values': data[`activeTimeWeek${key}`].join(','), times: `${this.timeToStr(data[`activeTimeStart${key}`], 'HH:mm')},${this.timeToStr(data[`activeTimeEnd${key}`], 'HH:mm')}` }; });
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
    this.handleSubmit('submit');
  },

  handleSubmit(submitType) {
    // this.props.renderType();
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
      if (!!error) {
        return;
      }
      let url;
      if (this.props.initData && this.props.initData.templateNo) {
        url = window.APP.kbretailprod + '/gateway.htm?biz=supermarket.retailer&action=/template/modify';
      } else {
        url = window.APP.kbretailprod + '/gateway.htm?biz=supermarket.retailer&action=/template/create';
      }

      // 券可用时段
      if (values.availableTimeType === '2') {
        const times = values.timeKeys.map(key => { return {'values': values[`activeTimeWeek${key}`].join(','), times: `${this.timeToStr(values[`activeTimeStart${key}`], 'HH:mm')},${this.timeToStr(values[`activeTimeEnd${key}`], 'HH:mm')}` }; });
        if (times.length === 1) {
          values.availableTimes = times;
        } else {
          values.multipAvailableTime = true;
          values.availableTimes = times;
        }
      }
      const postData = {
        submitType,
        bsnParams: {
          itemDiscountType: values.itemDiscountType,
          startTime: this.timeToStr(values.startTime, 'YYYY-MM-DD HH:mm'),
          endTime: this.timeToStr(values.endTime, 'YYYY-MM-DD HH:mm'),
          useMode: values.useMode,
          useModeType: values.useMode,
          descList: values.descList && values.descList.join(':-)'),
          receiveLimited: values.receiveLimited && String(values.receiveLimited),
          dayReceiveLimited: values.dayReceiveLimited && String(values.dayReceiveLimited),
          donateFlag: values.useMode === '0' && values.donateFlag,
          payChannel: values.payChannel || 'USE_NO_LIMIT',
          validPeriod: values.useMode === '0' ? String(values.validPeriod) : '',
          validTimeType: values.useMode === '0' ? values.validTimeType : '',
          validTimeFrom: values.validTimeType === 'FIXED' && this.timeToStr(values.validTime[0], 'YYYY-MM-DD HH:mm'),
          validTimeTo: values.validTimeType === 'FIXED' && this.timeToStr(values.validTime[1], 'YYYY-MM-DD HH:mm'),
          availableTimeType: values.availableTimeType,
          availableTimeValues: values.availableTimes,
          renewMode: values.autoDelayFlag ? '1' : '0',
        },
        shopList: values.selecshop,
        templateName: values.templateName,
      };
      if (postData.bsnParams.validTimeType === 'FIXED') {
        delete postData.bsnParams.validPeriod;
      }
      if (postData.bsnParams.useMode === '1') {
        postData.bsnParams.participateLimited = values.receiveLimited && String(values.receiveLimited);
        postData.bsnParams.dayParticipateLimited = values.dayReceiveLimited && String(values.dayReceiveLimited);
        delete postData.bsnParams.receiveLimited;
        delete postData.bsnParams.dayReceiveLimited;
      }
      if (this.props.initData && this.props.initData.templateNo) {
        postData.templateNo = this.props.initData.templateNo;
      }
      this.setState({canSubmit: false});
      ajax({
        method: 'post',
        url,
        data: {
          data: JSON.stringify(postData),
        },
        success: (res) => {
          this.setState({canSubmit: true});
          if (res.success) {
            this.gotoModal();
            message.success(postData.templateNo ? '修改成功' : '提交成功');
            if (postData.templateNo) {
              ajax({
                method: 'get',
                url: window.APP.kbretailprod + '/gateway.htm?biz=supermarket.retailer&action=/template/detail',
                data: {
                  data: JSON.stringify({templateNo: postData.templateNo}),
                },
                success: (items) => {
                  const dataObj = items;
                  const bsnParamsList = JSON.parse(dataObj.bsnParams);
                  if ( bsnParamsList.descList.indexOf(':-)') > 0) {
                    bsnParamsList.descList = bsnParamsList.descList.split(':-)');
                  } else {
                    bsnParamsList.descList = [ bsnParamsList.descList];
                  }
                  dataObj.bsnParams = bsnParamsList;
                  dataObj.shopList = JSON.parse(dataObj.shopList);
                  dataObj.addClass = true;
                  this.setState({initData: dataObj, isEdit: false});
                },
              });
              this.props.getList(postData.templateNo);
            } else {
              this.props.renderType();
              this.props.getList();
            }
          } else {
            this.setState({canSubmit: true});
            this.props.form.validateFieldsAndScroll();
            this.gotoModal();
            message.error( res.resultMsg || res.errorMsg || '提交失败');
          }
        },
        error: (data) => {
          this.setState({canSubmit: true});
          this.props.form.validateFieldsAndScroll();
          this.gotoModal();
          message.error( data.resultMsg || data.errorMsg || '提交失败');
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

  changeType(e) {
    if (e.target.value === '1') { // 当选择无需用户领取时 是否转赠默认值是0
      this.props.form.setFieldsValue({donateFlag: '0'});
    } else {
      this.props.form.setFieldsValue({donateFlag: '0', allowUseUserGroup: '0'});
    }
  },
  shopsNumber() {
    const { initData } = this.state;
    const index = [];
    if (initData.shopList) {
      initData.shopList.map((p) => {
        p.shops.map((s) => {
          index.push(s.id);
        });
      });
    }
    return index.length;
  },
  showCityShop() {
    this.setState({
      showCityShopModel: true,
    });
  },
  renderCancel() {
    this.setState({
      isEdit: false,
    });
  },
  /* eslint-disable complexity */
  render() {
    /* eslint-disable complexity */
    const {isEdit, initData: data, relationList} = this.state;
    const {form} = this.props;
    const {getFieldProps, getFieldValue, validateFields} = form;
    const autoDelayProps = getFieldProps('autoDelayFlag', {
      initialValue: (data.bsnParams && data.bsnParams.renewMode === '1') ? true : false,
      valuePropName: 'checked',
    });
    let availableTimeList;
    if (data.bsnParams && data.bsnParams.availableTimeValues) {
      availableTimeList = (data.bsnParams && data.bsnParams.availableTimeValues).map((item) => {
        const weeks = item.values.split(',');
        const date = item.times.split(',');
        return (<span style={{marginLeft: 5}}>{`${weeks.map(week => ({
          '1': '周一', '2': '周二', '3': '周三', '4': '周四', '5': '周五', '6': '周六', '7': '周日',
        }[week])).join('、')} ${date[0]} ~ ${date[1]}`}</span>);
      });
    }
    return (<div>
        <div className="kb-detail-main" style={{overflow: 'hidden'}}>
          <div style={{marginTop: '32px'}}>
            <ConsumeSimulator type={getFieldValue('itemDiscountType') || (data.bsnParams && data.bsnParams.itemDiscountType)}/>
            <div style={{float: 'left', width: '630px'}}>
              {!data.templateNo && <div style={{marginLeft: 30}}>
                <Alert message="单品券活动模板"
                  description={"请填写单品券活动以下规则以制作模板"}
                  type="info"
                  showIcon
                />
              </div>}
              <div className="title-split">
                <span>活动模板信息</span>
              </div>
              {!isEdit ? <div className="kb-detail-template">
                <i className="anticon anticon-edit" onClick={() => { this.setState({isEdit: true});}}><span>编辑</span></i>
                <p>单品券活动</p>
                <div>券种类：{data.bsnParams && data.bsnParams.itemDiscountType === 'MONEY' ? '代金券' : '折扣券'}</div>
                <div>适用门店：<a onClick={this.showCityShop}>{this.shopsNumber()}个门店</a></div>
                <Modal title={'券适用门店'}
                       visible={this.state.showCityShopModel}
                       onCancel={() => {
                         this.setState({showCityShopModel: false});
                       }}
                       footer={[]}>
                  <div className="check-shop-list">
                    {
                      data.shopList && data.shopList.map((shopItem, key) => {
                        return (
                        <dl key={key}>
                          <dt>{shopItem.cityName}</dt>
                          {
                            shopItem.shops.map((shop, i) => {
                              return (
                              <dd key={i}>{shop.name}</dd>
                                );
                            })
                          }
                        </dl>
                        );
                      })
                    }
                  </div>
                </Modal>
                <div>上架时间：{data.bsnParams && data.bsnParams.startTime}~{data.bsnParams && data.bsnParams.endTime}</div>
                <div>使用方式：{data.bsnParams && data.bsnParams.useMode === '0' ? '需要用户领取' : '无需用户领取'}</div>
                {
                  data.bsnParams && data.bsnParams.validTimeType === 'FIXED' ?
                  <div>券有效期：{data.bsnParams && data.bsnParams.validTimeFrom}~{data.bsnParams && data.bsnParams.validTimeTo}</div> :
                  <div>券有效期：领取后{data.bsnParams && data.bsnParams.validPeriod}日内有效</div>
                }
                {
                  data.bsnParams && data.bsnParams.useMode === '0' ? [
                    (<div>领取限制：{data.bsnParams && data.bsnParams.receiveLimited && data.bsnParams.receiveLimited !== 'undefined' ? data.bsnParams.receiveLimited + '张/人' : '不限制'}</div>),
                    (<div>每日领取限制：{data.bsnParams && data.bsnParams.dayReceiveLimited && data.bsnParams.dayReceiveLimited !== 'undefined' ? data.bsnParams.dayReceiveLimited + '张/人/日' : '不限制'}</div>),
                  ] : [
                    (<div>参与限制：{data.bsnParams && data.bsnParams.participateLimited && data.bsnParams.participateLimited !== 'undefined' ? data.bsnParams.participateLimited + ' 次/人 ' : '不限制'}</div>),
                    (<div>每日参与限制：{data.bsnParams && data.bsnParams.dayParticipateLimited && data.bsnParams.participateLimited !== 'undefined' ? data.bsnParams.dayParticipateLimited + '次/人/日' : '不限制'}</div>),
                  ]
                }
                {(data.bsnParams && data.bsnParams.availableTimeValues) && <div>使用时段：{availableTimeList}</div>}
                {(data.bsnParams && data.bsnParams.renewMode === '1') && <div>自动续期：<Checkbox defaultChecked disabled>自动延长券上架时间</Checkbox></div>}
                {data.bsnParams && data.bsnParams.useMode === '0' && <div>是否可以转赠：{data.bsnParams && data.bsnParams.donateFlag === '1' ? '是' : '否'}</div>}
                {data.bsnParams && data.bsnParams.birthDateFrom && <div>指定生日日期：{data.bsnParams.birthDateFrom}~{data.bsnParams.birthDateTo}</div>}
                {/* <div>支付渠道限制：{PayChannels.map((p) => {return p.value === (data.bsnParams && data.bsnParams.payChannel) && <span>{p.label}</span>; })}</div> */}
                <div>使用须知：{data.bsnParams && data.bsnParams.descList && data.bsnParams.descList.join(',')}</div>
              </div> :
                <Form horizontal form={form} className="market_vouchers_form">
                  <FormItem
                    label="模版名称："
                    {...formItemLayout}>
                    <Input {...getFieldProps('templateName', {
                      initialValue: data && data.templateName,
                      rules: [{
                        required: true,
                        message: '此处必填',
                      }],
                    })}/>
                  </FormItem>
                  <FormItem
                    label="活动类型："
                    {...formItemLayout} required>
                    <RadioGroup {...getFieldProps('itemDiscountType', {
                      initialValue: (data.bsnParams && data.bsnParams.itemDiscountType) ? data.bsnParams.itemDiscountType : 'MONEY',
                    })}>
                      <Radio value="MONEY">单品代金券</Radio>
                      <Radio value="RATE">单品折扣券</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem
                    label="活动门店："
                    required
                    {...formItemLayout} required>
                    <SelectShops form={this.props.form} selectedShops={(data && data.shopList) ? data.shopList : []} {...getFieldProps('shopIds', {
                      initialValue: (data && data.shopList) ? data.shopList : [],
                      rules: [this.checkShop],
                    })}/>
                  </FormItem>
                  <OnlineTimeItem form={form} initData={data} end={3} />
                  <FormItem
                    label="使用方式："
                    {...formItemLayout} required>
                    <RadioGroup {...getFieldProps('useMode', {
                      initialValue: data.bsnParams && data.bsnParams.useMode ? data.bsnParams.useMode : '0',
                      onChange: this.changeType,
                    })}>
                      <Radio value="0">需要用户领取</Radio>
                      <Radio value="1">无需用户领取</Radio>
                    </RadioGroup>
                  </FormItem>
                  <div style={{display: getFieldValue('useMode') !== '1' ? 'block' : 'none'}}>
                    <ValidTimeFormItem form={form} initData={data} checkAppend={() => {
                      if (getFieldValue('useMode') !== '1') {
                        validateFields(['effectType'], {force: true});
                      }
                    }} data={{activityTime: [getFieldValue('startTime'), getFieldValue('endTime')], validTime: [moment(data.bsnParams && data.bsnParams.validTimeFrom).toDate(), moment(data.bsnParams && data.bsnParams.validTimeTo).toDate()]}} />
                  </div>
                  {
                    getFieldValue('useMode') === '0' ?
                    <FormItem
                      label="是否可以转赠："
                      {...formItemLayout}>
                      <RadioGroup {...getFieldProps('donateFlag', {
                        initialValue: data.bsnParams && data.bsnParams.donateFlag ? data.bsnParams.donateFlag : '0',
                        rules: [{
                          required: true,
                          message: '是否可以转赠为必选项',
                        }],
                      })}>
                        <Radio value="1">是</Radio>
                        <Radio value="0">否</Radio>
                      </RadioGroup>
                    </FormItem> : null
                  }
                  <LimitInvolve layout={formItemLayout} {...this.props} initData={this.state.initData} campType={getFieldValue('useMode') === '0' ? 'realtime' : 'common'} />
                  <AvailableTimeFormItem form={form} data={data} max={5} />
                  { (getFieldValue('validTimeType') === 'FIXED' && getFieldValue('useMode') === '0') ? null : <FormItem
                    label="自动续期："
                    extra={'上架时间结束时，若券未送完，则自动延期，每次延期30天'}
                    {...formItemLayout}>
                    <label className="ant-checkbox-vertical"><Checkbox {...autoDelayProps}>自动延长券上架时间</Checkbox></label>
                  </FormItem>}
                  {/* <FormItem
                    label="支付渠道限制："
                    required
                    {...formItemLayout}>
                    <Select {...getFieldProps('payChannel', {
                      rules: [{
                        required: true,
                        message: '此处必填',
                      }],
                      initialValue: data.bsnParams && data.bsnParams.payChannel ? data.bsnParams.payChannel : 'USE_NO_LIMIT',
                    })}>
                      {PayChannels.map(p => <Option key={p.value} value={p.value}>{p.label}</Option>)}
                    </Select>
                  </FormItem>*/}

                  <UseInfo layout={formItemLayout} {...this.props} max={6} />
                  <FormItem wrapperCol={{span: 12, offset: 6}}>
                    <Button type="primary" onClick={() => {this.testModal(); }} loading={!this.state.canSubmit}>{ (this.state.isEdit && data.templateNo) ? '修改模版' : '创建模版'}</Button>
                    <Button type="ghost" onClick={this.onCancel} style={{marginLeft: 20}}>取消</Button>
                  </FormItem>
                </Form>
              }
              {
                (data && data.templateNo && !this.state.isEdit) && [
                  (<div className="title-split">
                    <span>商品信息配置</span>
                  </div>),
                  (<OtherRules {...this.props} isEdit={this.state.isEdit} initData={this.state.initData} getQuery={this.getTemplateRelation}/>)
                ]
              }
            </div>
          </div>
        </div>

        {(data.templateNo && relationList && relationList.length > 0) && <div style={{border: '1px solid #eee'}}>
          <p className="kb-table-title">最近创建活动<a href="/goods/itempromo/index.htm">去活动管理列表查看 ></a></p>
          <div className="kb-table-list">
            {
              relationList.map((item) => {
                return (
                  <div style={{width: '46%', display: 'inline-block', borderBottom: '1px solid #ddd', paddingBottom: '5px', margin: '0 2%', cursor: 'pointer'}} onClick={() => {window.location.href = '/goods/itempromo/detail.htm?itemId=' + item.activityId;}}>
                    <img src="https://gw.alipayobjects.com/zos/rmsportal/UrydqsHSGfRgLZXTMHxp.png" style={{verticalAlign: 'top'}}/>
                    <span style={{display: 'inline-block', marginTop: '4px', fontSize: '14px', marginLeft: '5px', color: '#000'}}>{item.activityName}</span>
                    <span style={{display: 'inline-block', marginTop: '4px', fontSize: '14px', float: 'right'}}>{item.gmtCreate}</span>
                  </div>);
              })
            }
          </div>
        </div>}
      </div>
    );
  },
});

export default Form.create()(SingleTemplateCreate);
