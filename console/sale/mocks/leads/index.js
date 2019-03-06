'use strict';
const servicesData = {
  'data': [{
    'key': '2088102146888635',
    'loginEmail': 'o2o_service_01@ts.com',
    'merchantId': '364880',
    'merchantName': '测试服务商',
    'partnerId': '2088102146888635',
    'positionId': '1000000010016905'
  }, {
    'key': '2088101146122891',
    'loginEmail': 'globaltest10-5@qq.com',
    'merchantId': '358229',
    'merchantName': '测试服务商',
    'partnerId': '2088101146122891',
    'positionId': '1000000010016905'
  }, {
    'key': '2088102145895849',
    'loginEmail': 'sinom0326@alitest.com',
    'merchantId': '356378',
    'merchantName': '测试服务商',
    'partnerId': '2088102145895849',
    'positionId': '1000000010016905'
  }, {
    'key': '2088102141029718',
    'loginEmail': 'gordo_test@163.com',
    'merchantId': '324407',
    'merchantName': '测试服务商',
    'partnerId': '2088102141029718',
    'positionId': '1000000010017777'
  }, {
    'key': '2088102141027198',
    'loginEmail': 'gordo@163.com',
    'merchantId': '324398',
    'merchantName': '测试服务商',
    'partnerId': '2088102141027198',
    'positionId': '1000000010017777'
  }],
  'status': 'succeed'
};

module.exports = {
  'GET /sale/leads/searchLeads.json':{"data":{"currentPage":1,"itemsPerPage":10,"queryResult":{"shopLeadses":[{"address":"万体馆","bdName":"xxxxx xxxxx","branchName":"黑乎乎202","brandName":"其它品牌","categoryName":"美食-中餐-湘菜","cityName":"上海城区","companyName":"还会尽快","contactsName":"看看加班","contactsPhone":"18616681717","districtName":"徐汇区","latitude":31.183577,"leadsId":"2016012800026845","level":"否","longitude":121.43922,"name":"空空旷旷","operatorId":"2088102164325969","provinceName":"上海市","statusCode":"CLAIMED","statusDesc":"已认领"},{"address":"世纪公园","bdName":"xxxxx xxxxx","branchName":"太长了","brandName":"呵呵咖啡","categoryName":"美食-中餐-湘菜","cityName":"上海城区","companyName":"呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵","contactsName":"吞吞吐吐发展和谐社会","contactsPhone":"18551255253","districtName":"浦东新区","latitude":31.221604,"leadsId":"2016012800026847","level":"否","longitude":121.549248,"name":"太长了","operatorId":"2088102164325969","provinceName":"上海市","statusCode":"CLAIMED","statusDesc":"已认领"},{"address":"Ffa","bdName":"xxxxx xxxxx","branchName":"Dd","brandName":"m+咖啡馆","categoryName":"美食-搜索测试二级类目-搜索测试三级级类目","cityName":"上海郊县","companyName":"Dfs","contactsName":"ygmnfl","contactsPhone":"13466667678","districtName":"崇明县","latitude":31.623587,"leadsId":"2016012800029779","level":"否","longitude":121.397417,"name":"娜娜法国更好发言稿法国哈哈哈法国哈哈","operatorId":"2088102164325969","provinceName":"上海市","statusCode":"CLAIMED","statusDesc":"已认领"},{"address":"民生路路1199弄","bdName":"xxxxx xxxxx","branchName":"民生路店","brandName":"可C可D","categoryName":"美食-中餐-西北菜","cityName":"上海城区","companyName":"局长","contactsName":"星远","contactsPhone":"18621342578","districtName":"杨浦区","latitude":30.287459,"leadsId":"2016012800029780","level":"否","longitude":120.153576,"name":"星远","operatorId":"2088102164325969","provinceName":"上海市","statusCode":"CLAIMED","statusDesc":"已认领"},{"address":"河间路640号","bdName":"xxxxx xxxxx","branchName":"很长的名字方法法国哈哈方法刚刚好反复更改","brandName":"法国CASTEL家族酒庄","categoryName":"美食-中餐-湘菜","cityName":"上海郊县","companyName":"刚刚","contactsName":"南山","contactsPhone":"15655555556","districtName":"崇明县","latitude":31.479792,"leadsId":"2016012800029783","level":"否","longitude":121.831208,"name":"鱼","operatorId":"2088102164325969","provinceName":"上海市","statusCode":"CLAIMED","statusDesc":"已认领"},{"address":"支付宝28血站","bdName":" xxxxx","branchName":"天下第一","brandName":"大口九茶饮","categoryName":"美食-汤/粥/煲/砂锅/炖菜-川菜","cityName":"上海城区","companyName":"阿里巴巴","contactsName":"特木","contactsPhone":"13265327861","districtName":"黄浦区","latitude":31,"leadsId":"2016012800029788","level":"否","longitude":121,"name":"肯德基abc0013","operatorId":"2088102164325969","provinceName":"上海市","statusCode":"CLAIMED","statusDesc":"已认领"},{"address":"支付宝28血站","bdName":" xxxxx","branchName":"天下第一","brandName":"大口九茶饮","categoryName":"美食-汤/粥/煲/砂锅/炖菜-川菜","cityName":"上海城区","companyName":"阿里巴巴","contactsName":"特木","contactsPhone":"13265327861","districtName":"黄浦区","latitude":31,"leadsId":"2016012800029787","level":"否","longitude":121,"name":"肯德基abc0012","operatorId":"2088102164325969","provinceName":"上海市","statusCode":"CLAIMED","statusDesc":"已认领"},{"address":"支付宝28血站","bdName":"xxxxx xxxxx","branchName":"天下第一","brandName":"大口九茶饮","categoryName":"美食-汤/粥/煲/砂锅/炖菜-川菜","cityName":"上海城区","companyName":"阿里巴巴","contactsName":"特木","contactsPhone":"13265327861","districtName":"黄浦区","latitude":31,"leadsId":"2016012800029786","level":"否","longitude":121,"name":"肯德基abc0011","operatorId":"2088102164325969","provinceName":"上海市","statusCode":"CLAIMED","statusDesc":"已认领"},{"address":"支付宝28血站","bdName":" xxxxx","branchName":"天下第一","brandName":"大口九茶饮","categoryName":"美食-汤/粥/煲/砂锅/炖菜-川菜","cityName":"上海城区","companyName":"阿里巴巴","contactsName":"特木","contactsPhone":"13265327861","districtName":"黄浦区","latitude":31,"leadsId":"2016012800029791","level":"否","longitude":121,"name":"肯德基abc0016","operatorId":"2088102164325969","provinceName":"上海市","statusCode":"CLAIMED","statusDesc":"已认领"},{"address":"支付宝28血站","bdName":" xxxxx","branchName":"天下第一","brandName":"大口九茶饮","categoryName":"美食-汤/粥/煲/砂锅/炖菜-川菜","cityName":"上海城区","companyName":"阿里巴巴","contactsName":"特木","contactsPhone":"13265327861","districtName":"黄浦区","latitude":31,"leadsId":"2016012800029792","level":"否","longitude":121,"name":"肯德基abc0017","operatorId":"2088102164325969","provinceName":"上海市","statusCode":"CLAIMED","statusDesc":"已认领"}]},"success":true,"totalCount":30,"totalPages":4},"leadsSearchConditionForm":{"brandId":"","categoryId":"","cityCode":"","companyName":"","districtCode":"","leadsId":"","leadsLevel":"","leadsStatus":"","name":"","pageNum":1,"pageSize":10,"provinceCode":"","searchType":"PRIVATE"},"power":["LEADS_RELEASE","LEADS_QUERY","LEADS_ALLOCATE","LEADS_MODIFY"],"status":"succeed"},
  'GET /sale/searchLeads.json'(req, res) {
    const total = 40;
    const query = req.query;
    const ret = [];
    const pageSize = parseInt(query.pageSize, 10);
    const current = parseInt(query.pageNum, 10);
    const start = (current - 1) * pageSize;
    for (let i = start; i < 5; i++) {
      const data = {
        'id': i,
        'key': i,
        'materType': 'KA(商户名称)' + i,
        'materAddress': '上海',
        'materId': '模版名称模版名称',
        'materName': '12345454' + i,
        'materProperty': '活动物料',
        'materialType': '海报',
        'materCode': '生效中',
        'materA': '2000',
        'materB': '2000',
        'materC': '80000',
        'materD': '59000',
        'materE': '1000',
        'materF': '200',
      };
      ret.push(data);
    }
    setTimeout(()=> {
      res.json({
        'ok': '3',
        'data': ret,
        'totalCount': total,
      });
    }, 100);
  },

  'GET /sale/searchId.json'(req, res) {
    const ret = [];
    for (let i = 0; i < 5; i++) {
      const data = {
        'id': i,
        'materType': 'KA(商户名称)' + i,
        'materAddress': '上海',
        'materId': '模版名称模版名称',
        'materName': '12345454' + i,
        'materProperty': '活动物料',
        'materialType': '海报',
        'materCode': '生效中',
        'materA': '2000',
        'materB': '2000',
        'materC': '80000',
        'materD': '59000',
        'materE': '1000',
        'materF': '200',
      };
      ret.push(data);
    }
    console.log(ret);
    setTimeout(()=> {
      res.json({
        'ok': '2',
        'data': ret,
      });
    }, 100);
  },

  'GET /sale/leads/searchId.json'(req, res) {
    const ret = [];
    for (let i = 0; i < 3; i++) {
      const data = {
        'id': i,
        'materType': 'KA(商户名称)' + i,
        'materAddress': '上海',
        'materId': '模版名称模版名称',
        'materName': '12345454' + i,
        'materProperty': '活动物料',
        'materialType': '海报',
        'materCode': '生效中',
        'materA': '2000',
        'materB': '2000',
        'materC': '80000',
        'materD': '59000',
        'materE': '1000',
        'materF': '200',
      };
      ret.push(data);
    }
    setTimeout(()=> {
      res.json({
        'ok': '2',
        'data': ret,
      });
    }, 100);
  },

  'GET /allocator.json'(req, res) {
    setTimeout(()=> {
      res.json({
        shop: [{
          name: 'shop1'
        }, {
          name: 'shop2'
        }],
        employee: [{
          name: 'employee1'
        }, {
          name: 'employee2'
        }]
      });
    }, 100);
  },


  'GET /getBrand.json'(req, res) {
    setTimeout(()=> {
      res.json({
        data: ['外婆家', '小肥羊', '肯德基']
      });
    }, 100);
  },

  'POST /upload.json'(req, res) {
    setTimeout(()=> {
      res.json({
        url: 'http://img.alicdn.com/tps/TB1ZYBCLXXXXXXcXXXXXXXXXXXX-200-200.jpg_200x200.jpg',
        status: 'succeed',
      });
    }, 100);
  },

  'GET /sale/merchant/merchantservicelist.json'(req, res) {
    res.json(servicesData);
  },
  'POST /shop/koubei/imageUpload4Pc.json'(req, res) {
    res.json({
      date: 1483074830457,
      id: 'AGy8H0XGRHmFaWVDOq8X5wAAACMAAQQD',
      status: 'succeed',
      url: "https://dl.django.t.taobao.com/rest/1.0/image?fileIds=AGy8H0XGRHmFaWVDOq8X5wAAACMAAQQD&token=shjWomcIgJgLEFHsxaxkWAABUYAAAAFZTiXEHQAAACMAAQED&timestamp=1483074830456&acl=2bc810356854f46e5b207ea5dfa06c6e&zoom=original"
    });
  },
};
