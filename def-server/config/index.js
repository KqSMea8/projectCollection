// 代理配置项
module.exports = {
    'dev': {
        port: 8080,
        proxyTable: {
            '/api': {
                target: 'www.baidu.com',
                changeOrigin: true
            },
            '/user': {
                target: 'www.baidu1.com',
                changeOrigin: true
            }
        },
        "env": "development"
    },
    'build': {
        'env': 'production'
    }
}