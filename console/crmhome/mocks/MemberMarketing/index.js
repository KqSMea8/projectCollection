var Mock = require('mockjs');
var fs = require('fs');
var giftDetailMock = require('./giftDetail');

module.exports = {
  'GET /promo/brand/detail.json': function(req, res) {
    res.json(giftDetailMock.data);
  },
  'GET /goods/discountpromo/getCityIndustryInfo.json': function(req, res) {
    res.json({
        "cityNames": [
            "杭州"
        ],
        "industryNames": [
            "宝洁"
        ]
    });
  },
  'GET /goods/itempromo/brandVendorItems.json': function(req, res) {
    var data = [], total = 26;

    for (var i = 0; i < total; i++) {
      data.push({
        "subject":"dsfsd",
        "startTime":"",
        "allowConfirm":false,
        "activityBeginTime":"",
        "planOwnerId":"2088101159953541",
        "itemDiscountType":"",
        "orderId":"20160430000000000007181200002543",
        "applyMerchantNum":0,
        "status":"NO_CONFIRM_YET",
        "planId":Math.random() * 100000,
        "outBizType":"",
        "legalContent":"",
        "discountFormList":[],
        "subsidy":"",
        "canRecruit":false,
        "confirmShopsNum":0,
        "activityType":"SINGLE_DISCOUNT",
        "activityTime":"2016.05.07 - 2016.06.07"
      });
    }

    setTimeout(() => {
      res.json({
        success: true,
        data: data,
        errorCode: "11",
        message: '´íÎóÏûÏ¢ÌáÊ¾',
        "page":{
          "pageSize":10,
          "currentPage":1,
          "totalSize":335
        },
/*        pageNum: 2,
        pageSize: 10,
        totalRecords: total*/
      });
    }, 500);
  },

  'GET /*/getData.JSON': function(req, res) {
    var blockUri = req.query.blockUri;
    try {
      var mocks = JSON.parse(fs.readFileSync('./mocks/report/mock.json', 'utf-8'));
    } catch (e) {
      console.log('mock.json error');
    }
    if (mocks && blockUri in mocks) {
      res.json({
        result: Mock.mock(mocks[blockUri]),
        status: "success"
      })
    } else {
      res.status(404).end();
    }
  },

  'GET /promo/brand/modifyView.json': function(req, res) {
    var data = {
      "itemDiscountType": "MONEY",
      "startTime": "2016-05-18 00:00",
      "endTime": "2016-06-28 23:59",
      "activityLink": "http://www.alipay.com",
      "budgetAmount": "999999999",
      "receiveLimited": 60,
      "dayReceiveLimited": 50,
      "validTimeType": "FIXED",
      "validTimeFrom": "2016-05-19 00:00",
      "validTimeTo": "2016-07-29 23:59",
      "validPeriod": 4,
      "itemType": "appDefault",
      "useMode": "0",
      "campaignName": "活动名称",
      "rate": "3",
      "brandVendorLogoFileId": "soUTBfJSTLKtBk6lqQW6_wAAACMAAQED",
      "brandVendorLogo": "https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png",
      "logoFileId": "soUTBfJSTLKtBk6lqQW6_wAAACMAAQED",
      "logoFixUrl": "https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png",
      "activityImgFileIds": ["y_EV4PbcTze6T11nJls6ngAAACMAAQED"],
      "activityImgs": ["https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png", "https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png", "https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png"],
      "deliveryChannels": ['PAYMENT_RESULT', 'SPECIAL_LIST'],
      "deliveryChannelSlogan": "专属优惠推荐理由",
      "deliveryChannelImgFileId": "soUTBfJSTLKtBk6lqQW6_wAAACMAAQED",
      "deliveryChannelImgUrl": "https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png",
      "brandName": "品牌名称",
      "activityName": "商品详情文案",
      "goodsIds": ["111", "222", "333"],
      "fileId": "mq3acV3zSqq8pEqnOW2MtwAAACMAAQED",
      "backgroundImgUrl": "http://dl.django.t.taobao.com/rest/1.0/image?fileIds=mq3acV3zSqq8pEqnOW2MtwAAACMAAQED&token=KdTxDgtfsuLM8nUHahpPzAABUYAAAAFUcJDwtQAAACMAAQED&timestamp=1462243311567&acl=fa0bbe7265efa32ba01a8d68d13fc2d4&zoom=original",
      "subject": "商品名称",
      "minItemNum": "10",
      "maxDiscountItemNum": "8",
      "descList": ["使用须知1", "使用须知2", "使用须知3"],
      "confirmTime": "2016-05-08 00:00",
      "couponValue": 5.5,
      "couponName": "券名称",
      "shopIds": ["2015112000077000000002292910", "2015122400077000000002399888", "2015092500077000000001839074", "2015051200077000000000109858", "2016011900077000000002467837"],
      "shopsCitys": [{
        "cityCode": "SH",
        "shops": [{
          "shopid": "2015112000077000000002292910"
        }]
      }],
      "crowdId": "34546576576565756",
      "crowdName": "品牌商活动对象",
      "merchants": ['2088101166109902'],
      "minimumAmount": "4.6",
    };

    setTimeout(() => {
      res.json({
        status: 'success',
        discountForm: data,
        "confirmedMerchants": [],
        "unConfirmedMerchants": [{
          "cardNo":"2088101166109902",
          "name":"niojrd@alitest.com",
          "status":"1"
        }],
      });
    }, 500);
  },

  'GET /promo/merchant/detail.json': function(req, res) {
    var data = {
      "campaignStart": true,
      "itemDiscountType": "REDUCETO",
      "startTime": "2016-05-10 00:00",
      "endTime": "2016-05-12 23:59",
      "activityLink": "http://www.alipay.com",
      "budgetAmount": "333",
      "receiveLimited": 60,
      "dayReceiveLimited": 50,
      "validTimeType": "FIXED",
      "validTimeFrom": "2016-05-13 00:00",
      "validTimeTo": "2016-05-15 23:59",
      "validPeriod": 4,
      "itemType": "appDefault",
      "useMode": "0",
      "campaignName": "活动名称",
      "rate": "3",
      "brandVendorLogoFileId": "soUTBfJSTLKtBk6lqQW6_wAAACMAAQED",
      "brandVendorLogo": "https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png",
      "logoFileId": "soUTBfJSTLKtBk6lqQW6_wAAACMAAQED",
      "logoFixUrl": "https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png",
      "activityImgFileIds": ["y_EV4PbcTze6T11nJls6ngAAACMAAQED"],
      "activityImgs": ["https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png", "https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png", "https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png"],
      "deliveryChannels": ['PAYMENT_RESULT'],
      "deliveryChannelSlogan": "专属优惠推荐理由",
      "deliveryChannelImgFileId": "soUTBfJSTLKtBk6lqQW6_wAAACMAAQED",
      "deliveryChannelImgUrl": "https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png",
      "brandName": "防守打法",
      "activityName": "商品详情文案",
      "goodsIds": ["111", "222", "333"],
      "fileId": "mq3acV3zSqq8pEqnOW2MtwAAACMAAQED",
      "backgroundImgUrl": "http://dl.django.t.taobao.com/rest/1.0/image?fileIds=mq3acV3zSqq8pEqnOW2MtwAAACMAAQED&token=KdTxDgtfsuLM8nUHahpPzAABUYAAAAFUcJDwtQAAACMAAQED&timestamp=1462243311567&acl=fa0bbe7265efa32ba01a8d68d13fc2d4&zoom=original",
      "subject": "商品名称",
      "minItemNum": "10",
      "maxDiscountItemNum": "8",
      "merchants": ["2088101143457130", "2088102146931393", "2088101141440699"],
      "descList": ["使用须知1", "使用须知2", "使用须知3"],
      "confirmTime": "2016-05-08 00:00",
      "originPrice": "10.09",
      "reduceToPrice": "5.98",
      "couponName": "券名称",
      "shopIds": ["2015112000077000000002292910", "2015122400077000000002399888", "2015092500077000000001839074", "2015051200077000000000109858", "2016011900077000000002467837"],
      "shopsCitys": [{
        "cityCode": "SH",
        "shops": [{
          "shopid": "2015112000077000000002292910"
        }]
      }],
      "crowdId": "43534543543543534",
      "crowdName": "零售商活动对象",
    };

    setTimeout(() => {
      res.json({
        status: 'success',
        discountForm: data,
      });
    }, 500);
  },

  'POST /goods/itempromo/uploadPicture.json': function(req, res) {
    var data;
    // if (req.query.err) {
    //   data = {"resultMsg":"系统繁忙，请稍后再试","resultCode":"AE0501717099","exception_marking":"Required org.springframework.web.multipart.MultipartFile parameter &#39;Filedata&#39; is not present","status":"failed"};
    // } else {
      data = {
        "fileId": "2KM54cq1Q_m_SGyGcvAbdAAAACMAAQED",
        "resultCode": "succeed",
        "result": "http://dl.django.t.taobao.com/rest/1.0/image?fileIds=2KM54cq1Q_m_SGyGcvAbdAAAACMAAQED&amp;token=Tdylp7w8kWf-8yCw1wdVnAABUYAAAAFUlN9JaQAAACMAAQED&amp;timestamp=1462869421695&amp;acl=3d72edd44a6fcb60bc0bd52fcc98d342&amp;zoom=original",
        "avatarImage": "http://dl.django.t.taobao.com/rest/1.0/image?fileIds=2KM54cq1Q_m_SGyGcvAbdAAAACMAAQED&amp;token=Tdylp7w8kWf-8yCw1wdVnAABUYAAAAFUlN9JaQAAACMAAQED&amp;timestamp=1462869421695&amp;acl=3d72edd44a6fcb60bc0bd52fcc98d342&amp;zoom=original",
        "fileType": "PNG",
        "status": "succeed",
      };
    // }
    setTimeout(() => {
      res.json(data);
    }, 500);
  },

  'POST /goods/itempromo/cutPicture.json': function(req, res) {
    setTimeout(() => {
      res.json({
        "fileId": "2KM54cq1Q_m_SGyGcvAbdAAAACMAAQED",
        "resultCode": "succeed",
        "result": "http://dl.django.t.taobao.com/rest/1.0/image?fileIds=2KM54cq1Q_m_SGyGcvAbdAAAACMAAQED&amp;token=Tdylp7w8kWf-8yCw1wdVnAABUYAAAAFUlN9JaQAAACMAAQED&amp;timestamp=1462869421695&amp;acl=3d72edd44a6fcb60bc0bd52fcc98d342&amp;zoom=original",
        "avatarImage": "http://dl.django.t.taobao.com/rest/1.0/image?fileIds=2KM54cq1Q_m_SGyGcvAbdAAAACMAAQED&amp;token=Tdylp7w8kWf-8yCw1wdVnAABUYAAAAFUlN9JaQAAACMAAQED&amp;timestamp=1462869421695&amp;acl=3d72edd44a6fcb60bc0bd52fcc98d342&amp;zoom=original",
        "fileType": "PNG",
        "status": "succeed",
      });
    }, 500);
  },
  'GET /goods/discountpromo/inviteModify.json': function(req, res) {
    setTimeout(() => {
      res.json({
        "planId": "2KM54cq1Q_m_SGyGcvAbdAAAACMAAQED",
        "result": "true",
        "status": "succeed"
      });
    }, 500);
  },

  'POST /promo/*/createPost.json': function(req, res) {
    setTimeout(() => {
      res.json({
        "status": "success"
      });
    }, 500);
  },

  'POST /promo/*/modifyPost.json': function(req, res) {
    setTimeout(() => {
      res.json({
        errorCode: "AE0501717091",
        status: "failed",
        errorMsg: "111111AE0501717091:系统繁忙，请稍后再试",
      });
    }, 500);
  },

  'GET /goods/discountpromo/getRetailers.json': function(req, res) {
    var list = [{
      "cardNo": "2088101141354721",
      "status": "1",
      "name": "xuanshia@alitest.com"
    }, {
      "cardNo": "2088101141272045",
      "status": "1",
      "name": "zhongchangsitua@alitest.com"
    }, {
      "cardNo": "2088101143457130",
      "status": "1",
      "name": "niojrd@alitest.com"
    }, {
      "cardNo": "2088102146931393",
      "status": "1",
      "name": "cc123@alitest.com"
    }, {
      "cardNo": "2088101141440677",
      "status": "1",
      "name": "changsunquana@alitest.com"
    }, {
      "cardNo": "2088101141440699",
      "status": "1",
      "name": "shangguanjianga@alitest.com"
    }];

    if (req.query.displayName === 'a') {
      list = [{
        "cardNo": "2088101166109902",
        "status": "1",
        "name": "gt_lss101@alitest.com"
      }, {
        "cardNo": "2088101166193811",
        "status": "1",
        "name": "gt_lss102@alitest.com"
      }, {
        "cardNo": "2088102166193856",
        "status": "1",
        "name": "gt_lss103@alitest.com"
      }, {
        "cardNo": "2088101166193888",
        "status": "1",
        "name": "gt_lss104@alitest.com"
      }, {
        "cardNo": "2088101166193901",
        "status": "1",
        "name": "gt_lss105@alitest.com"
      }];
    }

    setTimeout(() => {
      res.json({
        retailers: list,
      });
    }, 500);
  },

  'GET /goods/itempromo/getShops.json': function(req, res) {
    var list = [{
      "shops": [],
      "cityName": "Shanghai",
      "cityCode": "SH",
      "shopCount": 3
    }, {
      "shops": [],
      "cityName": "海外",
      "cityCode": "990100",
      "shopCount": 1
    }, {
      "shops": [],
      "cityName": "离岛",
      "cityCode": "820200",
      "shopCount": 1
    }, {
      "shops": [],
      "cityName": "澳门半岛",
      "cityCode": "820100",
      "shopCount": 4
    }, {
      "shops": [],
      "cityName": "大堂区",
      "cityCode": "820004",
      "shopCount": 1
    }, {
      "shops": [],
      "cityName": "定西市",
      "cityCode": "621100",
      "shopCount": 1
    }, {
      "shops": [],
      "cityName": "丽江市",
      "cityCode": "530700",
      "shopCount": 16
    }, {
      "shops": [],
      "cityName": "达州市",
      "cityCode": "511700",
      "shopCount": 1
    }, {
      "shops": [],
      "cityName": "重庆市",
      "cityCode": "500100",
      "shopCount": 2
    }, {
      "shops": [],
      "cityName": "东莞市",
      "cityCode": "460200",
      "shopCount": 1
    }, {
      "shops": [],
      "cityName": "防城港市",
      "cityCode": "450600",
      "shopCount": 1
    }, {
      "shops": [],
      "cityName": "东莞市",
      "cityCode": "441900",
      "shopCount": 1
    }, {
      "shops": [],
      "cityName": "恩施土家族苗族自治州",
      "cityCode": "422800",
      "shopCount": 1
    }, {
      "shops": [],
      "cityName": "荆门市",
      "cityCode": "420800",
      "shopCount": 1
    }, {
      "shops": [],
      "cityName": "九江市",
      "cityCode": "360400",
      "shopCount": 20
    }, {
      "shops": [],
      "cityName": "宁德市",
      "cityCode": "350900",
      "shopCount": 1
    }, {
      "shops": [],
      "cityName": "龙岩市",
      "cityCode": "350800",
      "shopCount": 1
    }, {
      "shops": [],
      "cityName": "南平市",
      "cityCode": "350700",
      "shopCount": 1
    }, {
      "shops": [],
      "cityName": "亳州市",
      "cityCode": "341600",
      "shopCount": 1
    }, {
      "shops": [],
      "cityName": "安庆市",
      "cityCode": "340800",
      "shopCount": 23
    }, {
      "shops": [],
      "cityName": "铜陵市",
      "cityCode": "340700",
      "shopCount": 1
    }, {
      "shops": [],
      "cityName": "蚌埠市",
      "cityCode": "340300",
      "shopCount": 5
    }, {
      "shops": [],
      "cityName": "杭州",
      "cityCode": "330100",
      "shopCount": 79
    }, {
      "shops": [],
      "cityName": "常州市",
      "cityCode": "320400",
      "shopCount": 2
    }, {
      "shops": [],
      "cityName": "上海",
      "cityCode": "310100",
      "shopCount": 12
    }, {
      "shops": [],
      "cityName": "佳木斯市",
      "cityCode": "230800",
      "shopCount": 1
    }, {
      "shops": [],
      "cityName": "天津城区",
      "cityCode": "120100",
      "shopCount": 2
    }, {
      "shops": [],
      "cityName": "北京市",
      "cityCode": "110100",
      "shopCount": 7
    }];

    setTimeout(() => {
      res.json({
        shopCountGroupByCityVO: list,
      });
    }, 500);
  },

  'GET /goods/itempromo/getShopsByCity.json': function(req, res) {
    var list = [
      {
        "shopName": "NB店铺656923",
        "shopId": "2015112000077000000002292910",
        "cityCode": "SH"
      },
      {
        "shopName": "NB店铺670734",
        "shopId": "2015110700077000000002125058",
        "cityCode": "SH"
      },
      {
        "shopName": "shop_1432102089259",
        "shopId": "2015052000077000000000182141",
        "cityCode": "SH"
      }
    ];

    setTimeout(() => {
      res.json({
        shopComps: list,
      });
    }, 500);
  },

  'GET /promo/merchant/memberMerchantBatchSum.json': function(req, res) {
    setTimeout(() => {
      res.json({
        status: 'success',
        data: {
          memberMerchantGroupCount: '1000人',
          memberMerchantGroupRatio: '3%',
        }
      });
    }, 500);
  },

  'GET /promo/common/memberCrowdCount.json': function(req, res) {
    setTimeout(() => {
      res.json({
        memberCrowdCount: '900人',
      });
    }, 500);
  },

  'POST /goods/itempromo/queryShopName.json': function(req, res) {
    setTimeout(() => {
      res.json({
        shopNames: ["tsesffs","一般商户01","蓬山旗舰店6485810600394222698","Test","caffee2"],
        status: 'succeed',
      });
    }, 500);
  },
};
