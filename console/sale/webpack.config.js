/* eslint-disable */
const path = require('path');
module.exports = function(webpackConfig, env) {
  webpackConfig.babel.plugins.push(['babel-plugin-import', [{
    libraryName: 'antd',
    style: 'css', // if true, use less
  }, {
    style: true, // if true, use less
    libraryDirectory: 'components',
    libraryName: 'hermes-react',
  }]]);

  if (env === 'development') {
    webpackConfig.devtool = '#cheap-source-map';
  }

  webpackConfig.module.loaders.push({test: /\.handlebars$/, loader: "handlebars-loader"});

  const alias = webpackConfig.resolve.alias || {};
  alias['Common'] = path.resolve(__dirname, 'src/common');
  alias['Utility'] = path.resolve(__dirname, 'src/common/utility');
  alias['Library'] = path.resolve(__dirname, 'src/common/library');
  webpackConfig.resolve.alias = alias;

  return webpackConfig;
};
