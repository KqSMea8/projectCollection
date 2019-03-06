export const LANG = {
    message: {
        title: '运动品牌'
    },
    placeholder: {
        enter: '请输入您喜欢的品牌'
    },
    brands: {
        nike: '耐克',
        adi: '阿迪达斯',
        nb: '新百伦',
        ln: '李宁'
    },
    loginInfo: {
        login: '请先登录',
        loginSuccess: '登录成功',
        nickname: '注册邮箱',
        name: "管理员/操作员名称",
        password: '登录密码',
        nameerr: '管理员/操作员名称不能为空',//用户名错误提示文字
        nicenameerr: '注册邮箱不能为空',
        passerr: '登录密码不能为空',//密码错误提示文字
        verification: '验证码',
        varerr: '验证码不能为空',//验证码错误提示文字
        logbtn: '登录'
    },
    // 支付信息
    wxpay: {
        error: '支付失败',
        success: '支付成功'
    },
    // 请求http信息
    request: {
        errorData: '错误的传参',
        errorNet: '网络异常',
        error502: '应用程序错误',
        errorOthers: '其他未知错误'
    },
    // 路由信息
    router: {
        index: "首页",
        home: "首页",
        login: "登录",
        newUserRegistration: "新用户注册激活",
        userPayment: "支付链用户付款",
        hello: "你好",
        i18n: "国际化",
        form: "表单",
        mainManage: {
            index: "配置中心",
            mainManage: "交易主体管理",
            message: "消息推送配置",
            messagePush: "接收人",
            addSendee: "新增接收人",
            receiverConfig: '接收人配置',
            keyManagement: '密钥管理',
            asynNotification: '异步通知配置',
            notiAddress:'通知地址配置'
        },
        fundManage: {
            index: "资金管理",
            accountBalance: "账户余额",
            touchBalance: "余额明细",
            withdraw: '提现',
            withdrawApply: '提现申请',
            withdrawQuery: '提现查询',
            withdrawDetail: "提现详情",
            currencyExchange: '货币兑换',
            currencyApply: '兑换申请',
            currencyQuery: '兑换查询',
            withdrawCard:'提现卡管理',
            addCardMessage:'添加提现卡',
            cardDetails:'提现卡详情'
        },
        accountManage: {
            index: "账号管理",
            baseInfo: "我的账号",
            cardManage: '提现卡管理',
            addCardMessage: '添加提现卡',
            safeMain: '安全中心',
            securitySet: '基本信息',
            modifyLoginPass: '修改登录密码',
            modifyTelPass: '修改绑定手机',
            modifyPayPass: '修改支付密码',
            modifyEmail: '修改绑定邮箱',
            setEmail: '设置绑定邮箱',
            setTel: '设置绑定手机',
            card: '银行账户',
            cardDetails: '提现卡详情',
            managementOperator: '操作员管理',
            operator: '操作员',
            roleManagement: '角色管理',
            operatorDetails: '操作员详情',
            addRole: '新增角色',
            modifyRole: '角色修改',
            roleDetails: '角色详情',
            addManagement: '新增操作员',
            operatorConfi: '操作员配置',
            modifyManageLoginPass: '重置操作员登录密码',
            modifyManagePayPass: '重置操作员支付密码',
            myMessages: '我的消息',
            myMessagesList: '消息列表',
            mesDetails: '消息详情',
            logQuery: '日志查询',
            firstSet: '完善操作员资料'
        },
        paymentChain: {
            index: "支付链",
            paymentChainInit: "支付链生成",
            paymentChainQuery: "支付链查询",
            basicInfoMaintenance: "基本信息维护",
            paymentChainDetail: "支付链详情",
        },
        billCheckCenter: {
            index: "对账中心",
            billofAccounts: "结算对账单",
        },
        riskManage: {
            index: "风控管理",
            ruleConfig: "规则配置",
            configuratorConfig: '配置器管理',
            blackList: "黑名单管理",
            riskOrderAudit: "风险订单审核",
            addBlackList: "添加黑名单"
        },
        deal: {
            index: "交易管理",
            transactionQuery: "交易查询",
            filterList: '过滤器列表',
            filterSet: "过滤器设置",
            orderDetails: "订单详情",
            transactionProcessing: "交易处理",
            RefusalOfPaymentProcessing: "拒付处理",
            reportForms: "交易报表"
        },
        orderOnline: '线上下单',
        helpCenter: {
            index: '帮助中心',
            problems: '常见问题',
            contactInformation: '联系方式'
        }
    },
    //侧边栏
    navbar: {
        home: "首页",
        fund: {
            index: "资金管理",
            balanceOfAccount: "账户余额",
            TheBalanceOfSubsidiary: "余额明细",
            withdrawDeposit: "提现",
            currencyExchange: "货币兑换",
            ToSettleTheQuery: "结算查询"
        },
        deal: {
            index: "交易管理",
            transactionQuery: "交易查询",
            transactionProcessing: "交易处理",
            RefusalOfPaymentProcessing: "拒付处理"
        },
        TheOnlineOrder: "线上下单",
        payment: {
            index: "支付链接",
            PaymentChainGeneration: "支付链生成",
            PaymentChainQuery: "支付链查询",
            BasicInformationMaintenance: "基本信息维护",
        },
        reconciliation: {
            index: "对账中心",
            StatementOfAccount: "结算对账单"
        },
        risk: {
            index: "风控管理",
            RuleConfiguration: "规则配置",
            BlacklistManagement: "黑名单管理",
            riskOrderAudit: "风险订单审核",
        },
        configuration: {
            index: "配置中心",
            SubjectManagement: "交易主体管理",
            keyManagement: "密钥管理",
            MessagePushConfiguration: "消息推送配置"
        },
        ID: {
            index: "账号管理",
            essentialInformation: "我的账号",
            operatorManagement: "操作员管理",
            securitySettings: "安全设置",
            ShortcutEntryConfiguration: "快捷入口配置",
            WithdrawalCardManagement: {
                index: {
                    index: "提现卡管理",
                    success: "添加提现卡成功",
                    error: "添加提现卡失败"
                }
            },
            myMessage: "我的消息",
            logQuery: "日志查询"
        },
        helpCenter: {
            index: "帮助中心",
            FAQ: "常见问题",
            contactWay: "联系方式"
        }

    },
    //资金管理
    fundManage: {
        // 账户余额
        accountBalance: {}
    }
}
