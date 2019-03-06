import { getUrl, commonCallHandler } from 'Utility/ajax';

/**
 * @method getOrderList
 * @desc 获取生产单列表
 * @param options
 * @param options.pageNum
 * @param options.pageSize
 * @param options.produceOrderId
 * @param options.stuffType
 * @param options.gmtStart
 * @param options.gmtEnd
 * @param options.purchaserName
 * @param options.supplierName
 * @param options.supplierId
 * @param options.status
 * @returns {*}
 */
export const getOrderList = (options) => {
  return commonCallHandler({
    url: getUrl('/proxy.json'),
    data: {
      mappingValue: 'kbasset.pageQueryProduceOrder',
      ...options
    }
  });
};

/**
 * @method getOrderDetail
 * @desc 获取生产单详情
 * @param produceOrderId
 * @returns {*}
 */
export const getOrderDetail = produceOrderId => {
  return commonCallHandler({
    url: getUrl('/proxy.json'),
    data: {
      mappingValue: 'kbasset.queryProduceOrderDetail',
      produceOrderId
    }
  });
};

/**
 * @method getStuffAttributeList
 * @desc 获取物料模板材质列表
 * @param options.bizSource {"KOUBEI_ASSET - 口碑物料材质（有价格数据）"||""}
 * @returns {*}
 */
export const getStuffAttributeList = (options = {}) => {
  return commonCallHandler({
    url: getUrl('/proxy.json'),
    data: {
      domain: 'KOUBEI',
      mappingValue: 'kbasset.queryStuffAttribute',
      ...options
    }
  });
};

/**
 * @method getStuffTemplateList
 * @desc 获取模板列表
 * @param options
 * @param options.status
 * @param options.name
 * @param options.templateId
 * @param options.creator
 * @param options.startTime
 * @param options.endTime
 * @param options.stuffType 物料类型
 * @param options.stuffAttrName 物料属性
 * @returns {*}
 */
export const getStuffTemplateList = (options) => {
  return commonCallHandler({
    url: getUrl('/proxy.json'),
    data: {
      domain: 'KOUBEI',
      status: 'EFFECTIVE',
      bizSource: 'KOUBEI_STUFF,KOUBEI_CODE',
      mappingValue: 'kbasset.pageQueryTemplate',
      ...options
    }
  });
};

/**
 * @method getStuffUnitPrice
 * @desc 查询材料单价
 * @param options
 * @param options.stuffAttrId 物料类型ID
 * @param options.sizeCode 尺寸code
 * @param options.materialCode 材质code
 */
export const getStuffUnitPrice = options => {
  return commonCallHandler({
    url: getUrl('/proxy.json'),
    data: {
      mappingValue: 'kbasset.queryStuffPriceInfo',
      ...options
    }
  });
};

/**
 * @method submitProduceOrder
 * @desc 提交生产单
 * @param options
 * @param options.templateId 模板ID
 * @param options.materialCode 材质code
 * @param options.materialName 材质名称
 * @param options.supplierId 供应商ID
 * @param options.purchaseQuantity 申请数量
 * @param options.budgetUnitPrice 单价
 * @param options.budgetTotalPrice 总价
 * @returns {*}
 */
export const submitProduceOrder = options => {
  return commonCallHandler({
    url: getUrl('/proxy.json'),
    data: {
      mappingValue: 'kbasset.produceOrderPurchase',
      ...options
    }
  });
};

/**
 * @method getSupplierList
 * @desc 获取供应商列表
 * @returns {*}
 */
export const getSupplierList = () => {
  return commonCallHandler({
    url: getUrl('/proxy.json'),
    data: {
      mappingValue: 'kbasset.queryStuffSupplier'
    }
  });
};

/**
 * @method getRequestId
 */
export const getRequestId = () => {
  return commonCallHandler({
    url: getUrl('/proxy.json'),
    data: {
      mappingValue: 'kbasset.getRequestId'
    }
  });
};

/**
 * @method getAllocationRecord
 * @desc 获取生产单对应的分配记录
 * @param options
 * @param options.produceOrderId
 * @param options.pageNum
 * @param options.pageSize
 */
export const getAllocationRecord = (options) => {
  return commonCallHandler({
    url: getUrl('/proxy.json'),
    data: {
      mappingValue: 'kbasset.pageQueryProduceOrderAssigned',
      ...options
    }
  });
};

/**
 * @method getApplyItems
 * @desc 查询申请单明细列表
 * @param options
 * @param options.produceOrderId
 * @param options.templateId
 * @param options.materialCode
 */
export const getApplyItems = options => {
  return commonCallHandler({
    url: getUrl('/proxy.json'),
    data: {
      mappingValue: 'kbasset.pageQueryApplyItem',
      domain: 'KOUBEI',
      ...options
    }
  });
};

/**
 * @method allocateProduction
 * @desc 分配生产单
 * @param options
 * @param options.produceOrderId
 * @param options.itemIds
 */
export const allocateProduction = options => {
  return commonCallHandler({
    url: getUrl('/proxy.json'),
    data: {
      mappingValue: 'kbasset.updateProduceAndItem',
      domain: 'KOUBEI',
      ...options
    }
  });
};

/**
 * @method getInStockSummary
 * @desc 查询入库单详情
 * @param options
 * @param [options.purchaseItemId]
 * @param options.expressNo
 * @param options.expressCompany
 * @returns {*}
 */
export const getInStockSummary = options => {
  return commonCallHandler({
    url: getUrl('/proxy.json'),
    data: {
      mappingValue: 'kbasset.queryInStockSummary',
      domain: 'KOUBEI',
      ...options
    }
  });
};


/**
 * @typedef {Object} InStockOrder
 * @property orderId
 * @property itemId
 * @property summaryId
 * @property curQuantity
 * @property purchaseItemId
 */
/**
 * @method submitInStockRegister
 * @desc 提交入库单
 * @param options
 * @param options.logisticOrderNo 物流单号
 * @param options.checkOperatorId 验收人ID
 * @param options.checkOperatorName 验收人名称
 * @param options.remark
 * @param {InStockOrder[]} options.listInStockOrder
 */
export const submitInStockRegister = options => {
  return commonCallHandler({
    url: getUrl('/proxy.json'),
    data: {
      mappingValue: 'kbasset.doInStock',
      domain: 'KOUBEI',
      ...options
    }
  });
};

/**
 * @method getInStockLog
 * @desc 查询库存流水
 * @param options
 * @param options.logisticOrderNo 物流单号，
 * @param options.storageName 仓库,
 * @param options.templateName 模版名称,
 * @param options.orderId 申请单号,
 " @param options.templateId 模版ID,
 " @param options.summeryId 库存表主键，
 " @param options.pageNo 当前页码,
 " @param options.pageSize 每页条数
 */
export const getInStockLog = options => {
  return commonCallHandler({
    url: getUrl('/proxy.json'),
    data: {
      mappingValue: 'kbasset.queryStuffInstockItem',
      ...options
    }
  });
};

/**
 * @method getInventoryList
 * @desc 获取库存列表
 * @param options
 * @param options.merchantName 仓库名称，
 * @param options.stuffAttrId 物料属性,
 * @param options.stuffType 物料类型,
 * @param options.templeName 模板名称,
 * @param options.templateId 模版ID,
 * @param options.pageSize 每页条数,
 * @param options.pageNo 当前页数
 * @returns {*}
 */
export const getInventoryList = options => {
  return commonCallHandler({
    url: getUrl('/proxy.json'),
    data: {
      mappingValue: 'kbasset.queryStuffStockSummary',
      ...options
    }
  });
};

/**
 * @method getProviderInfo
 * @desc 查询服务商详情
 * @param options
 * @param options.operatorId 用户userId
 * @returns {*}
 */
export const getProviderInfo = options => {
  return commonCallHandler({
    url: getUrl('/sale/asset/queryUserNameAdderss.json'),
    data: {
      ...options
    }
  });
};
