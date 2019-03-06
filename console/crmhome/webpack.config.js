/* eslint-disable */
var path = require('path');
var kbDFImportPluginPath = path.resolve(require.resolve('@alipay/xform'), '..', '..', 'plugins', 'split-import-base-on-index');

module.exports = function(webpackConfig, env) {
  webpackConfig.babel.plugins.push('transform-runtime');
  // 映射 react 和 react-dom 为 dist 文件
  // 不能 否则 Carousel会寻找react/dist/react/lib/ReactTransitionEvents报错
  // if (env === 'development') {
  //   webpackConfig.resolve.alias = Object.assign({}, webpackConfig.resolve.alias, {
  //     'react-dom': 'react-dom/dist/react-dom',
  //   });
  // }

  webpackConfig.babel.plugins.push(['babel-plugin-import', [{
    libraryName: 'antd',
    style: 'css', // if true, use less
  }, {
    style: true, // if true, use less
    libraryDirectory: 'components',
    libraryName: 'hermes-react',
  }]]);

  webpackConfig.babel.plugins.push([kbDFImportPluginPath, {
    '@alipay/xform': {
      libDir: 'lib',
      libraryName: '@alipay/xform',
      mode: 'camel2Dash',
    },
  }]);
/*
  webpackConfig.externals = {
    react: 'React',
    'react-dom': 'ReactDOM'
  }
*/
  if (env === 'development') {
    webpackConfig.devtool = '#source-map';
  }
  webpackConfig.module.loaders.push({test: /\.handlebars$/, loader: 'handlebars-loader'});

  const alias = webpackConfig.resolve.alias || {};
  alias.layout = path.resolve(__dirname, 'src/common/layout');
  webpackConfig.resolve.alias = alias;

  return webpackConfig;
};
