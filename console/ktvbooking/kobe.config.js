module.exports = {
  solution: '@alipay/kobe-solution-koubeib-pc',
  config: {
    spa: {
      on: true,
      history: 'hash',
    },
    kbtracker: {
      spma: 'a439',
    },
    framework: {
      // antd: 2, // 使用antd 2.x，未经充分测试，除非特殊组件不支持，否则建议全部使用antd 1.x，即不配置该属性
      on: true,
      local: 'crmhome',
    },
    crmhomevm: {
      on: true, // 本地开发是否使用 crmhome 的 html 文件
    },

  },
  page: {
    order: {
      entry: './src/order',
      route: '/order(|/stay|/unused|/consumed|/back)',
      title: 'KTV预订-订单管理',
      spmb: 'b5867',
    },
    status: {
      entry: './src/status',
      title: 'KTV预订-房态管理',
      spmb: 'b5868',
    },
    trade: {
      entry: './src/trade',
      title: 'KTV预订-预订交易数据',
      spmb: 'b5869',
    },
    plan: {
      entry: './src/plan',
      route: '/(|plan)',
      title: 'KTV预订-预订方案管理',
      spmb: 'b5864',
    },
    'plan-detail': {
      entry: './src/plan-detail',
      route: '/plan/detail',
      title: 'KTV预订-预订方案详情',
      spmb: 'b5864',
    },
    setting: {
      entry: './src/setting',
      title: 'KTV预订-其他预订设置',
      spmb: 'b5865',
    },
    refund: {
      entry: './src/refund',
      title: 'KTV预订-手工退款管理',
      spmb: 'b5866',
    },
  },
  dev: {
    app: 'chrome',
    hostname: 'local.alipay.net',
    path: '/index.html',
    query: { __pickpost: true },
  },
};
