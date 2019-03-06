import { BREAD } from '../mutation-types.js';
let state = {
    breadListState:[]
}
let getters = {
    breadListState(){
      return JSON.parse(sessionStorage.getItem('breadListStorage')) || [];
    }
  }
let mutations={
    [BREAD](getters,list){
        getters.breadListState=list;
        sessionStorage.setItem('breadListStorage',list);
    }
}
let actions ={
    bread({commit},obj){
        commit('BREAD',obj)
    }
}
export default({
    state,
    getters,
    actions,
    mutations
})