import fetch from '@alipay/kb-fetch';

const ajax = fetch.ajax;
/**
 * 获取拜访小记列表
 */
export function getRecordList(params) {
  return ajax({
    url: `${window.APP.kbservcenterUrl}/sale/visitrecord/queryVisitRecord.json`,
    type: 'json',
    data: params,
  });
}

/**
 * 获取拜访小记详情
 */
export function getRecordDetail(recordId) {
  return ajax({
    url: `${window.APP.kbservcenterUrl}/sale/visitrecord/queryDetailInfo.json`,
    type: 'json',
    data: { recordId },
  });
}

export function approve(recordId, isValid, invalidReason) {
  return fetch({
    url: 'kbservcenter.visitRecordOpManager.auditRecord',
    param: {
      recordId,
      auditResult: isValid ? 1 : 0,
      invalidReason: isValid ? '' : invalidReason,
    },
  }).catch(e => {
    throw e && e.message;
  });
}

/**
 * 查询拜访商户
 * @param keywords 搜索关键字
 * @param isAllMerchant 是否查所有商户
 */
export function loadVisitMerchant(keywords, isAllMerchant) {
  const isSelfForNotAll = keywords ? 3 : 1;
  return ajax({
    url: `${window.APP.kbservcenterUrl}/sale/visitrecord/queryVisitObj.json`,
    data: {
      type: 'MERCHANT',
      customerName: keywords || '', // 搜索名称
      isSelf: isAllMerchant ? 4 : isSelfForNotAll, // 商户范围（1我的商户  2下属商户  3我的商户+下属商户  4所有商户）
    },
  });
}

/**
 * 查询 拜访人/归属人 BD
 * @param keywords 搜索关键字
 * @param isSelf 传 true 则返回当前用户
 */
export function loadVisitBdUser(keywords, isSelf) {
  return ajax({
    url: `${window.APP.kbservcenterUrl}/sale/visitrecord/queryVisitBdUser.json`,
    data: {
      userName: keywords || '', // 搜索名称
      isSelf: isSelf ? 1 : undefined,
    },
  });
}

export function loadSubCompany(merchantId) {
  return fetch({
    url: 'kbsales.merchantCompanyManager.getByMerchantId',
    param: {
      merchantId,
    },
  });
}

export function addSubCompany(merchantId, companyName) {
  return fetch({
    url: 'kbsales.merchantCompanyManager.add',
    param: {
      merchantId,
      name: companyName,
    },
  });
}

export function queryContacts(merchantId) {
  return ajax({
    url: `${window.APP.kbservcenterUrl}/sale/visitrecord/queryVisitContacts.json`,
    data: { customerId: merchantId },
  });
}

/**
 * 添加拜访对象
 * @param param
 * @param param.customerId 拜访的商户
 * @param param.name 拜访对象姓名
 * @param [param.tel] 拜访对象电话
 * @param param.position 拜访对象职务 CEO、STAY_DIRECTOR（运营总监）、MARKET_DIRECTOR（市场总监）、WIDE_DIRECTOR（推广总监）、OTHER
 * @param param.otherPosition 选其他职务时，这里传输入的拜访对象职务
 */
export function addContacts(param) {
  return ajax({
    url: `${window.APP.kbservcenterUrl}/sale/visitrecord/createVisitContacts.json`,
    method: 'post',
    data: {
      ...param,
      bizType: 'MERCHANT',
    },
  });
}

/**
 * 修改拜访对象
 * @param param
 * @param param.customerId 拜访的商户
 * @param param.id 拜访对象的id
 * @param param.name 拜访对象姓名
 * @param [param.tel] 拜访对象电话
 * @param param.position 拜访对象职务 CEO、STAY_DIRECTOR（运营总监）、MARKET_DIRECTOR（市场总监）、WIDE_DIRECTOR（推广总监）、OTHER
 * @param param.otherPosition 选其他职务时，这里传输入的拜访对象职务
 */
export function modifyContacts(param) {
  return fetch({
    url: 'kbservcenter.visitContactPersonManager.modifyContactPerson',
    param: {
      ...param,
      bizType: 'MERCHANT',
    },
  });
}

/**
 * 删除拜访对象
 * @param objectId 拜访对象的id
 */
export function deleteContacts(objectId) {
  return fetch({
    url: 'kbservcenter.visitContactPersonManager.deleteContactPerson',
    param: {
      id: objectId,
    },
  });
}

export function addVisit(param) {
  return ajax({
    url: `${window.APP.kbservcenterUrl}/sale/visitrecord/createVisitRecord.json`,
    method: 'post',
    data: {
      customerType: 'MERCHANT',
      ...param,
    },
  });
}

export function getDigitalFeedback(merchantId) {
  return fetch({
    url: 'kbservcenter.visitRecordQrManager.getMerchantDigitalFeedback',
    param: {
      merchantId,
    },
  });
}
