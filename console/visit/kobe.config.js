const config = {
  solution: '@alipay/kobe-solution-koubeib-h5',
  config: {
    kbtracker: {
      spma: 'a484', // spm a位
    },
    spi: {
      // devServer: ['kbsales-ztt-9.gz00b.dev.alipay.net'],
    },
    qingtai: {
      theme: { hd: '2px' },
    },
  },
  page: {
    'tka-index': {
      entry: './src/tka-index/index.js',
      title: '我的拜访',
      spm: 'b5541',
    },
    'tka-visit-list': {
      entry: './src/tka-visit-list/index.js',
      title: '',
      spm: 'b5549',
    },
    'tka-visit-detail': {
      entry: './src/tka-visit-detail/index.js',
      title: '拜访详情',
      spm: 'b5550',
    },
    'tka-visit-approve': {
      entry: './src/tka-visit-approve/index.js',
      title: '审阅',
      spm: 'b5552',
    },
    'tka-visit-search': {
      entry: './src/tka-visit-search/index.js',
      title: '搜索拜访记录',
      spm: 'b5553',
    },
    'tka-visit-add': {
      entry: './src/tka-visit-add/index.js',
      title: '添加拜访',
      spm: 'b5554',
    },
    'tka-visit-add-visit-merchant': {
      entry: './src/tka-visit-add/form/visit-merchant-page/index.js',
      title: '选择拜访商户',
      spm: 'b5555',
    },
    'tka-visit-add-visit-object': {
      entry: './src/tka-visit-add/form/visit-object-page/index.js',
      title: '拜访对象',
      spm: '',
    },
    'tka-visit-add-visit-object-add': {
      entry:
        './src/tka-visit-add/form/visit-object-page/visit-object-add-page/index.js',
      title: '添加对象',
      spm: '',
    },
    'tka-visit-add-visit-sub-company': {
      entry: './src/tka-visit-add/form/visit-sub-company-page/index.js',
      title: '拜访分公司',
      spm: '',
    },
    'tka-visit-add-visit-sub-company-add': {
      entry:
        './src/tka-visit-add/form/visit-sub-company-page/visit-sub-company-add-page/index.js',
      title: '新增分公司',
      spm: '',
    },
    'tka-visit-add-visit-with-people': {
      entry: './src/tka-visit-add/form/visit-with-people-page/index.js',
      title: '陪访人',
      spm: '',
    },
    'tka-visit-add-next-plan': {
      entry: './src/tka-visit-add/form/next-plan-page/index.js',
      title: '下一步计划',
      spm: '',
    },
    'tka-visit-add-other-note': {
      entry: './src/tka-visit-add/form/other-note-page/index.js',
      title: '其他备注',
      spm: '',
    },
    'tka-visit-add-visit-result': {
      entry: './src/tka-visit-add/form/visit-result-page/index.js',
      title: '拜访结果',
      spm: '',
    },
    'digital-feedback-page': {
      entry: './src/tka-visit-add/form/digital-feedback-page/index.js',
      title: '数字化程度反馈',
      spm: '',
    },
    'digital-feedback': {
      entry: './src/tka-visit-detail/component/digital-feedback/index.js',
      title: '数字化程度反馈',
      spm: '',
    },
  },
  dev: {
    app: 'chrome',
    hostname: 'local.alipay.net',
    path: '/tka-index.html',
    startupParam: {},
  },
};

module.exports = config;
