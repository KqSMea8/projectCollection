import * as types from '../mutation-types'

const state = {
    count: 10,
    isCollapse : false, // 侧边栏显示隐藏
    isWarpperLeft : '200px', //侧边栏宽度变化
}

// 初始计算state
const getters = {
    count:function(state){
        return state.count;
    },

    isWarpperLeft : function(state){
        return state.isWarpperLeft;
    }
}

// 同步事件
const mutations={
    add(state,n){
        state.count+=n;
    },
    reduce(state){
        state.count-=1;
    },
    INCREMENT_WITH_VALUE(state, value){
        state.count +=value;
    }
}

// 异步事件
const actions ={
	// 两种写法
    // addAction(context,n){
    //     context.commit('add',n)
    // },

    addAction({commit},n){
        commit('add',n)
    },

    // 常用
    reduceAction({commit}){
        commit('reduce')
        //setTimeout(()=>{commit('reduce')},1000); //异步模拟
    },
    incrementWithValue({commit}, value){
        commit("INCREMENT_WITH_VALUE",  parseInt(value))
    },

    // 侧边栏显示隐藏
    handleAction({commit}){
        commit('handle')
    },
}

export default({
    state,
    getters,
    actions,
    mutations
})