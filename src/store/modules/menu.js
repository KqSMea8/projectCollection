import fetcher from '../../tools/fetcher';
import { MUNULIST } from '../modules_types';
export const menu = {
    state: {
        menu: []
    },
    actions: {
        munuList ({commit}) {
            fetcher.get('http://localhost:8084/getMenuList').then((result) => {
                if (result.successful) {
                    commit(MUNULIST, JSON.parse(result.data));
                };
            });
        }
    },
    mutations: {
        [MUNULIST] (state, data) {
            state.menu = data;
        }
    }
};
