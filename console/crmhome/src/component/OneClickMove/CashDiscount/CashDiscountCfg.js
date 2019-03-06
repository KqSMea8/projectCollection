import moment from 'moment';

export default [{
  key: 'couponValue',
  field: 'couponValue',
  component: 'CouponValue',
  label: '券面额',
  required: true,
  rules: ctx => [(r, v, cb) => {
    if (ctx.props.form.getFieldValue('minimumAmount')) {
      ctx.props.form.validateFields(['minimumAmount'], { force: true, scroll: true });
    }
    cb();
  }],
}, {
  key: 'shops',
  field: 'shopIds',
  component: 'SelectShopsAsync',
  required: true,
  rules: [{
    required: true, message: '请选择适用门店',
    type: 'array',
  }],
  canReduce: true,
  isEdit: true,
}, {
  label: '参与限制',
  key: 'participatelimit',
  component: 'ParticipateLimit',
  field: {
    dayLimit: 'dayReceiveLimited',
    totalLimit: 'receiveLimited',
  },
  rules: {
    dayLimit: [{ type: 'number', max: 99, message: '请输入 1 ~ 99 的数字' }],
    totalLimit: [{ type: 'number', max: 99, message: '请输入 1 ~ 99 的数字' }],
  },
}, {
  key: 'totalAmount',
  component: 'InputTotal2',
  field: {
    inventoryType: 'budgetAmountType',
    inventory: 'budgetAmount',
  },
  defaultValue: '0',
  label: '发放总量',
  required: true,
  max: 99999999,
  rules: [{
    required: true,
    type: 'number',
    message: '请填写发放总量',
  }, {
    validator: (rule, value, callback) => {
      if (value <= 0) {
        callback('发放总量必须大于0');
        return;
      }
      callback();
    },
  }],
}, {
  key: 'onlineTime',
  component: 'OnlineTime',
  field: {
    start: 'startTime',
    end: 'endTime',
  },
  span: {
    day: 0,
    month: 3,
  },
  label: '上架时间',
  required: true,
  rules: ctx => {
    const { getFieldValue } = ctx.props.form;
    // start 改变时会自动触发 end 的校验，所以收敛校验规则的 end
    return {
      end: [(r, v, cb) => {
        if (getFieldValue('useMode') === '0' && getFieldValue('validTimeType') === 'FIXED') {
          const startTime = moment(getFieldValue('startTime'), 'YYYY-MM-DD HH:mm').toDate();
          const endTime = moment(v, 'YYYY-MM-DD HH:mm').toDate();
          const validTimeFrom = moment(getFieldValue('validTime')[0], 'YYYY-MM-DD HH:mm').toDate();
          const validTimeTo = moment(getFieldValue('validTime')[1], 'YYYY-MM-DD HH:mm').toDate();
          if (validTimeFrom < startTime) {
            return cb('券开始时间应该大于等于上架开始时间');
          } else if (validTimeTo < endTime) {
            return cb('券结束时间应该大于等于上架结束时间');
          }
        }
        cb();
      }],
    };
  },
}, {
  key: 'useMode',
  component: 'Radio',
  field: 'useMode',
  label: '使用方式',
  visible: true,
  required: true,
  defaultValue: '0',
  options: [{
    key: '0',
    name: '需要用户领取',
  }, {
    key: '1',
    disabled: true,
    name: '无需用户领取',
  }],
}, {
  key: 'VouchersValidTime',
  component: 'ValidDate2',
  field: {
    validTimeType: 'validTimeType',
    validPeriod: 'validPeriod',
    validTime: 'validTime',
  },
  defaultValue: {
    validPeriod: 30,
  },
  span: {
    month: 3,
    day: 0,
  },
  label: '券有效期',
  required: true,
  rules: ctx => ({
    validPeriod: [{
      required: true,
      message: '此处必填',
    }, {
      min: 1,
      type: 'number',
      message: '有效期不能小于1',
    }, {
      max: 365,
      type: 'number',
      message: '有效期不能超过365',
    }],
    validTime: [{
      validator: (rule, value, callback) => {
        if (value === undefined || value[0] === null) {
          callback('请填写券有效期');
          return;
        }
        if (value[0] >= value[1]) {
          callback('券开始时间必须小于券结束时间');
          return;
        }
        ctx.props.form.validateFields(['endTime'], { force: true, scroll: true });
        callback();
      },
    }],
  }),
}, {
  key: 'InvalidDate',
  component: 'MultiInvalidTime',
  label: '不可用日期',
  field: {
    type: 'invalidTimeType',
    value: 'invalidTimeValue',
  },
  max: 3,
  dateFormat: 'YYYY-MM-DD',
}, {
  key: 'renewMode',
  component: 'CheckboxRenewal',
  field: 'renewMode',
  label: '自动续期',
  defaultValue: '1',
  required: false,
  extra: '上架时间结束时，若未领取完，则自动延期，每次延期 30 天',
}, {
  key: 'availableTimes',
  component: 'MultiValidTime',
  label: '券可用时段',
  field: {
    type: 'multiValidTimeType',
    value: 'multiValidTimeValue',
  },
  max: 3,
  timeFormat: 'HH:mm',
  options: [{ value: '1', text: '不限制' }, { value: '2', text: '指定时间' }],
}, {
  key: 'minimumAmount',
  component: 'MinimumAmount',
  field: 'minimumAmount',
  rules: ctx => [(r, v, cb) => {
    const { getFieldValue } = ctx.props.form;
    if (+getFieldValue('couponValue') > +v) {
      return cb('最低消费需大于等于券面额');
    }
    cb();
  }],
}, {
  key: 'BrandName',
  component: 'BrandName',
  field: 'brandName',
  required: true,
  label: '品牌名称',
  rules: [{
    max: 40,
    message: '品牌名称不能超过 40 字',
  }],
}, {
  key: 'firstImage',
  component: 'UpGoodsImage',
  field: 'logoFileId',
  label: '券logo',
  extra: '建议优先使用商家logo或品牌logo，图片大小不超过2M。格式：bmp，png，jpeg，gif。尺寸为不小于500 x 500px的正方形。',
  required: true,
  fileExt: ['image/bmp', 'image/png', 'image/jpg', 'image/jpeg', 'image/gif'],
  rules: [
    { required: true, type: 'array', message: '请上传券logo' },
  ],
  max: 1,
  uploadOption: {
    key: 'logoFileId',
    maxSize: 2048, // 上传文件最大尺寸,单位为KB
    currentViews: [
      {
        desc: '券logo――优惠券入口――商品预览图',
        width: 100,
        height: 100,
      },
      {
        desc: '券logo――商品预览图',
        width: 500,
        height: 500,
      },
    ], // 裁剪框右侧的预览框的大小及描述
    rate: 1 / 1, // 裁剪的虚线框的宽/高比
    initWidth: 0.8,
    requiredSize: { width: 500, height: 500 },// 要求的最小尺寸
  },
}, {
  key: 'payChannel',
  component: 'ChannelLimit',
  field: 'payChannel',
  label: '支付渠道限制',
  required: false,
  extra: '请确认已在口碑开通储值卡功能。尚未开通请咨询您的服务商',
}, {
  key: 'Memo',
  component: 'Input',
  field: 'name',
  label: '备注',
  required: false,
  rules: [{ type: 'string', max: 50, message: '不能超过 50 字' }],
  placeholder: '仅作管理使用，不会展示给用户',
}, {
  key: 'descList',
  component: 'AddableInput',
  field: 'descList',
  label: '使用须知',
  required: false,
  wrapperCol: { span: 21 },
  labelCol: { span: 3 },
  maxRow: 5,
  rules: [{
    max: 50, message: '每条50字以内',
  }],
  inputCol: 19,
  btnCol: 5,
  styleText: true,
}];
