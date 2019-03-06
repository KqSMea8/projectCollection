import ajax from './ajax';
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
    if (!/^(\d+(-\d+){2}|\d+(-\d+){1}|\d+)$/.test(value)) {
      callback(new Error('请填写正确电话号码'));
      return;
    }
    const count = (value.match(/-/g) || []).length;
    if ((count === 0 && value.length === 11 && !/^[01]/.test(value)) ||
        (count === 0 && (value.length < 7 || value.length > 12)) ||
        (count === 1 && (value.length < 10 || value.length > 15)) ||
        (count === 2 && (value.length < 13 || value.length > 20))) {
      callback(new Error('请填写正确电话号码'));
      return;
    }
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
    url: window.APP.crmhomeUrl + '/shop/crm/checkMerchant.json',
    method: 'get',
    data: {
      partnerId: value,
    },
    type: 'json',
    success: (data) => {
      if (!data.status) {
        callback(new Error('无权为该商户开店'));
        return;
      }
      callback();
    },
    error: () => {
      callback(new Error('接口异常，无法验证商户'));
    },
  });
}


export function email(rule, value, callback) {
  if (value && !/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(value) && value.length > 49) {
    callback(new Error('请填写正确邮箱'));
    return;
  }
  callback();
}

export function person(rule, value, callback) {
  if (value && /\d+/.test(value) && value.length > 19) {
    callback(new Error('请输入正确的联系人'));
    return;
  }
  callback();
}

export function account(rule, value, callback) {
  if (value && !(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(value) || /^1\d{10}$/.test(value)) && value.length > 49) {
    callback(new Error('请输入正确的支付宝账号'));
    return;
  }
  callback();
}

export function shop(rule, value, callback) {
  if (value && !/^\d+$/.test(value) && value.length > 49) {
    callback(new Error('请输入正确的门店ID'));
    return;
  }
  callback();
}

export function orderNo(rule, value, callback) {
  if (value && !/^\d+$/.test(value) && value.length > 49) {
    callback(new Error('请输入正确的交易号'));
    return;
  }
  callback();
}

export function bankCardNumber(rule, value, callback) {
  if (value && !/^\d{10,20}$/.test(value)) { // 更准确的位数范围是 {13,16} http://www.regular-expressions.info/creditcard.html
    callback(new Error('请输入正确的银行卡号'));
    return;
  }
  callback();
}

// 从cms中配置错误文案
function findCodeMessage(code) {
  const validateCodes = window.__fd_validate_data || [];
  const obj = validateCodes.find((item) => { return item.code === code;});
  return obj ? obj.text : '';
}

export function commonCheck(fieldType, checkInfo, callback) {
  ajax({
    url: '/shop/qualityValidate.json',
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
      if (result.resultCode) {
        callback(new Error(findCodeMessage(result.resultCode)));
        return;
      }
      callback(new Error(result.resultMsg));
    },
  });
}

export function checkAddressCollect(data, callback) {
  ajax({
    data,
    url: '/shop/addressValidate.json',
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
  ajax({
    url: window.APP.ownUrl + '/shop/shopLocationCorrect.json', // window.APP.crmhomeUrl + '/shop/shopLocationCorrect.json'
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
