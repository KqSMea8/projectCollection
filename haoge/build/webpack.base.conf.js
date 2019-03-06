var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var webpack = require('webpack')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: ["babel-polyfill", "./src/main.js"]
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src') //引入jquery，不能放在src/assets
    }
  },
  // plugins: [
  //     new webpack.ProvidePlugin({
  //         $: "jquery",
  //         jQuery: "jquery"
  //     })
  // ],
  //不需要打包的
  externals: {
    // 'vue': 'Vue',
    // 'vue-router': 'VueRouter',
    // 'vuex': 'Vuex',
    // 'axios': 'axios'
    // 'element-ui':'ElementUI',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      // {
      //   test: /\.(css|less)$/,
      //   loader: 'style-loader!css-loader'
      // },
      {
        test: /\.less$/,
        loader: 'less-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_module/,
        loader: 'babel-loader'
      }
    ]
  }
}
