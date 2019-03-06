export const logShopActionList = [
	{key: 'CREATE_SHOP', value: '创建门店'},
	{key: 'MODIFY_SHOP', value: '修改门店'},
	{key: 'CLOSE_SHOP', value: '关闭门店'},
	{key: 'FREEZE_SHOP', value: '冻结门店'},
	{key: 'UNFREEZE_SHOP', value: '解冻门店'},
	{key: 'SURROUND_SHOP', value: '添加门店'},
	{key: 'REMOVE_SHOP', value: '移除门店'},
	{key: 'CREATE_SHOP_RATE', value: '创建门店费率'},
  {key: 'INVALID_SHOP_RATE', value: '失效门店费率'},
];

export const logMallActionList = [
  {key: 'CREATE_SHOP', value: '创建门店'},
  {key: 'MODIFY_SHOP', value: '修改门店'},
  {key: 'SURROUND_SHOP', value: '添加门店'},
  {key: 'REMOVE_SHOP', value: '移除门店'},
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
];

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

export const logMallFilterList = [];
logMallActionList.forEach((row) => {
  logMallFilterList.push({text: row.value, value: row.key});
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
	{key: 'WAIT_MERCHANT_CONFIRM', value: '待商户确认'},
	{key: 'LICENSE_AUDITING', value: '一证多开审核中'},
	{key: 'RISK_AUDITING', value: '风控审核中'},
	{key: 'WAIT_SIGN', value: '当面付签约中'},
	{key: 'RISK_AUDIT_FAIL', value: '风控审核未通过'},
	{key: 'BIZ_ORDER_CANCELED', value: '业务流水被撤销'},
	{key: 'MERCHANT_CONFIRM_REJECT', value: '企业开店,商户拒绝'},
	{key: 'PROCESS', value: '处理中'},
	{key: 'INIT', value: '初始'},
	{key: 'SUCCESS', value: '成功'},
	{key: 'FAIL', value: '失败'},
];

export const logResultMap = {};
logResultList.forEach((row) => {
  logResultMap[row.key] = row.value;
});

export const logFlowStatus = [
  {key: 'INIT', value: '初始'},
  {key: 'OPEN', value: '营业中'},
  {key: 'PAUSED', value: '暂停营业'},
  {key: 'CLOSED', value: '关店'},
  {key: 'FREEZE', value: '冻结'},
];

export const logFlowStatusMap = {};
logFlowStatus.forEach((row) => {
  logFlowStatusMap[row.key] = row.value;
});
