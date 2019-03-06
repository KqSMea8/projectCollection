import axios from 'axios';
import MockAdapter from 'axios-mock-adapter'

const userPwd = [
    {
        userName:'gaoyuanyuan',
        password:123
    },
    {
        userName:'wangyaping',
        password:123
    },
    {
        userName:'zhoujing',
        password:123
    },
    {
        userName:'jiaruijuan',
        password:123
    },
    {
        userName:'weitianhao',
        password:123
    }
]
const mock = new MockAdapter(axios);
mock.onGet('/getUserPwd').reply((config) => {
    return new Promise((resolve, reject) => {
        resolve([200, userPwd])
    })
})