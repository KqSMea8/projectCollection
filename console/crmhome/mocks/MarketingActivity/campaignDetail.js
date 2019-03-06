module.exports = {
  'GET /goods/itempromo/campaignDetail.json': function (req, res) {

    // 实时优惠 -- 代金券
    const data0 = {
      "discountForm": {
        "allowConfirm": false,
        "allowModifyConfirm": false,
        "allowOffline": true,
        "allowOfflineConfirm": false,
        "autoDelayFlag": "N",
        "autoPurchase": true,
        "campName": "[测试]测试商家中心",
        "campRule": "消费即送",
        "campType": "REAL_TIME_SEND",
        "cityShopVOs": [
          {
            "cityCode": "152200",
            "cityName": "兴安盟",
            "shopCount": 5,
            "shops": [
              {
                "addFlag": false,
                "address": "突泉小城旅馆3楼301",
                "cityCode": "152200",
                "cityName": "兴安盟",
                "id": "2016111100077000000019934154",
                "name": "小猫造型(兴安盟)",
                "partnerId": "2088211521646673"
              },
              {
                "addFlag": false,
                "address": "突泉县利源快餐店旁边",
                "cityCode": "152200",
                "cityName": "兴安盟",
                "id": "2016111100077000000019934153",
                "name": "红点点造型(兴安盟店)",
                "partnerId": "2088211521646673"
              },
              {
                "addFlag": false,
                "address": "突泉福泉宾馆2楼",
                "cityCode": "152200",
                "cityName": "兴安盟",
                "id": "2016111100077000000019934152",
                "name": "一拍即合造型(兴安盟)",
                "partnerId": "2088211521646673"
              },
              {
                "addFlag": false,
                "address": "突泉丽娜餐馆旁边的小弄堂",
                "cityCode": "152200",
                "cityName": "兴安盟",
                "id": "2016111100077000000019934151",
                "name": "山山雨雨造型(兴安盟店)",
                "partnerId": "2088211521646673"
              },
              {
                "addFlag": false,
                "address": "内蒙古自治区兴安盟突泉县向阳路",
                "cityCode": "152200",
                "cityName": "兴安盟",
                "id": "2016102500077000000019411986",
                "name": "手艺人测试店勿动(表妹分店)",
                "partnerId": "2088211521646673"
              }
            ]
          }
        ],
        "consumeSendType": 1,
        "dayParticipateLimited": "3",
        "endTime": "2016-11-20 23:59:59",
        "itemIds": [],
        "minimumAmount": "",
        "shop": [],
        "shopIds": [
          "2016111100077000000019934153",
          "2016111100077000000019934152",
          "2016102500077000000019411986",
          "2016111100077000000019934151",
          "2016111100077000000019934154"
        ],
        "sourceChannel": "CRMHOME",
        "sourceType": "ALIPAY",
        "startTime": "2016-11-17 00:00:00",
        "voucherVOs": [
          {
            "availableVoucherTime": [],
            "cityShopVOs": [
              {
                "cityCode": "152200",
                "cityName": "兴安盟",
                "shopCount": 5,
                "shops": [
                  {
                    "addFlag": false,
                    "address": "突泉小城旅馆3楼301",
                    "cityCode": "152200",
                    "cityName": "兴安盟",
                    "id": "2016111100077000000019934154",
                    "name": "小猫造型(兴安盟)",
                    "partnerId": "2088211521646673"
                  },
                  {
                    "addFlag": false,
                    "address": "突泉县利源快餐店旁边",
                    "cityCode": "152200",
                    "cityName": "兴安盟",
                    "id": "2016111100077000000019934153",
                    "name": "红点点造型(兴安盟店)",
                    "partnerId": "2088211521646673"
                  },
                  {
                    "addFlag": false,
                    "address": "突泉福泉宾馆2楼",
                    "cityCode": "152200",
                    "cityName": "兴安盟",
                    "id": "2016111100077000000019934152",
                    "name": "一拍即合造型(兴安盟)",
                    "partnerId": "2088211521646673"
                  },
                  {
                    "addFlag": false,
                    "address": "突泉丽娜餐馆旁边的小弄堂",
                    "cityCode": "152200",
                    "cityName": "兴安盟",
                    "id": "2016111100077000000019934151",
                    "name": "山山雨雨造型(兴安盟店)",
                    "partnerId": "2088211521646673"
                  },
                  {
                    "addFlag": false,
                    "address": "内蒙古自治区兴安盟突泉县向阳路",
                    "cityCode": "152200",
                    "cityName": "兴安盟",
                    "id": "2016102500077000000019411986",
                    "name": "手艺人测试店勿动(表妹分店)",
                    "partnerId": "2088211521646673"
                  }
                ]
              }
            ],
            "donateFlag": "false",
            "effectDayFlag": "true",
            "forbiddenVoucherTime": "",
            "itemHeadImg": [],
            "itemIds": [
              "2828293",
              "2872929"
            ],
            "itemName": "测试代金券",
            "itemText": "测试代金券",
            "logo": "https://dl.django.t.taobao.com/rest/1.0/image?fileIds=ykyxekGzTaiVgJaZV_UavAAAACMAAQQD&token=z0_2QNSTxgoUhi2uvuAY-gABUYAAAAFYgiW2eQAAACMAAQED&timestamp=1479736886273&acl=869142a0cfe663824a416868f3667657&zoom=original",
            "maxAmount": "",
            "maxDiscountNum": "",
            "minConsumeNum": "",
            "name": "测试代金券",
            "promotionRule": "单品立减1元",
            "promotionType": "SINGLE_ITEM",
            "rate": "",
            "relativeTime": "3",
            "shopIds": [
              "2016111100077000000019934153",
              "2016111100077000000019934152",
              "2016102500077000000019411986",
              "2016111100077000000019934151",
              "2016111100077000000019934154"
            ],
            "subTitle": "测试",
            "type": "MONEY",
            "useCondtion": "1",
            "useInstructions": [],
            "voucherCount": "",
            "voucherImg": "https://dl.django.t.taobao.com/rest/1.0/image?fileIds=nAcluuyASueF-JOLhN3rIgAAACMAAQED&token=z0_2QNSTxgoUhi2uvuAY-gABUYAAAAFYgiW2eQAAACMAAQED&timestamp=1479736886273&acl=486c65070b1af96446405c17d74261c0&zoom=original",
            "worthValue": "1"
          }
        ]
      },
      "result": true,
      "roleType": "MERCHANT"
    };

    // 实时优惠 -- 折扣券
    const data1 = {
      "discountForm": {
        "allowConfirm": false,
        "allowModifyConfirm": false,
        "allowOffline": true,
        "allowOfflineConfirm": false,
        "autoDelayFlag": "N",
        "autoPurchase": true,
        "budgetAmount": "50",
        "campName": "[测试]商家端展示",
        "campRule": "消费即送",
        "campType": "REAL_TIME_SEND",
        "cityShopVOs": [
          {
            "cityCode": "152200",
            "cityName": "兴安盟",
            "shopCount": 5,
            "shops": [
              {
                "addFlag": false,
                "address": "突泉小城旅馆3楼301",
                "cityCode": "152200",
                "cityName": "兴安盟",
                "id": "2016111100077000000019934154",
                "name": "小猫造型(兴安盟)",
                "partnerId": "2088211521646673"
              },
              {
                "addFlag": false,
                "address": "突泉县利源快餐店旁边",
                "cityCode": "152200",
                "cityName": "兴安盟",
                "id": "2016111100077000000019934153",
                "name": "红点点造型(兴安盟店)",
                "partnerId": "2088211521646673"
              },
              {
                "addFlag": false,
                "address": "突泉福泉宾馆2楼",
                "cityCode": "152200",
                "cityName": "兴安盟",
                "id": "2016111100077000000019934152",
                "name": "一拍即合造型(兴安盟)",
                "partnerId": "2088211521646673"
              },
              {
                "addFlag": false,
                "address": "突泉丽娜餐馆旁边的小弄堂",
                "cityCode": "152200",
                "cityName": "兴安盟",
                "id": "2016111100077000000019934151",
                "name": "山山雨雨造型(兴安盟店)",
                "partnerId": "2088211521646673"
              },
              {
                "addFlag": false,
                "address": "内蒙古自治区兴安盟突泉县向阳路",
                "cityCode": "152200",
                "cityName": "兴安盟",
                "id": "2016102500077000000019411986",
                "name": "手艺人测试店勿动(表妹分店)",
                "partnerId": "2088211521646673"
              }
            ]
          }
        ],
        "consumeSendType": 1,
        "dayParticipateLimited": "1",
        "endTime": "2016-11-20 23:59:59",
        "itemIds": [],
        "minimumAmount": "",
        "participateLimited": "1",
        "shop": [],
        "shopIds": [
          "2016111100077000000019934153",
          "2016111100077000000019934152",
          "2016102500077000000019411986",
          "2016111100077000000019934151",
          "2016111100077000000019934154"
        ],
        "sourceChannel": "CRMHOME",
        "sourceType": "ALIPAY",
        "startTime": "2016-11-17 00:00:00",
        "voucherVOs": [
          {
            "availableVoucherTime": [],
            "cityShopVOs": [
              {
                "cityCode": "152200",
                "cityName": "兴安盟",
                "shopCount": 5,
                "shops": [
                  {
                    "addFlag": false,
                    "address": "突泉小城旅馆3楼301",
                    "cityCode": "152200",
                    "cityName": "兴安盟",
                    "id": "2016111100077000000019934154",
                    "name": "小猫造型(兴安盟)",
                    "partnerId": "2088211521646673"
                  },
                  {
                    "addFlag": false,
                    "address": "突泉县利源快餐店旁边",
                    "cityCode": "152200",
                    "cityName": "兴安盟",
                    "id": "2016111100077000000019934153",
                    "name": "红点点造型(兴安盟店)",
                    "partnerId": "2088211521646673"
                  },
                  {
                    "addFlag": false,
                    "address": "突泉福泉宾馆2楼",
                    "cityCode": "152200",
                    "cityName": "兴安盟",
                    "id": "2016111100077000000019934152",
                    "name": "一拍即合造型(兴安盟)",
                    "partnerId": "2088211521646673"
                  },
                  {
                    "addFlag": false,
                    "address": "突泉丽娜餐馆旁边的小弄堂",
                    "cityCode": "152200",
                    "cityName": "兴安盟",
                    "id": "2016111100077000000019934151",
                    "name": "山山雨雨造型(兴安盟店)",
                    "partnerId": "2088211521646673"
                  },
                  {
                    "addFlag": false,
                    "address": "内蒙古自治区兴安盟突泉县向阳路",
                    "cityCode": "152200",
                    "cityName": "兴安盟",
                    "id": "2016102500077000000019411986",
                    "name": "手艺人测试店勿动(表妹分店)",
                    "partnerId": "2088211521646673"
                  }
                ]
              }
            ],
            "donateFlag": "false",
            "effectDayFlag": "true",
            "forbiddenVoucherTime": "",
            "itemHeadImg": [],
            "itemIds": [
              "38832",
              "28392"
            ],
            "itemName": "测试折扣",
            "itemText": "测试商品情况",
            "logo": "https://dl.django.t.taobao.com/rest/1.0/image?fileIds=P16INhEnQMK_Pa6oBIRMjgAAACMAAQQD&token=z0_2QNSTxgoUhi2uvuAY-gABUYAAAAFYgiW2eQAAACMAAQED&timestamp=1479737005420&acl=c169124b90594bc2c9a31df5db12c571&zoom=original",
            "maxAmount": "",
            "maxDiscountNum": "1",
            "minConsumeNum": "1",
            "name": "测试折扣",
            "promotionType": "SINGLE_ITEM",
            "rate": "8",
            "relativeTime": "3",
            "shopIds": [
              "2016111100077000000019934153",
              "2016111100077000000019934152",
              "2016102500077000000019411986",
              "2016111100077000000019934151",
              "2016111100077000000019934154"
            ],
            "subTitle": "测试",
            "type": "RATE",
            "useCondtion": "",
            "useInstructions": [],
            "voucherCount": "50",
            "voucherImg": "https://dl.django.t.taobao.com/rest/1.0/image?fileIds=KdS7CNL9TwOW6_145Cy25gAAACMAAQED&token=z0_2QNSTxgoUhi2uvuAY-gABUYAAAAFYgiW2eQAAACMAAQED&timestamp=1479737005420&acl=8062936b265351461bae388d54643957&zoom=original"
          }
        ]
      },
      "result": true,
      "roleType": "MERCHANT"
    };

    // 实时优惠 -- 换购券
    const data2 = {
      "discountForm": {
        "allowConfirm": false,
        "allowModifyConfirm": false,
        "allowOffline": true,
        "allowOfflineConfirm": false,
        "autoDelayFlag": "N",
        "autoPurchase": true,
        "campName": "[测试]测试咋回",
        "campRule": "消费即送",
        "campType": "REAL_TIME_SEND",
        "cityShopVOs": [
          {
            "cityCode": "152200",
            "cityName": "兴安盟",
            "shopCount": 5,
            "shops": [
              {
                "addFlag": false,
                "address": "突泉小城旅馆3楼301",
                "cityCode": "152200",
                "cityName": "兴安盟",
                "id": "2016111100077000000019934154",
                "name": "小猫造型(兴安盟)",
                "partnerId": "2088211521646673"
              },
              {
                "addFlag": false,
                "address": "突泉县利源快餐店旁边",
                "cityCode": "152200",
                "cityName": "兴安盟",
                "id": "2016111100077000000019934153",
                "name": "红点点造型(兴安盟店)",
                "partnerId": "2088211521646673"
              },
              {
                "addFlag": false,
                "address": "突泉福泉宾馆2楼",
                "cityCode": "152200",
                "cityName": "兴安盟",
                "id": "2016111100077000000019934152",
                "name": "一拍即合造型(兴安盟)",
                "partnerId": "2088211521646673"
              },
              {
                "addFlag": false,
                "address": "突泉丽娜餐馆旁边的小弄堂",
                "cityCode": "152200",
                "cityName": "兴安盟",
                "id": "2016111100077000000019934151",
                "name": "山山雨雨造型(兴安盟店)",
                "partnerId": "2088211521646673"
              },
              {
                "addFlag": false,
                "address": "内蒙古自治区兴安盟突泉县向阳路",
                "cityCode": "152200",
                "cityName": "兴安盟",
                "id": "2016102500077000000019411986",
                "name": "手艺人测试店勿动(表妹分店)",
                "partnerId": "2088211521646673"
              }
            ]
          }
        ],
        "consumeSendType": 1,
        "dayParticipateLimited": "2",
        "endTime": "2016-11-20 23:59:59",
        "itemIds": [],
        "minimumAmount": "",
        "shop": [],
        "shopIds": [
          "2016111100077000000019934153",
          "2016111100077000000019934152",
          "2016102500077000000019411986",
          "2016111100077000000019934151",
          "2016111100077000000019934154"
        ],
        "sourceChannel": "CRMHOME",
        "sourceType": "ALIPAY",
        "startTime": "2016-11-17 00:00:00",
        "voucherVOs": [
          {
            "availableVoucherTime": [],
            "cityShopVOs": [
              {
                "cityCode": "152200",
                "cityName": "兴安盟",
                "shopCount": 5,
                "shops": [
                  {
                    "addFlag": false,
                    "address": "突泉小城旅馆3楼301",
                    "cityCode": "152200",
                    "cityName": "兴安盟",
                    "id": "2016111100077000000019934154",
                    "name": "小猫造型(兴安盟)",
                    "partnerId": "2088211521646673"
                  },
                  {
                    "addFlag": false,
                    "address": "突泉县利源快餐店旁边",
                    "cityCode": "152200",
                    "cityName": "兴安盟",
                    "id": "2016111100077000000019934153",
                    "name": "红点点造型(兴安盟店)",
                    "partnerId": "2088211521646673"
                  },
                  {
                    "addFlag": false,
                    "address": "突泉福泉宾馆2楼",
                    "cityCode": "152200",
                    "cityName": "兴安盟",
                    "id": "2016111100077000000019934152",
                    "name": "一拍即合造型(兴安盟)",
                    "partnerId": "2088211521646673"
                  },
                  {
                    "addFlag": false,
                    "address": "突泉丽娜餐馆旁边的小弄堂",
                    "cityCode": "152200",
                    "cityName": "兴安盟",
                    "id": "2016111100077000000019934151",
                    "name": "山山雨雨造型(兴安盟店)",
                    "partnerId": "2088211521646673"
                  },
                  {
                    "addFlag": false,
                    "address": "内蒙古自治区兴安盟突泉县向阳路",
                    "cityCode": "152200",
                    "cityName": "兴安盟",
                    "id": "2016102500077000000019411986",
                    "name": "手艺人测试店勿动(表妹分店)",
                    "partnerId": "2088211521646673"
                  }
                ]
              }
            ],
            "donateFlag": "false",
            "effectDayFlag": "true",
            "forbiddenVoucherTime": "",
            "itemHeadImg": [],
            "itemIds": [
              "232335",
              "292992"
            ],
            "itemName": "测试换购券",
            "itemText": "搜搜嗖嗖嗖的",
            "logo": "https://dl.django.t.taobao.com/rest/1.0/image?fileIds=b7jM_VweSOGsK5op4ATKTwAAACMAAQED&token=z0_2QNSTxgoUhi2uvuAY-gABUYAAAAFYgiW2eQAAACMAAQED&timestamp=1479737141324&acl=990f42478e493a8973b42481e88138b9&zoom=original",
            "maxAmount": "",
            "maxDiscountNum": "1",
            "minConsumeNum": "1",
            "name": "测试换购券",
            "promotionType": "SINGLE_ITEM",
            "rate": "",
            "relativeTime": "3",
            "shopIds": [
              "2016111100077000000019934153",
              "2016111100077000000019934152",
              "2016102500077000000019411986",
              "2016111100077000000019934151",
              "2016111100077000000019934154"
            ],
            "subTitle": "测试",
            "type": "REDUCETO",
            "useCondtion": "",
            "useInstructions": [],
            "voucherCount": "",
            "voucherImg": "https://dl.django.t.taobao.com/rest/1.0/image?fileIds=LYpIXr3ZS0e_p1DyNVZIiAAAACMAAQED&token=z0_2QNSTxgoUhi2uvuAY-gABUYAAAAFYgiW2eQAAACMAAQED&timestamp=1479737141324&acl=8eb39851491839decbf72457a77e2e47&zoom=original",
            "worthValue": "0.01"
          }
        ]
      },
      "result": true,
      "roleType": "MERCHANT"
    };

    // 买一送一
    const data = {
      "discountForm": {
        "campaignStart": true,
        "autoPurchase": true, // 是否需要领取
        "allowConfirm": false,
        "allowModifyConfirm": false,
        "allowOffline": true,
        "allowOfflineConfirm": false,
        "autoDelayFlag": "N",
        "budgetAmount": "500",
        "campName": "橘子汽水买一送一",
        "campRule": "消费即送",
        "campType": "BUY_ONE_SEND_ONE",
        "cityShopVOs": [{
          "cityCode": "310100",
          "cityName": "上海市",
          "shopCount": 2,
          "shops": [{
            "addFlag": false,
            "address": "上海市浦东新校区民生路1199弄",
            "cityCode": "310100",
            "cityName": "上海市",
            "id": "2016100300077000000003421266",
            "name": "headShopName_1475479398916(shopName)",
            "partnerId": "2088102149447802"
          }]
        }],
        "consumeSendType": 1,
        "endTime": "2016-12-09 23:59:00",
        "itemIds": [],
        "minimumAmount": "",
        "shop": [],
        "shopIds": ["2016100300077000000003421266"],
        "sourceChannel": "CRMHOME",
        "sourceType": "ALIPAY",
        "startTime": "2016-11-09 00:00:00",
        "voucherVOs": [{
          "availableVoucherTime": [],
          "cityShopVOs": [{
            "cityCode": "310100",
            "cityName": "上海市",
            "shopCount": 2,
            "shops": [{
              "addFlag": false,
              "address": "上海市浦东新校区民生路1199弄",
              "cityCode": "310100",
              "cityName": "上海市",
              "id": "2016100300077000000003421266",
              "name": "headShopName_1475479398916(shopName)",
              "partnerId": "2088102149447802"
            }]
          }],
          "donateFlag": "true",
          "effectDayFlag": "true",
          "forbiddenVoucherTime": "",
          "itemDiscountRule": {
            "itemSendType": "BUY_A_SEND_B", // BUY_A_SEND_B
            "sendRules": [
              {
                "buyCnt": 2,
                "buySkus": [23234, 4234234],
                "sendCnt": 1,
                "sendSkus": [23323, 8909, 2323],
                "buyItemName": "商品名称1",
                "sendItemName": "商品名称2"
              },
              {
                "buyCnt": 2,
                "buySkus": [],
                "sendCnt": 1,
                "sendSkus": [],
                "buyItemName": "",
                "sendItemName": "",
                "limitCnt": 5
              },
            ],
            "totalLimitCnt": 0
          },
          "itemHeadImg": ["http://dl.django.t.taobao.com/rest/1.0/image?fileIds=FlVuGXn2SCyxZlIHKWPN-AAAACMAAQQD&token=FmQYZpkIMmYlctwKmZGnswABUYAAAAFYRy6aVAAAACMAAQED&timestamp=1478676985528&acl=82bd63065116d4c769fc207f4ed490c1&zoom=original", "http://dl.django.t.taobao.com/rest/1.0/image?fileIds=T_1sam3CQoqjMQhpRzRNlQAAACMAAQQD&token=FmQYZpkIMmYlctwKmZGnswABUYAAAAFYRy6aVAAAACMAAQED&timestamp=1478676985528&acl=43470d06d85e3fb89890f55bfa82f2b9&zoom=original"],
          "itemIds": ["456;789"],
          "itemLink": "http://www.alipay.com",
          "itemName": "活动商品名称",
          "itemText": "活动商品详情",
          "logo": "http://dl.django.t.taobao.com/rest/1.0/image?fileIds=eDCKA4o8S3y1PU1XY4G5WQAAACMAAQQD&token=FmQYZpkIMmYlctwKmZGnswABUYAAAAFYRy6aVAAAACMAAQED&timestamp=1478676985527&acl=2582ecdc97cb5dd4036d570fa2be2fdc&zoom=original",
          "maxAmount": "",
          "maxDiscountNum": "",
          "minConsumeNum": "",
          "name": "活动商品名称",
          "promotionType": "SINGLE_ITEM",
          "rate": "",
          "relativeTime": "7",
          "sendNum": 1,
          "shopIds": ["2016100300077000000003421266"],
          "subTitle": "橘子汽水",
          "type": "BUY_A_SEND_A",
          "useCondtion": "",
          "useInstructions": ["使用说明1", "使用说明2"],
          "voucherCount": "500",
          "voucherImg": "http://dl.django.t.taobao.com/rest/1.0/image?fileIds=yEwWOhXnSYqs3FXXElVpoQAAACMAAQED&token=FmQYZpkIMmYlctwKmZGnswABUYAAAAFYRy6aVAAAACMAAQED&timestamp=1478676985528&acl=7439d6727cb4c7a321c06ec0ee50803c&zoom=original"
        }]
      }, "result": true, "roleType": "MERCHANT"
    }

    setTimeout(function () {
      res.json(data0);
    }, 100);
  }
}

