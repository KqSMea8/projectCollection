import httpRequest from './http'
const classPost = {
    // 自动登录
    autologin:function(params){
        return httpRequest('post', '/auth/autologin', params)
    },
    // 登录
    login: function (params) {
        return httpRequest('post', '/auth/login', params)
    },
    //验证是否激活
    activeInfo: function (params) {
        return httpRequest('post', '/security/active_info', params)
    },
    //激活页安全问题列表
    securityQuestion: function (params) {
        return httpRequest('post', '/security/query_security_question', params)
    },
    //激活   /api
    merchantActive: function (params) {
        return httpRequest('post', '/security/merchant_active', params)
    },
    // 批量不申诉
    batch_noappeal:function(params){
        return httpRequest('post','/chargeback/batch/noappeal',params)
    },
    // 拒付处理
    batch_appeal:function(params){
        return httpRequest('post','/chargeback/batch/appeal',params)
    },
    // 下载交易查询处理
    export_query:function(params){
        return httpRequest('post','/transaction/export/query',params,'',{responseType:"arraybuffer"})
    },
    //下载交易处理
    export_deal: function(params){
        return httpRequest('post','/transaction/export/deal',params,'',{responseType:"arraybuffer"})
    },
    // 预授权完成
    capture: function(params){
        return httpRequest('post','/transaction/capture',params)
    },
    // 获取风险原因
    risk_reason:function(params){
        return httpRequest('post','/transaction/risk/reason',params)
    },
    // 过滤器设置列表
    filter_list: function(params){
        return httpRequest('post','/filter/list',params)
    },
    // 保存过滤器设置
    config_save:function(params){
        return httpRequest('post','/filter/config/save',params)
    },
    // 更新过滤器配置
    config_update:function(params){
        return httpRequest('post','/filter/config/update',params)
    },
    // 交易详情
    transaction_detail: function(params){
        return httpRequest('post','/transaction/detail',params)
    },
     // 获取列表
    security_mymenu:function(params){
        return httpRequest('post','/security/mymenu',params)
    },
    // 交易查询
    transaction_query: function(params){
        return httpRequest('post','/transaction/query',params)
    },
    // 过滤器列表
    config_list: function(params){
        return httpRequest('post','/filter/config/list',params)
    },
    // 获取验证码
    getValidCode: function(params){
        return httpRequest('post','/auth/get_valid_code',params)
    },
    // 获取图片验证码
    getVerify: function(params){
        return httpRequest('post','/auth/getVerify',params,'',{responseType:'arraybuffer'})
    },
    // 判断设备是否被信任
    isdevice: function(params){
        return httpRequest('post','/security/is_device_accessed',params)
    },
    // 信任设备
    device: function(params){
        return httpRequest('post','/security/device_access',params)
    },
    // 昨日账户动态
    yesterday_trade: function(params){
        return httpRequest('post','/index/yesterday_trade',params)
    },
    // 本月账户动态
    month_trade: function(params){
        return httpRequest('post','/index/month_trade',params)
    },
    // 退出登录
    logout: function(params){
        return httpRequest('post','/auth/logout',params)
    },
    // 账户动态
    accountActivity: function(params){
        return httpRequest('post','/index/account_activity',params)
    },
    // 首页消息
    announcement:function(params){
        return httpRequest('post','/index/announcement',params)
    },
    //快捷入口
    menu_quick_entrance:function(params){
        return httpRequest('post','/index/menu_quick_entrance',params)
    },
    //交易统计
    month_trade_statistics:function(params){
        return httpRequest('post','/index/trade_statistics',params)
    },
    // 代办处理
    pending_schedule:function(params){
        return httpRequest('post','/index/pending_schedule',params)
    },
    // 交易查询
    tradeSelect: function(params){
        return httpRequest('post','/transaction/query',params)
    },
    // 拒付查询
    chargeback: function(params){
        return httpRequest('post','/chargeback/query',params)
    },
    // 查询交易信息为退款初始化数据
    query_detail: function(params){
        return httpRequest('post','/transaction/query/detail',params)
    },
    // 下载拒付单
    chargeback_export: function(params){
        return httpRequest('post','/chargeback/export',params,'',{responseType:"arraybuffer"})
    },
    // 交易退款
    refund: function(params){
        return httpRequest('post','/transaction/refund',params)
    },
    // 交易报表
    querytradereport: function(params){
        return httpRequest('post','/transaction/querytradereport',params)
    },
    // 撤销预授权
    auth_void: function(params){
        return httpRequest('post','/transaction/auth_void',params)
    },
    // 审核通过
    accept: function(params){
        return httpRequest('post','/transaction/accept',params)
    },
    //  审核拒绝
    reject: function(params){
        return httpRequest('post','/transaction/reject',params)
    },
    // 批量退款
    batch: function(params){
        return httpRequest('post','/transaction/refund/batch',params)
    },
    // 下载批量退款
    download_template: function(params){
        return httpRequest('post','/transaction/download/template',params)
    },
    // 获取所有币种信息
    get_current: function(params){
        return httpRequest('post','/vcc/index',params)
    },
    // 获取网站域名
    get_websit: function(params){
        return httpRequest('post','/site/queryAuditedSite',params)
    },
    // 检测卡号是否正确
    checkBankCard:function(params){
        return httpRequest('post','/vcc/checkBankCard',params)
    },
    //支付链
    //基本信息维护
    basicInfoQuery: function(params){
        return httpRequest('post','/payLink/queryBaseInfo',params)
    },
    //文件上传
    fileUpload: function(params){
        return httpRequest('post','/payLink/doUpload',params)
    },
    // 线上下单提交
    addVcc:function(params){
        return httpRequest('post','/vcc/addVcc',params)
    },
    //网址
    website:function(params){
        return httpRequest('post','/site/queryAuditedSite',params)
    },
    //新增
    basicInfoAdd:function(params){
        return httpRequest('post', '/payLink/addBaseInfo',params)
    },
    //修改//
    basicInfoModify:function(params){
        return httpRequest('post','/payLink/modifyBaseInfo',params)
    }, 
    //删除
    basicInfoDelete:function(params){
        return httpRequest('post','/payLink/deleteBaseInfo',params)
    },
    //获取币种
    curCode:function (params) {
        return httpRequest('post','/acct/queryAccCategoryListByMemberCode',params)
    },
    //对账中心 /api
    downpartnerreconcile:function (params) {
        return httpRequest('post','/partnerreconcile/downpartnerreconcile',params)
    },
    //支付链查询页面
    paymentChainQuery:function(params){
        return httpRequest('post','/payLink/queryPayLink',params)
    },
     //支付链查询商品名称
     queryAttributeNames:function(params){
        return httpRequest('post','/payLink/queryAttributeNames',params)
    },
    //支付链失效
    paymentChainInvalid:function(params){
        return httpRequest('post','/payLink/invalidPayLink',params)
    },
    //支付链克隆
    paymentChainClone:function(params){
        return httpRequest('post','/payLink/clonePayLink',params)
    },
    //支付链下载
    paymentChainDownLoad:function(params){
        return httpRequest('post','/payLink/payLinkDownload',params,'',{responseType:"arraybuffer"})
    },
    //支付链生成页面初始化
    paymentChainIndex:function(params){
        return httpRequest('post','/payLink/index',params)
    },
    //支付链生成
    paymentChainInit:function(params){
        return httpRequest('post','/payLink/payLinkGenerate',params)
    },
    //支付链详情
    paymentChainDetail:function(params){
        return httpRequest('post','/payLink/queryPayLinkDetail',params)
    },
    //资金管理
    //账户余额
    queryacct:function(params){
        return httpRequest('post','/acct/queryacct',params)
    },
    //余额明细根据基本类型获取账户币种列表和明细类型列表
    queryAcctTypeAnddealTypeList:function(params){
        return httpRequest('post','/acct/queryAcctTypeAnddealTypeList',params)
    },
    //余额明细查询
    queryBalanceDeal:function(params){
        return httpRequest('post','/acct/queryBalanceDeal',params)
    },
    //余额明细下载
    downLoadBalanceDeal:function(params){
        return httpRequest('post','/acct/exportBalanceDeal',params,'',{responseType:"arraybuffer"})
    },
    //兑换申请  账户初始化
    queryaccttypeList:function(params){
        return httpRequest('post','/acct/queryaccttypeList',params)
    },
     //兑换申请  选择账户
    accttypeListSelect:function(params){
        return httpRequest('post','/acct/doQueryBuyBalancesNsTx',params)
    },
    //兑换申请  目标币种初始化
    queryCapitalPoolManage:function(params){
        return httpRequest('post','/acct/queryCapitalPoolManage',params)
    },
    //兑换申请  选择目标币种
    getswapbananceAndrate:function(params){
        return httpRequest('post','/acct/getswapbananceAndrate',params)
    },
    //兑换申请  申请兑换金额
    getInfoByApplyAmount:function(params){
        return httpRequest('post','/acct/getInfoByApplyAmount',params)
    },
    //兑换申请  提交
    swapParitiesPay:function(params){
        return httpRequest('post','/acct/swapParitiesPay',params)
    },
    //兑换查询
    querybysetterorder:function(params){
        return httpRequest('post','/acct/querybysetterorder',params)
    },
    //兑换查询 下载
    exportbuysettleorder:function(params){
        return httpRequest('post','/acct/exportbuysettleorder',params,'',{responseType:"arraybuffer"})
    },
    //兑换查询 验证密码
    validatetradePwd:function(params){
        return httpRequest('post','/acct/validatetradePwd',params)
    },
    //风控管理
    //风控管理查询
    riskManageQuery:function(params){
        return httpRequest('post','/suspected/query',params)
    },
    //置为正常
    riskManageNormal:function(params){
        return httpRequest('post','/suspected/normal',params)
    },
    //下载
    downLoadRiskManage:function(params){
        return httpRequest('post','/suspected/export',params,'',{responseType:"arraybuffer"})
    },
    //黑名单管理   查询类型列表
    queryblacktypelist:function(params){
        return httpRequest('post','/riskmanger/queryblacktypelist',params)
    },
    //黑名单管理   查询
    queryblacklist:function(params){
        return httpRequest('post','/riskmanger/queryblacklist',params)
    },
     //黑名单管理 添加黑名单
    addblackdata:function(params){
        return httpRequest('post','/riskmanger/addblackdata',params)
    },
    //黑名单管理 删除黑名单
    deleteblackdata:function(params){
        return httpRequest('post','/riskmanger/deleteblackdata',params)
    },
    //黑名单管理 下载黑名单
    downloadblacklist:function(params){
        return httpRequest('post','/riskmanger/downloadblacklist',params,'',{responseType:"arraybuffer"})
    },
    //规则配置 查询规则集列表
    queryrulesetlist:function(params){
        return httpRequest('post','/riskmanger/queryrulesetlist',params)
    },
    //规则配置 删除规则集
    deleteruleset:function(params){
        return httpRequest('post','/riskmanger/deleteruleset',params)
    },
    //规则配置 查询单个规则集
    queryruleset:function(params){
        return httpRequest('post','/riskmanger/queryruleset',params)
    },
    //规则配置 查询规则集未使用的域名列表
    queryuseablewebsiteconfig:function(params){
        return httpRequest('post','/riskmanger/queryuseablewebsiteconfig',params)
    },
    //规则配置 查询是否开通动态预授权产品
    isopendomainauthorization:function(params){
        return httpRequest('post','/riskmanger/isopendomainauthorization',params)
    },
    //规则配置 更新规则集
    updateruleset:function(params){
        return httpRequest('post','/riskmanger/updateruleset',params)
    },
    //规则配置 创建规则集
    createruleset:function(params){
        return httpRequest('post','/riskmanger/createruleset',params)
    },
    //交易主体管理
    querySite:function (params) {
        return httpRequest('post','/site/query',params);
    },
    deleteSite:function (params) {
        return httpRequest('post','/site/deleteSite',params)
    },
    addSingleSite:function (params) {
        return httpRequest('post','/site/addSingleSite',params)
    },
    //批量添加
    addBatchByFile:function (params) {
        return httpRequest('post','/site/addBatchByFile',params)
    },
    //查询密钥  /api
    keyQuery:function (params) {
        return httpRequest('post','/key/query',params)
    },
    //获取和重置密钥
    keyGenerate:function (params) {
        return httpRequest('post','/key/generate',params)
    },
    //上传公钥  /api
    publicKey:function (params) {
        return httpRequest('post','/key/save/publickey',params)
    },
    //消息推送配置
    receiverList:function (params) {
        return httpRequest('post','/notify/query',params)
    },
    //删除接收人
    deleteReceiver:function (params) {
        return httpRequest('post','/notify/del',params)
    },
    //新增接收人
    addReceiver:function (params) {
        return httpRequest('post','/notify/add',params)
    },
    //接收人详情
    receiverDetail:function (params) {
        return httpRequest('post','/notify/getNotifyReceiverInfoDetail',params)
    },
    //修改联系方式  /api/
    receiverMethods:function (params) {
        return httpRequest('post','/notify/batchupdateNofifyway',params)
    },
    //改变消息方式 /apiw
    wayStatus:function (params) {
        return httpRequest('post','/notify/updateNotifyWayStatus',params)
    },
    //修改消息推送   /api
    notifywaytotype:function (params) {
        return httpRequest('post','/notify/notifywaytotype',params)
    },
    //我的账号
    //操作员信息
    nowManagementInfo:function (params) {
        return httpRequest('post','/myaccount/operator',params)
    },
    //商户信息
    merchant:function (params) {
        return httpRequest('post','/myaccount/merchant',params);
    },
    //修改登录密码
    modifyLoginPass:function (params) {
        return httpRequest('post','/myaccount/modify/pwd',params);
    },
    //绑定手机号
    bindPhone:function (params) {
        return httpRequest('post','/myaccount/bind/phone',params);
    },
    //绑定邮箱  /api
    bindEmail:function (params) {
        return httpRequest('post','/myaccount/bind/email',params);
    },
    //手机验证码
    sendPhone:function (params) {
        ////api/
        return httpRequest('post','/myaccount/sendcode/phone',params);
    },
    //邮箱验证码
    sendEmail:function (params) {
        return httpRequest('post','/myaccount/sendcode/email',params);
    },
    //操作员管理
    queryListOperator:function (params) {
        return httpRequest('post','/operator/list',params)
    },
    //操作员详情
    detailOperator:function (params) {
        return httpRequest('post','/operator/id?operatorId',params)
    },
    //新增操作员
    addOperator:function (params) {
        console.log(params)
        return httpRequest('post','/operator/add',params)
    },
    //删除操作员
    deleteOperator:function (params) {
        return httpRequest('post','/operator/delete',params)
    },
    //重置操作员密码
    resetPass:function (params) {
        return httpRequest('post','/operator/reset/pwd',params)
    },
    //修改操作员信息
    updateOperator:function (params) {
        return httpRequest('post','/operator/update',params)
    },
    //查询角色列表
    queryRoleList:function (params) {
        return httpRequest('post','/role/list',params)
    },
    //查询角色详情
    roleDetail:function (params) {
        return httpRequest('post','/role/id',params)
    },
    //添加角色
    roleAdd:function (params) {
        return httpRequest('post','/role/add',params)
    },
    //修改角色配置
    roleUpdate:function (params) {
        return httpRequest('post','/role/update',params)
    },
    //查询权限
    queryResource:function (params) {
        return httpRequest('post','/role/resource/all',params)
    },
    //查询角色权限
    queryRoleResource:function (params) {
        return httpRequest('post','/role/resource',params)
    },
    //银行卡查询审核通过
    queryCard:function (params) {
        return httpRequest('post','/liquidateInfo/query',params)
    },
    //银行卡查询所有
    queryCardAll:function (params) {
        return httpRequest('post','/liquidateInfo/queryAll',params)
    },
    //银行列表  /api
    queryBankList:function (params) {
        return httpRequest('post','/liquidateInfo/bankList',params)
    },
    //支行列表
    bankBrancheList:function (params) {
        return httpRequest('post','/liquidateInfo/bankBrancheList',params)
    },
    //國家列表  /api
    countrylist:function (params) {
        return httpRequest('post','/liquidateInfo/countryList',params)
    },
    //省  /api
    provinceList:function (params) {
        return httpRequest('post','/liquidateInfo/provinceList',params)
    },
    //市  /api
    cityList:function (params) {
        return httpRequest('post','/liquidateInfo/cityList',params)
    },
    //添加银行卡
    addBankCard:function (params) {
        return httpRequest('post','/liquidateInfo/add',params)
    },
    //银行卡详情
    cardDetail:function (params) {
        return httpRequest('post','/liquidateInfo/detail',params)
    },
    //删除银行卡
    deleteCard:function (params) {
        return httpRequest('post','/liquidateInfo/delete',params)
    },
    //我的消息  列表
    messageList:function (params) {
        return httpRequest('post','/announcement/index',params)
    },
    //消息详情  /api
    messageDetail:function (params) {
        return httpRequest('post','/announcement/detail',params)
    },
    //日志查询
    oplogList:function (params) {
        return httpRequest('post','/oplog/list',params)
    },
    //消息详情
    mesDetails:function (params) {
        return httpRequest('post','/announcement/detail',params)
    },
    //提现账户
	withdrawApply:function (params) {
		return httpRequest('post','/acct/queryAccCategoryListByMemberCode',params)
	},
    //账户选择
	accountSelect:function(params){
		return httpRequest('post','/acct/queryaccttypeList',params)
	},
    //提现查询--查询按钮
	withdrawQuery:function(params){
		return httpRequest('post','/withdraw/queryfundoutList',params)
	},
    //提现查询--下载列表
	withdrawDownload:function(params){
		return httpRequest('post','/withdraw/exportfoundorder',params,'',{responseType:"arraybuffer"})
	},
    //提现-->提现申请-->提现账户选择后，掉用接口
	accountSelectAfterCall:function(params){
		return httpRequest('post','/withdraw/getBanlance',params)
	},
    //交易密码
	transactionPassword:function(params){
		return httpRequest('post','/withdraw/pay',params)
	},
    //提现详情
	withdrawDetail:function(params){
		return httpRequest('post','/withdraw/fundorderDetail',params)
	},
//    通知配置 查询   /api
    notifyQuery:function(params){
        return httpRequest('post','/notify/url/query',params)
    },
//    通知配置  保存   /apiC
    notifyConfig:function(params){
        return httpRequest('post','/notify/url/config',params)
    }
}
export default classPost