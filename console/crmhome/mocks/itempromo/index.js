/* eslint-disable */
module.exports = {

  'GET /goods/itempromo/getShopsByCityRecruit.json': (req, res) => {
    var shops = [];
    if (req.cityCode === 'SH') {
      shops = [{
        'cityCode': 'SH',
        'disabled': false,
        'shopId': '2016061600077000000003587835',
        'shopName': 'aaaaaaaa'
      }];
    } else if (req.cityCode === '990100') {
      shops = [{
        'cityCode': '990100',
        'disabled': false,
        'shopId': '2016061600077000000003587836',
        'shopName': 'bbbbbbbb'
      },
      {
        'cityCode': '990100',
        'disabled': false,
        'shopId': '2016061600077000000003587837',
        'shopName': 'ccccccccc'
      }];
    } else if (req.cityCode === '310100') {
      shops = [{
        'cityCode': '310100',
        'disabled': false,
        'shopId': '2016061600077000000003587838',
        'shopName': 'ddddddd'
      }];
    } else {
      shops = [{
        'cityCode': '110100',
        'disabled': false,
        'shopId': '1001',
        'shopName': '门店1'
      },
      {
        'cityCode': '110100',
        'disabled': false,
        'shopId': '1002',
        'shopName': '222222'
      },
      {
        'cityCode': '110100',
        'disabled': false,
        'shopId': '1003',
        'shopName': '333333'
      },
      {
        'cityCode': '110100',
        'disabled': false,
        'shopId': '1004',
        'shopName': '444444'
      },
      {
        'cityCode': '110100',
        'disabled': false,
        'shopId': '1005',
        'shopName': '5555555'
      },
      {
        'cityCode': '110100',
        'disabled': false,
        'shopId': '1006',
        'shopName': 'cccccc'
      }];
    }

    setTimeout(() => {
      res.json({
        'shopComps': shops
      });
    }, Math.random() * 2000);
  },

  'GET /goods/itempromo/exchangeDetail.json': (req, res) => {
    setTimeout(() => {
      res.json({
        status: 'succeed',
        discountForm: {
          startTime: "2016-11-05 00:00",
          endTime: "2016-11-30 23:59",
          //validPeriod: '20',
          //validTimeType: "RELATIVE",
          validTimeType: "FIXED",
          validTimeFrom: "2016-11-25 00:00",
          validTimeTo: "2016-12-28 23:58",
          budgetAmount: "999999997",
          //receiveLimited: '11',
          receiveLimited: undefined,
          verifyMode: "MERCHANT_SCAN",
          renewMode: "0",
          itemType: "appDefault",
          couponGoods: "海底捞10元代金券",
          descList: '1:-)2:-)3',
          fileId: "l9V-oNdOSAmsXY7FxOfmWQAAACMAAQED",
          backgroundImgUrl: "http://dl.django.t.taobao.com/rest/1.0/image?fileIds=YG1BWtkCSHGE2-db76zmiAAAACMAAQQD&amp;token=xaMz2YZCEM5OpwOQ3MlaRAABUYAAAAFX-ltKFAAAACMAAQED&amp;timestamp=1477381441298&amp;acl=00d07c76e4e9d811b63f008eceb51646&amp;zoom=original",
          "shop": [{ "cityCode": "310100", "shops": [{ "shopId": "2015110700077000000002125059" }, { "shopId": "2016052000077000000003186302" }, { "shopId": "2015110700077000000002125060" }, { "shopId": "2015051400077000000000118376" }, { "shopId": "2015121600077000000002388200" }, { "shopId": "2016051100077000000003167540" }, { "shopId": "2016050600077000000003167527" }, { "shopId": "2016082900077000000003383290" }, { "shopId": "2016082900077000000003383291" }, { "shopId": "2015101000077000000001863405" }, { "shopId": "2016052000077000000003186301" }, { "shopId": "2015051800077000000000120361" }, { "shopId": "2015060800077000000000492126" }, { "shopId": "2016052600077000000003191638" }, { "shopId": "2016080100077000000003329576" }, { "shopId": "2015051800077000000000120316" }, { "shopId": "2016080100077000000003329575" }, { "shopId": "2016083100077000000003397921" }, { "shopId": "2016082900077000000003383292" }, { "shopId": "2016082900077000000003383293" }, { "shopId": "2016082900077000000003383294" }]}],
          itemStatus: 'ONLINE',
          //itemStatus: 'READY_TO_ONLINE',
        }
      });
    }, 150);
  }
};
