const TYPE_KEY = 'kb-sale-commission';

export const SubType = {
  CUSTOMER_SERVICE_VIEW: 'customer-service-view',
  CS_MANUAL_CLICK: 'cs-manual-click',
  CS_SUBMIT_INVOICE_CLICK: 'cs-submit-invoice-click',
  CS_COMPLAINT_CLICK: 'cs-complaint-click',
  COMPLAINT_MUST_READ_CLICK: 'complaint-must-read-click',
  FILLOUT_INVOICE_MUST_READ_CLICK: 'fillout-invoice-must-read-click',
  SUBMIT_INVOICE_MUST_READ_CLICK: 'submit-invoice-must-read-click',
  ADD_INVOICE_ITEM_CLICK: 'add-invoice-item-click',
};

export const SubTypeName = {
  [SubType.CUSTOMER_SERVICE_VIEW]: '客服中心 - 查看',
  [SubType.CS_MANUAL_CLICK]: '客服中心 - 操作手册 - 点击',
  [SubType.CS_SUBMIT_INVOICE_CLICK]: '客服中心 - 提交发票必读 - 点击',
  [SubType.CS_COMPLAINT_CLICK]: '客服中心 - 申诉前必读 - 点击',
  [SubType.COMPLAINT_MUST_READ_CLICK]: '申诉 - 申诉前必读 - 点击',
  [SubType.FILLOUT_INVOICE_MUST_READ_CLICK]: '提交发票 - 填写发票 - 必读 - 点击',
  [SubType.SUBMIT_INVOICE_MUST_READ_CLICK]: '帐单查询 - 提交发票 - 必读 - 点击',
  [SubType.ADD_INVOICE_ITEM_CLICK]: '提交发票 - 新增发票行 - 点击'
};

export default function log(type, data = {}) {
  if (window.Tracker && window.Tracker.custom) {
    window.Tracker.custom(TYPE_KEY, {
      subType: type,
      subTypeName: SubTypeName[type],
      data: typeof data === 'object' ? JSON.stringify(data) : data
    });
  }
}
