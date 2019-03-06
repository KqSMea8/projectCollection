/*
 * api请求封装
 * @type 请求方式(post/get)
 * @url 请求地址
 * @params 传递参数
 * @isOutsideLink 是否为外链
 * url为空时默认取isOutsideLink参数
 * @config 单独设置请求头信息
 */
import Axios from './config'

export function httpRequest (type, url, params, isOutsideLink, config) {
  
    // get
  if (type === 'get') {
        // debugger;
    return new Promise((resolve, reject) => {
      url = isOutsideLink || Axios.defaults.baseURL + url
      Axios.get(url, { params }, config || {})
                .then(response => {
                  resolve(response.data)
                }, err => {
                  reject(err)
                })
                .catch((error) => {
                  reject(error)
                })
    })
  }

    // post
  if (type === 'post') {
    
    return new Promise((resolve, reject) => {
      url = isOutsideLink || Axios.defaults.baseURL + url
      Axios.post(url, params, config || {})
                .then(res => {
                  resolve(res.data)
                }, err => {
                  reject(err)
                })
                .catch((error) => {
                  reject(error)
                })
    })
  }
}

export default httpRequest
