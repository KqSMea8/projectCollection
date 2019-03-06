// 打包除node_modules外的所有js文件
const webpack = require('webpack');
const path = require('path');
const manifest = require('../manifest/manifest.json');
const htmlwebpackplugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const cwd = process.cwd();

module.exports = {
    entry: [
        'webpack-hot-middleware/client?noInfo=true&reload=true',
        './src/main.js'
    ],
    output: {
        filename: '[name].js',
        path: path.join(cwd, '/dist'),
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js$/, // 检测所有的js文件
                use: ['babel-loader'],
                exclude: /node_modules/ // 代表除了node_modules文件夹其他都检测
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            }
        ]
    },
    // 服务
    // devServer: {
    //     clientLogLevel: 'warning',// 报错级别
    //     historyApiFallback: true,// 是否使用history api
    //     hot: true,// 是否使用热加载
    //     compress: true,// 是否使用
    //     host: 'localhost',
    //     port: 8080,
    //     open: true,// 自动打开页面
    //     publicPath: '/',// 公共的路径
    //     quiet:true // necessary for FriendlyErrorsPlugin  打包的时候没有提示信息
    // },
    // 引入文件
    plugins: [
        new webpack.DllReferencePlugin({
            context: path.join(cwd, './build/manifest'),
            manifest
        }),
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify('development')
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new htmlwebpackplugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true // 注入的地方
        }),
        new ExtractTextPlugin("styles.css")
    ]
}