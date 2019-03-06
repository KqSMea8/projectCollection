import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import data from './data/order';
const mock = new MockAdapter(axios);
mock.onPost('/data').reply((config) => {
    let { startIndex, endIndex } = config.params;
    let arr = data.slice((startIndex - 1) * endIndex, startIndex * endIndex);
    arr.map((val) => {
        for (let i in val) {
            val[i] += '';
        };
    });
    return new Promise((resolve) => {
        resolve([200, {arr, length: data.length}]);
    });
});
