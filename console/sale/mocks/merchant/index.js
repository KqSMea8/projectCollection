
var tmp = {
  'GET /sale/merchant/mymerchantlist.json': function (req, res) {
    console.log(req.query);

    var data = [], total = 18;
    for (var i = 0; i < total; i++) {
      data.push({
        key: i,
        partnerId: 10040237983104023798,
        merchantName: '杭州经济技术开发区腾士招砂锅店',
        staffName: '真名(花名)',
        actions: [1, 2][Math.floor(Math.random() * 2)]
      });
    }

    setTimeout(() => {
      res.json({
        data: data,
        totalCount: total
      });
    }, 500);
  },

  'GET /merchant/team-merchant.json': function (req, res) {
    console.log(req.query);

    var data = [], total = 38;
    for (var i = 0; i < total; i++) {
      data.push({
        key: i,
        mId: '10040237' + Math.floor(Math.random() * 100000),
        mName: '上海经济技术开发区腾士招砂锅店',
        serviceId: '某某服务商',
        waiterName: '真名(花名)',
        actions: [1, 2][Math.floor(Math.random() * 2)]
      });
    }

    setTimeout(() => {
      res.json({
        data: data,
        totalCount: total
      });
    }, 500);
  },

  'GET /queryServicer.json': function (req, res) {
    console.log(req.query);

    setTimeout(() => {
      res.json({
        servicer: [{
          name: '服务商1',
          value: '10000'
        }, {
          name: '服务商2',
          value: '10001'
        }],
        employee: [{
          name: 'employee1',
          value: '10000-001'
        }, {
          name: 'employee2',
          value: '10000-002'
        }, {
          name: 'employee3',
          value: '10001-003'
        }]
      });
    }, 100);
  },


  'GET /merchant/mock-list.json': function (req, res) {
    res.json({
      data: [
        'mock-list1',
        'mock-list2',
        'mock-list3',
        'mock-list4',
        'mock-list5',
        'mock-list6',
        'mock-list7',
      ]
    });
  },


  'GET /merchant/service-config.json': function (req, res) {
    res.json({
      success: true
    })
  },

  'GET /merchant/get-service-config.json': function (req, res) {
    res.json({
      serviceRegion: [
        {
          'province': '浙江省',
          'provinceId': '01',
          'supportCategorys': [{
            'name': '美食',
            'id': '美食',
            'children': [{
              'name': '湘菜',
              'id': '湘菜',
              'children': [{
                'name': '农家小炒肉',
                'id': '农家小炒肉',
              }],
            }],
          }],
          'citys': [{
            'cityName': '杭州市',
            'cityId': '0101',
            'supportCategorys': [{
              'name': '旅行',
              'id': '旅行',
              'children': [{
                'name': '马尔代夫',
                'id': '马尔代夫',
              }],
            }],
          }, {
            'cityName': '衢州市',
            'cityId': '0102',
            'supportCategorys': [{
              'name': '旅行',
              'id': '旅行',
              'children': [{
                'name': '巴厘岛',
                'id': '巴厘岛',
              }],
            }],
          }, {
            'cityName': '台州市',
            'cityId': '0103',
            'supportCategorys': [{
              'name': '旅行',
              'id': '旅行',
              'children': [{
                'name': '普吉岛',
                'id': '普吉岛',
              }],
            }],
          }],
        },
        {
          'province': '江苏省',
          'provinceId': '02',
          'supportCategorys': [{
            'name': '丽人',
            'id': '丽人',
            'children': [{
              'name': '美甲',
              'id': '美甲',
            }],
          }],
          'citys': [{
            'cityName': '南京市',
            'cityId': '0201',
            'supportCategorys': [{
              'name': '娱乐',
              'id': '娱乐',
              'children': [{
                'name': 'ktv',
                'id': 'ktv',
              }],
            }],
          }, {
            'cityName': '徐州市',
            'cityId': '0202',
            'supportCategorys': [{
              'name': '娱乐',
              'id': '娱乐',
              'children': [{
                'name': '按摩',
                'id': '按摩',
                'children': [{
                  'name': '按摩一店',
                  'id': '按摩一店',
                }, {
                  'name': '按摩二店',
                  'id': '按摩二店',
                }],
              }],
            }],
          }],
        }],
      serviceName: '柚茜是服务商',
      serviceLevel: '二级',
      leadsLimit: 1,
      leadsTime: 2,
      operatorLimit: 3,
    });
  },

  'GET /merchant/allAccount.json': function (req, res) {
    var allAccount = [], total = 12;
    for (var i = 0; i < total; i++) {
      allAccount.push({
        accountID: 'ravenxu@foxmail.com',
        PID:'2008423522241144'+Math.random() * 10
      });
    }
    res.json({
      data: allAccount
    });
  },

  'GET /merchant/merchantInfo.json': function (req, res) {
    var info = {
      mName: '肯德基',
      PartnerID: '123456',
      accountID: 'ravenxu@foxmail.com',
      shopAccount: '121212',
      manager: '天还',
      nShortName: '肯德基',
      line: '美食',
      mcc: 'boss',
      source: '自主签约（全民开店）',
      remark: '博山东路',
      contactName: '风清扬',
      job: '董事长',
      mobile: '1312073434',
      email: 'qqqw@alipay.com',
      address: '证大五道口广场'
    };

    res.json({
      data: info
    });
  },

  'GET /merchant/merchant-order.json': function (req, res) {
    var data = [], total = 18;
    for (var i = 0; i < total; i++) {
      data.push({
        key:i,
        orderId: i,
        signAccount: 10040237983104023798,
        progectName: '杭州经济技术开发区腾士招砂锅店',
        status: ['生效', '清退'][Math.floor(Math.random() * 2)],
        manager: '柚茜',
        time: '2015-01-01  至 2016-01-01'
      });
    }
    setTimeout(() => {
      res.json({
        data: data,
        totalCount: total,
      });
    }, 500);

  },

  'GET /merchant/merchant-log.json': function (req, res) {
    var data = [], total = 18;
    for (var i = 0; i < total; i++) {
      data.push({
        key:i,
        index: i,
        operator: '柚茜',
        operationType: '创建',
        operatorTime: '2015-01-01  至 2016-01-01',
        actionInfo: '不需要审核，执行处理自动跳转'
      });
    }
    setTimeout(() => {
      res.json({
        data: data,
        totalCount: total,
      });
    }, 500);
  },
};

var myMerchant = require('./myMerchant');
var serviceConfig = require('./serviceConfig');
module.exports = Object.assign({}, myMerchant, serviceConfig);
