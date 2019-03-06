import Vue from 'vue'
import Vuex from 'vuex'
import global from './modules/global'
import upload from './modules/upload'
import bread from './modules/bread'
import computed from './modules/computed'
Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
		global,
		upload,
		bread,
		computed
	},
})