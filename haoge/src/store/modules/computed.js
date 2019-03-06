import { CHANGE } from '../mutation-types'
const state = {
    info:[]
}

// 同步事件
const mutations={
    [CHANGE](state, obj){
        state.info = obj
    }
}

// 异步事件
const actions ={
	change({commit}, obj){
       
        commit('CHANGE',obj)
    }
}

export default({
    state,
    actions,
    mutations
})