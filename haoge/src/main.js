// 引入vue、app、router
import Vue from 'vue';
import App from './App';
import router from './router';
//import ubcMobile from './ubcMobile'
import store from './store';
import VueI18n from 'vue-i18n';
import './assets/css/resetElement.css';
import './assets/css/common.css';
//import { getCookie } from './assets/js/get-cookie'
import ElementUI from 'element-ui';
import fingerprint from 'fingerprintjs2';
import fileDownload from 'js-file-download'
// element 语言包
import enLocale from 'element-ui/lib/locale/lang/en';
import zhLocale from 'element-ui/lib/locale/lang/zh-CN';
//引入echarts
// import echarts from 'echarts/lib/echarts'
// import 'echarts/lib/chart/line'
// import 'echarts/lib/chart/bar'
// import 'echarts/lib/chart/pie'
// import "echarts/lib/component/graphic";
// import "echarts/lib/component/grid";
// import "echarts/lib/component/legendScroll";
// import "echarts/lib/component/tooltip";
// import "echarts/lib/component/axisPointer";
// import "echarts/lib/component/polar";
// import "echarts/lib/component/geo";
// import "echarts/lib/component/parallel";
// import "echarts/lib/component/singleAxis";
// import "echarts/lib/component/brush";
// import "echarts/lib/component/calendar";
// import "echarts/lib/component/title";
// import "echarts/lib/component/dataZoom";
// import "echarts/lib/component/visualMap";
// import "echarts/lib/component/markPoint";
// import "echarts/lib/component/markLine";
// import "echarts/lib/component/markArea";
// import "echarts/lib/component/timeline";
// import "echarts/lib/component/toolbox";
// //import '../static/css/main.css' /*引入公共样式*/
import 'element-ui/lib/theme-chalk/index.css';
import "babel-polyfill";
// Vue.prototype.$echarts = echarts
Vue.prototype.$fileDownload = fileDownload
Vue.config.productionTip = false
Vue.prototype.$eventBus = new Vue()
//通过插件的形式挂载
Vue.use(VueI18n) 

//取得当前系统语言、浏览器语言
let language = (navigator.language || navigator.browserLanguage).toLowerCase();
language = (language === "zh-cn") ? "zh" : "en";
if(window.navigator.language.indexOf('zh')===-1){
  window.location.href = 'http://mps.ipaylinks.com/website/index.htm'
}

const i18n = new VueI18n({
    locale: localStorage.lang || language,    // 语言标识
    messages: {
      'zh': Object.assign(require('./lang/zh'), zhLocale),   // 中文语言包
      'en': Object.assign(require('./lang/en'), enLocale)    // 英文语言包
    }
})
fingerprint().get(function(result){
  localStorage.deviceId = result
})
// 注册Element时设置i18n的处理方法
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})


/* 入口根实例、组件  */
const VUE = new Vue({
  el: '#app',
  i18n,
  router,
  store,
  template: '<App/>',
  components: { App },
  // directive: { ubcMobile }
})

export default VUE;