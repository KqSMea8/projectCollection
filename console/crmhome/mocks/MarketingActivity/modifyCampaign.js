module.exports = {
  'POST /goods/itempromo/modifyCampaign.json': function (req, res) {
    const request = {
      method: 'post',
      url: 'http://crmhome-d3837.alipay.net/goods/itempromo/modifyCampaign.json',
      data: {
        campId: '20161111000000000910624000151673',
        sourceType: 'ALIPAY',
        sourceChannel: 'CRMHOME',
        jsonDataStr: JSON.stringify({
          "startTime": "2016-11-11 00:00:00",
          "endTime": "2016-12-11 23:59:00",
          "vouchers": {
            "brandName": "fsdfsd",
            "voucherLogo": "8XRT-CLsSz6q8RB7U5G-vAAAACMAAQED",
            "itemName": "fsdfsdf",
            "itemIds": ["dsfsd2323"],
            "itemDetail": "fdsfsdfacv",
            "voucherImg": "3In35WmEQ8aBZC_E4Nc_wgAAACMAAQED",
            "shopList": [{
              "id": "2016110900077000000003446358",
              "shopId": "2016110900077000000003446358"
            }, {
              "id": "2016110900077000000003446356",
              "shopId": "2016110900077000000003446356"
            }, {
              "id": "2016110900077000000003446354",
              "shopId": "2016110900077000000003446354"
            }, {
              "id": "2016110900077000000003446355",
              "shopId": "2016110900077000000003446355"
            }, {
              "id": "2016110900077000000003446357",
              "shopId": "2016110900077000000003446357"
            }, {
              "id": "2016110900077000000003446359",
              "shopId": "2016110900077000000003446359"
            }, { "id": "2016033000077000000003056725", "shopId": "2016033000077000000003056725" }],
            "validTimeType": "RELATIVE",
            "validPeriod": 7,
            "budgetAmount": 1,
            "descList": [""],
            "itemDiscountRule": {
              "itemSendType": "BUY_A_SEND_A",
              "totalLimitCnt": 1,
              "sendRules": [{
                "buyCnt": 1,
                "sendCnt": 1,
                "limitCnt": 1,
                "buySkus": ["dsfsd2323"],
                "sendSkus": ["dsfsd2323"]
              }]
            },
            "shopIds": ["2016110900077000000003446358", "2016110900077000000003446356", "2016110900077000000003446354", "2016110900077000000003446355", "2016110900077000000003446357", "2016110900077000000003446359", "2016033000077000000003056725"],
            "itemDetailImgs": [],
            "effectType": "0",
            "donateFlag": "1",
            "vouchersType": "BUY_A_SEND_A",
            "voucherName": "fsdfsdf"
          },
          "type": "DIRECT_SEND",
          "participateLimited": 1,
          "dayParticipateLimited": 1,
          "shopIds": ["2016110900077000000003446358", "2016110900077000000003446356", "2016110900077000000003446354", "2016110900077000000003446355", "2016110900077000000003446357", "2016110900077000000003446359", "2016033000077000000003056725"],
          "campName": "fsdfsdf买一送一",
          "sendNum": 1
        }),
      }
    };
  },
};
