/* 公用远程接口调用函数 */
import ajax from 'Utility/ajax';
import {appendOwnerUrlIfDev} from '../../../../common/utils';
import { getData as getFengdieData } from 'Utility/fengdie';
import {API_STATUS} from './enums';

export const handleApiException = (response, throws = false) => {
  if (response.status !== API_STATUS.SUCCEED || !response.data) {
    let errMessage = '未知错误';
    if (response.message) {
      errMessage = response.message;
    } else if (response.data) {
      errMessage = response.data.resultMsg || response.data.resultCode;
    } else {
      errMessage = response.resultMsg || response.resultCode;
    }
    if (throws && !(response instanceof Error)) {
      throw new Error(errMessage);
    }
    return errMessage;
  }
};

export const apiGetStuffAttrList = () => {
  const params = {
    mappingValue: 'kbasset.queryKBCodeStuffTemplate',
    bizSource: 'KOUBEI_CODE',
  };
  return new Promise((resolve, reject) => {
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      data: params,
      type: 'json',
    })
      .then(res => {
        if (res.status === API_STATUS.SUCCEED) {
          resolve(res.data.data);
        } else {
          reject(res);
        }
      })
      .catch(res => {
        reject(res);
      });
  });
};

export const apiGetStuffTemplateList = () => {
  return getFengdieData('kbcode-stuff-template/config/list-h5data');
};

export const apiGetShopList = () => {
  return new Promise((resolve, reject) => {
    return ajax({
      url: '/sale/kbcode/queryAppImportAgentShops.json',
      method: 'GET',
      type: 'json',
    })
      .then(res => {
        if (res.status === API_STATUS.SUCCEED) {
          resolve(res.data.shopList || []);
        } else {
          reject(res);
        }
      })
      .catch(res => {
        reject(res);
      });
  });
};
