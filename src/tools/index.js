import fetcher from './fetcher';
export default {
    install (Vue) {
        Object.defineProperty(Vue.prototype, '$http', {
            value: fetcher
        });
    }
};
