export const INVOICE_MAP = {
  ELECTRONIC_INVOICE: '电子发票',
  PAPER_INVOICE: '机打发票',
};

export const INVOICE_OPTIONS = Object.keys(INVOICE_MAP).map(value => ({ label: INVOICE_MAP[value], value }));
