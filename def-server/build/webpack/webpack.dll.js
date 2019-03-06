// 在开发环境下打包类库文件
const webpack = require('webpack');
const path = require('path');
const cwd = process.cwd();

const vendors = [
    "react",
    "react-dom"
]

module.exports = {
    entry: {
        vendor: vendors
    },
    output: {
        filename: '[name].js', // 要给hash值，不然容易走缓存
        path: path.join(cwd, 'public/vendors'),
        library: '[name]' // 文件夹名字
    },
    // 生成文件
    plugins: [
         new webpack.DllPlugin({
            path: './build/manifest/manifest.json',
            name: '[name]',
            context: path.join(cwd, 'build/manifest')
        })
    ]
}