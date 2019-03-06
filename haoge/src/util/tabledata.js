export const datalist = [
    { prop:"date",label:"日期",width:"120"},
    { prop:"name",label:"名字",width:"120"},
    { prop:"province",label:"地区",width:"120"},
    { prop:"city",label:"城市",width:"120"},
    { prop:"address",label:"地址",width:"160"},
    { prop:"zip",label:"邮编",width:"120"},
    { prop:"operation",label:"其他操作",width:"120"}]
export const filterTable = [
    { 
        prop:'orderNumber', 
        label:"商户订单号",
        changehead:true,
        type:'input'
    },
    { 
        prop:'seriaNumber', 
        label:"交易流水号",
        changehead:true,
        type:'input'
    },
    { 
        prop:'createTime', 
        label:"创建时间",
        changehead:true,
        type:'time',
        showsort:true
    },
    { 
        prop:'okTime', 
        label:"完成时间",
        changehead:true,
        type:'time'
    },
    { 
        prop:'tradeCurrency', 
        label:"交易币种",
        changehead:true,
        type:'dropdown'
    },
    { 
        prop:'tradeMoney', 
        label:"交易金额",
        changehead:false    
    },
    { 
        prop:'CardOrganization', 
        label:"卡组织",
        changehead:true,
        type:'checkbox'
    },
    { 
        prop:'status', 
        label:"状态",
        changehead:true,
        type:'checkbox'
    },
    { 
        prop:'lastNum', 
        label:"卡号后四位",
        changehead:true,
        type:'input'
    },
    { 
        prop:'telNumber', 
        label:"商户手机号",
        changehead:true,
        type:'input'
    }
]
export const filterlist = [
    { prop:'defaults', label:"默认", isSelfDefined:'audio' },
    { prop:'name', label:"名称", isSelfDefined:'txt' },
    { prop:'show', label:"显示选择", isSelfDefined:'flag' },
    { prop:'operation', label:"操作", isSelfDefined:'many' },
]
export const setTradeInfo = [
    { prop:'itemName', label:"字段中文名称", isSelfDefined:'txt' },
    { prop:'itemFieldName', label:"字段英文名称", isSelfDefined:'txt' },
    { prop:'disabled', label:"显示", isSelfDefined:'flag' },
    { prop:'asCondition', label:"作为查询条件", isSelfDefined:'flags' },
    { prop:'setdefault', label:"设置查询默认值", isSelfDefined:'many' }
]
export const dealList = [
    { prop:'merchantOrderId', label:"商户订单号", isSelfDefined:'goto',width:'250' },
    { prop:'orderType', label:"交易类型", isSelfDefined:'txt',width:'120' },
    { prop:'payChannel', label:"渠道类型", isSelfDefined:'txt',width:'100' },
    { prop:'orderAmount', label:"交易金额", isSelfDefined:'txt',width:'150' },
    { prop:'orderCurrency', label:"交易币种", isSelfDefined:'txt',width:'100' },
    { prop:'gmtCreateTime', label:"创建时间", isSelfDefined:'txt',width:'180' },
    { prop:'refundStatus', label:"已退款", isSelfDefined:'txt',width:'100' },
    { prop:'outerStatus', label:"订单状态", isSelfDefined:'txt',width:'80' },
    { prop:'latestAdjustTime', label:"最晚审核时间", isSelfDefined:'txt',width:'180' },
    { prop:'set', label:"操作", isSelfDefined:'many',width:'120'},
]
export const protest = [
    { isSelfDefined:'ceck' },
    { prop:'orderNo', label:"商户订单号", isSelfDefined:'goto',width:'250' },
    {prop:'acsOrderId',label:'交易流水号',isSelfDefined:'txt',width:'250'},
    { prop:'tradeDate', label:"交易时间", isSelfDefined:'txt',width:'180' },
    { prop:'tradeAmount', label:"交易金额", isSelfDefined:'txt',width:'150' },
    { prop:'settlementRate', label:"清算汇率", isSelfDefined:'txt',width:'100' },
    { prop:'cpType', label:"订单类型", isSelfDefined:'txt',width:'80' },
    { prop:'chargeBackAmount', label:"拒付金额", isSelfDefined:'txt',width:'150' },
    { prop:'createDate', label:"拒付时间", isSelfDefined:'txt' ,width:'180'},
    { prop:'visableCode', label:"拒付原因", isSelfDefined:'txt',width:'180' },
    { prop:'status', label:"拒付状态", isSelfDefined:'txt',width:'100' },
    { prop:'latestAnswerDate', label:"最晚回复时间", isSelfDefined:'txt',width:'180'},
    { prop:'set', label:"操作", isSelfDefined:'many',width:'80'}
]