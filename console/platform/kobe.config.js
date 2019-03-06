module.exports = {
  solution: '@alipay/kobe-solution-koubeib-pc',
  config: {
    spa: {
      on: true,
      history: 'hash',
    },
    kbtracker: {
      spma: '',
    },
    framework: {
      on: false,
      // type: 'kbservcenter',
    },
    crmhomevm: {
      on: false,
    },
    spi: {
      devServer: ['ikbservcenter-zth-12.gz00b.dev.alipay.net'],
    },
  },
  page: {
    index: {
      route: '/',
      entry: './src/main',
    },
    spi: {
      entry: './src/spi',
      route: '/spi',
      // route: '(/spi|/)',

    },
    spiDetail: {
      entry: './src/spiDetail',
      route: '/spi/spiDetail/:id',
    },
    spiNewAdd: {
      entry: './src/spiNewAdd',
      route: '/spi/spiNewAdd/:title',
    },
    spiOperationLog: {
      entry: './src/spiOperationLog',
      route: '/detail/spiOperationLog/:id',
    },
  },
  dev: {
    app: 'chrome',
    hostname: 'local.alipay.net',
    path: '/index.html',
    query: { __firmworm: true }, // true 开启firmworm
    // proxy: { autoproxy: false }, // 开启代理
  },
};
