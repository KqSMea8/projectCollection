// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import store from './store';
import ElementUI from 'element-ui';
import leaflet from 'leaflet';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router';
import './assets/style/style.css';
import fetcher from './tools';
import mock from './assets/service';
import particles from 'particles.js';
Vue.use(particles);
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(fetcher);
Vue.use(leaflet);
if (process.env.NODE_ENV === 'development') {
    mock.bootstrap();
}
new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: { App }
});
