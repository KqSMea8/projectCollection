import {GETROLEDATA} from '../mutation_type';
import fetcher from '../../tools/fetcher';
const role = {
    state: {
        tableData: [],
        conditions: {
            pageSize: 1,
            pageLength: 10
        }
    },
    actions: {
        getRoleData ({commit}, datas) {
            fetcher.get('http://localhost:8087/role').then((res) => {
                if (Number(res.successful)) {
                    res.data.map((v, k) => {
                        let rulesArr = [];
                        JSON.parse(v.rules).map((val, key) => {
                            rulesArr.push(val.menuName);
                        });
                        v.rules = rulesArr;
                    });
                    commit(GETROLEDATA, res.data);
                }
            });
        }
    },
    mutations: {
        [GETROLEDATA] (state, datas) {
            state.tableData = datas;
        }
    }
};
export default role;
