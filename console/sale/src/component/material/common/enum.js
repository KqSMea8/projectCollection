import { keyMirror } from 'Common/TypeUtils';
export const StuffType = keyMirror({
  BASIC: null,
  ACTIVITY: null,
  ACTUAL: null,
  OTHER: null
});
export const StuffTypeText = {
  [StuffType.BASIC]: '基础物料',
  [StuffType.ACTIVITY]: '活动物料',
  [StuffType.ACTUAL]: '实物物料',
  [StuffType.OTHER]: '其他物料'
};
export const TemplateStatus = keyMirror({
  EFFECTIVE: null,
  INVALID: null
});
export const TemplateStatusText = {
  [TemplateStatus.EFFECTIVE]: '生效中',
  [TemplateStatus.INVALID]: '已失效'
};
export const ExpressStatus = keyMirror({
  RECEIVE_SUCCESS: null,
  DELIVER_SUCCESSDELIVER_SUCCESS: null,
  TRANSIT: null,
  DELIVERY_REMIND: null,
  TO_PICK_UP: null,
  RECEIVE_SIGN: null,
  SIGN_FAILED: null
});
export const ExpressStatusText = {
  [ExpressStatus.RECEIVE_SUCCESS]: '揽件成功',
  [ExpressStatus.DELIVER_SUCCESSDELIVER_SUCCESS]: '快件发出',
  [ExpressStatus.TRANSIT]: '中转',
  [ExpressStatus.DELIVERY_REMIND]: '派件提醒',
  [ExpressStatus.TO_PICK_UP]: '待提货',
  [ExpressStatus.RECEIVE_SIGN]: '已签收',
  [ExpressStatus.SIGN_FAILED]: '签收失败'
};
