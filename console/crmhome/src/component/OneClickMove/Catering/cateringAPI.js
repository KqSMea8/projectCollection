import fetch from '@alipay/kb-fetch';
import ajax from '../../../common/ajax';
import { isFromKbServ } from '../../../common/utils';

export const caterCallChannelMap = {
  kbsale: 'SALES_MG',         // 销售中台
  crmhome: 'CRM_HOME',        // 商家中心
  mapp: 'MERCHANT_APP',       // 口碑掌柜/商户app
  dingtalk: 'DING_DING',      // 钉钉客户端
  openAPI: 'OPEN_PLATFORM',   // 开放平台
};

const caterCallChannel = isFromKbServ() ? caterCallChannelMap.kbsale : caterCallChannelMap.crmhome;

export const asyncAjax = (() => {
  const c = {};
  return ({ cache = false, ...opts }) => {
    if (cache && c[JSON.stringify(opts)]) {
      return Promise.resolve(c[JSON.stringify(opts)]);
    }

    return new Promise((resolve, reject) => {
      ajax({
        ...opts,
        success: resp => {
          if (cache) {
            c[JSON.stringify(opts)] = resp;
          }
          resolve(resp);
        },
        error: reject,
      });
    });
  };
})();

/**
 * 商品置顶
 * 文档：https://lark.alipay.com/kbcatering/documents/itemstick#%E7%BD%AE%E9%A1%B6%E6%8E%A5%E5%8F%A3
 * 搬家那边不出置顶功能 只有自运营这边有 操作仅限商户自己
 *
 * @export
 * @param {any} itemId 商品 ID
 * @returns {Promise<resp>}
 */
export function stickItem(itemId) {
  const url = '/goods/caterItem/stickItem.json';
  return asyncAjax({
    method: 'POST',
    url,
    data: {
      itemId,
      caterCallChannel,
    },
  });
}

/**
 * 商品取消置顶
 * 文档：https://lark.alipay.com/kbcatering/documents/itemstick#%E5%8F%96%E6%B6%88%E7%BD%AE%E9%A1%B6%E6%8E%A5%E5%8F%A3
 *
 * @export
 * @param {any} itemId 商品 ID
 * @returns {Promise<resp>}
 */
export function stickCancelItem(itemId) {
  const url = '/goods/caterItem/stickCancelItem.json';
  return asyncAjax({
    method: 'POST',
    url,
    data: {
      itemId,
      caterCallChannel,
    },
  });
}

/**
 * 检查是否签约了在线购买协议
 * 文档：https://lark.alipay.com/kbcatering/documents/bvg609#15.-%E6%A3%80%E6%9F%A5%E5%95%86%E6%88%B7%E6%98%AF%E5%90%A6%E7%AD%BE%E8%AE%A2%E5%9C%A8%E7%BA%BF%E8%B4%AD%E4%B9%B0%E5%8D%8F%E8%AE%AE-%E9%98%BF%E5%88%97
 *
 * @export
 * @returns {Promise<resp>}
 */
export function checkSign() {
  const url = '/goods/catering/checkSign.json';
  return asyncAjax({
    url,
  });
}

/**
 * 暂停商品（俗称下架）
 *
 * @export
 * @param {any} itemId 商品 ID
 * @returns {Promise<resp>}
 */
export function merchantPause(itemId) {
  const url = '/goods/caterItem/merchantPause.json';
  return asyncAjax({
    method: 'POST',
    url,
    data: { itemId },
  });
}

/**
 * 新增核销方式查询接口
 * 文档: https://lark.alipay.com/kbfhy/hg5t9o/mr3a24
 * Array<{
 *  ticketDisplayMode: //核销方式 券码/付款码 ex. TICKET_CODE USER_PAY_CODE
 *  defaultMode: //是否是默认的核销方式 ex. true false
 *  goodsIdRequired: //是否需要填写sku ex. true false
 * }>
 */
export function queryAvailableTicketDisplayMode(data) {
  const url = '/goods/caterItem/queryAvailableTicketDisplayMode.json';
  // const url = 'http://pickpost.alipay.net/mock/crmhome/goods/caterItem/queryAvailableTicketDisplayMode.json';
  return asyncAjax({
    url,
    cache: true,
    data,
  });
}

/**
 * 查询KFC场景外部券码核销商户白名单服务
 * 文档：https://lark.alipay.com/kbcatering/documents/external-ticket-item
 *
 * @export
 * @returns {Promise<resp>}
 */
export function checkExternalTicketCode() {
  const url = '/goods/caterItem/checkExternalTicketCode.json';
  return asyncAjax({
    url,
  });
}

/**
 * 审核结果查询
 *
 * @export
 * @param {any} itemId 商品 ID
 * @returns {Promise<resp>}
 */
export function queryAuditLabels(itemId) {
  return fetch({
    url: 'kbaudit.auditQueryService.queryAuditLabels',  // 对应 spi 网关的 bizType
    param: {
      bizId: itemId,
      bizType: 'ITEM',
    },
  });
}
