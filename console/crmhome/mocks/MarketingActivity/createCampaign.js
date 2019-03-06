module.exports = {
  // 创建买一送一活动
  'POST /goods/itempromo/createCampaign.json': function (req, res) {

    const request = {
      method: 'post',
      url: 'http://crmhome-d3837.alipay.net/goods/itempromo/createCampaign.json',
      data2: {
        jsonDataStr: JSON.stringify({
          "startTime": "2016-11-11 00:00",
          "endTime": "2016-12-10 23:59",
          "vouchers": {
            "brandName": "记得记得加",
            "voucherLogo": "DHpU6gzISp-Lvf-5io7UYQAAACMAAQQD",
            "itemName": "fdsfsdfsd",
            "itemIds": [
              "32322", "232323"
            ],
            "itemDetail": "fsdfsdf",
            "voucherImg": "iphIM0Z8R9Cm9fykGexyKgAAACMAAQED",
            "shopList": [
              {
                "id": "2016110900077000000003446358",
                "shopId": "2016110900077000000003446358"
              },
              {
                "id": "2016110900077000000003446354",
                "shopId": "2016110900077000000003446354"
              },
              {
                "id": "2016033000077000000003056725",
                "shopId": "2016033000077000000003056725"
              },
              {
                "id": "2016110900077000000003446355",
                "shopId": "2016110900077000000003446355"
              },
              {
                "id": "2016110900077000000003446356",
                "shopId": "2016110900077000000003446356"
              },
              {
                "id": "2016110900077000000003446357",
                "shopId": "2016110900077000000003446357"
              },
              {
                "id": "2016110900077000000003446359",
                "shopId": "2016110900077000000003446359"
              }
            ],
            "validTimeType": "RELATIVE",
            "validPeriod": 7,
            "validTimeFrom": "2016-11-17 18:40",
            "validTimeTo": "2016-12-18 18:40",
            "descList": [
              ""
            ],
            "itemDiscountRule": {
              "itemSendType": "BUY_A_SEND_A",
              "totalLimitCnt": 1,
              "sendRules": [
                {
                  "buyCnt": 1,
                  "buySkus": ["32322", "232323"],
                  "sendSkus": ["32322", "232323"],
                  "sendCnt": 1,
                  "limitCnt": 1
                }
              ]
            },
            "shopIds": [
              "2016110900077000000003446358",
              "2016110900077000000003446354",
              "2016033000077000000003056725",
              "2016110900077000000003446355",
              "2016110900077000000003446356",
              "2016110900077000000003446357",
              "2016110900077000000003446359"
            ],
            "itemDetailImgs": [],
            "effectType": "0",
            "donateFlag": "1",
            "vouchersType": "BUY_A_SEND_A",
            "voucherName": "sdfsdfsdf"
          },
          "type": "REAL_TIME_SEND",
          "participateLimited": 1,
          "dayParticipateLimited": 1,
          "shopIds": [
            "2016110900077000000003446358",
            "2016110900077000000003446354",
            "2016033000077000000003056725",
            "2016110900077000000003446355",
            "2016110900077000000003446356",
            "2016110900077000000003446357",
            "2016110900077000000003446359"
          ],
          "campName": "fsdfsdf",
          "sendNum": 1
        }),
      }
    };

  }
};
