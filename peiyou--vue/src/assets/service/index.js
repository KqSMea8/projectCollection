import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import datalist from './datalist';
const mock = new MockAdapter(axios);

export default {
    bootstrap () {
        mock.onGet('/orders').reply((config) => {
            const {pageSize, pageLength} = config.params;
            const newDataList = datalist.tableLists.slice((pageSize - 1) * pageLength, pageSize * pageLength);
            return new Promise((resolve, reject) => {
                resolve([200, {code: 1, msg: '请求成功', total: datalist.tableLists.length, data: newDataList, datas: datalist}]);
            });
        });
    }
};
