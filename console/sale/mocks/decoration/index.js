module.exports = {
  'GET /shop/kbdish/statistics.json': function (req, res) {
    setTimeout(() => {
      res.json({
        "resultMsg": "",
        "resultCode": "",
        "status": "succeed",
        "totalCount": 10
      });
    }, 500);
  },
  'GET /shop/kbdish/pageQuery.json': function(req, res) {
    setTimeout(() => {
      res.json({"resultMsg":"","status":"succeed","resultCode":"","data":[{"dishName":"鱼香肉丝","price":"18","dishId":"1","pictureURL":"iZM0ZORdQ76wju1TZTmM4wAAACMAAQED","dishTagList":[{"value":"微辣","type":"菜属性"},"~unique-id~1"]},{"dishName":"泡菜鱼头","price":"98.22","dishId":"2","pictureURL":"iZM0ZORdQ76wju1TZTmM4wAAACMAAQED","dishTagList":[{"value":"微辣","type":"菜属性"},"~unique-id~3"]},{"dishName":"清汤娃娃菜","price":"32.2","dishId":"3","pictureURL":"iZM0ZORdQ76wju1TZTmM4wAAACMAAQED","dishTagList":[{"value":"微辣","type":"菜属性"},"~unique-id~5"]},{"dishName":"夫妻肺片","price":"22.2","dishId":"4","pictureURL":"iZM0ZORdQ76wju1TZTmM4wAAACMAAQED","dishTagList":[{"value":"微辣","type":"菜属性"},"~unique-id~7"]},{"dishName":"红烧肉","price":"11","dishId":"5","pictureURL":"iZM0ZORdQ76wju1TZTmM4wAAACMAAQED","dishTagList":[{"value":"微辣","type":"菜属性"},"~unique-id~9"]},{"dishName":"芝士焗龙虾","price":"130","dishId":"6","pictureURL":"iZM0ZORdQ76wju1TZTmM4wAAACMAAQED","dishTagList":[{"value":"微辣","type":"菜属性"},"~unique-id~11"]}],"pageSize":10,"dishSearchForm":{"pageSize":10,"status":"AUDIT_DENY","pageNum":1},"currentPage":1,"totalSize":6});
    }, 500);
  },
  'GET /shop/kbdish/queryByIds.json': function (req, res) {
    setTimeout(() => {
      res.json({
        "resultMsg": "",
        "resultCode": "",
        "data": [
          {
            "price": "18",
            "desc": "好吃好吃",
            "dishName": "鱼香肉丝",
            "dishId": "1",
            "pictureURL": "http://dl.django.t.taobao.com/rest/1.0/image?fileIds=-uatj03jQGWp1bd_qYFJAQAAACMAAQED&token=ql-oHvT0ZfQ6a5HyeRsVygABUYAAAAFVdiZA5gAAACMAAQED&timestamp=1466576727851&acl=259c2710069e8583089f02b02cd8f4b8&zoom=original",
            "dishTagList": [
              {
                "value": "微辣",
                "type": "菜属性"
              },
              "~unique-id~1"
            ]
          },
          {
            "price": "98",
            "desc": "赞赞赞",
            "dishName": "校验皮皮虾",
            "dishId": "2",
            "pictureURL": "http://dl.django.t.taobao.com/rest/1.0/image?fileIds=029SxdU5Su-Gr9mrLjUUDgAAACMAAQED&token=ql-oHvT0ZfQ6a5HyeRsVygABUYAAAAFVdiZA5gAAACMAAQED&timestamp=1466576727851&acl=e3e0cf535791703d78a5b2d948c242bf&zoom=original",
            "dishTagList": [
              {
                "value": "微辣",
                "type": "菜属性"
              },
              "~unique-id~3"
            ]
          }
        ],
        "dishTagSet": [
          {
            "allValues": [
              "变态辣",
              "甜辣",
              "清淡"
            ],
            "type": "菜属性"
          },
          {
            "allValues": [
              "推荐菜",
              "创意菜",
            ],
            "type": "菜推荐"
          }
        ],
        "status": "succeed"
      });
    }, 500);
  },
  'GET /shop/kbmenu/pageQuery.json': function(req, res) {
    var list = [];
    for (var i = 0; i < 10; i++) {
      list.push({
        "menuId": i + "",
        "title": "这里显示模板名称" + (i + 1),
        "dishCount": 10,
        "shopCount": 2,
        "status": ['EFFECT', 'INIT', 'PROCESS'][parseInt(Math.random() * 3, 10)]
      });
    }
    setTimeout(() => {
      res.json({
        "menuVO": list,
        "pageSize": 10,
        "currentPage": 1,
        "totalSize": 20,
        "status": "success"
      });
    }, 500);
  },
  'GET /shop/kbmenu/detailQuery.json': function(req, res) {
    setTimeout(() => {
      res.json({
        "menuDetailVO": {
          "menuId": "7",
          "status": ['EFFECT', 'INIT', 'PROCESS'][parseInt(Math.random() * 3, 10)],
          "title": "这里显示模板名称8",
          "coverFileId": "xxxxxxxxx",
          "coverUrl": "http://dl.django.t.taobao.com/rest/1.0/image?fileIds=-uatj03jQGWp1bd_qYFJAQAAACMAAQED&token=ql-oHvT0ZfQ6a5HyeRsVygABUYAAAAFVdiZA5gAAACMAAQED&timestamp=1466576727851&acl=259c2710069e8583089f02b02cd8f4b8&zoom=original",
          "coverName": "封面名称",
          "dishCount": 111,
          "menuDishRelation": [{
            "dishName": "鱼香肉丝",
            "dishId": "1",
          }, {
            "dishName": "北京烤鸭",
            "dishId": "3",
          }],
          "shopCount": 111,
          "menuShopRelation": [{
            "shopName": "新天地店",
            "shopId": "2016041600077000000003126249",
          }, {
            "shopName": "外滩店",
            "shopId": "2016041600077000000003126237",
          }],
        },
        "status": "success"
      });
    }, 500);
  },
  'GET /shop/kbdish/checkRepeat.json': function(req, res) {
    setTimeout(() => {
      res.json({
        "resultMsg":"",
        "resultCode":"",
        "repeat":false,
        "status":"succeed"
      });
    }, 500);
  },
  'GET /shop/kbdish/queryAllTags.json': function (req, res) {
    setTimeout(() => {
      res.json({
        "resultMsg": "",
        "resultCode": "",
        "data": [
          {
            "allValues": [
              "变态辣",
              "甜辣",
              "清淡"
            ],
            "type": "菜属性"
          },
          {
            "allValues": [
              "推荐菜",
              "创意菜",
            ],
            "type": "菜推荐"
          }
        ],
        "status": "succeed"
      });
    }, 500);
  },
  'GET /kbshopenv/pageQuery.json': function(req, res) {
    setTimeout(() => {
      res.json({
        "resultCode": "succeed",
        "list": [
          {
            "id": "20160620143300002278",
            "name": "testName2",
            "picName": "testPicName2",
            "shopCount": 1,
            "url": "EYy5nc5SROiOs6COZi_PRwAAACMAAQED"
          },
          {
            "id": "20160620142600002277",
            "name": "testName",
            "picName": "testPicName",
            "shopCount": 1,
            "url": "EYy5nc5SROiOs6COZi_PRwAAACMAAQED"
          }
        ],
        "count": 1,
        "status": "succeed"
      });
    }, 500);
  },
  'POST /kbshopenv/delete.json': function(req, res) {
    setTimeout(() => {
      res.json({
        "resultCode": "succeed",
        "status": "succeed"
      });
    }, 500);
  },
  'POST /kbshopenv/save.json': function(req, res) {
    setTimeout(() => {
      res.json({
        "resultCode": "succeed",
        "status": "succeed"
      });
    }, 500);
  },
  'POST /kbshopenv/detailQuery.json': function(req, res) {
    setTimeout(() => {
      res.json({
        "data": {
          "id": "20160620143300002278",
          "name": "testName2",
          "picName": "testPicName2",
          "shopCount": 1,
          "shopsInfo": [
            {
              "shopId": "208888888"
            }
          ],
          "url": "EYy5nc5SROiOs6COZi_PRwAAACMAAQED"
        },
        "resultCode": "succeed",
        "status": "succeed"
      });
    }, 500);
  },
  'GET /getPicList.json': function(req, res) {
    setTimeout(() => {
      res.json({
        "materials": [{
          "gmtModified": "Wed Apr 22 15:41:38 CST 2015",
          "operatorType": "MERCHANT",
          "gmtCreate": "Wed Apr 22 15:41:38 CST 2015",
          "status": 0,
          "prop": "{&quot;suffix&quot;:&quot;png&quot;,&quot;imgX&quot;:&quot;100&quot;,&quot;imgY&quot;:&quot;100&quot;,&quot;fileId&quot;:&quot;0O5BVPb0R-mUtgfNH9-vkgAAACMAAQEC&quot;}",
          "url": "https://os.alipayobjects.com/rmsportal/TVyBuyOGQklXVoh.png",
          "sourceId": "0O5BVPb0R-mUtgfNH9-vkgAAACMAAQEC",
          "id": 448,
          "groupId": 37,
          "name": "100.png",
          "merchantId": "2088102146885085"
        }, {
          "gmtModified": "Wed Apr 22 15:41:46 CST 2015",
          "operatorType": "MERCHANT",
          "gmtCreate": "Wed Apr 22 15:41:46 CST 2015",
          "status": 0,
          "prop": "{&quot;suffix&quot;:&quot;jpg&quot;,&quot;imgX&quot;:&quot;1024&quot;,&quot;imgY&quot;:&quot;768&quot;,&quot;fileId&quot;:&quot;2dLtRjcFTHaOZrBZU2VzeQAAACMAAQEC&quot;}",
          "url": "https://os.alipayobjects.com/rmsportal/TVyBuyOGQklXVoh.png",
          "sourceId": "2dLtRjcFTHaOZrBZU2VzeQAAACMAAQEC",
          "id": 449,
          "groupId": 37,
          "name": "Jellyfish.jpg",
          "merchantId": "2088102146885085"
        }, {
          "gmtModified": "Wed Apr 22 15:42:04 CST 2015",
          "operatorType": "MERCHANT",
          "gmtCreate": "Wed Apr 22 15:42:04 CST 2015",
          "status": 0,
          "prop": "{&quot;suffix&quot;:&quot;jpg&quot;,&quot;imgX&quot;:&quot;1024&quot;,&quot;imgY&quot;:&quot;768&quot;,&quot;fileId&quot;:&quot;9TjfMgk_QyCSY7_Wa9irNwAAACMAAQEC&quot;}",
          "url": "https://os.alipayobjects.com/rmsportal/TVyBuyOGQklXVoh.png",
          "sourceId": "9TjfMgk_QyCSY7_Wa9irNwAAACMAAQEC",
          "id": 453,
          "groupId": 37,
          "name": "Desert.jpg",
          "merchantId": "2088102146885085"
        }, {
          "gmtModified": "Wed Apr 22 15:42:04 CST 2015",
          "operatorType": "MERCHANT",
          "gmtCreate": "Wed Apr 22 15:42:04 CST 2015",
          "status": 0,
          "prop": "{&quot;suffix&quot;:&quot;jpg&quot;,&quot;imgX&quot;:&quot;1024&quot;,&quot;imgY&quot;:&quot;768&quot;,&quot;fileId&quot;:&quot;a1e8gCl0TamIz58_WX_8iAAAACMAAQEC&quot;}",
          "url": "https://os.alipayobjects.com/rmsportal/TVyBuyOGQklXVoh.png",
          "sourceId": "a1e8gCl0TamIz58_WX_8iAAAACMAAQEC",
          "id": 451,
          "groupId": 37,
          "name": "Lighthouse.jpg",
          "merchantId": "2088102146885085"
        }, {
          "gmtModified": "Wed Apr 22 15:42:04 CST 2015",
          "operatorType": "MERCHANT",
          "gmtCreate": "Wed Apr 22 15:42:04 CST 2015",
          "status": 0,
          "prop": "{&quot;suffix&quot;:&quot;jpg&quot;,&quot;imgX&quot;:&quot;1024&quot;,&quot;imgY&quot;:&quot;768&quot;,&quot;fileId&quot;:&quot;o0O0YdFgRBeI54CqMN4p8AAAACMAAQEC&quot;}",
          "url": "https://os.alipayobjects.com/rmsportal/TVyBuyOGQklXVoh.png",
          "sourceId": "o0O0YdFgRBeI54CqMN4p8AAAACMAAQEC",
          "id": 452,
          "groupId": 37,
          "name": "Chrysanthemum.jpg",
          "merchantId": "2088102146885085"
        }],
        "status": "succeed"
      });
    }, 100);
  },
  'GET /shop/kbdish/queryAll.json': function (req, res) {
    setTimeout(() => {
      res.json({
        "resultMsg":"",
        "resultCode":"",
        "data":[
          {"dishId":"1","dishName":"鱼香肉丝"},
          {"dishId":"2","dishName":"香烤猪蹄"},
          {"dishId":"3","dishName":"北京烤鸭"}
        ],
        "status":"succeed"
      });
    }, 500);
  },
  'POST /shop/kbdish/batchCreate.json': function(req, res) {
    setTimeout(() => {
      res.json({
        "status": "succeed"
      });
    }, 500);
  },
  'POST /shop/kbdish/batchModify.json': function(req, res) {
    setTimeout(() => {
      res.json({
        "status": "succeed"
      });
    }, 500);
  },
  // 环境图部分
  'GET /shop/shopPicData.json': function(req, res) {
  },
  'GET /shop/getShops.json': function(req, res) {
    var list = [];
    var ceshiData = {"resultMsg":"","result":"true","shopCountGroupByCityVO":[{"shops":[{"shopName":"原浩创2088102147273384(1464101385004)","shopId":"2016052400077000000003180684","cityCode":""},{"shopName":"原浩创2088102147273384(1463821263161)","shopId":"2016052100077000000003180676","cityCode":""},{"shopName":"原浩创2088102147273384(1463821261970)","shopId":"2016052100077000000003180675","cityCode":""},{"shopName":"原浩创2088102147273384(1463821261972)","shopId":"2016052100077000000003180674","cityCode":""},{"shopName":"原浩创2088102147273384(1463821148252)","shopId":"2016052100077000000003180673","cityCode":""},{"shopName":"原浩创2088102147273384(1451559467265)","shopId":"2015123100077000000002412695","cityCode":""},{"shopName":"原浩创2088102147273384(1451559467044)","shopId":"2015123100077000000002412694","cityCode":""},{"shopName":"原浩创2088102147273384(1451559466341)","shopId":"2015123100077000000002412693","cityCode":""},{"shopName":"原浩创2088102147273384(1451559466205)","shopId":"2015123100077000000002412692","cityCode":""},{"shopName":"原浩创2088102147273384(1451559465394)","shopId":"2015123100077000000002412690","cityCode":""},{"shopName":"原浩创2088102147273384(1451559465367)","shopId":"2015123100077000000002412691","cityCode":""},{"shopName":"原浩创2088102147273384(1451559464187)","shopId":"2015123100077000000002412689","cityCode":""},{"shopName":"原浩创2088102147273384(1451559464153)","shopId":"2015123100077000000002412688","cityCode":""},{"shopName":"原浩创2088102147273384(1451559463139)","shopId":"2015123100077000000002412687","cityCode":""},{"shopName":"原浩创2088102147273384(1451559463136)","shopId":"2015123100077000000002412686","cityCode":""}],"cityName":"上海市","cityCode":"310100","shopCount":6000},{"shops":[{"shopName":"dimo(黄龙店)","shopId":"2016042200077000000003153093","cityCode":""}],"cityName":"杭州市","cityCode":"330100","shopCount":1},{"shops":[{"shopName":"原浩创2088102147273384(1460796745724)","shopId":"2016041600077000000003126254","cityCode":""},{"shopName":"原浩创2088102147273384(1460796745711)","shopId":"2016041600077000000003126253","cityCode":""},{"shopName":"原浩创2088102147273384(1460796744665)","shopId":"2016041600077000000003126252","cityCode":""},{"shopName":"原浩创2088102147273384(1460796744577)","shopId":"2016041600077000000003126251","cityCode":""},{"shopName":"原浩创2088102147273384(1460796743586)","shopId":"2016041600077000000003126250","cityCode":""},{"shopName":"原浩创2088102147273384(1460796743403)","shopId":"2016041600077000000003126249","cityCode":""},{"shopName":"原浩创2088102147273384(1460796742397)","shopId":"2016041600077000000003126248","cityCode":""},{"shopName":"原浩创2088102147273384(1460796742246)","shopId":"2016041600077000000003126247","cityCode":""},{"shopName":"原浩创2088102147273384(1460796741265)","shopId":"2016041600077000000003126246","cityCode":""},{"shopName":"原浩创2088102147273384(1460796741175)","shopId":"2016041600077000000003126245","cityCode":""},{"shopName":"原浩创2088102147273384(1460796740114)","shopId":"2016041600077000000003126244","cityCode":""},{"shopName":"原浩创2088102147273384(1460796740002)","shopId":"2016041600077000000003126243","cityCode":""},{"shopName":"原浩创2088102147273384(1460796739057)","shopId":"2016041600077000000003126242","cityCode":""},{"shopName":"原浩创2088102147273384(1460796738935)","shopId":"2016041600077000000003126241","cityCode":""},{"shopName":"原浩创2088102147273384(1460796737908)","shopId":"2016041600077000000003126240","cityCode":""},{"shopName":"原浩创2088102147273384(1460796737833)","shopId":"2016041600077000000003126239","cityCode":""},{"shopName":"原浩创2088102147273384(1460796736834)","shopId":"2016041600077000000003126238","cityCode":""},{"shopName":"原浩创2088102147273384(1460796736745)","shopId":"2016041600077000000003126237","cityCode":""},{"shopName":"原浩创2088102147273384(1460796735706)","shopId":"2016041600077000000003126236","cityCode":""},{"shopName":"原浩创2088102147273384(1460796735627)","shopId":"2016041600077000000003126235","cityCode":""}],"cityName":"九江市","cityCode":"360400","shopCount":20},{"shops":[{"shopName":"NB店铺622199","shopId":"2016052600077000000003191648","cityCode":""}],"cityName":"Shanghai","cityCode":"SH","shopCount":1}],"status":"succeed","brandStoryShopLimit":100};

    ceshiData.shopCountGroupByCityVO[0].shops = ceshiData.shopCountGroupByCityVO[0].shops.concat(Array.from({length: 6000}).fill({"shopName":"原浩创2088102147273384(1464101385004)","shopId":"2016052400077000000003180684","cityCode":""})
    );
   res.json(ceshiData);
  },
};