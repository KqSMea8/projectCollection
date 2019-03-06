export const LANG = {
    message: {
        title: 'Sport Brands'
    },
    placeholder: {
        enter: 'Please type in your favorite brand'
    },
    brands: {
        nike: 'Nike',
        adi: 'Adidas',
        nb: 'New Banlance',
        ln: 'LI Ning'
    },
    loginInfo: {
        login: 'please log in first',
        loginSuccess: 'Login Success',
        nickname: 'register an E-mail account ',
        name: 'Administrator/operator name',
        password: 'login password',
        nameerr: 'The administrator/operator name cannot be empty',//用户名错误提示文字
        nicenameerr: 'Registered mailbox cannot be empty',
        passerr: 'The login password cannot be empty',//密码错误提示文字
        verification: 'verification code',
        varerr: 'The verification code cannot be empty',//验证码错误提示文字
        logbtn: 'Login'
    },
    // 支付信息
    wxpay: {
        error: 'payment failed',
        success: 'payment success'
    },
    // 请求http信息
    request: {
        errorData: 'False reference',
        errorNet: 'network anomaly',
        error502: 'Application error',
        errorOthers: 'Other unknown error'
    },
    // 路由信息
    router: {
        index: "home",
        home: "home page",
        login: "login",
        newUserRegistration: "新用户注册激活",
        userPayment: "支付链用户付款",
        hello: "hello",
        i18n: "internationalization",
        form: "from",
        mainManage: {
            index: "Management center",
            mainManage: "Management of transaction subject",
            message: "message push configuration",
            messagePush: "接收人",
            addSendee: "addSendee",
            receiverConfig: 'receiver config',
            keyManagement: 'key management',
            asynNotification: '异步通知配置',
            notiAddress: '通知地址配置'
        },
        fundManage: {
            index: "fund management",
            accountBalance: "Account balance",
            touchBalance: "Fine balance",
            withdraw: 'Put forward',
            withdrawApply: 'Application for cash',
            withdrawQuery: 'Present query',
            withdrawDetail: "Give details",
            currencyExchange: 'Currency Exchange',
            currencyApply: 'Exchange application',
            currencyQuery: 'Exchange inquiries',
            withdrawCard:'提现卡管理',
            addCardMessage:'添加提现卡',
            cardDetails:'提现卡详情'
        },
        accountManage: {
            index: "Account management",
            baseInfo: "Essential information",
            cardManage: 'Cash card management',
            addCardMessage: 'Add cash card',
            safeMain: '安全中心',
            securitySet: '安全设置',
            modifyLoginPass: '修改登录密码',
            modifyTelPass: '修改绑定手机',
            modifyPayPass: '修改支付密码',
            modifyEmail: '修改绑定邮箱',
            setEmail: '设置绑定邮箱',
        },
        deal: {
            index: "transaction management",
            transactionQuery: "transaction query",
            filterList: 'filter list',
            filterSet: "set filter",
            orderDetails: "order details",
            transactionProcessing: "transaction processing",
            RefusalOfPaymentProcessing: "Refusal of payment processing",
            reportForms: 'report forms'
        },
        orderOnline: 'order online'
    },
    //侧边栏
    navbar: {
        home: "home",
        fund: {
            index: "Funds management",
            balanceOfAccount: "balance of account",
            TheBalanceOfSubsidiary: "The balance of subsidiary",
            withdrawDeposit: "withdraw deposit",
            currencyExchange: "currency exchange",
            ToSettleTheQuery: "To settle the query"
        },
        deal: {
            index: "transaction management",
            transactionQuery: "transaction query",
            transactionProcessing: "transaction processing",
            RefusalOfPaymentProcessing: "Refusal of payment processing"
        },
        TheOnlineOrder: "The online order",
        payment: {
            index: "Payment link",
            PaymentChainGeneration: "Payment chain generation",
            PaymentChainQuery: "Payment chain query",
            BasicInformationMaintenance: "Basic information maintenance",
        },
        reconciliation: {
            index: "Check for the center",
            StatementOfAccount: "Statement of account"
        },
        risk: {
            index: "Risk control management",
            RuleConfiguration: "Rule configuration",
            BlacklistManagement: "Blacklist management",
            riskOrderAudit: "Risk order audit",
        },
        configuration: {
            index: "Configuration center",
            SubjectManagement: "Subject management",
            keyManagement: "key management",
            MessagePushConfiguration: "Message push configuration"
        },
        ID: {
            index: "account management",
            essentialInformation: "essential information",
            operatorManagement: "operator management",
            securitySettings: "security settings",
            ShortcutEntryConfiguration: "Shortcut entry configuration",
            WithdrawalCardManagement: {
                index: {
                    index: "Withdrawal card management",
                    success: "Add withdrawal card successfully",
                    error: "Failed to add withdrawal card"
                }
            },
            myMessage: "my message",
            logQuery: "log query"
        },
        helpCenter: {
            index: "help center",
            FAQ: "FAQ",
            contactWay: "contact way"
        }

    },
    //资金管理
    fundManage: {
        // 账户余额
        accountBalance: {}
    }
}
