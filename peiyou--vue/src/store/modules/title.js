const title = {
    state: {
        title: '欢迎页'
    },
    actions: {
        getTitle ({ commit }, title) {
            commit('GETTITLE', title);
        }
    },
    mutations: {
        GETTITLE (state, title) {
            state.title = title;
        }
    }
};
export default title;
