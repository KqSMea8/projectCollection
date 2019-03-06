import { SETROLEDATA, CHANGEEDITTYPE } from '../modules_types';
import fetcher from '../../tools/fetcher';
const role = {
    state: {
        roleData: [],
        editType: '',
        colums: {
            startIndex: 1,
            endIndex: 10
        }
    },
    actions: {
        changeEditType ({commit}, type) {
            commit(CHANGEEDITTYPE, type);
        },
        setRoleData ({commit}) {
            fetcher.post('http://localhost:8084/homeRoleData').then((res) => {
                const {code, data} = res;
                if (code) {
                    console.log(data);
                    data.map((val) => {
                        let newArr = [];
                        const roles = JSON.parse(val.roles);
                        roles.map((v) => {
                            newArr.push(v.menuName);
                        });
                        val.roles = newArr;
                    });
                    commit(SETROLEDATA, data);
                }
            });
        },
        delRoleData ({commit}, row) {
            fetcher.post('http://localhost:8084/delRole', row).then((res) => {});
        }
    },
    mutations: {
        [SETROLEDATA] (state, data) {
            state.roleData = data;
        },
        [CHANGEEDITTYPE] (state, type) {
            state.editType = type;
        }
    }
};
export default role;
