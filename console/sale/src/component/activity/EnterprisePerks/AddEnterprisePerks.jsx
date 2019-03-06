import React, {PropTypes} from 'react';
import {Form, Input, Select, Button, InputNumber, DatePicker, message, Checkbox, Modal} from 'antd';
import classnames from 'classnames';
import ajax from 'Utility/ajax';
import moment from 'moment';
import { appendOwnerUrlIfDev } from '../../../common/utils';
import SelectShop from './SelectShop';
import BrandName from './BrandName';
import InputAddable from './InputAddable';
import './enterprisePerks.less';
import groupBy from 'lodash/groupBy';

// 时间组件不可选问题
import GregorianCalendar from 'gregorian-calendar';
import zhCn from 'gregorian-calendar/lib/locale/zh_CN';

const FormItem = Form.Item;
const Option = Select.Option;

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14 },
};

const AddEnterprisePerks = React.createClass({
  propTypes: {
    form: PropTypes.object,
  },

  getInitialState() {
    return {
      MerOptions: [], // 获取商户下拉选
      BrandOptions: [], // 品牌名称下拉选
      shopIds: '', // 可选门店ids
      startValue: null,
      endValue: null,

      merchantId: '', // 商户Id

      enterpriseList: [], // 企业列表
      campList: [], // 餐别列表
      enterpriseDistricts: [],

      newEnterPriseList: {},
      enterpriseName: '', // 企业
      crowdGroupId: '', // 企业ID
      crowdGroupName: '',

      campType: '', // 餐别
      shareGroupId: '', // 餐别ID
      worthValue: '', // 优惠金额
      useTimes: [],
      isAmountSplitSupport: false, // 是否可拆分使用

      FundPoodOptions: [], // 资金池下拉选
      fundPoodData: {}, // 资金池关联的数据 包括资金池余额
      fundPoodBalance: '', // 资金池余额
      fundPoodActivityTime: '', // 资金池有效期

      loading: false, // 防重复提交
    };
  },

  componentWillMount() {
    this.getInitialData();
    // 获取资金池下拉选数据
    this.getFundPoodOptionData();
  },

  getInitialData() {
    ajax({
      url: appendOwnerUrlIfDev('/sale/enterpriseBenefitInit.json'),
      method: 'get',
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          const data = res.data;
          const { MerOptions } = this.state;
          // 获取商户下拉选 MerOptions
          const shopConfigs = data.shopConfigs;
          this.showConfigs = data.shopConfigs;
          if (shopConfigs && shopConfigs.length > 0) {
            for (let i = 0; i < shopConfigs.length; i++) {
              MerOptions.push(<Option key= {shopConfigs[i].partnerId}>{shopConfigs[i].partnerName}</Option>);
            }
          }

          // 通过 enterpriseName 进行分组
          const newEnterPriseList = groupBy(data.enterprises, 'enterpriseName');

          this.setState({
            enterpriseDistricts: [{
              name: data.cityName,
            }],
            MerOptions: MerOptions,
            newEnterPriseList: newEnterPriseList,
            enterpriseList: data.enterprises,
            campList: data.ruleConfigs,
          });
        }
      },
      error: () => {
        message.error('初始化数据失败', 3);
      },
    });
  },

  // 拼接资金池下拉选 并且保存资金池关联的数据
  getFundPoodOptionData() {
    ajax({
      url: appendOwnerUrlIfDev('/sale/capitalpool/query.json'),
      method: 'post',
      type: 'json',
      data: {
        pageNum: 1,
        pageSize: 1000,
        status: 'NORMAL',
      },
      success: (res) => {
        if (res.status === 'succeed') {
          let data = res.data.vos;
          // 前端先过滤一下INIT状态的资金池
          data = data.filter(item => item.poolId);

          // 资金池下拉选 保存资金池关联的数据{23412423:{balance: 223}}
          if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              this.fixTooDeepAlarmAmount(data[i]);
            }
          }
        }
      },
      error: () => {
        message.error('获取资金池数据失败', 3);
      },
    });
  },

  // 获取资金池balance
  getFundPoodBalance(poolId) {
    const {fundPoodData} = this.state;
    this.setState({
      fundPoodBalance: fundPoodData[poolId].balance,
      fundPoodStartTime: fundPoodData[poolId].startTime,
      fundPoodEndTime: fundPoodData[poolId].endTime,
    });
  },

  fixTooDeepAlarmAmount(item) {
    const { FundPoodOptions, fundPoodData } = this.state;
    if (item) { // alarmAmount 预警金额
      const tamp = {};
      tamp.balance = item.balance;
      tamp.startTime = item.startTime;
      tamp.endTime = item.endTime;
      tamp.alarmAmount = item.alarmAmount;
      tamp.invalidAmount = item.invalidAmount;
      fundPoodData[item.poolId] = tamp;
      FundPoodOptions.push(<Option key= {item.poolId}>{item.poolName} | {item.poolId}</Option>);
    }
  },

  // 当选择商户时,获取品牌的下拉选数据  拼接品牌名称下拉选
  merchantSelect(partnerId) {
    // 更新可选门店参数
    const selectShop = this.showConfigs.find(item => {
      return item.partnerId === partnerId;
    });

    if (selectShop) {
      this.setState({
        shopIds: selectShop.shopIds.join(','),
      });
    }

    this.setState({
      merchantId: partnerId,
    });

    // 获取对应可选品牌名称列表
    ajax({
      url: appendOwnerUrlIfDev('/sale/queryShopName.json'),
      method: 'post',
      type: 'json',
      data: {partnerId},
      success: (res) => {
        if (res.status === 'succeed') {
          const data = res.data;
          // 品牌下拉选
          const optionObj = [];
          if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              optionObj.push(<Option key= {data[i]}>{data[i]}</Option>);
            }
          }
          this.setState({
            BrandOptions: optionObj,
          });
        }
      },
      error: () => {
        message.error('获取品牌名称数据失败', 3);
      },
    });
  },

  // 当选择福利企业 加载福利类型下拉选的数据
  enterSelect(enterpriseName, e) {
    this.props.form.resetFields(['campType']);
    const selectEnterprise = e.props['data-item'];

    this.setState({
      crowdGroupId: selectEnterprise.crowdGroupId,
      enterpriseName: enterpriseName,
      crowdGroupName: selectEnterprise.crowdGroupName,
      departmentName: '', // 重置福利部门
      campList: [],
      campType: '', // 重置餐别
      shareGroupId: '', // 重置餐别ID
      worthValue: '', // 重置优惠金额
      useTimes: [], // 重置使用时间
      isAmountSplitSupport: false, // 是否可拆分使用
    });
  },

  // 选择福利部门
  departmentSelect(department, e) {
    const data = e.props['data-item'];
    this.setState({
      campList: data.ruleConfigs || [],
      campType: '', // 重置餐别
      shareGroupId: '', // 重置餐别ID
      worthValue: '', // 重置优惠金额
      useTimes: [], // 重置使用时间
    });
  },

  // 当选择福利类型时 加载优惠金额 和 shareGroupId 的数据
  campTypeSelect(campType) {
    const { campList } = this.state;
    const selectedCamp = campList.find(item => item.campType === campType);

    this.setState({
      campType: campType,
      shareGroupId: selectedCamp.shareGroupId,
      worthValue: selectedCamp.worthValue,
      useTimes: selectedCamp.useTimeConfigs,
      isAmountSplitSupport: selectedCamp.isAmountSplitSupport,
    });
  },

  beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
  },

  handlePreview(file) {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  },

  handleChange({ fileList }) {
    this.setState({ fileList });
  },

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.submit(() => {
      this.props.form.validateFields((errors, values)=> {
        const {crowdGroupId, worthValue, shareGroupId, useTimes, enterpriseName, isAmountSplitSupport} = this.state;
        if (!errors) {
          let params;
          params = values;
          params.startTime = moment(values.startTime).format('YYYY-MM-DD HH:mm:ss');
          params.endTime = moment(values.endTime).format('YYYY-MM-DD HH:mm:ss');
          params.recruitEndTime = moment(values.recruitEndTime).format('YYYY-MM-DD HH:mm:ss');
          params.recruitStartTime = moment().format('YYYY-MM-DD HH:mm:ss'); // 默认当前时间
          params.crowdGroupId = crowdGroupId;
          params.worthValue = worthValue;
          params.shareGroupId = shareGroupId;
          params.useTimes = useTimes;
          params.suitShops = params.suitShops.map(item => item.shopId);
          params.logo = 'd0hkbDYJQOumq4XEoxsGQQAAACMAAQQD'; // 品牌logo不需要上传，取默认值
          params.enterpriseName = enterpriseName;
          params.isAmountSplitSupport = isAmountSplitSupport;

          this.setState({
            loading: true,
          });

          ajax({
            url: appendOwnerUrlIfDev('/sale/enterpriseBenefitCreate.json') + '?_ts=' + new Date().getTime(),
            method: 'post',
            type: 'json',
            data: {
              jsonDataStr: JSON.stringify(params),
            },
            success: (res) => {
              if (res.status === 'succeed') {
                message.success('创建成功');
                location.hash = '/activity/enterpriseperks/list';
              } else {
                this.setState({
                  loading: false,
                });
                message.error(res.resultMsg, 3);
              }
            },
            error: (res) => {
              this.setState({
                loading: false,
              });
              message.error(res.resultMsg, 3);
            },
          });
        }
      });
    });
  },

  // 资金池未设置预警和失效金额校验
  validateFundPood(rule, value, callback) {
    const {getFieldValue, getFieldError, validateFields} = this.props.form;
    const {fundPoodData} = this.state;
    if (typeof value !== 'undefined') {
      const fundItem = fundPoodData[value];

      if (typeof fundItem.alarmAmount === 'undefined' || typeof fundItem.invalidAmount === 'undefined') {
        callback(new Error('该资金池未设置预警和失效金额'));
        return;
      }

      if (fundItem && ((+fundItem.balance <= +fundItem.alarmAmount) || (+fundItem.balance <= +fundItem.invalidAmount))) {
        callback(new Error('该资金池余额低于失效金额或预警金额，请立即充值'));
        return;
      }

      // 所选的活动时间再资金池有效期内
      const fundPoodStartTime = new Date(fundPoodData[value].startTime.replace(/-/g, '/'));
      const fundPoodEndTime = new Date(fundPoodData[value].endTime.replace(/-/g, '/'));
      const startTime = getFieldValue('startTime');
      const endTime = getFieldValue('endTime');

      if (typeof startTime !== 'undefined') {
        const tmpFSTime = (typeof startTime === 'object') ? startTime : new Date(startTime.replace(/-/g, '/'));
        if (moment(tmpFSTime).clone().subtract(1, 'hours').isBefore(moment(fundPoodStartTime))) {
          callback(new Error(`活动时间必须在资金池有效期内，且活动起止时间至少与资金池起止时间相差1小时`));
          return;
        }
      }

      if (typeof endTime !== 'undefined') {
        const tmpFETime = (typeof endTime === 'object') ? endTime : new Date(endTime.replace(/-/g, '/'));
        if (moment(tmpFETime).clone().add(1, 'hours').isAfter(moment(fundPoodEndTime))) {
          callback(new Error(`活动时间必须在资金池有效期内，且活动起止时间至少与资金池起止时间相差1小时`));
          return;
        }
      }

      // 下面这段代码估计作用不大
      if (getFieldError('startTime')) {
        validateFields(['startTime'], {force: true});
      }
      if (getFieldError('endTime')) {
        validateFields(['endTime'], {force: true});
      }
    }
    callback();
  },

  // 验证商户确认截止时间在活动开始时间之前,在当前时间之后
  validateRecruitEndTime(rule, value, callback) {
    const {getFieldValue, getFieldError, validateFields } = this.props.form;
    // 获取活动开始时间
    const startTime = getFieldValue('startTime');
    if (typeof value !== 'undefined' && typeof startTime !== 'undefined') {
      const tmpStartTime = (typeof startTime === 'object') ? startTime : new Date(startTime.replace(/-/g, '/'));
      const valueTime = (typeof value === 'object') ? value : new Date(value.replace(/-/g, '/'));
      if (!moment(valueTime).isBefore(moment(tmpStartTime))) {
        callback(new Error(`商户确认截止时间必须在活动开始之前`));
        return;
      }
      const today = moment();
      if (!today.isBefore(value)) {
        callback(new Error(`商户确认截止时间必须晚于当前时间`));
        return;
      }
      if (getFieldError('startTime')) {
        validateFields(['startTime'], {force: true});
      }
    }
    callback();
  },

  render() {
    const { crowdGroupName, BrandOptions, fundPoodBalance, FundPoodOptions, MerOptions,
      campList, worthValue, useTimes, merchantId, shopIds, loading,
      fundPoodStartTime, fundPoodEndTime, newEnterPriseList, enterpriseDistricts,
      isAmountSplitSupport} = this.state;
    const {getFieldProps, getFieldError, getFieldValue, validateFields} = this.props.form;

    const suitShopProps = getFieldProps('suitShops', {
      rules: [
        { validator: (rule, value, callback) => {
          if (value === undefined || value.length === 0) {
            callback('至少选择一家门店');
            return;
          }
          callback();
        }},
      ],
    });

    const timeTypeMap = {
      H: '周末、国家法定节假日',
      WD: '工作日',
    };

    // antd的联动bug，第一次联动失效
    const contractCheck = (
      <div>
        <Checkbox {...getFieldProps('read', {valuePropName: 'checked', initialValue: true})} />
        <span>已仔细阅读并同意</span><a href="" onClick={(e) => { e.preventDefault(); this.setState({contract: true}); }}>《口碑福利协议》</a>
      </div>
    );

    // 活动时间不可选控制
    const disabledFutureDate = (date) => {
      if (typeof date !== 'undefined') {
        const now = new GregorianCalendar(zhCn);
        now.setTime(Date.now());
        return date.compareToDay(now) < 0;
      }
    };

    // 截止时间不可选控制
    const disabledRecruitEndTimeDate = (date) => {
      if (typeof date !== 'undefined') {
        const now = new GregorianCalendar(zhCn);
        now.setTime(Date.now());
        return date.compareToDay(now) < 0;
      }
    };
    // 当前时间时间
    const today = moment();
    return (<div>
        <div>
          <pre>{JSON.stringify(this.state.campTypeLinkData, null, 2)}</pre>
        </div>
      <div className="app-detail-header">
        <a href="#/activity/enterpriseperks/list">口碑福利活动</a> > 新建活动
      </div>
      <div className="qf-main">
        <div className="simulator-wrap">
          <div className="simulator">
            <img className="sample" src="https://zos.alipayobjects.com/rmsportal/SdKcadRcWWVCJdWERjGy.png"/>
          </div>
        </div>
        <Form horizontal>
          <div className="main-form">
            <FormItem label="选择商户：" {...layout} required>
              <Select placeholder="请选择商户" onSelect={this.merchantSelect}
                      style={{width: 400}}
                {...getFieldProps('merchantId', {
                  rules: [
                    {
                      required: true,
                      message: '请选择商户',
                    },
                  ],
                })}
              >
                {MerOptions}
              </Select>
            </FormItem>
            <FormItem label="福利企业：" {...layout} required>
              <Select placeholder="请选择" onSelect={this.enterSelect}
                      style={{width: 400}}
                {...getFieldProps('enterpriseName', {
                  rules: [
                    {
                      required: true,
                      message: '请选择福利企业',
                    },
                  ],
                })}
              >
                {
                  Object.keys(newEnterPriseList || {}).map(item => <Option key={item} data-item={newEnterPriseList[item][0]}>{newEnterPriseList[item][0].enterpriseName}</Option> )
                }
              </Select>
            </FormItem>
            <FormItem label="福利部门：" {...layout} required>
              <Select placeholder="请选择" onSelect={this.departmentSelect}
                      style={{width: 400}}
                {...getFieldProps('departmentName', {
                  rules: [
                    {
                      required: true,
                      message: '请选择福利部门：',
                    },
                  ],
                })}
              >
                {
                  (newEnterPriseList[getFieldValue('enterpriseName')] || []).map(item => <Option key= {item.departmentName} data-item={item}>{item.departmentName}</Option> )
                }
              </Select>
            </FormItem>
            <FormItem label="福利地区：" {...layout} required>
              <Select placeholder="请选择"
                      style={{width: 400}}
                {...getFieldProps('cityName', {
                  rules: [
                    {
                      required: true,
                      message: '请选择福利地区',
                    },
                  ],
                })}
              >
                {
                  (enterpriseDistricts || []).map(item => <Option key={item.name}>{item.name}</Option> )
                }
              </Select>
            </FormItem>
            <FormItem label="福利类型：" {...layout} required
              extra={ getFieldValue('campType') ? <div className="hint_tip">{getFieldValue('campType')}可抵扣餐费<span className="cprice"> {worthValue} </span>元</div> : null}
            >
              <Select placeholder="请选择" onSelect={this.campTypeSelect}
                      style={{width: 400}}
                {...getFieldProps('campType', {
                  rules: [
                    {
                      required: true,
                      message: '请选择福利类型',
                    },
                  ],
                })}
              >
                {
                  (campList || []).map(item => <Option key={item.campType}>{item.campType}</Option> )
                }
              </Select>
            </FormItem>
            <h3 className="kb-form-sub-title">
              <div className="kb-form-sub-title-icon"></div>
              <span className="kb-form-sub-title-text">资金设置</span>
              <div className="kb-form-sub-title-line"></div>
            </h3>

            <FormItem label="选择资金池：" {...layout} required
              validateStatus={classnames({error: !!getFieldError('fundPoolId')})}
              extra={ getFieldValue('fundPoolId') ?
              <div>
                <div className="hint_tip">资金池有效期：{fundPoodStartTime} ~ {fundPoodEndTime}</div>
                <div className="hint_tip">当前余额：<span className="cprice">{fundPoodBalance}</span> 元</div>
              </div> : null}
              help={getFieldError('fundPoolId')}
            >
              <Select placeholder="请选择" onSelect={this.getFundPoodBalance}
                style={{width: 200, marginRight: 10}}
                {...getFieldProps('fundPoolId', {
                  rules: [
                    {
                      required: true,
                      message: '请选择资金池',
                    }, {
                      validator: this.validateFundPood,
                    },
                  ],
                })}
              >
                {FundPoodOptions}
              </Select>
              <a target="_blank" href="#/activity/manage/funds">新建资金池</a>
            </FormItem>

            <FormItem label="服务商出资百分比：" {...layout}
              validateStatus={classnames({error: !!getFieldError('thirdPartyRatio')})}
              help={getFieldError('thirdPartyRatio') || true}
              extra={'请输入0～100之间任意数，且支持2位小数'}
              required>
              <InputNumber style={{width: 200}} placeholder="请输入" {...getFieldProps('thirdPartyRatio', {
                rules: [
                  {
                    required: true,
                    type: 'number',
                    message: '请输入服务商出资百分比',
                  },
                ],
              })} min={0} max={100} step={0.01} /><span>%</span>
            </FormItem>
            <h3 className="kb-form-sub-title">
              <div className="kb-form-sub-title-icon"></div>
              <span className="kb-form-sub-title-text">活动基本信息</span>
              <div className="kb-form-sub-title-line"></div>
            </h3>
            <FormItem label="活动名称：" {...layout} required>
              <Input placeholder="请输入" style={{width: 400}}
                {...getFieldProps('campName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入活动名称',
                    },
                  ],
                })}
              />
            </FormItem>
            <FormItem label="活动类型：" {...layout} required>
              实时优惠
            </FormItem>
            <FormItem label="优惠金额：" {...layout} required>
              { typeof worthValue !== 'undefined' ? <span>立减{worthValue}元</span> : null }
            </FormItem>
            <FormItem label="活动库存：" {...layout} required>
              不限制
            </FormItem>
            <FormItem label="活动时间：" {...layout} required
              help={getFieldError('startTime') || getFieldError('endTime') }
              extra={<p>活动时间必须在资金池有效期内，且活动起止时间至少与资金池起止时间相差1小时</p>}
              validateStatus={
                classnames({
                  error: getFieldError('startTime') || getFieldError('endTime'),
                })
              }
            >
              <DatePicker disabledDate={disabledFutureDate} showTime format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间" style={{ width: 200 }}
                {...getFieldProps('startTime', {
                  rules: [
                    { required: true, message: '请选择活动开始时间' },
                    { validator: (rule, value, callback) => {
                      if (!getFieldValue('endTime')) {
                        callback();
                      } else {
                        const startDate = moment(value);
                        const endDate = moment(getFieldValue('endTime'));

                        // 开始时间要晚于当前时间
                        if (endDate && !startDate.isAfter(today)) {
                          callback([new Error('开始时间应该晚于当前时间')]);
                          return;
                        }

                        if (!startDate.isBefore(endDate)) {
                          callback([new Error('开始时间应该早于结束时间')]);
                          return;
                        }
                        if (endDate.isAfter(startDate.clone().add(365, 'day'))) {
                          callback(new Error('活动时间最长为1年'));
                          return;
                        }
                        if (typeof value !== 'undefined' && getFieldValue('recruitEndTime')) {
                          const recruitEndTime = moment(getFieldValue('recruitEndTime'));
                          if (recruitEndTime.isAfter(value)) {
                            callback(new Error('活动开始时间要晚于商户确认截止时间'));
                            return;
                          }
                        }
                        // 这里是验证活动时候是否在资金池有效时间内
                        if (typeof fundPoodStartTime !== 'undefined' && typeof fundPoodEndTime !== 'undefined' && typeof value !== 'undefined') {
                          const tmpFSTime = new Date(fundPoodStartTime.replace(/-/g, '/'));
                          if (startDate && startDate.clone().subtract(1, 'hours').isBefore(moment(tmpFSTime))) {
                            callback(new Error(`活动开始时间必须在资金池有效期内，且活动起止时间至少与资金池起止时间相差1小时`));
                          }
                        }
                        if (getFieldError('recruitEndTime')) {
                          validateFields(['recruitEndTime'], {force: true});
                        }
                        if (getFieldError('endTime')) {
                          validateFields(['endTime'], {force: true});
                        }
                        if (getFieldError('fundPoolId')) {
                          validateFields(['fundPoolId'], {force: true});
                        }
                        callback();
                      }
                    } },
                  ],
                  initialValue: today.clone().add(5, 'day').format('YYYY-MM-DD 00:00:00'),
                })}/> -&nbsp;
              < disabledDate={disabledFutureDate} showTime format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间" style={{ width: 200 }}
                {...getFieldProps('endTime', {
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
                        if (endDate.isAfter(startDate.clone().add(365, 'days'))) {
                          callback(new Error('活动时间最长为1年'));
                          return;
                        }

                        // 这里是验证活动时候是否在资金池有效时间内
                        if (typeof fundPoodStartTime !== 'undefined' && typeof fundPoodEndTime !== 'undefined' && typeof value !== 'undefined') {
                          const tmpFETime = new Date(fundPoodEndTime.replace(/-/g, '/'));

                          if (endDate.clone().add(1, 'hours').isAfter(moment(tmpFETime))) {
                            callback(new Error(`活动结束时间必须在资金池有效期内，且活动起止时间至少与资金池起止时间相差1小时`));
                          }
                        }
                        if (getFieldError('startTime')) {
                          validateFields(['startTime'], {force: true});
                        }
                        if (getFieldError('fundPoolId')) {
                          validateFields(['fundPoolId'], {force: true});
                        }
                        callback();
                      }
                    }},
                  ],
                  initialValue: today.clone().add(35, 'day').format('YYYY-MM-DD 23:59:59'),
                })} />
            </FormItem>
            <FormItem label="商户确认截止时间：" {...layout} required
              validateStatus={classnames({error: !!getFieldError('recruitEndTime')})}
              help={getFieldError('recruitEndTime') || true}
              extra={'商家需要在此时间前确认活动邀约'}
            >
              <DatePicker disabledDate={disabledRecruitEndTimeDate}
                {...getFieldProps('recruitEndTime', {
                  rules: [
                    {
                      validator: this.validateRecruitEndTime,
                    }, {
                      required: true,
                      message: '商户确认截止时间必填',
                    }],
                  initialValue: today.clone().add(4, 'day').format('YYYY-MM-DD 23:59:59'),
                })}
                showTime format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间" style={{ width: 200 }}
              />
            </FormItem>
            <FormItem label="适用门店：" {...layout} required>
              {merchantId ?
                <SelectShop shopIds={shopIds} merchantId={merchantId} {...suitShopProps} disableReduce /> :
                <span style={{color: 'red'}}>请先选择商户</span>
              }
            </FormItem>
            <FormItem label="品牌名称：" {...layout} required>
              <BrandName BrandOptions={BrandOptions} {...getFieldProps('brandName', {
                rules: [
                  { required: true, message: '请填写品牌名称' },
                  { max: 20, message: '最多 20 个字符' },
                ],
              })} />
            </FormItem>
            <h3 className="kb-form-sub-title">
              <div className="kb-form-sub-title-icon"></div>
              <span className="kb-form-sub-title-text">规则设置</span>
              <div className="kb-form-sub-title-line"></div>
            </h3>
            <FormItem label="参与人群：" {...layout} required>
              <span>{crowdGroupName}</span>
            </FormItem>
            <FormItem label="券可用时段：" {...layout} required>
              {useTimes.map(item => <p key={item.type}>{timeTypeMap[item.type]} | {item.times.replace(',', '-')}</p>)}
            </FormItem>
            <FormItem label="每日参与限制：" {...layout} required>
              {isAmountSplitSupport ? `每人每天限制${worthValue}元（${worthValue}元可拆分多次使用）` : '每人每天参与 1 次'}
            </FormItem>
            <FormItem label="可与其他优惠叠加：" {...layout} required>
              是
            </FormItem>
            <FormItem label="可拆分使用：" {...layout} required>
              {isAmountSplitSupport ? '是' : '否'}
            </FormItem>
            <FormItem label="使用须知：" {...layout}>
              <InputAddable {...getFieldProps('useInstructions', {
                rules: [
                  { required: false, type: 'array', message: '' },
                ],
                initialValue: [''],
              })} placeholder="请输入使用说明，100字以内" />
            </FormItem>
          </div>
          <FormItem style={{padding: '20px 0 0 520px'}} {...layout}>
            <Button type= "primary" loading={loading} onClick={this.handleSubmit} disabled={!getFieldValue('read')}>提交</Button>
            <br />
            {contractCheck}
          </FormItem>
        </Form>
      </div>
      <Modal title="口碑福利服务商协议"
             visible={this.state.contract}
             onCancel={() => {this.setState({contract: false});}}
             footer={null}
             width={750}
      >
        <iframe src="https://render.alipay.com/p/f/koufu/provider-contract.html" width="720" height="400" style={{border: 'none'}}></iframe>
      </Modal>
    </div>
    );
  },
});

export default Form.create()(AddEnterprisePerks);
