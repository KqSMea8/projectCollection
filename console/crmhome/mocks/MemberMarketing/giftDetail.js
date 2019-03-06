module.exports = {
  data: {
    "confirmedMerchants": [],
    "unConfirmedMerchants": [{ "cardNo": "2088101118574628", "name": "hello123@a.com", "status": "1" }],
    "discountForm": {
      "activityId": "20160913000000000046829000151004",
      "activityImgFileIds": [],
      "activityImgs": [],
      "budgetAmount": "99999999",
      "campaignName": "消费满元送稍等发",
      "cityShop": [],
      "confirmTime": "2016-09-13 22:10",
      "consumeGoodsIds": ["09131709369", "123123"],
      "dayReceiveLimited": 10,
      "deliveryChannels": [],
      "deliveryResult": {},
      "displayStatus": "PLAN_GOING", // "STARTED" "PLAN_GOING"
      "endTime": "2016-09-14 20:56",
      "giftName": "稍等发",
      "goodsIds": ["09131709369", "123123"],
      "goodsNames": [],
      "headShopName": "",
      "maxDiscountItemNum": 0,
      "merchants": ["2088101141354721"],
      "minItemNum": 0,
      "minimumAmount": "0",
      "offlineDate": "2016-09-14 20:56",
      "planId": "20160913000000000000368280001001",
      "receiveLimited": 20,
      "recruit": { "endTime": "2016-09-13 22:10", "recruitStatus": "GOING", "startTime": "2016-01-01 00:00" },
      "roundingMode": "0",
      "salesQuantity": 0,
      "shop": [],
      "shopIds": [],
      "shopsCitys": [],
      "showRealtimeVoucher": false,
      "startTime": "2016-09-14 18:10",
      "type": "CONSUME_SEND",
      "validPeriod": 0,
      "vouchers": [{
        "voucherNo": "abckndkdkdkdk",
        "activityImgFileIds": ["1T8Pp00AT7eo9NoAJkMR3AAAACMAAQEC", "1T8Pp00AT7eo9NoAJkMR3AAAACMAAQEC"],
        "activityImgs": ["https://dl.django.t.taobao.com/rest/1.0/image?fileIds=1T8Pp00AT7eo9NoAJkMR3AAAACMAAQEC&zoom=original", "https://dl.django.t.taobao.com/rest/1.0/image?fileIds=1T8Pp00AT7eo9NoAJkMR3AAAACMAAQEC&zoom=original"],
        "activityLink": "http://www.baidu.com",
        "activityName": "单品券说明",
        "availableTimes": [],
        "brandName": "品牌名称09131709369",
        "cityShop": [],
        "consumeSendNum": 1,
        "descList": ["券的使用说明"],
        "goodsIds": [],
        "goodsNames": [],
        "itemDiscountType": "RATE",
        "logoFileId": "1T8Pp00AT7eo9NoAJkMR3AAAACMAAQEC",
        "logoFixUrl": "https://dl.django.t.taobao.com/rest/1.0/image?fileIds=1T8Pp00AT7eo9NoAJkMR3AAAACMAAQEC&zoom=original",
        "maxDiscountItemNum": 88,
        "minItemNum": 1,
        "minimumAmount": "1",
        "rate": "2.8",
        "shop": [],
        "shopIds": [],
        "shopsCitys": [],
        "subject": "单品名称09131709369",
        "validPeriod": 3,
        "validTimeType": "RELATIVE",
        "voucherGoodsIds": ["09131709369"]
      }, {
        "voucherNo": "jkjkjkjkjkjkjk",
        "activityImgFileIds": ["1T8Pp00AT7eo9NoAJkMR3AAAACMAAQEC", "1T8Pp00AT7eo9NoAJkMR3AAAACMAAQEC"],
        "activityImgs": ["https://dl.django.t.taobao.com/rest/1.0/image?fileIds=1T8Pp00AT7eo9NoAJkMR3AAAACMAAQEC&zoom=original", "https://dl.django.t.taobao.com/rest/1.0/image?fileIds=1T8Pp00AT7eo9NoAJkMR3AAAACMAAQEC&zoom=original"],
        "activityLink": "http://www.baidu.com",
        "activityName": "单品券说明",
        "availableTimes": [],
        "brandName": "品牌名称09131709369",
        "cityShop": [],
        "consumeSendNum": 1,
        "couponValue": "13",
        "descList": ["券的使用说明"],
        "goodsIds": [],
        "goodsNames": [],
        "itemDiscountType": "MONEY",
        "logoFileId": "1T8Pp00AT7eo9NoAJkMR3AAAACMAAQEC",
        "logoFixUrl": "https://dl.django.t.taobao.com/rest/1.0/image?fileIds=1T8Pp00AT7eo9NoAJkMR3AAAACMAAQEC&zoom=original",
        "maxDiscountItemNum": 88,
        "minItemNum": 1,
        "minimumAmount": "1",
        "shop": [],
        "shopIds": [],
        "shopsCitys": [],
        "subject": "单品名称09131709369",
        "validTimeType": "FIXED",
        "validTimeFrom": "2016-09-14 18:10",
        "validTimeTo": "2016-10-14 18:10",
        "voucherGoodsIds": ["09131709369"]
      }]
    },
    "isBrand": true,
    "status": "success"
  }

};

// 初始数据结构,与详情下发尽量保持一致
const requestData = {
  // 活动时间
  'startTime': '2016-09-02 12:00', // 活动开始时间
  'endTime': '2016-09-17 12:59', // 活动结束时间

  // 参与限制
  'dayReceiveLimited': 3, // 单个用户每日参与限制
  'receiveLimited': 33, // 单个用户总共参与限制

  // 商品限制
  'goodsIds': ['2088101143457130', '2088102146931393'], // 单品的商品Id集合

  // 消费限制
  'minimumAmount': '5', // 最低支付金额

  // 礼包设置
  'vouchers': [
    {
      'itemDiscountType': 'RATE',
      'rate': 2,
      'subject': '商品啊啊啊',
      'brandName': '品牌啊啊啊',
      'logoFixUrl': 'http://dl.django.t.taobao.com/rest/1.0/image?fileIds=xGMl6ND3TSyS_Q-gfUEsBwAAACMAAQED&amp;token=UpSan6Vb9vDfjX3v4xClsgABUYAAAAFXB9PrQAAAACMAAQED&amp;timestamp=1473305816838&amp;acl=414a7bb3ac37ff0bc459813f97a68467&amp;zoom=original',
      'logoFileId': 'xGMl6ND3TSyS_Q-gfUEsBwAAACMAAQED',
      'activityName': '房价快速反馈说',
      'activityImgs': ['http://dl.django.t.taobao.com/rest/1.0/image?fileIds=tI-zwFuOQNuX9dHuqMKl6wAAACMAAQED&amp;token=UpSan6Vb9vDfjX3v4xClsgABUYAAAAFXB9PrQAAAACMAAQED&amp;timestamp=1473305822874&amp;acl=1abc74914b491e6308cc9d3ede7d2669&amp;zoom=original'],
      'activityImgFileIds': ['tI-zwFuOQNuX9dHuqMKl6wAAACMAAQED'],
      'minItemNum': 2,
      'maxDiscountItemNum': 2,
      'goodsIds': 'a123456\nb123456',
      'validTimeType': 'RELATIVE',
      'validPeriod': 7,
      'voucherGoodsIds': ['a123456', 'b123456'],
      'consumeSendNum': 1
    }
  ], // 死侍提供

  // 券发放总量
  'budgetAmount': 4, // 发送总量

  // 活动名称
  'campaignName': '消费送xqh', // 活动名称

  'giftName': 'giftName',

  // 商家设置
  'merchants': ['2088101143457130', '2088102146931393'], //  参与商家

  // 商户确认截止时间
  'confirmTime': '2016-09-01 12:30'
};
