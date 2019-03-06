// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import elementUi from 'element-ui';
import fetcher from './tools';
import store from './store';
import './mock/server';
import particles from 'particles.js';
Vue.use(particles);
Vue.use(elementUi);
Vue.use(fetcher);
Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: { App }
});
