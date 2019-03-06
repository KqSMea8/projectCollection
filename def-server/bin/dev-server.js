// webpack-dev-middleware
// webpack-hot-middleware
const express = require('express');
const webpackBaseDev = require('../build/webpack/webpack.dev');
const webpack = require('webpack');
const app = express();
const compiler = webpack(webpackBaseDev);
const proxy = require('http-proxy-middleware');
const config = require('../config').dev;
const proxyTable = config.proxyTable;
let port = process.PORT || config.port;

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = config.env;
}
console.log(process.env.NODE_ENV);

const devMiddleware = require('webpack-dev-middleware')(compiler);
const hotMiddleware = require('webpack-hot-middleware')(compiler);

Object.keys(proxyTable).forEach((key) => {
    let options;
    if (proxyTable[key] === 'string') {
        options = {
            target: proxyTable[key],
            changeOrigin: true
        }
    }
    options = proxyTable[key];
    app.use(key, proxy(options))
})
app.use(devMiddleware);
app.use(hotMiddleware);
app.use(express.static('public'));
app.listen(port);