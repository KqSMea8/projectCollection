import moment from 'moment';
export default [{
  key: 'DiscountItem',
  component: 'Discount',
  label: '折扣力度',
  required: true,
  field: {
    discountValue: 'rate',
    discountType: 'roundingMode',
  },
  defaultValue: {
    discountValue: 1.5,
    discountType: '2',
  },
  rules: {
    discountType: [],
    discountValue: [{
      required: true,
      message: '请填写折扣',
    }],
  },
}, {
  key: 'SelectShopsAsync',
  component: 'SelectShopsAsync',
  field: 'shopIds',
  required: true,
  label: '适用门店',
  canReduce: true,
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
  key: 'logoFileId',
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
    key: 'itemImage',
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
    requiredSize: {width: 500, height: 500},// 要求的最小尺寸
  },
}, {
  key: 'SendAmountLimited',
  component: 'InputTotal2',
  field: {
    inventoryType: 'budgetAmountType',
    inventory: 'budgetAmount',
  },
  defaultValue: {
    inventoryType: '0',
    inventory: undefined,
  },
  label: '发放总量',
  required: true,
  placeholder: '请填写发放总量',
  max: 99999999,
  rules: [{
    required: true,
    type: 'number',
    message: '请填写发放总量',
  }, {
    validator: (rule, value, callback) => {
      if ( value <= 0 ) {
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
  key: 'UsageMode',
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
  key: 'GetEffect',
  component: 'GetEffect',
  field: 'actived',
  label: '领取生效',
  required: true,
  defaultValue: '0',
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
  key: 'CheckboxRenewal',
  component: 'CheckboxRenewal',
  field: 'renewMode',
  label: '自动续期',
  defaultValue: '1',
  required: false,
  extra: '上架时间结束时，若未领取完，则自动延期，每次延期 30 天',
},
];
