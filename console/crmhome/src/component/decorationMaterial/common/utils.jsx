export const getCategoryId = () => {
  return window.location.hash.match(/decoration\/(\w+)\/?/)[1] || '';
};

export const getEntityCode = (code) => {
  const dom = document.createElement('div');
  dom.innerHTML = code;
  return dom.innerText || dom.textContent;
};

export const getKbWin = () => {
  const isKbInput = document.getElementById('J_isFromKbServ');
  return isKbInput && isKbInput.value === 'true' && window.parent;
};

export const getMerchantId = () => {
  const KbWin = getKbWin();
  let merchantId = '';
  if (KbWin) {
    const elm = KbWin.document.getElementById('kbMerchantId');
    if (elm && elm.innerHTML) {
      merchantId = elm.innerHTML;
    }
  }
  return merchantId;
};

export const kbScrollToTop = () => {
  const KbWin = getKbWin();
  if (KbWin) KbWin.scrollTo(0, 0);
};
