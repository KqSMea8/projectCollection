/*
 * axios http请求配置
 * @baseURL 请求api地址
 * @headers 头文件设置
 * @timeout 超时时间
 */
import Vue from 'vue'
import Axios from 'axios'
import Qs from 'qs'
import { Message, MessageBox } from 'element-ui'
import Env from './env'
import vm from '../main'

Vue.component(Message.name, Message)
Vue.component(MessageBox.name,MessageBox)
Axios.defaults.timeout = 30000
Axios.defaults.withCredentials = true
Axios.defaults.baseURL = Env.api || 'http://localhost:3000' // 当前环境地址
Axios.defaults.headers.common['AUTH_TOKEN'] = localStorage.data?JSON.parse(localStorage.data).token:''
Axios.defaults.headers.common['LANG'] = window.navigator.language
Axios.interceptors.request.use((config) => {
  return config
}, (error) => {
  
  return Promise.reject(error)
  
})
// if(res.data.code==="00000999"){
//  
// }
// code状态码200判断
Axios.interceptors.response.use((res) => {
    if(res.data.status==='0'){
      if(res.data.code==='00000400'||res.data.code==='00000447'){
        MessageBox.alert('登录已超时，请重新登录','提示',{
          confirmButtonText: '重新登录',
          type:'warning',
          showClose:false,
          closeOnClickModal:false,
        }).then(()=>{
          localStorage.removeItem('data')
          localStorage.removeItem('uname')
          localStorage.removeItem('current')
          window.location.href = `${window.location.origin}/#/login`
          setTimeout(()=>{
            window.location.reload()
          },300)
        })
      }else{
        Message({
          message:res.data.message,
          type:'error'
        })
        return Promise.reject(res)
      }
    } else {
      if(res.config.url=="http://localhost/mps-gateway/api/auth/login"&&!res.data.data.roleId){
        MessageBox.alert('您的操作员账号还未分配角色权限，请联系管理员','提示',{
          confirmButtonText: '更换账号',
          type:'warning',
          showClose:false,
          closeOnClickModal:false,
        }).then(()=>{
          localStorage.removeItem('data')
          localStorage.removeItem('uname')
          localStorage.removeItem('current')
          window.location.href = `${window.location.origin}/#/login`
          setTimeout(()=>{
            window.location.reload()
          },300)
        })
      }
      return res
    } 
}, (error) => {
  if(error.data){
    Message({
        message:error.data.message,
        type:'error'
    })
  } else if(error.response) {
    Message({
      message:error.response.statusText,
      type:'error'
    })
  } else {
    Message({
      message:'请求超时',
      type:'error'
    })
  }
  return Promise.reject(error)
})

export default Axios
