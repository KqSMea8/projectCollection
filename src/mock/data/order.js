import Mock from 'mockjs';
const mock = Mock.mock({
    'data|100': [
        {
            'number|+1': 1001,
            'name': '@cname',
            'email': '@email',
            'branch': '应用产品部',
            'administer': '北京分校',
            'page': '@cparagraph(1,3)',
            'update': '@date()'
        }
    ]
});
export default mock.data;
