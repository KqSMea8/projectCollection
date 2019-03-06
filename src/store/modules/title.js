import {CHANGEFLAG, CHANGETITLE} from '../modules_types';
const title = {
    state: {
        title: '',
        flag: false
    },
    actions: {
        changTitle ({commit}, title) {
            commit('CHANGETITLE', title);
        },
        changFlag ({commit}, val) {
            commit('CHANGEFLAG', val);
        }
    },
    mutations: {
        [CHANGETITLE] (state, title) {
            state.title = title;
        },
        [CHANGEFLAG] (state) {
            console.log(state.flag);
            state.flag = !state.flag;
        }
    }
};
export default title;
