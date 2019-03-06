import ajax from 'Utility/ajax';
import {message} from 'antd';

export function noBracket(rule, value, callback) {
  if (/[\(\)（）]/.test(value)) {
    callback(new Error('直接填写名称无需输入括号'));
    return;
  }
  callback();
}

/*
1、门店创建的电话号码不允许为空；
2、不含“-”的电话号码长度为7到12位。包含固话、手机、400/800号码。
-对11位长度的号码校验：不是“0或1”开头是错的
3、含“-”的电话号码长度为10到20位。
-含一个“-“的电话号码长度为10到15位;
-含两个“-“的电话号码长度为13到20位；
-不能连续出现2个“-”，不能在开头和结尾。
*/
export function telephone(rule, value, callback) {
  if (value) {
    const tempContactArr = value.split(',');
    tempContactArr.forEach((el) => {
      if (!/^(\d+(-\d+){2}|\d+(-\d+){1}|\d+)$/.test(el)) {
        callback(new Error('请填写正确电话号码'));
        return;
      }
      const count = (el.match(/-/g) || []).length;
      if (count === 0 && el.length === 11 && !/^[01]/.test(el) ||
        count === 0 && (el.length < 7 || el.length > 12) ||
        count === 1 && (el.length < 10 || el.length > 15) ||
        count === 2 && (el.length < 13 || el.length > 20)) {
        callback(new Error('请填写正确电话号码'));
        return;
      }
    });
  }
  callback();
}

export function mobilephone(rule, value, callback) {
  if (value && !/^1\d{10}$/.test(value)) {
    callback(new Error('请输入正确的手机号码'));
    return;
  }
  callback();
}

export function forbiddenWord(rule, value, callback) {
  if (value.indexOf('$') > -1) {
    callback(new Error('不允许输入"$"'));
    return;
  }
  ajax({
    url: window.APP.crmhomeUrl + '/member/forbidWordValidator.json',
    method: 'post',
    data: {
      txt: value,
    },
    success: (data) => {
      if (data.stat === 'deny') {
        callback(new Error('接口禁止访问'));
        return;
      }
      if (!data.valid) {
        callback(new Error(data.msg));
        return;
      }
      callback();
    },
    error: () => {
      callback(new Error('接口请求失败'));
    },
  });
}

export function merchantPid(rule, value, callback) {
  ajax({
    url: window.APP.crmhomeUrl + '/shop/koubei/checkMerchant.json',
    method: 'get',
    data: {
      partnerId: value,
    },
    type: 'json',
    success: (result) => {
      if (result.status === 'failed') {
        callback(new Error(result.resultMsg));
        return;
      }
      callback();
    },
    error: (result) => {
      callback(new Error(result.resultMsg));
    },
  });
}

// 从cms中配置错误文案
function findCodeMessage(code) {
  const validateCodes = window.__fd_validate_data || [];
  const obj = validateCodes.find((item) => { return item.code === code;});
  return obj ? obj.text : '';
}

export function commonCheck(fieldType, checkInfo, callback) {
  ajax({
    url: '/sale/qualityValidate.json',
    method: 'get',
    data: {
      fieldType,
      ...checkInfo,
    },
    type: 'json',
    success: (result) => {
      if (result.resultCode) {
        callback(new Error(findCodeMessage(result.resultCode)));
        return;
      }
      callback();
    },
    error: (result) => {
      callback(new Error(result.resultMsg));
    },
  });
}

export function checkAddressCollect(data, callback) {
  ajax({
    data,
    url: '/sale/addressValidate.json',
    method: 'get',
    type: 'json',
    success: (result) => {
      const code = result.data;
      if (code === 'INVALID' || code === 'SUSPECT_INVALID') {
        message.error(findCodeMessage(code), 5);
        callback(new Error(findCodeMessage(code)));
        return;
      } else if (code === 'SUSPECT') {
        message.warn(findCodeMessage(code));
      }
      callback();
    },
    error: (result) => {
      callback(new Error(result.resultMsg));
    },
  });
}

export function validationAdcode(params, callback) {
  const url = '/shop/koubei/shopLocationCorrect.json';
  ajax({
    // url: 'http://crmhome-csy.d2309.alipay.net/shop/koubei/shopLocationCorrect.json',
    url: window.APP.crmhomeUrl + url,
    method: 'get',
    data: params,
    type: 'json',
    success: (result) => {
      if (result.status === 'succeed') {
        if (result.needCorrect) {
          callback(result);
        }
      }
    },
    error: (result) => {
      message.error(result.resultMsg, 3);
    },
  });
}
