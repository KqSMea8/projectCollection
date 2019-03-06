import ajax from '@alipay/kb-ajax';
import { message, Modal } from 'antd';

const APP = window.APP || {};

function startsWith(str, prefix) {
  return str.slice(0, prefix.length) === prefix;
}

let hasNotLoginModal = false;

function safeStringify(data) {
  try {
    return JSON.stringify(data).substr(0, 1000);
  } catch (e) {
    return '';
  }
}

function KbAjax(opts = {}) {
  let req = undefined;

  const p = new Promise((resolve, reject) => {
    const { success: originSuccess, error: originError, url } = opts;
    let ownUrl = APP.ownUrl;

    if (ownUrl && startsWith(url, '/') && !startsWith(url, '//')) {
      if (ownUrl.charAt(ownUrl.length - 1) === '/') {
        ownUrl = ownUrl.slice(0, -1);
      }
      opts.url = ownUrl + url;
    }

    opts.data = opts.data || {};
    const merchantIdInput = document.getElementById('J_crmhome_merchantId');
    const merchantId = merchantIdInput ? merchantIdInput.value : '';
    if (merchantId) {
      opts.data.op_merchant_id = merchantId;
    }

    opts.success = (data = {}) => {  // eslint-disable-line
      // 接入Clue接口报错埋点
      if (data.status === 'failed' && window._clue_tracker) {
        try {
          window._clue_tracker.log({
            code: 2,  // 系统自动生成，请勿修改
            ajaxurl: opts.url,
            params: safeStringify(opts.data),
            msg: 'status failed',  // 异常信息
            sampleRate: 1.00,  // 目前采样率为 100.00%
            c1: opts.method ? opts.method.toLocaleUpperCase() : 'GET',  // HTTP method
            c2: opts.resultCode || '',      // 业务错误码
            c3: safeStringify(data),      // 接口结果
            c4: opts.resultMsg || '',      // 业务异常代码
            c5: '',       // 钉钉版本号
          });
        } catch (e) {
          console.error(e);
        }
      }

      if (data.timeout) {
        location.href = location.href;  // eslint-disable-line no-location-assign
        return;
      }
      // 正常返回的json数据结构
      // ajax超时跳转登录
      if ((data.stat === 'deny') || (data.status === 'deny')) {
        if (!hasNotLoginModal) {
          const isKbInput = document.getElementById('J_isFromKbServ');
          const isParentFrame = isKbInput && isKbInput.value === 'true' && window.parent;
          Modal.confirm({
            title: '登录超时，需要立刻跳转到登录页吗？',
            onOk() {
              if (isParentFrame) {
                window.parent.location.reload();
              } else {
                if (data.target) {
                  location.href = data.target; // eslint-disable-line no-location-assign
                } else {
                  location.reload();
                }
              }
            },
            onCancel() {
              hasNotLoginModal = false;
            },
          });
          hasNotLoginModal = true;
        }
        return;
      }
      const code = data.buserviceErrorCode;
      if (code) {
        let errorMessage = null;
        switch (code) {
        case 'TNT_INST_ID_NOT_FIND':
          errorMessage = '无法获取租户';
          break;
        case 'USER_HAS_NOT_PERMISSION':
        case 'USER_HAS_NOT_PERMISSION_SCOPE':
          errorMessage = '您没有权限操作!';
          break;
        default:
          errorMessage = '系统错误,CODE=' + code;
          break;
        }
        if (errorMessage) {
          KbAjax.showSystemError(errorMessage);
          if (originError) {
            originError(data, errorMessage);
          }
          reject(data, errorMessage);
        }
      } else {
        // error interceptor
        let error = null;
        for (let i = 0; i < KbAjax.errorInterceptors.length; i++) {
          error = KbAjax.errorInterceptors[i](data);
          if (error) {
            break;
          }
        }
        if (error) {
          if (originError) {
            originError(data, error);
          } else {
            KbAjax.showInterceptorError(error);
          }
          reject(data, error);
        } else {
          if (originSuccess) {
            originSuccess(data);
          }
          resolve(data);
        }
      }
    };

    opts.error = (e) => {
      // 接入Clue接口报错埋点
      if (window._clue_tracker) {
        try {
          window._clue_tracker.log({
            code: 2,  // 系统自动生成，请勿修改
            ajaxurl: opts.url,
            params: safeStringify(opts.data),
            msg: 'ajax error',  // 异常信息
            sampleRate: 1.00,  // 目前采样率为 100.00%
            c1: opts.method ? opts.method.toLocaleUpperCase() : 'GET',  // HTTP method
            c2: '',      // HTTP status
            c3: safeStringify(e),      // 接口结果
            c4: '',      // 业务异常代码
            c5: '',       // 钉钉版本号
          });
        } catch (err) {
          console.error(err);
        }
      }

      if (window.console && window.console.error) {
        window.console.error(e);
      }
      const error = '未知错误';
      if (originError) {
        originError(null, error);
      } else {
        KbAjax.showSystemError(error);
      }
      reject(null, error);
    };
    req = ajax(opts);
  });

  p.request = req ? req.request : null;

  return p;
}

KbAjax.ajaxSetup = (opts) => {
  KbAjax.buserviceUrl = opts.buserviceUrl;
  KbAjax.showSystemError = opts.showSystemError || message.error;
  KbAjax.showInterceptorError = opts.showInterceptorError || message.error;
  KbAjax.errorInterceptors = opts.errorInterceptors || [];
  ajax.ajaxSetup(opts);
};

KbAjax.ajaxSetup({
  cache: false,
});

export default KbAjax;
