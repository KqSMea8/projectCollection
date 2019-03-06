import Vue from 'vue'
import {MessageBox} from 'element-ui'

Vue.component(MessageBox.name, MessageBox)
import Router from 'vue-router'
//import Hello from '@/components/Hello'
//import clickpage from '@/components/clickpage'
//import page1 from '@/components/page1'
const roulist = ["首页", "账户余额", "余额明细", "提现", "货币兑换", "资金管理", "交易查询", "交易处理", "拒付处理", "交易报表", "交易管理", "线上下单", "支付链生成", "支付链查询", "基本信息维护", "支付链接", "结算对账单", "对账中心", "规则配置", "黑名单管理", "风险订单审核", "风控管理", "交易主体管理", "密钥管理", "消息推送配置", "配置中心", "我的账号", "操作员管理", "我的消息", "日志查询", "账号管理", "联系方式", "帮助中心", '常见问题']
// webpack2 懒加载, 支持es6原生模块加载
const home = () => import('@/components/home')
const Hello = () => import('@/components/Hello')
const i18n = () => import('@/components/i18n')
const loginIn = () => import('@/components/login/loginIn')
const validate = () => import('@/components/validate')
const homepage = () => import('@/components/index')
const main = () => import('@/components/configCenter/index')
//新用户注册激活
const newUserRegistration = () => import('@/components/newUser/index')
//支付链用户付款
const userPayment = () => import('@/components/userPayment/index')
const userPayment2 = () => import('@/components/userPayment/userPayment')


//配置中心引入组件
const mainManage = () => import('@/components/configCenter/mainManage')
const messagePush = () => import('@/components/configCenter/messagePush')
const addSendee = () => import('@/components/configCenter/addSendee')
// const addSendee=()=> import('@/components/modules/uploader')
const message = () => import('@/components/configCenter/message')
const receiverConfig = () => import('@/components/configCenter/receiverConfig')
const keyManagement = () => import('@/components/configCenter/keyManagement')
const asynNotification = () => import('@/components/configCenter/asynNotification')
//资金管理
const fundManageMain = () => import('@/components/fundManage/index')
const accountBalance = () => import('@/components/fundManage/accountBalance')
const touchBalance = () => import('@/components/fundManage/touchBalance')
const withdraw = () => import('@/components/fundManage/withdraw')
const currencyExchange = () => import('@/components/fundManage/currencyExchange')
const currencyApply = () => import('@/components/fundManage/currencyApply')
const currencyQuery = () => import('@/components/fundManage/currencyQuery')
const withdrawDetail = () => import('@/components/fundManage/withdrawDetail')
const withdrawApply = () => import('@/components/fundManage/withdrawApply')
const withdrawQuery = () => import('@/components/fundManage/withdrawQuery')

//账户管理
const accountManageMain = () => import('@/components/accountManage/index')
const baseInfo = () => import('@/components/accountManage/baseInfo')
const cardManage = () => import('@/components/accountManage/cardManage')
const addCardMessage = () => import('@/components/accountManage/addCardMessage')
const addSuccess = () => import('@/components/accountManage/addSuccess')
const addFail = () => import('@/components/accountManage/addFail')
const safeMain = () => import('@/components/accountManage/safeMain')
const securitySet = () => import('@/components/accountManage/securitySet')
const modifyLoginPass = () => import('@/components/accountManage/modifyLoginPass')
const modifyTelPass = () => import('@/components/accountManage/modifyTelPass')
const modifyPayPass = () => import('@/components/accountManage/modifyPayPass')
const modifyEmail = () => import('@/components/accountManage/modifyEmail')
const setEmail = () => import('@/components/accountManage/setEmail')
const setTel = () => import('@/components/accountManage/setTel')
const firstSet = () => import('@/components/accountManage/firstSet')
const cardDetails = () => import('@/components/accountManage/cardDetails')
const operator = () => import('@/components/accountManage/managementOperator')
const roleManagement = () => import('@/components/accountManage/roleManagement')
const operatorDetails = () => import('@/components/accountManage/operatorDetails')
const addRole = () => import('@/components/accountManage/addRole')
const modifyRole = () => import('@/components/accountManage/modifyRole')
const roleDetails = () => import('@/components/accountManage/roleDetails')
const addManagement = () => import('@/components/accountManage/addManagement')
const operatorConfi = () => import('@/components/accountManage/operatorConfi')
const modifyManageLoginPass = () => import('@/components/accountManage/modifyManageLoginPass')
const modifyManagePayPass = () => import('@/components/accountManage/modifyManagePayPass')
const myMessages = () => import('@/components/accountManage/myMessages')
const mesDetails = () => import('@/components/accountManage/mesDetails')
const logQuery = () => import('@/components/accountManage/logQuery')

//支付链
const paymentChainMain = () => import('@/components/paymentChain/index')
const paymentChainInit = () => import('@/components/paymentChain/paymentChainInit')
const paymentChainQuery = () => import('@/components/paymentChain/paymentChainQuery')
const basicInfoMaintenance = () => import('@/components/paymentChain/basicInfoMaintenance')
const paymentChainDetail = () => import('@/components/paymentChain/paymentChainDetail')

//交易管理
const tradeManage = () => import('@/components/tradeManage/index')
const selectTrade = () => import('@/components/tradeManage/selectTrade')
const filterList = () => import('@/components/tradeManage/filterList')
const filterSet = () => import('@/components/tradeManage/filterSet')
const orderDetails = () => import('@/components/tradeManage/orderDetails')
const dealDispose = () => import('@/components/tradeManage/dealDispose')
const protestDispose = () => import('@/components/tradeManage/protestDispose')
const tradeecharts = () => import('@/components/tradeManage/tradeecharts')

// 线上下单
const orderOnline = () => import('@/components/orderOnline/index')


//对账中心
const billCheckCenterMain = () => import('@/components/billCheckCenter/index')
const billofAccounts = () => import('@/components/billCheckCenter/billofAccounts')

//风控管理
const riskManageMain = () => import('@/components/riskManage/index')
const ruleConfig = () => import('@/components/riskManage/ruleConfig')
const configuratorConfig = () => import('@/components/riskManage/configuratorConfig')
const blackList = () => import('@/components/riskManage/blackList')
const riskOrderAudit = () => import('@/components/riskManage/riskOrderAudit')
const addBlackList = () => import('@/components/riskManage/addBlackList')


//帮助中心
const helpCenterIndex = () => import('@/components/helpCenter/index')
const problems = () => import('@/components/helpCenter/problems')
const contactInformation = () => import('@/components/helpCenter/contactInformation')
//错误页面
const error404 = () => import('@/components/error/error404')


//webpack1 写法
//const Login = resolve => require(['../views/Login.vue'], resolve)
//const Login = r => require.ensure([], () => r(require('../views/Login.vue')), 'group1') //分组写法

Vue.use(Router)

// const User = {
//   template: '<div><router-view></router-view></div>'
// }

// error 路由记得加一下；也可以使用嵌套路由

const router = new Router({
    //mode:'history', //去掉地址栏中/#/
    //base:'/dist/',
    //history: false,//这个参数改为false就可以了
    routes: [
        {
            path: '/',
            redirect: '/login',//重定向
        },
        {
            path: '/login',
            name: 'LANG.router.login',
            meta: {
                title: '登录',
                code: ''
            },
            component: loginIn
        },
        //错误页面
        {
            path: '*',
            meta: {
                loginAuth: true
            },
            component: error404,
        },
        {
            path: "/home",
            name: 'LANG.router.index',
            meta: {
                code: ''
            },
            component: homepage,
            children: [
                {
                    path: "/",
                    name: 'LANG.router.home',
                    meta: {
                        title: '首页',
                        code: ''
                    },
                    component: home,
                },
                // 交易处理
                {
                    path: 'tradeManage',
                    name: 'LANG.router.deal.index',
                    meta: {
                        title: '交易管理'
                    },
                    component: tradeManage,
                    children: [
                        {
                            path: '/',
                            meta: {
                                title: '交易查询'
                            },
                            name: "LANG.router.deal.transactionQuery",
                            component: selectTrade
                        },
                        {
                            path: 'filterList',
                            meta: {
                                title: '过滤器列表'
                            },
                            name: "LANG.router.deal.filterList",
                            component: filterList
                        },
                        {
                            path: "filterSet/:id",
                            meta: {
                                title: '过滤器设置'
                            },
                            name: "LANG.router.deal.filterSet",
                            component: filterSet
                        },
                        {
                            path: 'orderDetails/:id',
                            meta: {
                                title: '交易详情'
                            },
                            name: "LANG.router.deal.orderDetails",
                            component: orderDetails
                        },
                        {
                            path: 'dealDispose',
                            meta: {
                                title: '交易处理'
                            },
                            name: 'LANG.router.deal.transactionProcessing',
                            component: dealDispose
                        },
                        {
                            path: 'protestDispose',
                            meta: {
                                title: '拒付处理'
                            },
                            name: 'LANG.router.deal.RefusalOfPaymentProcessing',
                            component: protestDispose
                        },
                        {
                            path: 'tradeecharts',
                            meta: {
                                title: '交易报表'
                            },
                            name: 'LANG.router.deal.reportForms',
                            component: tradeecharts
                        }
                    ]
                },
                // 线上下单
                {
                    path: 'orderOnline',
                    meta: {
                        title: '线上下单'
                    },
                    name: 'LANG.router.orderOnline',
                    component: orderOnline
                },
                //  配置中心
                {
                    path: 'mainManage',
                    meta: {
                        title: '配置中心'
                    },
                    name: 'LANG.router.mainManage.index',
                    component: main,
                    children: [
                        {
                            path: "/",
                            meta: {
                                title: '交易主体管理'
                            },
                            name: 'LANG.router.mainManage.mainManage',
                            component: mainManage,
                        },
                        {
                            path: 'keyManagement',
                            meta: {
                                title: '密钥管理'
                            },
                            name: 'LANG.router.mainManage.keyManagement',
                            component: keyManagement
                        },
                        {
                            path: "messagePush",
                            meta: {
                                title: '消息推送配置'
                            },
                            name: "LANG.router.mainManage.message",
                            component: message,
                            children: [
                                {
                                    path: "/",
                                    name: "LANG.router.mainManage.messagePush",
                                    component: messagePush
                                },
                                {
                                    path: "addSendee",
                                    meta: {
                                        title: '新增接收人'
                                    },
                                    name: "LANG.router.mainManage.addSendee",
                                    component: addSendee
                                },
                                {
                                    path: "receiverConfig/:id",
                                    meta: {
                                        title: '接收人配置'
                                    },
                                    name: "LANG.router.mainManage.receiverConfig",
                                    component: receiverConfig
                                }
                            ]
                        },
                        {
                            path: "asynNotification",
                            meta: {
                                title: '异步通知配置'
                            },
                            name: "LANG.router.mainManage.asynNotification",
                            component: message,
                            children: [
                                {
                                    path: "/",
                                    meta: {
                                        title: '通知地址配置'
                                    },
                                    name: "LANG.router.mainManage.notiAddress",
                                    component: asynNotification
                                }
                            ]
                        }
                    ]
                },
                //资金管理模块
                {
                    path: 'fundManage',
                    name: 'LANG.router.fundManage.index',
                    meta: {
                        title: '资金管理'
                    },
                    component: fundManageMain,
                    children: [
                        {
                            path: "/",
                            meta: {
                                title: '账户余额'
                            },
                            name: 'LANG.router.fundManage.accountBalance',
                            component: accountBalance,
                        },
                        {
                            path: "touchBalance",
                            meta: {
                                title: '余额明细'
                            },
                            name: 'LANG.router.fundManage.touchBalance',
                            component: touchBalance,
                        },
                        {
                            path: "withdraw",
                            name: 'LANG.router.fundManage.withdraw',
                            component: withdraw,
                            meta: {
                                title: '提现',
                                children: [
                                    {
                                        path: '/home/fundManage/withdraw',
                                        name: 'LANG.router.fundManage.withdrawApply',
                                    },
                                    {
                                        path: '/home/fundManage/withdraw/withdrawQuery',
                                        name: 'LANG.router.fundManage.withdrawQuery',
                                    },
                                    {
                                        path: '/home/fundManage/withdraw/cardManage',
                                        name: 'LANG.router.fundManage.withdrawCard',
                                    },
                                ]
                            },
                            children: [
                                {
                                    path: '/',
                                    meta: {
                                        title: '提现',
                                        show: true
                                    },
                                    name: 'LANG.router.fundManage.withdrawApply',
                                    component: withdrawApply,
                                    // meta: {
                                    //     show: true
                                    // }
                                },
                                {
                                    meta: {
                                        title: '提现查询',
                                        show: true
                                    },
                                    path: 'withdrawQuery',
                                    name: 'LANG.router.fundManage.withdrawQuery',
                                    component: withdrawQuery,
                                    // meta: {
                                    //     show: true
                                    // }
                                },
                                {
                                    meta: {
                                        title: '提现卡管理',
                                        show: true
                                    },
                                    path:'cardManage',
                                    name: 'LANG.router.fundManage.withdrawCard',
                                    component: cardManage,
                                },
                                {
                                    meta: {
                                        title: '添加提现卡',
                                        show: true
                                    },
                                    path:'addCardMessage',
                                    name: 'LANG.router.fundManage.addCardMessage',
                                    component: addCardMessage,
                                },
                                {
                                    meta: {
                                        title: '提现卡详情',
                                        show: true
                                    },
                                    path:'cardDetails/:liquidateId',
                                    name: 'LANG.router.fundManage.cardDetails',
                                    component: cardDetails,
                                },
                                {
                                    meta: {
                                        title: '提现详情'
                                    },
                                    path: 'withdrawDetail',
                                    name: 'LANG.router.fundManage.withdrawDetail',
                                    component: withdrawDetail,
                                }
                            ]
                        },
                        {
                            path: "currencyExchange",
                            name: 'LANG.router.fundManage.currencyExchange',
                            component: currencyExchange,
                            meta: {
                                title: '货币兑换',
                                children: [
                                    {
                                        path: '/home/fundManage/currencyExchange',
                                        name: 'LANG.router.fundManage.currencyApply',
                                    },
                                    {
                                        path: '/home/fundManage/currencyExchange/currencyQuery',
                                        name: 'LANG.router.fundManage.currencyQuery',
                                    },
                                ]
                            },
                            children: [
                                {
                                    path: '/',
                                    name: 'LANG.router.fundManage.currencyApply',
                                    component: currencyApply,
                                    meta: {
                                        show: true,
                                        title: '货币兑换'
                                    }
                                },
                                {
                                    path: 'currencyQuery',
                                    name: 'LANG.router.fundManage.currencyQuery',
                                    component: currencyQuery,
                                    meta: {
                                        title: '兑换查询',
                                        show: true
                                    }
                                },
                            ]
                        }
                    ],
                },
                //账户管理配置
                {
                    path: 'accountManage',
                    meta: {
                        title: '账号管理'
                    },
                    name: 'LANG.router.accountManage.index',
                    component: accountManageMain,
                    children: [
                        {
                            //我的账号
                            path: "/",
                            meta: {
                                title: '我的账号'
                            },
                            name: 'LANG.router.accountManage.baseInfo',
                            component: safeMain,
                            children: [
                                {
                                    path: '/',
                                    name: 'LANG.router.accountManage.securitySet',
                                    component: baseInfo
                                }, {
                                    path: 'modifyLoginPass/:message',
                                    name: 'LANG.router.accountManage.modifyLoginPass',
                                    component: modifyLoginPass
                                }, {
                                    path: 'modifyTelPass/:id',
                                    name: 'LANG.router.accountManage.modifyTelPass',
                                    component: modifyTelPass
                                }, {
                                    path: 'modifyPayPass/:message',
                                    name: 'LANG.router.accountManage.modifyPayPass',
                                    component: modifyPayPass
                                }, {
                                    path: 'modifyEmail/:id',
                                    name: 'LANG.router.accountManage.modifyEmail',
                                    component: modifyEmail
                                }, {
                                    path: 'setEmail/:id',
                                    name: 'LANG.router.accountManage.setEmail',
                                    component: setEmail
                                }, {
                                    path: 'setTel/:id',
                                    name: 'LANG.router.accountManage.setTel',
                                    component: setTel
                                },
                                {
                                    path: 'firstSet',
                                    name: 'LANG.router.accountManage.firstSet',
                                    component: firstSet
                                }
                            ]
                        },
                        {
                            //提现卡管理
                            path: "cardManage",
                            name: 'LANG.router.accountManage.cardManage',
                            component: safeMain,
                            meta: {
                                title: '提现卡管理'
                            },
                            children: [
                                {
                                    path: '/',
                                    name: 'LANG.router.accountManage.card',
                                    component: cardManage,
                                },
                                {
                                    path: "addCardMessage",
                                    name: 'LANG.router.accountManage.addCardMessage',
                                    component: addCardMessage,
                                },
                                {
                                    path: "addSuccess",
                                    name: 'LANG.router.accountManage.addCardMessage',
                                    component: addSuccess,
                                },
                                {
                                    path: "addFail",
                                    name: 'LANG.router.accountManage.addCardMessage',
                                    component: addFail,
                                },
                                {
                                    path: 'cardDetails/:liquidateId',
                                    name: 'LANG.router.accountManage.cardDetails',
                                    component: cardDetails
                                }
                            ]
                        },
                        //安全中心
                        {
                            path: 'safeMain',
                            name: 'LANG.router.accountManage.safeMain',
                            component: safeMain,
                            // children:[
                            //   {
                            //     path:'/',
                            //     name:'LANG.router.accountManage.securitySet',
                            //     component:securitySet
                            //   },{
                            //     path:'modifyLoginPass',
                            //     name:'LANG.router.accountManage.modifyLoginPass',
                            //     component:modifyLoginPass
                            //   },{
                            //     path:'modifyTelPass',
                            //     name:'LANG.router.accountManage.modifyTelPass',
                            //     component:modifyTelPass
                            //   },{
                            //     path:'modifyPayPass',
                            //     name:'LANG.router.accountManage.modifyPayPass',
                            //     component:modifyPayPass
                            //   },{
                            //     path:'modifyEmail',
                            //     name:'LANG.router.accountManage.modifyEmail',
                            //     component:modifyEmail
                            //   },{
                            //     path:'setEmail',
                            //     name:'LANG.router.accountManage.setEmail',
                            //     component:setEmail
                            //   }
                            // ]
                        },
                        {
                            path: "managementOperator",

                            name: 'LANG.router.accountManage.managementOperator',
                            component: safeMain,
                            meta: {
                                title: '操作员管理',
                                children: [
                                    {
                                        path: '/home/accountManage/managementOperator',
                                        name: 'LANG.router.accountManage.operator',
                                    },
                                    {
                                        path: '/home/accountManage/managementOperator/roleManagement',
                                        name: 'LANG.router.accountManage.roleManagement',
                                    },
                                ]
                            },
                            children: [
                                {
                                    path: '/',
                                    name: 'LANG.router.accountManage.operator',
                                    component: operator,
                                    meta: {
                                        show: true,
                                        title: '操作员管理'
                                    }
                                },
                                {
                                    path: 'roleManagement',
                                    name: 'LANG.router.accountManage.roleManagement',
                                    component: roleManagement,
                                    meta: {
                                        show: true,
                                        title: '角色管理'
                                    }
                                },
                                {
                                    path: 'operatorDetails/:id',
                                    name: 'LANG.router.accountManage.operatorDetails',
                                    component: operatorDetails,
                                }, {
                                    path: 'addRole',
                                    name: 'LANG.router.accountManage.addRole',
                                    component: addRole
                                }, {
                                    path: 'modifyRole/:id',
                                    name: 'LANG.router.accountManage.modifyRole',
                                    component: modifyRole
                                }, {
                                    path: 'roleDetails/:id',
                                    name: 'LANG.router.accountManage.roleDetails',
                                    component: roleDetails
                                }, {
                                    path: 'addManagement',
                                    name: 'LANG.router.accountManage.addManagement',
                                    component: addManagement
                                }, {
                                    path: 'operatorConfi/:message',
                                    name: 'LANG.router.accountManage.operatorConfi',
                                    component: operatorConfi
                                }, {
                                    path: 'modifyManageLoginPass/:message',
                                    name: 'LANG.router.accountManage.modifyManageLoginPass',
                                    component: modifyManageLoginPass
                                }, {
                                    path: 'modifyManagePayPass/:message',
                                    name: 'LANG.router.accountManage.modifyManagePayPass',
                                    component: modifyManagePayPass
                                }
                            ]
                        },
                        //  我的消息
                        {
                            path: 'myMessages',
                            meta: {
                                title: '我的消息'
                            },
                            name: 'LANG.router.accountManage.myMessages',
                            component: safeMain,
                            children: [
                                {
                                    path: '/',
                                    name: 'LANG.router.accountManage.myMessagesList',
                                    component: myMessages
                                },
                                {
                                    path: 'mesDetails/:id',
                                    name: 'LANG.router.accountManage.mesDetails',
                                    component: mesDetails
                                }
                            ]
                        },
                        //  日志查询
                        {
                            path: 'logQuery',
                            meta: {
                                title: '日志查询'
                            },
                            name: 'LANG.router.accountManage.logQuery',
                            component: logQuery
                        }
                    ]
                },
                //支付链模块
                {
                    path: 'paymentChain',
                    name: 'LANG.router.paymentChain.index',
                    component: paymentChainMain,
                    meta: {
                        title: '支付链接'
                    },
                    children: [
                        {
                            path: "/",
                            name: 'LANG.router.paymentChain.paymentChainInit',
                            component: paymentChainInit,
                            meta: {
                                title: '支付链生成'
                            },
                        },
                        {
                            path: "paymentChainQuery",
                            name: 'LANG.router.paymentChain.paymentChainQuery',
                            component: paymentChainQuery,
                            meta: {
                                title: '支付链查询'
                            },
                        },
                        {
                            path: "basicInfoMaintenance",
                            name: 'LANG.router.paymentChain.basicInfoMaintenance',
                            component: basicInfoMaintenance,
                            meta: {
                                title: '基本信息维护'
                            },
                        },
                        {
                            path: "paymentChainDetail",
                            meta: {
                                title: '支付链详情'
                            },
                            name: 'LANG.router.paymentChain.paymentChainDetail',
                            component: paymentChainDetail,
                        },
                    ]
                },
                //对账中心
                {
                    path: 'billCheckCenter',
                    name: 'LANG.router.billCheckCenter.index',
                    component: billCheckCenterMain,
                    meta: {
                        title: '对账中心'
                    },
                    children: [
                        {
                            path: "/",
                            meta: {
                                title: '结算对账单'
                            },
                            name: 'LANG.router.billCheckCenter.billofAccounts',
                            component: billofAccounts,
                        },
                    ]
                },
                //风控管理
                {
                    path: 'riskManage',
                    name: 'LANG.router.riskManage.index',
                    component: riskManageMain,
                    meta: {
                        title: '风控管理'
                    },
                    children: [
                        {
                            path: "/",
                            meta: {
                                title: '规则配置'
                            },
                            name: 'LANG.router.riskManage.ruleConfig',
                            component: ruleConfig,
                        },
                        {
                            path: "configuratorConfig",
                            meta: {
                                title: '配置器管理'
                            },
                            name: 'LANG.router.riskManage.configuratorConfig',
                            component: configuratorConfig,
                        },
                        {
                            path: "blackList",
                            meta: {
                                title: '黑名单管理'
                            },
                            name: 'LANG.router.riskManage.blackList',
                            component: blackList,
                        },
                        {
                            path: "riskOrderAudit",
                            meta: {
                                title: '风险订单审核'
                            },
                            name: 'LANG.router.riskManage.riskOrderAudit',
                            component: riskOrderAudit,
                        },
                        {
                            path: "addBlackList",
                            meta: {
                                title: '添加黑名单'
                            },
                            name: 'LANG.router.riskManage.addBlackList',
                            component: addBlackList,
                        },
                    ]
                },
                //  帮助中心
                {
                    path: 'helpCenter',
                    meta: {
                        title: '帮助中心'
                    },
                    name: 'LANG.router.helpCenter.index',
                    component: helpCenterIndex,
                    children: [
                        {
                            path: '/',
                            name: 'LANG.router.helpCenter.problems',
                            meta: {
                                title: '常见问题'
                            },
                            component: problems
                        },
                        {
                            path: 'contactInformation',
                            meta: {
                                title: '联系方式'
                            },
                            name: 'LANG.router.helpCenter.contactInformation',
                            component: contactInformation
                        }
                    ]
                },
            ]
        },
        {
            path: '/newUserRegistration/:id',
            name: 'LANG.router.newUserRegistration',
            component: newUserRegistration
        },
        {
            path: '/userPayment',
            name: 'LANG.router.userPayment',
            meta: {
                title: '支付链用户付款',
                code: ''
            },
            component: userPayment
        },
        {
            path: '/userPayment2',
            name: 'LANG.router.userPayment',
            meta: {
                title: '支付链用户付款',
                code: ''
            },
            component: userPayment2
        },
    ]
})


// 路由拦截，判断是否需要登录权限 以及是否登录
router.beforeEach((to, from, next) => {
    scrollTo(0, 0);
    
    let ary = sessionStorage.contrast ? JSON.parse(sessionStorage.contrast) : []
    if (!ary) {
        next()
    } else {
        let arr = []
        ary.forEach(item => {
            if (item.children) {
                item.children.forEach(i => {
                    arr.push(i.name)
                })
            }
            arr.push(item.name)
        })
        if (window.location.hash == '#/login') {
            if (to.path == '/home' ) {
                next()
            } else {
                next()
            }
        } else {
            if(!sessionStorage.uname){
                window.location.href = `${window.location.origin}/#/login`
                setTimeout(()=>{
                    window.location.reload()
                },300)
            }else{
                if (roulist.includes(to.meta.title) && arr.includes(to.meta.title)) {
                    next()
                } else if (roulist.includes(to.meta.title) && !arr.includes(to.meta.title)) {
                    MessageBox.alert('抱歉，您没有该页面操作权限，请联系管理员添加相应权限，谢谢', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning',
                        showClose: false,
                        closeOnClickModal: false,
                    }).then(() => {
                        if (!from.name) {
                            window.history.go(-1)
                            setTimeout(() => {
                                window.location.reload()
                            }, 100)
                        }
                    })
                } else {
                    next()
                }
            }
        }
    }

})

export default router;
