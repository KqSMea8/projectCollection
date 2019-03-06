import { ADDBASE, REMOVEBASE } from '../mutation-types.js';
let state = {
    upimgbase: new FormData()
}
let mutations={
    [ADDBASE](state,obj){
       if(obj){
            let arr = Object.keys(obj)
            arr.forEach((item)=>{
                state.upimgbase.append(item,obj[item])
            })
       }
    },
    [REMOVEBASE](state){
        state.upimgbase = new FormData()
    }
}
let actions ={
    addbase({commit},obj){
        commit('ADDBASE',obj)
    },
    removebase({commit}){
        commit('REMOVEBASE')
    }
}
export default({
    state,
    actions,
    mutations
})