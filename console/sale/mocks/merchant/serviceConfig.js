var initData = {
  "data": {
    "areaConfigVOs": [
      {
        "categories": "2015102600487400",
        "cityCode": "421100",
        "countryCode": "CN",
        "districtCode": "421182",
        "provinceCode": "420000"
      },
      {
        "categories": "2015050700000047,2015050700000001,2015050700000028",
        "cityCode": "330100",
        "countryCode": "CN",
        "districtCode": "330106",
        "provinceCode": "330000"
      }
    ],
    "id": "2015046015",
    "keepLeadsProtectDay": 15,
    "leadsLimit": 100,
    "loginEmail": "13072428798",
    "merchantName": "yhcobu",
    "partnerId": "2088101164499924",
    "salesMaxLimit": 190,
    "serviceLevel": "3"
  },
  "status": "succeed"
};


module.exports = {

  // 查询业务配置初始化数据
  'GET /sale/merchant/initMerchantConfig.json': function (req, res) {
    console.log(req.query);

    setTimeout(() => {
      res.json(initData);
    }, 100);
  },

  // 业务配置
  'POST /sale/merchant/initMerchantConfig.json': function (req, res) {
    console.log(req.query);

    setTimeout(() => {
      res.json({
        status: 'succeed',
        message: '这是mock的数据'
      });
    }, 100);
  },
};