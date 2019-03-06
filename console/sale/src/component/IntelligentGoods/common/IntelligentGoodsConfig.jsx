export const cateringWaitingStatus = [
  {key: 'shelves', text: '已上架', value: 'ONLINE'},
  {key: 'offline', text: '已下架', value: 'OFFLINE' },
];
export const cateringWaitingShelveStatus = [
  {key: 'waitingcomplete', text: '待完善', value: 'INIT'},
  {key: 'waitingshelve', text: '待上架', value: 'PENDING'},
  {key: 'waitingconfirm', text: '待商户确认', value: 'AUDIT'},
  {key: 'sendback', text: '已退回', value: 'RETURNED'},
  // {key: 'shelves', text: '已上架', value: 'ONLINE'},
  // {key: 'offline', text: '已下架', value: 'OFFLINE' }
];
export const waitingShelveStatus = [
  {key: 'waitingcomplete', text: '待完善', value: 'INIT'},
  {key: 'waitingshelve', text: '待上架', value: 'PREPARED'},
  {key: 'waitingconfirm', text: '商户确认中', value: 'UNDER_REVIEW'},
  {key: 'shelves', text: '已搬家', value: 'ON_SHELVES'},
  {key: 'sendback', text: '已退回', value: 'REJECTED'}
];

export const shelvedStatus = [
  {key: 'shelved', text: '已上架', value: 'ON_SHELVES'},
  {key: 'shelved-unconfirm', text: '已上架-待确认', value: 'WAIT_TO_AUDIT'},
  {key: 'shelved-init', text: '已上架-待处理', value: 'INIT'},
];

export const todoListRequestUrl = {
  'GenericIndustry': '/item/leads/queryMerchantBySpStaffId.json'
};
