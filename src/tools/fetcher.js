const reqHeaders = {
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
    'sysCode': 'market',
    'token': localStorage['token'] || ''
};
const getJsON = (init) => {
    const arr = [];
    for (let i in init) {
        arr.push(`${i}=${init[i]}`);
    }
    return arr.join('&');
};
const getFectch = (url, init) => {
    return fetch(url, init).then((res) => {
        if (res.ok) {
            // console.log(res.json())
            // console.log(res);
            return res.json();
        }
    });
};

export default {
    get (url, params) {
        // console.log('get');
        // 标题 3号
        // 非专业  分析自己
        // 专业 不足在那，
        return getFectch(url, {
            method: 'get',
            headers: reqHeaders
        });
    },
    post (url, params) {
        return getFectch(url, {
            method: 'post',
            headers: Object.assign({}, reqHeaders, { 'Content-type': 'application/x-www-form-urlencoded' }),
            body: getJsON(params)
        });
    }
};
 // return fetch(url, {
        //     method: 'post',
        //     headers: Object.assign({}, reqHeaders, { 'Content-type': 'application/x-www-form-urlencoded' }),
        //     body: getJsON(params)
        // }).then(function (res) {
        //     console.log(res);
        //     if (res.ok) {
        //         // console.log(res.json())
        //         return res.json();
        //         // res.json().then((data) => {
        //         //     console.log(data)
        //         // });
        //     }
        // });
