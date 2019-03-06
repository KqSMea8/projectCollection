// import React from 'react';
import moment from 'moment';
// 商品售卖默认显示时间
// const salesPeriodStart = moment(moment().format('YYYY-MM-DD') + ' 00:00:00', 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
// const salesPeriodEnd = moment(salesPeriodStart, 'YYYY-MM-DD').add(1, 'd').add(3, 'M').add(-1, 's').format('YYYY-MM-DD HH:mm:ss');
export default [
  {
    key: 'DisplayChannels',
    component: 'DisplayChannels',
    field: 'displayChannels',
    label: '商品展示渠道',
    placeholder: '请选择',
    required: true,
    defaultValue: 'ALL',
  },
  {
    key: 'CancelAfterVerification',
    component: 'CancelAfterVerification',
    field: 'ticketDisplayMode',
    label: '核销方式',
    placeholder: '请选择',
    required: true,
    rules: [{ required: true, message: '请选择核销方式' }],
  },
  {
    key: 'ExternalAppId',
    component: 'ExternalAppId',
    field: 'externalAppId',
  },
  {
    key: 'goodsIds',
    component: 'Input',
    type: 'textarea',
    field: 'goodsIds',
    label: '商品编码',
    required: false,
    extra: '最多可输入800个商品编码，编码之间请用回车间隔。商品发布成功后请做一笔核销测试，确保配置正确无误',
    placeholder: '请输入正确可用的商品编码',
    rules: [(r, v, cb) => {
      const values = v.split(/\n/).sort();
      let err = null;
      if (v) {
        values.forEach((item, i) => {
          if (item.indexOf(',') !== -1 || item.indexOf('，') !== -1) {
            err = '请勿输入逗号';
          } else if (/\s/.test(item)) {
            err = '请勿输入空格';
          } else if (values.length > 0 && !item) {
            err = '请去掉多余回车';
          } else if (i > 0 && item === values[i - 1]) {
            err = '请勿输入重复项';
          }
        });
      }
      if (err) {
        return cb(err);
      }
      if (values.length > 800) {
        return cb('最多输入800条');
      }
      cb();
    }],
  },
  {
    key: 'SendAmountLimited',
    component: 'InputTotal',
    field: 'totalAmount',
    label: '发放总量',
    required: true,
    max: 99999999,
    defaultValue: 99999999,
    placeholder: '请填写发放总量',
    rules: [{
      required: true,
      type: 'number',
      message: '请填写发放总量',
    }, {
      validator: (rule, value, callback) => {
        if (value && value <= 0) {
          callback('发放总量必须大于0');
          return;
        }
        callback();
      },
    }],
  },
  // {
  //   key: 'ValidDate',
  //   component: 'ValidDate',
  //   field: 'rangeTo',
  //   field2: 'rangeFrom',
  //   typeField: 'validTimeType',
  //   label: '有效期',
  //   required: true,
  //   defaultValue: 360,
  //   rules: [{
  //     required: true, message: '请填写有效期',
  //   }, { validator: (rule, value, callback) => {
  //     if (value && value < 7 || value > 360) {
  //       callback('有效期为7-360天');
  //       return;
  //     }
  //     callback();
  //   }}],
  //   rules2: [{
  //     required: true, message: '请填写有效期',
  //   }, { validator: (rule, value, callback) => {
  //     if (value && value < 7 || value > 360) {
  //       callback('有效期为7-360天');
  //       return;
  //     }
  //     callback();
  //   }}],
  // },
  // {
  //   key: 'SellTime',
  //   component: 'SellTime',
  //   field: {
  //     salesPeriodStart: 'salesPeriodStart',
  //     salesPeriodEnd: 'salesPeriodEnd',
  //   },
  //   label: '商品售卖时间',
  //   isDisabledDate: false,
  //   extra: '商品创建成功后，仅在售卖时间内才展示给用户并开放售卖',
  //   required: true,
  //   defaultValue: {
  //     salesPeriodStart: salesPeriodStart,
  //     salesPeriodEnd: salesPeriodEnd,
  //   },
  //   format: 'YYYY-MM-DD HH:mm:ss',
  //   pickerFormat: 'yyyy-MM-dd HH:mm:ss',
  //   rules: () => ({
  //     salesPeriodStart: [{
  //       required: true,
  //       message: '此处必填',
  //     }],
  //     salesPeriodEnd: [{
  //       required: true,
  //       message: '此处必填',
  //     }],
  //   }),
  // },
  {
    key: 'SalesPeriod',
    component: 'SalesPeriod',
    required: true,
  },
  {
    key: 'VouchersValidTime',
    component: 'ValidDate2',
    field: {
      validTimeType: 'validTimeType',
      validPeriod: 'rangeTo',
      validTime: 'validTime',
    },
    defaultValue: {
      validPeriod: 360,
      validTimeStart: moment().hours(0).minutes(0).seconds(0).milliseconds(0).format('YYYY-MM-DD HH:mm:ss'),
    },
    span: {
      month: 3,
      day: 1,
    },
    isDisabledDate: false,
    label: '有效期',
    required: true,
    isValid: true,
    limitOneYears: true,
    format: 'YYYY-MM-DD HH:mm:ss',
    pickerFormat: 'yyyy-MM-dd HH:mm:ss',
    rules: (form) => ({
      validPeriod: [{
        required: true,
        message: '此处必填',
      }, {
        min: 7,
        type: 'number',
        message: '有效期不能小于7',
      }, {
        max: 360,
        type: 'number',
        message: '有效期不能超过360',
      }],
      validTime: [{
        validator: (rule, value, callback) => {
          if (value === undefined || value[0] === null) {
            callback('请填写有效期');
            return;
          }
          if (value[0] >= value[1]) {
            callback('开始时间必须小于结束时间');
            return;
          }
          if (value && value[0] && value[1] && moment(value[0]).format('YYYY-MM-DD') === moment(value[1]).format('YYYY-MM-DD')) {
            callback('结束时间必须比开始时间大一天');
            return;
          }
          const { salesPeriodStart, salesPeriodEnd } = form.getFieldsValue(['salesPeriodStart', 'salesPeriodEnd']);
          const fmt = 'YYYY-MM-DD HH:mm:ss';
          const pStart = moment(salesPeriodStart, fmt);
          const pEnd = moment(salesPeriodEnd, fmt);
          if (pStart.isAfter(moment(value[0]))) {
            callback('有效期开始时间不能早于售卖开始时间');
            return;
          }
          if (pEnd.isAfter(moment(value[1]))) {
            callback('有效期结束时间不能早于售卖结束时间');
            return;
          }
          if (form.getFieldError('salesPeriodEnd')) {
            form.validateFields(['salesPeriodEnd'], { force: true });
          }
          callback();
        },
      }],
    }),
  },
  {
    key: '使用时段',
    label: '使用时段',
    component: 'MultiValidTime',
    field: {
      type: 'availableTimesType',
      value: 'availableTimes',
    },
    max: 3,
    timeFormat: 'HH:mm',
    extra: '',
  },
  {
    key: '不可用日期',
    label: '不可用日期',
    component: 'MultiInvalidTime',
    field: {
      type: 'forbiddenDatesType',
      value: 'forbiddenDates',
    },
    max: 3,
    timeFormat: 'HH:mm',
    extra: '',
  },
];
