import axios from 'axios';
import {
    GETDATAS,
    SETTOTAL,
    SETCONDITIONS,
    GETSEARCH,
    GETALLDATA
} from '../mutation_type';
const order = {
    state: {
        datas: [],
        conditions: {
            pageSize: 1,
            pageLength: 10
        },
        total: 0,
        names: '',
        allData: []
    },
    actions: {
        getDatas ({commit, state}) {
            axios({
                method: 'GET',
                url: '/orders',
                params: state.conditions
            }).then((res) => {
                commit('GETALLDATA', res.data.datas.tableLists);// 获取全部数据
                commit('GETDATAS', res.data.data);// 获取数据
                commit('SETTOTAL', res.data.total);// 获取total
            });
        },
        getAllData ({commit}, allData) {
            commit('GETALLDATA', allData);// 获取全部数据
        },
        setTotal ({commit}, total) {
            commit('SETTOTAL', total);
        },
        setConditions ({commit}, conditions) {
            commit('SETCONDITIONS', conditions);// 获取每一次的点击的值交给mutations覆盖
        },
        getSearch ({commit}, names) {
            commit('GETSEARCH', names);
        }
    },
    mutations: {
        [GETDATAS] (state, data) {
            state.datas = data;// 覆盖每一次的数据 [GETDATAS]形式可以进行计算
        },
        [SETTOTAL] (state, total) {
            state.total = total;// 覆盖每一次的total
        },
        [SETCONDITIONS] (state, conditions) {
            // 在不改变原对象的情况下将后来的params添加进去
            state.conditions = Object.assign({}, state.conditions, conditions);
        },
        [GETSEARCH] (state, names) {
            // 将input框内的值传过来
            state.names = names;
        },
        [GETALLDATA] (state, allData) {
            // 获取所有数据
            state.allData = allData;
        }
    }
};
export default order;
