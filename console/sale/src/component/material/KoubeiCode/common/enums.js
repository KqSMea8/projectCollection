import { keyMirror } from '../../../../common/TypeUtils';

// 码生成状态
export const CODE_STATUS = keyMirror({
  INIT: null,
  PROCESS: null,
  FAILED: null,
  COMPLETED: null,
});
export const CODE_STATUS_TEXT = {
  [CODE_STATUS.INIT]: '处理中',
  [CODE_STATUS.PROCESS]: '处理中',
  [CODE_STATUS.FAILED]: '生成失败',
  [CODE_STATUS.COMPLETED]: '已生成',
};

// 绑定状态
export const BIND_STATUS = keyMirror({
  INIT: null,
  BINDED: null,
});

// 码绑定方式
export const BIND_TYPE = keyMirror({
  IN_SHOP_BINDING: null,  // 空码
  DIRECT_BINDING: null,   // 明码
});

export const BIND_SCENE = keyMirror({
  BIND_SHOP: null,
  BIND_TABLE: null,
  BIND_SHELVES: null,
  BIND_MALL: null,
  BIND_KAMERCHANT: null,
});

export const TEMPLATE_CATE = keyMirror({
  STICKER: null,
  TCARD: null,
  SINGLE_CODE: null,
  SHUIPAI: null,
  POSTER: null,
});

export const TEMPLATE_CATE_TEXT = {
  [TEMPLATE_CATE.STICKER]: '贴纸',
  [TEMPLATE_CATE.TCARD]: '台卡',
  [TEMPLATE_CATE.SINGLE_CODE]: '独立二维码',
  [TEMPLATE_CATE.SHUIPAI]: '水牌',
  [TEMPLATE_CATE.POSTER]: '海报',
};

// 码绑定来源（明码）
export const BIND_SOURCE = {
  // 空码（just for UI options）
  EMPTY: 'empty',
  EXCEL: 'excel',
  ISV: 'isv',
  SHOP_PICKER: 'shop_picker',
};

// 物料类型
// NOTE: 此枚举类型值实际上由后端给出，因业务需要硬编码
export const STUFF_ATTR = keyMirror({
  DOOR_PASTER: null,
  TABLE_PASTER: null,
  SINGLE_QRCODE: null,
  MALL_DOOR_PASTER: null,
  CORE_CODE: null,
});

// 明码业务类型
export const BIND_BIZ_TYPE = keyMirror({
  MALL: null,      // 商圈码
  CATERING: null,  // 餐饮
  RETAIL: null,    // 零售
});

// 上传组件Upload，上传状态
export const UPLOAD_STATUS = {
  UPLOADING: 'uploading',
  DONE: 'done',
  ERROR: 'error',
  REMOVED: 'removed',
};

// API Status
export const API_STATUS = {
  SUCCEED: 'succeed',
  FAILED: 'failed',
};

// userType
export const USER_TYPE = keyMirror({
  BUC: null,
  PROVIDER: null,
  P_STAFF: null
});

export const ISV_IMPORT_LIMIT = {
  /**
   * 服务应用导入：单店桌数上限
   */
  SINGLE_SHOP_MAX_TABLE_COUNT: 300,

  /**
   * 服务应用导入：多店总桌数上限
   */
  MULTI_SHOP_MAX_TABLE_COUNT: 150,

  /**
   * 服务应用导入：门店超过此数量则收起城市，不超过则展开到门店
   */
  SHOW_TABLE_MAX_SHOP_COUNT: 500,
};
