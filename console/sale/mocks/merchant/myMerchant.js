module.exports = {
  // 查询我的服务商（商户）
  'GET /sale/merchant/myMerchantList.json': function (req, res) {
    console.log(req.query);

    var data = [], total = 18;
    for (var i = 0; i < total; i++) {
      var k = i < 10 ? '0' + i : i;
      data.push({
        key: k,
        partnerId: '1004023798310' + k,
        merchantId: '399311' + k,
        merchantName: '杭州经济技术开发区腾士招砂锅店 ' + k,
        belongStaffId: '2016012801830' + k,
        staffName: '真名(花名)',
        loginEmail: 'rchmcy' + k + '@alitest.com',
        canTransferFlag: true
      });
    }

    setTimeout(() => {
      res.json({
        data: data,
        totalCount: total
      });
    }, 500);
  },

  // 转移服务商
  'POST /sale/merchant/transferMerchant.json': function (req, res) {
    console.log(req.query);

    setTimeout(() => {
      res.json({
        // status: 'succeed',
        status: 'fail',
        errorMsg: '这是报错',
        message: '这是mock的数据'
      });
    }, 100);
  },
};