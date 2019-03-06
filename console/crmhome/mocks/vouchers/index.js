var Mock = require('mockjs');
this.config = {
  root: 'http://crmhome-d5752.alipay.net',
};
module.exports = {
  'GET /promo/conponsVerify/shopsQuery.json': function(req, res) { //查询店铺
    res.json({
      "resultMsg": "",
      "result": "true",
      "shopCountGroupByCityVO": [
		{
			"cityCode": "320400",
			"cityName": "常州市",
      "provinceName": "安徽",
      "provinceCode": "324",
			"leafCount": 2,
			"shopCount": 2,
			"shops": []
		}
	],
      "status": "succeed"
    });
  },
  'GET /promo/conponsVerify/getShopsByCityForNewCamp.json': function(req, res) { //查询相应城市门店
    this.request = {
      cityCode: '320400',
    }
    res.json(
      Mock.mock({'shopComps|30-50': [{
          "categoryId": "",
          "cityCode": "@increment(100000)",
          "extInfo": {},
          "shopId": "@id()",
          "shopName": "@csentence(3, 5)"
        }]
      })
      // [{
      //     "categoryId": "",
      //     "cityCode": "330100",
      //     "extInfo": {},
      //     "shopId": "6187932058275994101",
      //     "shopName": "为了储蓄卡20"
      //   }]
    );
  },
  'GET /promo/conponsVerify/operatorsQuery.json': function(req, res) { //查询操作员
    this.request = {
      data: {shopId: '2015052200077000000000194415'},
    };
    res.json({
      "data": {
        "2088201943141038": "luo***@alitest.com#025)",
        "2088202923983301": "Sho***@alitest.com#test3)",
        "2088202923983211": "zzz***@alitest.com#zz)",
        "2088202927065711": "Abc***@alitest.com#abc)",
        "2088202923983329": "hai***@alitest.com#haigonggong)",
        "2088202923983228": "zx(***@alitest.com#zx)",
        "2088201941408908": "测试(***@alitest.com#test123456)",
        "2088202923983293": "Qew***@alitest.com#test2)",
        "2088202923983239": "zw(***@alitest.com#zw)",
        "2088202923983345": "Cra***@alitest.com#raftsman)",
        "2088201941108235": "luo***@alitest.com#022)",
        "2088202887257317": "yy(***@alitest.com#youlong123)",
        "2088202923983622": "Wq(***@alitest.com#wq)",
        "2088202925175807": "zzz***@alitest.com#014)",
        "2088202887257306": "犹龙(***@alitest.com#005)",
        "2088201941106000": "dud***@alitest.com#024)",
        "2088202927543420": "hh(***@alitest.com#yj)",
        "2088202923982801": "犹龙(***@alitest.com#kkdd)",
        "2088202923983402": "hel***@alitest.com#123123123)",
        "2088202923983244": "李店长***@alitest.com#dz)",
        "2088202923983255": "zv(***@alitest.com#zv)",
        "2088201941105283": "张三(***@alitest.com#019)"
      },
      "status": "success"
    });
  }, //有报错
  'GET /promo/conponsVerify/conponsQuery.json': function(req, res) { //券查询接口
    this.request = {
      data: {
        shopId: '2015051200077000000000109858',
        conponId: '39201610180015500900106000095039',
      },
    };

    // res.json({
    //   "errorCode": "AE0511717009",
    //   "status": "failed",
    //   "errorMsg": "核销券查询异常"
    // });
    res.json({
      "data": {
        "conponId": "5161124015490621",
        "coponName": "kendej兑换券",
        "ownerInfo": "lmgwmo(208****943140623)"
      },
      "status": "success"
    });
  },
  'GET /promo/conponsVerify/conponsVerify.json': function(req, res) { // 券核销
     this.request = {
      data: {
        shopId: '2016011800077000000002425085',
        conponId: '8161123027095423',
      },
    }
    res.json({
      // "errorCode": "VOUCHER_ALREADY_USED",
      "status": "succeed",
      // "errorMsg": "券已使用"
    });
  },
  'GET /promo/conponsVerify/verifyRecordsQuery.json': function(req, res) { // 券核销记录接口
    this.request = {
      data: {
        shopId: '2016011800077000000002425085',
        operatorId: '2088102146931393',
        pageIndex: 1,
        pageSize: 10,
        conponId: '',
      },
    };
    res.json({
      "data": [
        {
          "conponId": "8161123027095423",
          "verifyTime": "2016-11-23 18:45:03",
          "coponName": "kendej兑换券",
          "ownerInfo": "bddnrh(208****942332429)",
          "operatorInfo": "cc123(208****146931393)"
        }
      ],
      "page": {
        "pageSize": 10,
        "currentPage": 1,
        "totalSize": 1
      },
      "status": "success"
    });
  }
};
