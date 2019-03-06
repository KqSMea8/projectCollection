/*
* 全局环境配置
* localhost／ development／ pre／ production *
* @api 后台api地址
* @link 全局链接地址
* @share 全局分享默认配置
*/
// const CONFIG = {
//   // 本地环境
//   localhost: {
//     api: 'http://localhost/mps-gateway/api',
//     link: {
//       index: 'http://localhost/mps-gateway/api'
//     }
//   },
//   // DEV环境
//   development: {
//     api: `${location.origin}/mps-gateway/api`,
//     link: {
//       index: 'http://localhost/mps-gateway/api'
//     }
//   },
//   // PRE环境
//   pre: {
//     api: 'localhost:8081',
//     link: {
//       index: 'localhost:8081'
//     }
//   },
//   // PRD环境
//   production: {
//     api: 'localhost:8081',
//     link: {
//       index: 'localhost:8081',
//     }
//   }
// }
//
// // 检测环境
// let host = window.location.host
// if (host.indexOf('dev') > -1 || host.indexOf('innertest32') > -1) {
//   global.APIMSG = CONFIG.development
// } else if (host.indexOf('localhost.pre:8081') > -1) {
//   global.APIMSG = CONFIG.pre
// } else if (host.indexOf('localhost.mst:8081') > -1) {
//   global.APIMSG = CONFIG.production
// } else {
//   global.APIMSG = CONFIG.localhost
// }
//
// export default global.APIMSG

const CONFIG = {
    // 本地环境
    localhost: {
        api: 'http://localhost/mps-gateway/api',
        link: {
            index: 'http://localhost/mps-gateway/api'
        }
    },
    // 其他环境
    others: {
        api: `${location.protocol + "//" + location.host}/mps-gateway/api`,
        link: {
            index: 'http://localhost/mps-gateway/api'
        }
    }
}

// 检测环境
let host = window.location.host
if (host.indexOf('localhost') > -1 || host.indexOf('172.168') > -1) {
    global.APIMSG = CONFIG.localhost
}  else {
    global.APIMSG = CONFIG.others
}

export default global.APIMSG
