// import React from 'react';
// import moment from 'moment';
export default [
  {
    key: 'CancelAfterVerification',
    component: 'CancelAfterVerification',
    field: 'ticketDisplayMode',
    label: '核销方式',
    placeholder: '请选择',
    isMulti: false,
    required: true,
    hasTicketCode: true,
    hasUserPayCode: false,
    hasExternal: false,
    rules: [{ required: true, message: '请选择核销方式' }],
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
        if ( value && value <= 0 ) {
          callback('发放总量必须大于0');
          return;
        }
        callback();
      },
    }],
  },
  {
    key: 'ValidDate',
    component: 'ValidDate',
    field: 'rangeTo',
    field2: 'rangeFrom',
    typeField: 'validTimeType',
    label: '有效期',
    required: true,
    defaultValue: 360,
    rules: [{
      required: true, message: '请填写有效期',
    }, { validator: (rule, value, callback) => {
      if (value && value < 7 || value > 360) {
        callback('有效期为7-360天');
        return;
      }
      callback();
    }}],
    rules2: [{
      required: true, message: '请填写有效期',
    }, { validator: (rule, value, callback) => {
      if (value && value < 7 || value > 360) {
        callback('有效期为7-360天');
        return;
      }
      callback();
    }}],
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
