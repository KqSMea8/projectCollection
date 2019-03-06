export const logShopActionList = [
  {key: 'CREATE_SHOP', value: '创建门店'},
  {key: 'MODIFY_SHOP', value: '修改门店'},
  {key: 'CREATE_SHOP_ALLOCATION', value: '系统分配'},
  {key: 'ADJUST_SHOP_ALLOCATION', value: '手动分配'},
  {key: 'GRANT_SHOP_AUTHORIZATION', value: '门店授权'},
  {key: 'CANCEL_SHOP_AUTHORIZATION', value: '停止授权'},
  {key: 'CREATE_SHOP_JUDGE_RECOVER', value: '店铺创建判单恢复'},
  {key: 'CLOSE_SHOP', value: '关闭门店'},
  {key: 'FREEZE_SHOP', value: '冻结门店'},
  {key: 'UNFREEZE_SHOP', value: '解冻门店'},
  {key: 'SURROUND_SHOP', value: '圈店'},
  {key: 'REMOVE_SHOP', value: '移店'},
  {key: 'CREATE_SHOP_RATE', value: '创建门店费率'},
  {key: 'INVALID_SHOP_RATE', value: '失效门店费率'},
];

export const logLeadsActionList = [
  {key: 'CREATE_LEADS', value: '创建leads'},
  {key: 'MODIFY_LEADS', value: '修改leads'},
  {key: 'CLAIM_LEADS', value: '认领leads'},
  {key: 'RELEASE_LEADS', value: '释放leads'},
  {key: 'ALLOCATE_LEADS', value: '分配leads'},
];

export const logGoodsActionList = [
  {key: 'CREATE_ITEM', value: '创建商品'},
  {key: 'MODIFY_ITEM', value: '修改商品'},
  {key: 'MODIFY_ITEM_VISIBILITY', value: '正式上架'},
  {key: 'INVALID_ITEM', value: '下架商品'},
  {key: 'RESUME_ITEM', value: '恢复售卖'},
  {key: 'PAUSE_ITEM', value: '暂停售卖'},
  {key: 'ITEM_LOCK', value: '商品锁定'},// 针对服务中台 货架商品专用
  {key: 'ITEM_UNLOCK', value: '解锁商品'},// 针对服务中台 货架商品专用
];

export const logShopType = [
  {key: 'MALL', value: '综合体'},
  {key: 'COMMON', value: '普通门店'},
];


export const BillsStatu = [
  {key: '01', value: '客户确认中'},
  {key: '02', value: '对账完成'},
  {key: '03', value: '核销'},
  {key: '04', value: '止付'},
];
export const BillsStatuMap = {};
BillsStatu.forEach((row) => {
  BillsStatuMap[row.key] = row.value;
});
export const BillsStatuMapList = [];
BillsStatu.forEach((row) => {
  BillsStatuMapList.push({text: row.value, value: row.key});
});

export const LinkStatus = [
  {key: '01', value: '待结算'},
  {key: '02', value: '部分结算'},
  {key: '03', value: '结算完成'},
];
export const LinkStatusMap = {};
LinkStatus.forEach((row) => {
  LinkStatusMap[row.key] = row.value;
});
export const LinkStatusMapList = [];
LinkStatus.forEach((row) => {
  LinkStatusMapList.push({text: row.value, value: row.key});
});


export const invoiceType = [
  {key: '01', value: '增值税专用发票'},
  {key: '02', value: '增值税普通发票'},
  {key: '03', value: '营业税发票'},
  {key: '04', value: '国际形式发票'},
  {key: '06', value: '抵扣发票'},
  {key: '07', value: '虚拟发票'},
  {key: '05', value: '其它发票'},
];
export const invoiceTypeMap = {};
invoiceType.forEach((row) => {
  invoiceTypeMap[row.key] = row.value;
});
export const invoiceTypeMapList = [];
invoiceType.forEach((row) => {
  invoiceTypeMapList.push({text: row.value, value: row.key});
});


export const logGoodsShopTypeMap = {};
logShopType.forEach((row) => {
  logGoodsShopTypeMap[row.key] = row.value;
});
export const logGoodsShopTypeList = [];
logShopType.forEach((row) => {
  logGoodsShopTypeList.push({text: row.value, value: row.key});
});

export const logShopActionMap = {};

logShopActionList.forEach((row) => {
  logShopActionMap[row.key] = row.value;
});

export const logLeadsActionMap = {};

logLeadsActionList.forEach((row) => {
  logLeadsActionMap[row.key] = row.value;
});

export const logGoodsActionMap = {};

logGoodsActionList.forEach((row) => {
  logGoodsActionMap[row.key] = row.value;
});

export const logShopFilterList = [];
logShopActionList.forEach((row) => {
  logShopFilterList.push({text: row.value, value: row.key});
});

export const logGoodsFilterList = [];
logGoodsActionList.forEach((row) => {
  logGoodsFilterList.push({text: row.value, value: row.key});
});

export const logSourceList = [
  {key: 'system', value: '系统自动处理'},
  {key: 'crm_home', value: '商家中心'},
  {key: 'sales_mg', value: '销售中台'},
  {key: 'duplicate', value: '判单中心'},
  {key: 'isv', value: 'ISV'},
  {key: 'yun_zong', value: '云纵'},
  {key: 'merchant_app', value: '口碑商家APP'},
  {key: 'service_backend', value: '小二服务后台'},
  {key: 'future_window', value: '支付宝未来服务窗'},
  {key: 'kb_punlish', value: '处罚中心'},
];

export const logSourceMap = {};

logSourceList.forEach((row) => {
  logSourceMap[row.key] = row.value;
});

export const logChannelList = [
  {key: 'open_platform', value: '开放平台'},
  {key: 'mobile_app', value: '手机支付宝'},
  {key: 'merchant_app', value: '口碑商家APP'},
  {key: 'pc', value: 'PC'},
  {key: 'ding_ding', value: '集团钉钉客户端'},
  {key: 'system', value: '系统'},
  {key: 'backend', value: '后端系统'},
];

export const logChannelMap = {};

logChannelList.forEach((row) => {
  logChannelMap[row.key] = row.value;
});

export const logResultList = [
  {key: 'WAIT_CERTIFY', value: '实名认证中'},
  {key: 'LICENSE_AUDITING', value: '一证多开审核中'},
  {key: 'RISK_AUDITING', value: '风控审核中'},
  {key: 'WAIT_SIGN', value: '当面付签约中'},
  {key: 'PROCESS', value: '处理中'},
  {key: 'WAIT_MERCHANT_CONFIRM', value: '待商户确认'},
  {key: 'INIT', value: '初始'},
  {key: 'SUCCESS', value: '成功'},
  {key: 'FAIL', value: '失败'},
  {key: 'OPEN', value: '营业中'},
];

export const logResultMap = {};
logResultList.forEach((row) => {
  logResultMap[row.key] = row.value;
});

export const logContrastActionList = [
  {key: 'PAY', value: '打款'},
  {key: 'MODIFY', value: '调整'},
  {key: 'REPAY', value: '回款'},
  {key: 'LOG', value: '操作日志'},
];

export const logContrastFilterList = [
  {text: '启动打款', value: 'MANUAL_PAY'},
  {text: '门店调整', value: 'CONTRACT_SHOP_MODIFY'},
  {text: '回款', value: 'MANUAL_REPAY'},
];

export const alipayRecordOperaLogList = [
  {key: 'STUFF_PAVE_CHECK_INIT', value: '生成物料验收任务'},
  {key: 'STUFF_CHECK_AUDIT', value: '线上审核'},
  {key: 'STUFF_TEMPLATE_ADD', value: '物料模版新增'},
  {key: 'STUFF_TEMPLATE_COPY', value: '物料模版复制'},
  {key: 'STUFF_TEMPLATE_UP', value: '物料模版更新'},
  {key: 'STUFF_TEMPLATE_EFFECTIVE', value: '物料模版生效'},
  {key: 'STUFF_TEMPLATE_INVALID', value: '物料模版失效'},
  {key: 'STUF_MACHINE_AUDIT', value: '机器审核'},
  {key: 'STUFF_CHECK_OFFLINE', value: '云客服验收'},
  {key: 'STUFF_CHECK_INFO_TRANSFER', value: '物料验收任务转移'},
  {key: 'STUFF_PURCHASE', value: '物料采购'},
  {key: 'STUFF_QUOTEPRICE', value: '物料申请报价'},
  {key: 'STUFF_DISPATCHER', value: '物料调度预采购'},
  {key: 'APPLY_STUFF', value: '物料申请'},
  {key: 'STUFF_APPLY_ORDER_AUDIT_PASS', value: '审批通过'},
  {key: 'STUFF_APPLY_ORDER_AUDIT_REJECT', value: '审批驳回'},
  {key: 'STUFF_APPLY_ITEM_ASSIGN_SUPPLIER', value: '下单采购'},
  {key: 'FINISH_STOCK', value: '结束入库'},
  {key: 'IN_STOCK', value: '物料入库'},
  {key: 'OUT_STOCK', value: '物料出库'},
  {key: 'QR_CODE_APPLY', value: '空码申请'},
  {key: 'STUFF_DELIVER', value: '物料发货'},
  {key: 'STUFF_SEND', value: '供应商发货'},
  {key: 'STUFF_PROCESSING', value: '物料处理中'},
  {key: 'STUFF_SHIPPING', value: '物料发货中'},
  {key: 'STUFF_DELIVERED', value: '物料发货完毕'},
  {key: 'SUPPLIER_FEEDBACK', value: '供应商反馈'},
];
export const alipayRecordOperaLogMap = [];
alipayRecordOperaLogList.forEach((row) => {
  alipayRecordOperaLogMap.push({text: row.key, value: row.value});
});
