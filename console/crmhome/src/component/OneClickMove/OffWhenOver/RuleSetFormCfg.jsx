export default [{
  key: 'UseTheTime',
  component: 'MultiValidTime',
  label: '使用时段',
  field: {
    type: 'availableTimeType',
    value: 'availableTimes',
  },
  max: 3,
  timeFormat: 'HH:mm',
  options: [{ value: '1', text: '不限制' }, { value: '2', text: '指定时间' }],
}, {
  key: 'InvalidDate',
  component: 'MultiInvalidTime',
  label: '不可用日期',
  field: {
    type: 'forbiddenTimeType',
    value: 'forbiddenTime',
  },
  max: 3,
  dateFormat: 'YYYY-MM-DD',
}, {
  key: 'GetTheLimit',
  component: 'GetTheLimit',
  field: {
    type: 'receiveLimitedType',
    value: 'receiveLimitedValue',
  },
  defaultValue: {
    type: '0',
    value: 1,
  },
  label: '领取限制',
  required: false,
  max: 99999999,
  rules: ctx => {
    const form = ctx.props.form;
    return {
      type: [{
        validator: (rule, value, callback) => {
          const totalType = value;
          const total = form.getFieldValue('receiveLimitedValue');
          const dailyType = form.getFieldValue('dayReceiveLimitedType');
          const daily = form.getFieldValue('dayReceiveLimitedValue');

          if (totalType === '1') {
            if (total <= 0 || total >= 100) {
              callback('输入大于0，小于100的整数');
              return;
            }
            if (dailyType === '0') {
              callback('【领取限制】为指定数时，需要指定【每日领取限制】');
              return;
            } else if (daily > total) {
              callback('【领取限制】必须大于或等于【每日领取限制】');
              return;
            }
          }

          callback();
        },
      }],
      value: [{
        required: true,
        type: 'number',
        message: '请填写【领取限制】',
      }, (r, v, callback) => {
        form.validateFields(['receiveLimitedType'], { force: true, scroll: true });
        callback();
      }],
    };
  },
}, {
  key: 'DailyGetTheLimit',
  component: 'GetTheLimit',
  field: {
    type: 'dayReceiveLimitedType',
    value: 'dayReceiveLimitedValue',
  },
  defaultValue: {
    type: '0',
    value: 1,
  },
  daily: true,
  label: '每日领取限制',
  required: false,
  max: 99999999,
  // relativeCheckField: ['receiveLimitedValue'],
  rules: ctx => {
    const form = ctx.props.form;
    return {
      type: [{
        validator: (rule, value, callback) => {
          const totalType = form.getFieldValue('receiveLimitedType');
          const total = form.getFieldValue('receiveLimitedValue');
          const dailyType = value;
          const daily = form.getFieldValue('dayReceiveLimitedValue');

          if (dailyType === '1') {
            if (daily <= 0 || daily >= 100) {
              callback('输入大于0，小于100的整数');
              return;
            } if (daily > total) {
              callback('【领取限制】必须大于或等于【每日领取限制】');
              return;
            }
          } else if (dailyType === '0' && totalType === '1') {
            callback('【领取限制】为指定数时，需要指定【每日领取限制】');
            return;
          }
          callback();
        },
      }],
      value: [{
        required: true,
        type: 'number',
        message: '请填写【每日领取限制】',
      }, (r, v, callback) => {
        form.validateFields(['dayReceiveLimitedType'], { force: true, scroll: true });
        callback();
      }],
    };
  },
}, {
  key: 'ChannelLimit',
  component: 'ChannelLimit',
  field: 'payChannel',
  defaultValue: '1',
  label: '支付渠道限制',
  required: false,
  extra: '请确认已在口碑开通储值卡功能。尚未开通请咨询您的服务商',
}, {
  key: 'allowSendOther',
  component: 'Radio',
  field: 'donateFlag',
  visible: true,
  label: '允许转赠',
  required: false,
  defaultValue: '1',
  options: [{
    name: '是',
    key: '1',
    disabled: false,
  }, {
    name: '否',
    key: '0',
    disabled: false,
  }],
}, {
  key: 'allowExposeInKoubei',
  component: 'Radio',
  visible: true,
  field: 'deliveryChannels',
  label: '在口碑门店露出',
  required: false,
  defaultValue: ['SHOP_DETAIL'],
  convert2Form(v) {
    if (v === '1') {
      return ['SHOP_DETAIL'];
    }
    return [];
  },
  convert2Value(v = []) {
    return v.indexOf('SHOP_DETAIL') !== -1 ? '1' : '0';
  },
  options: [{
    name: '是',
    key: '1',
    disabled: false,
  }, {
    name: '否',
    key: '0',
    disabled: false,
  }],
},
];
