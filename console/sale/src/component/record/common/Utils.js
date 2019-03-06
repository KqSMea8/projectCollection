import {message} from 'antd';

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * 例子：
 * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
export function dateFormat(date, fmt) {
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds(),
  };

  let str = fmt;
  if (/(y+)/.test(fmt)) {
    str = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  for (const k in o) {
    if (new RegExp('(' + k + ')').test(str)) {
      str = str.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return str;
}

export function formatDate(date) {
  return date && dateFormat(new Date(date), 'yyyy-MM-dd hh:mm');
}

export function limitUploadSize(info, limit) {
  if (Array.isArray(info)) {
    return info;
  }
  if (!info) {
    return [];
  }
  let fileList = info.fileList;
  const event = info.event;
  if (limit) {
    if (fileList.length > limit) {
      fileList = fileList.slice(-limit);
    }
  }
  fileList = fileList.slice(0);


  // 2. 读取远程路径并显示链接
  fileList = fileList.map((file) => {
    if (typeof file.response === 'string') {
      file.response = JSON.parse(file.response);
    }
    if (file.response) {
      // 组件会将 file.url 作为链接进行展示
      file.url = file.response.url;
      file.id = file.response.id;
    }
    return file;
  });

  // 3. 按照服务器返回信息筛选成功上传的文件
  if (info.file.length === undefined) {
    if (event !== undefined ) {
      fileList = fileList.filter((file) => {
        if (file.type && file.type.indexOf('image') !== -1 && file.size > 5 * 1024 * 1024) {
          message.error('图片最大5M');
          return false;
        }
        return true;
      });
    } else {
      fileList = fileList.filter((file) => {
        if (file.response) {
          if (file.response.buserviceErrorCode === 'USER_NOT_LOGIN') {
            message.error('请重新登录');
          }
          return file.response.status === 'success' || file.response.status === 'succeed';
        }
        return true;
      });
    }
  }
  return fileList;
}
