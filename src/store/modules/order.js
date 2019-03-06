import axios from 'axios';
import { CHANGESTARTINDEX, CHANGEENDINDEX, CHANGEDATA, CHANGENAME, CHANGELENGTH } from '../modules_types';
const order = {
    state: {
        startIndex: 1,
        endIndex: 10,
        data: [],
        length: 0,
        name: ''
    },
    getters: {
        filterData (state) {
            return state.data.filter((v) => {
                for (let i in v) {
                    return v[i] === state.name;
                }
            });
        }
    },
    actions: {
        changeOrderData ({commit}, changenum) {
            const {startIndex, endIndex} = changenum;
            axios({
                url: '/data',
                method: 'POST',
                params: changenum
            }).then(res => {
                if (res.status === 200) {
                    const {arr, length} = res.data;
                    commit('CHANGESTARTINDEX', startIndex);
                    commit('CHANGEENDINDEX', endIndex);
                    commit('CHANGEDATA', arr);
                    commit('CHANGELENGTH', length);
                }
            });
        },
        changName ({commit}, name) {
            commit('CHANGENAME', name);
        }
    },
    mutations: {
        [CHANGESTARTINDEX] (state, startIndex) {
            // console.log(startIndex);
            state.startIndex = startIndex;
        },
        [CHANGENAME] (state, name) {
            state.name = name;
        },
        [CHANGEDATA] (state, data) {
            state.data = data;
        },
        [CHANGEENDINDEX] (state, endIndex) {
            state.endIndex = endIndex;
        },
        [CHANGELENGTH] (state, length) {
            state.length = length;
        }
    }
};
export default order;
