module.exports = {
  'GET /queryInfo.json': {
      'data': {
        'showIndustryBiz': true,
        'showMerchantBiz': true,
        'showShopBiz': true,
        'showTradeBiz': true,
        'showTask': true,
      },
      'resultCode': '',
      'resultMsg': '',
      'status': 'succeed',
    },

  'GET /queryTask.json': function(req, res) {
    res.json({
      data: [{ // 待办事项列表 List
        configDisplayName: '资金划出', // 待办事项的id String
        operator: 'alibank_admin', // 待办事项的发起人 String
        ticketBizId: '88123',
        ticketGmtCreate: '2015-11-23', // 待办事项的时间,时间格式{MM-dd hh:mm} String
      }, { // 待办事项列表 List
        configDisplayName: '资金划出b', // 待办事项的id String
        operator: 'ceshi', // 待办事项的发起人 String
        ticketBizId: '88123',
        ticketGmtCreate: '2015-11-23', // 待办事项的时间,时间格式{MM-dd hh:mm} String
      }, { // 待办事项列表 List
        configDisplayName: '资金划出a', // 待办事项的id String
        operator: 'alibank_admin', // 待办事项的发起人 String
        ticketBizId: '88123',
        ticketGmtCreate: '2015-11-23', // 待办事项的时间,时间格式{MM-dd hh:mm} String
      }],
    });
  },


  'GET /queryShopBizInfo.json': function(req, res) {
    res.json({
      "data": {
        "order_cnt_rl": "83599",
        "order_cnt_rl_dr": "0.32",
        "business_amt_per_cnt_rl": "235.0000",
        "business_amt_per_cnt_rl_dr": "-0.34903047",
        "order_amt_rl": "3824",
        "order_amt_rl_dr": "23",
        "check_reject_shop_cnt": "22",
        "checking_shop_cnt": "33",
        "data_date": "20160117",
        "item_shop_cnt": "1000",
        "item_shop_cnt_wr": "-0.1729",
        "item_shop_rate": "0.8400",
        "item_shop_rate_wr": "0.07692308",
        "new_shop_cnt": "35",
        "new_shop_cnt_wr": "-0.0541",
        "offline_item_cnt": "130",
        "offline_item_cnt_wr": "-0.0580",
        "offline_shop_cnt": "13",
        "offline_shop_cnt_wr": "-0.2778",
        "online_shop_cnt": "2400",
        "online_shop_cnt_wr": "-0.0283",
        "order_amt_per_cnt_rl": "321.0000",
        "order_amt_per_cnt_rl_dr": "-0.17902813",
        "trade_amt_rl": "31000",
        "trade_amt_rl_dr": "7.1579",
        "trade_cnt_per_shop": "254.7000",
        "trade_cnt_per_shop_wr": "-0.07348127",
        "trade_shop_cnt": "1200",
        "trade_shop_cnt_wr": "-0.1241",
        "trade_shop_rate": "0.8400",
        "trade_shop_rate_wr": "-0.08695652",
        "wait_check_shop_cnt": "13"
      },
      "resultCode": "",
      "resultMsg": "",
      "status": "succeed"
    });
  },

  'GET /queryMerchantBizInfo.json': function(req, res) {
    res.json({
      'data': {
        'check_success_contract_cnt': '8838',
        'checking_shop_cnt': '2883',
        'data_date': '20160114',
        'expired_30d_contract_cnt': '38829',
        'new_merchant_cnt': '2323',
        'new_merchant_cnt_wr': '0.2312',
        'online_merchant_cnt': '3821',
        'online_merchant_cnt_wr': '0.8382',
        'reject_contract_cnt': '8838',
        'terminate_merchant_cnt': '2883',
        'terminate_merchant_cnt_wr': '0.2831',
      },
      "data_date": '20160117',
      'resultCode': '',
      'resultMsg': '',
      'status': 'succeed',
    });
  },

  'GET /queryIndustryBizInfo.json': function(req, res) {
    res.json({
      "data": {
        "cate_2_stat_info": [{
          "avg_price": 2837,
          "biz_value": "其他美食",
          "shop_cnt": 2677455,
          "trade_amt": 700000,
          "trade_cnt": 23423
        }, {
          "avg_price": 2344,
          "biz_value": "汤／砂锅",
          "shop_cnt": 6543234,
          "trade_amt": 634000,
          "trade_cnt": 13455
        }, {
          "avg_price": 2345,
          "biz_value": "休闲食品",
          "shop_cnt": 1234535,
          "trade_amt": 372644,
          "trade_cnt": 24325
        }, {
          "avg_price": 2455,
          "biz_value": "小吃",
          "shop_cnt": 2764556,
          "trade_amt": 234721,
          "trade_cnt": 13455
        }, {
          "avg_price": 3452,
          "biz_value": "火锅",
          "shop_cnt": 1386425,
          "trade_amt": 364524,
          "trade_cnt": 13456
        }],
        "data_date": '20160117'
      },
      "resultCode": "",
      "resultMsg": "",
      "status": "succeed"
    });
  },

  'GET /promotionorder.json': function(req, res) {
    res.json({
      "data": [{
        "serviceName": "扫码点餐服务",
        "id": "2017022200903600",
        "taskName": "八月云纵摄影推广",
        "taskId": "2017022200903600",
        "startTime": "2015-12-12 00:00",
        "endTime": "2016-12-12 23:59",
        "policy": "0.1%/笔",
        "isvName": "二维火",
        "isvId": "2088002523769521",
        "contact": "13666666666",
      },{
        "serviceName": "扫码点餐服务",
        "id": "2017022200903600",
        "taskName": "八月云纵摄影推广",
        "taskId": "2017022200903600",
        "startTime": "2015-12-12 00:00",
        "endTime": "2016-12-12 23:59",
        "policy": "0.1%/笔",
        "isvName": "二维火",
        "isvId": "2088002523769521",
        "contact": "13666666666",
      },{
        "serviceName": "扫码点餐服务",
        "id": "2017022200903600",
        "taskName": "八月云纵摄影推广",
        "taskId": "2017022200903600",
        "startTime": "2015-12-12 00:00",
        "endTime": "2016-12-12 23:59",
        "policy": "0.1%/笔",
        "isvName": "二维火",
        "isvId": "2088002523769521",
        "contact": "13666666666",
      }
      ],
      "resultCode": "",
      "resultMsg": "",
      "status": "succeed"
    })
  },

  'GET /queryTradeBizInfo.json': function(req, res) {
    res.json({
      "data": {
        "data_date": '20160117',
        "top_stat_info": {
          "BRAND": [{
            "biz_value": "黄焖鸡",
            "trade_amt": 2390,
            "trade_cnt": 1234
          }, {
            "biz_value": "伊利",
            "trade_amt": 2100,
            "trade_cnt": 1209
          }, {
            "biz_value": "蒙牛",
            "trade_amt": 4300,
            "trade_cnt": 1203
          }, {
            "biz_value": "久久丫",
            "trade_amt": "2300",
            "trade_cnt": "350"
          }, {
            "biz_value": "麦麦乐",
            "trade_amt": "7800",
            "trade_cnt": "345"
          }],
          "PROVIDER": [{
            "biz_value": "东方既白",
            "trade_amt": "800000000",
            "trade_cnt": "15000000"
          }, {
            "biz_value": "大娘水饺",
            "trade_amt": "90000",
            "trade_cnt": "45"
          }, {
            "biz_value": "温州西嘉士餐饮有限公司",
            "trade_amt": "90000",
            "trade_cnt": "45"
          }, {
            "biz_value": "河南禾绿餐饮有限公司",
            "trade_amt": "90000",
            "trade_cnt": "45"
          }, {
            "biz_value": "武汉市江汉区玉红蛋糕店",
            "trade_amt": "90000",
            "trade_cnt": "45"
          }],
          "SHOP": [{
            "biz_value": "锅贴",
            "trade_amt": "564",
            "trade_cnt": "765"
          }, {
            "biz_value": "真功夫",
            "trade_amt": "357",
            "trade_cnt": "356"
          }, {
            "biz_value": "麦当劳文三路",
            "trade_amt": "785",
            "trade_cnt": "234"
          }, {
            "biz_value": "肯德基文三路",
            "trade_amt": "456",
            "trade_cnt": "234"
          }, {
            "biz_value": "大娘水饺",
            "trade_amt": "234",
            "trade_cnt": "234"
          }]
        },
        "trade_trend_7d": [{
          "biz_value": "20160117",
          "trade_amt": "31000",
          "trade_cnt": "2400"
        }, {
          "biz_value": "20160116",
          "trade_amt": "33000",
          "trade_cnt": "2500"
        }, {
          "biz_value": "20160115",
          "trade_amt": "34000",
          "trade_cnt": "2600"
        }, {
          "biz_value": "20160114",
          "trade_amt": "35000",
          "trade_cnt": "2700"
        }, {
          "biz_value": "20160113",
          "trade_amt": "36000",
          "trade_cnt": "2800"
        }, {
          "biz_value": "20160112",
          "trade_amt": "37000",
          "trade_cnt": "2900"
        }]
      },
      "resultCode": "",
      "resultMsg": "",
      "status": "succeed"
    });
  },
};