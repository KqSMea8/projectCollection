/* eslint-disable */
module.exports = {
  'GET /shop/koubei/myShops.json': function (req, res) {
    setTimeout(() => {
      res.json({"resultMsg":"","resultCode":"","data":[{"bdRealName":"吕飞","status":"2","bdNickName":"熏风","auditStatus":"CHECKED","category":"","address":"ZJ-HZ-XH 实例地址","competitorDis":"竞对数据","shopName":"实例名称","shopId":"shop_00001","brokerName":"服务商名称","merchantName":"商户名称","merchantPid":"2023456543","brokerStaff":"","mobile":"联系人"}],"KBShopSearchForm":{"pageSize":10,"currPage":0},"status":"succeed"});
    }, 500);
  },

  'GET /shop/koubei/teamShops.json': function (req, res) {
    setTimeout(() => {
      res.json({"resultMsg":"","resultCode":"","data":[{"bdRealName":"吕飞","status":"2","bdNickName":"熏风","auditStatus":"CHECKED","category":"","address":"ZJ-HZ-XH 实例地址","competitorDis":"竞对数据","shopName":"实例名称","shopId":"shop_00001","brokerName":"服务商名称","merchantName":"商户名称","merchantPid":"2023456543","brokerStaff":"","mobile":"联系人"}],"KBShopSearchForm":{"pageSize":10,"currPage":0},"status":"succeed"});
    }, 500);
  },

  'GET /shop/koubei/backlogShops.json': function (req, res) {
        var total = 40;
        var query = req.query;
        var ret = [];
        var pageSize = parseInt(query.pageSize, 10);
        var current = parseInt(query.current, 10);
        var start = (current - 1) * pageSize;
        for (var i = start; i < Math.min(start + pageSize, total); i++) {
            ret.push({
                shopId: '2015062900077000000001022106' + i,
                shopName: '[团队] 苏州羊肉' + i,
                shopLabel: '清零',
                pid: '2088702450601166',
                address: '上海-普陀区 地址显示完整显示完整',
                tel: '13812341234',
                merchantName: '堪爱琴堪爱琴堪爱琴堪爱琴',
                brandName: '品牌显示全',
                bdName: '真名',
                bdNickname: '花名',
                keyShop: '是',
                allocDate: '2015-12-12',
                openStatus: '开店处理中',
                partnerName: '服务商名称显示这里超过',
                categoryName: '美食-其他美食-其他餐饮美食',
                rivalInfo: '有优惠有优惠有优惠有优惠',
            });
        }
        setTimeout(() => {
            res.json({
                data: ret,
                totalCount: total,
            });
    }, 500);
  },

  'GET /shop/authList.json': function (req, res) {
    var total = 40;
    var query = req.query;
    var ret = [];
    var pageSize = parseInt(query.pageSize, 10);
    var current = parseInt(query.current, 10);
    var start = (current - 1) * pageSize;
    for (var i = start; i < Math.min(start + pageSize, total); i++) {
      ret.push({
        id: i,
        shopId: '2015062900077000000001022106' + i,
        shopName: '[团队] 苏州羊肉' + i,
        authType: '代运营、数据查询',
        staffName: '真名',
        staffNickname: '花名',
        authDate: '2015-12-12',
      });
    }
    setTimeout(() => {
      res.json({
        data: ret,
        totalCount: total,
      });
    }, 500);
  },

  'GET /shop/info.json': function (req, res) {
    var ret = {
      shopId: '2015062900077000000001022106',
      shopName: '[团队] 苏州羊肉',
      pid: '2088702450601166',
      merchantName: '堪爱琴',
      address: '上海-普陀区 地址显示完整显示完整',
      tel: '13812341234',
      shopStatus: '初始',
      rivalInfo: '有优惠有优惠有优惠有优惠',
    };
    setTimeout(() => {
      res.json({
        data: ret,
      });
    }, 500);
  },

  'GET /shop/koubei/flow.json': function (req, res) {
    var ret = {
      shop: {
        shopId: '2015062900077000000001022106',
        shopName: '[团队] 苏州羊肉',
        subShopName: '中山东路店',
        pid: '2088702450601166',
        merchantName: '堪爱琴',
        address: '地址显示完整显示完整',
        tel: '13812341234',
        shopStatus: '初始',
        categoryLabel: '普通堂食',
        category: '美食 -其它美 -其它餐饮美',
        acquiringMethod: '顾客扫码付款',
        gmtCreate: '2012-01-02',
        mobileNo: [
          '13411993535',
          '0571-2435362'
        ],
        brandLevel: 'K1',
        brandName: '外婆家',
        rivalInfo: '有优惠有优惠有优惠有优惠',
        provinceName : '上海市',
        cityName: '上海市',
        districtName: '普陀区',
        shopLevel: '全国KA',
        businessTime: '12:24~15:40',
        outShopId: '00231',
        cityId: '330100',
        provideServs: 'wifi，停车场',
        otherService: '可以代驾',
        perPay: '50元',
        posIds: [
          '101280001042',
          '101280001043',
        ],
        logo: {
          resourceUrl: 'https://os.alipayobjects.com/rmsportal/bLUDDvlPMIbjnQz.png',
        },
        licensePicture: {
          resourceUrl: 'https://os.alipayobjects.com/rmsportal/bLUDDvlPMIbjnQz.png',
        },
        businessLicenseValidTime: '2016-12-12',
        licenseName: '浙江省行业开发有限公司',
        certificatePicture: {
          resourceUrl: 'https://os.alipayobjects.com/rmsportal/bLUDDvlPMIbjnQz.png',
        },
        businessCertificateValidTime: '长期有效',
        licenseSeq: 'NO.12345678909876543211234',
        mainImage: {
          resourceUrl: 'https://os.alipayobjects.com/rmsportal/bLUDDvlPMIbjnQz.png',
        },
        authorizationLetterPicture: {
          resourceUrl: 'https://os.alipayobjects.com/rmsportal/bLUDDvlPMIbjnQz.png',
        },
        otherAuthResources: [
          {
            resourceUrl: 'https://os.alipayobjects.com/rmsportal/bLUDDvlPMIbjnQz.png'
          },
          {
            resourceUrl: 'https://os.alipayobjects.com/rmsportal/bLUDDvlPMIbjnQz.png'
          },
          {
            resourceUrl: 'https://os.alipayobjects.com/rmsportal/bLUDDvlPMIbjnQz.png'
          },
        ],
        imageList: [
          {
            resourceUrl: 'https://os.alipayobjects.com/rmsportal/bLUDDvlPMIbjnQz.png'
          },
          {
            resourceUrl: 'https://os.alipayobjects.com/rmsportal/bLUDDvlPMIbjnQz.png'
          },
          {
            resourceUrl: 'https://os.alipayobjects.com/rmsportal/bLUDDvlPMIbjnQz.png'
          },
        ],
      },
    };
    setTimeout(() => {
      res.json({
        data: ret,
      });
    }, 500);
  },


  'GET /shop/goods-list.json': function (req, res) {
    var total = 40;
    var query = req.query;
    var ret = [];
    var pageSize = parseInt(query.pageSize, 10);
    var current = parseInt(query.current, 10);
    var start = (current - 1) * pageSize;
    for (var i = start; i < Math.min(start + pageSize, total); i++) {
      ret.push({
        goodsId: '2015092900076000000001837891' + i,
        goodsName: '湘绅青花瓷9折可以拆行显示' + i,
        goodsType: '折扣券',
        timeRange: '2015-09-29 00:00:00至  2015-12-28 23:59:59',
        totalCount: '10000',
        useCount: '824',
        goodsStatus: '已上架已开始',
        restrict: '无限制',
        useType: '无需用户领取',
      });
    }
    setTimeout(() => {
      res.json({
        data: ret,
        totalCount: total,
      });
    }, 500);
  },

  'GET /shop/material-list.json': function (req, res) {
    var total = 40;
    var query = req.query;
    var ret = [];
    var pageSize = parseInt(query.pageSize, 10);
    var current = parseInt(query.current, 10);
    var start = (current - 1) * pageSize;
    for (var i = start; i < Math.min(start + pageSize, total); i++) {
      ret.push({
        materialId: '1' + i,
        createDate: '2015-09-29 00:00:00',
        staffName: '孙华(铁蛋' + i + ')',
        photoUrl: 'https://os.alipayobjects.com/rmsportal/bLUDDvlPMIbjnQz.png',
      });
    }
    setTimeout(() => {
      res.json({
        data: ret,
        totalCount: total,
      });
    }, 500);
  },

  'GET /shop/history.json': function (req, res) {
    var total = 40;
    var query = req.query;
    var ret = [];
    var pageSize = parseInt(query.pageSize, 10);
    var current = parseInt(query.current, 10);
    var start = (current - 1) * pageSize;
    for (var i = start; i < Math.min(start + pageSize, total); i++) {
      ret.push({
        historyId: '1' + i,
        staffName: '孙华(铁蛋' + i + ')',
        type: '门店修改',
        result: '操作失败',
        createDate: '2015-09-29 00:00:00',
        notes: '城市重点',
      });
    }
    setTimeout(() => {
      res.json({
        data: ret,
        totalCount: total,
      });
    }, 500);
  },

  'GET /shop/promotion.json': function (req, res) {
    var total = 40;
    var query = req.query;
    var ret = [];
    var pageSize = parseInt(query.pageSize, 10);
    var current = parseInt(query.current, 10);
    var start = (current - 1) * pageSize;
    for (var i = start; i < Math.min(start + pageSize, total); i++) {
      ret.push({
        id: '0000000000000' + i,
        title: '双十一充值送红包活动显示全超过拆行' + i,
        startTime: '2015-12-12 13:14',
        endTime: '2015-12-12 13:14',
      });
    }
    setTimeout(() => {
      res.json({
        data: ret,
        totalCount: total,
      });
    }, 500);
  },

  'POST /shop/open-shop.json': function (req, res) {
    var query = req.query;
    res.json({
      data: {},
      success: true,
    });
  },

  'POST /shop/close-shop.json': function (req, res) {
    var query = req.query;
    res.json({
      data: {},
      success: true,
    });
  },

  'GET /staff-list.json': function (req, res) {
    res.json({
      data: [{
        name: '员工1'
      }, {
        name: '员工2'
      }, {
        name: '员工3'
      }, {
        name: '员工4'
      }, {
        name: '员工5'
      }, {
        name: '员工6'
      }],
    });
  },

  'POST /shop/staff-assign.json': function (req, res) {
    var query = req.query;
    res.json({
      data: {},
      success: true,
    });
  },

  'GET /shop/brandSearch.json': function(req, res) {
    var query = req.query;
    var data = {"brands":[],"status":"succeed","otherBrand":{"id":"2015050700000000","name":"其它品牌"}};
    if (query.brandName !== '') {
      data = {"brands":[{"id":"2015042000030354","name":"d&#39;受保护","type":"","reserved":true},{"id":"2015042000030775","name":"d&#39;jawa","type":"","reserved":false},{"id":"2015042000029209","name":"d.b.a.夜店","type":"","reserved":false},{"id":"2015042000029211","name":"d.cupsCafe","type":"","reserved":false},{"id":"2015042000029217","name":"d.d烤鸡全城昼夜外卖","type":"","reserved":false},{"id":"2015042000029233","name":"d.park 果物憩席","type":"","reserved":false},{"id":"2015042000029234","name":"d.park果物憩席","type":"","reserved":false},{"id":"2015042000029237","name":"d.sky home","type":"","reserved":false},{"id":"2015042000029291","name":"d9音乐与电影主题酒吧","type":"","reserved":false},{"id":"2015042000030863","name":"dOCK","type":"","reserved":false},{"id":"2015042000029347","name":"da Lia","type":"","reserved":false},{"id":"2015042000029386","name":"da Pippo","type":"","reserved":false},{"id":"2015042000029382","name":"da pasqualino","type":"","reserved":false},{"id":"2015042000029763","name":"daVinci&#39;s","type":"","reserved":false},{"id":"2015042000029426","name":"dada酒吧","type":"","reserved":false},{"id":"2015042000029450","name":"dai Pescatori di Bocca d&#39;Arno","type":"","reserved":false},{"id":"2015042000029462","name":"daily cafe","type":"","reserved":false},{"id":"2015042000029480","name":"dairy  fairy","type":"","reserved":false},{"id":"2015042000077301","name":"dairy fairy","type":"","reserved":false},{"id":"2015042000029482","name":"dairy fairy 冰淇淋","type":"","reserved":false}],"status":"succeed","otherBrand":{"id":"2015050700000000","name":"其它品牌"}};
    }
    res.json(data);
  },

  'POST /shop/upload.json': function (req, res) {
    setTimeout(()=> {
      res.json({
        url: 'https://t.alipayobjects.com/images/rmsweb/T1QCFfXXRcXXXXXXXX.jpg',
        status: 'success',
      });
    }, 100);
  },

    'GET /shop/district.json': function (req, res) {
    res.json({
      "district": [{
        "p": "1",
        "n": "浙江省",
        "l": "2",
        "c": [{
          "p": "2",
          "n": "杭州市",
          "l": "3",
          "c": [{
            "c": [],
            "p": "340800",
            "n": "大观区",
            "l": "4",
            "i": "340803"
          }, {
            "c": [],
            "p": "340800",
            "n": "怀宁县",
            "l": "4",
            "i": "340822"
          }]
        }]
      }]
    });
  },

  'GET /material/pageMaterial.json': function (req, res) {
    res.json({"result":{"totalCount":0,"currentPage":1,"queryResult":[{"gmtModified":"Wed Dec 30 11:36:58 CST 2015","operatorType":"MERCHANT","gmtCreate":"Wed Dec 30 11:36:58 CST 2015","operatorId":"2088102130992843","status":0,"prop":"{&quot;fileId&quot;:&quot;6cGZ-5QwSYiw9gF3HhbsqAAAACMAAQED&quot;,&quot;imgX&quot;:&quot;1136&quot;,&quot;imgY&quot;:&quot;754&quot;,&quot;suffix&quot;:&quot;jpg&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=6cGZ-5QwSYiw9gF3HhbsqAAAACMAAQED&amp;token=l5GeWBzG4MtjIjrbz9fn9wABUYAAAAFSd3YoegAAACMAAQED&amp;timestamp=1453788765631&amp;acl=f8dd52a4c9d783537107ea3f47ddf299&amp;zoom=original","backupSourceInfoMap":{},"sourceId":"6cGZ-5QwSYiw9gF3HhbsqAAAACMAAQED","id":113065,"groupId":89,"name":"h5_photo_shop_coverPicture_2088102130992843.jpg","merchantId":"2088102130992843"},{"gmtModified":"Wed Dec 30 10:41:35 CST 2015","operatorType":"MERCHANT","gmtCreate":"Wed Dec 30 10:41:35 CST 2015","operatorId":"2088102130992843","status":0,"prop":"{&quot;fileId&quot;:&quot;vxVzCmoDT4K0BbarX6PG3AAAACMAAQED&quot;,&quot;imgX&quot;:&quot;1136&quot;,&quot;imgY&quot;:&quot;754&quot;,&quot;suffix&quot;:&quot;jpg&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=vxVzCmoDT4K0BbarX6PG3AAAACMAAQED&amp;token=l5GeWBzG4MtjIjrbz9fn9wABUYAAAAFSd3YoegAAACMAAQED&amp;timestamp=1453788765631&amp;acl=b9aee4ad985163956fa0dfaddff1d512&amp;zoom=original","backupSourceInfoMap":{},"sourceId":"vxVzCmoDT4K0BbarX6PG3AAAACMAAQED","id":113064,"groupId":89,"name":"h5_photo_shop_authorizationLetterPicture_2088102130992843.jpg","merchantId":"2088102130992843"},{"gmtModified":"Wed Dec 30 10:41:24 CST 2015","operatorType":"MERCHANT","gmtCreate":"Wed Dec 30 10:41:24 CST 2015","operatorId":"2088102130992843","status":0,"prop":"{&quot;fileId&quot;:&quot;_3fd0uUuSBiQVrlUr3cnXgAAACMAAQED&quot;,&quot;imgX&quot;:&quot;758&quot;,&quot;imgY&quot;:&quot;1136&quot;,&quot;suffix&quot;:&quot;jpg&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=_3fd0uUuSBiQVrlUr3cnXgAAACMAAQED&amp;token=l5GeWBzG4MtjIjrbz9fn9wABUYAAAAFSd3YoegAAACMAAQED&amp;timestamp=1453788765631&amp;acl=091d67f6f00222901edb3da1b90a9eff&amp;zoom=original","backupSourceInfoMap":{},"sourceId":"_3fd0uUuSBiQVrlUr3cnXgAAACMAAQED","id":113063,"groupId":89,"name":"h5_photo_shop_licensePicture_2088102130992843.jpg","merchantId":"2088102130992843"},{"gmtModified":"Wed Dec 30 10:41:03 CST 2015","operatorType":"MERCHANT","gmtCreate":"Wed Dec 30 10:41:03 CST 2015","operatorId":"2088102130992843","status":0,"prop":"{&quot;fileId&quot;:&quot;sP129YmLQCO223py8TmE6gAAACMAAQED&quot;,&quot;imgX&quot;:&quot;1136&quot;,&quot;imgY&quot;:&quot;754&quot;,&quot;suffix&quot;:&quot;jpg&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=sP129YmLQCO223py8TmE6gAAACMAAQED&amp;token=l5GeWBzG4MtjIjrbz9fn9wABUYAAAAFSd3YoegAAACMAAQED&amp;timestamp=1453788765631&amp;acl=c277ae4737f8baa7943ef6e52a15014a&amp;zoom=original","backupSourceInfoMap":{},"sourceId":"sP129YmLQCO223py8TmE6gAAACMAAQED","id":113062,"groupId":89,"name":"h5_photo_shop_certificatePicture_2088102130992843.jpg","merchantId":"2088102130992843"},{"gmtModified":"Wed Dec 30 10:40:52 CST 2015","operatorType":"MERCHANT","gmtCreate":"Wed Dec 30 10:40:52 CST 2015","operatorId":"2088102130992843","status":0,"prop":"{&quot;fileId&quot;:&quot;7tkaa_LBREethWxXAVBRAAAAACMAAQED&quot;,&quot;imgX&quot;:&quot;500&quot;,&quot;imgY&quot;:&quot;332&quot;,&quot;suffix&quot;:&quot;jpg&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=7tkaa_LBREethWxXAVBRAAAAACMAAQED&amp;token=l5GeWBzG4MtjIjrbz9fn9wABUYAAAAFSd3YoegAAACMAAQED&amp;timestamp=1453788765631&amp;acl=32bdaf35023792de3a7fabb9853e2d46&amp;zoom=original","backupSourceInfoMap":{},"sourceId":"7tkaa_LBREethWxXAVBRAAAAACMAAQED","id":113061,"groupId":89,"name":"h5_photo_imageUrlListId_2088102130992843.jpg","merchantId":"2088102130992843"},{"gmtModified":"Wed Dec 30 10:40:48 CST 2015","operatorType":"MERCHANT","gmtCreate":"Wed Dec 30 10:40:48 CST 2015","operatorId":"2088102130992843","status":0,"prop":"{&quot;fileId&quot;:&quot;TNeHqygwTw20SdptCwwX_AAAACMAAQED&quot;,&quot;imgX&quot;:&quot;334&quot;,&quot;imgY&quot;:&quot;500&quot;,&quot;suffix&quot;:&quot;jpg&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=TNeHqygwTw20SdptCwwX_AAAACMAAQED&amp;token=l5GeWBzG4MtjIjrbz9fn9wABUYAAAAFSd3YoegAAACMAAQED&amp;timestamp=1453788765631&amp;acl=c52d2f96910444265466b33c5a51f651&amp;zoom=original","backupSourceInfoMap":{},"sourceId":"TNeHqygwTw20SdptCwwX_AAAACMAAQED","id":113060,"groupId":89,"name":"h5_photo_imageUrlListId_2088102130992843.jpg","merchantId":"2088102130992843"},{"gmtModified":"Wed Dec 30 10:40:44 CST 2015","operatorType":"MERCHANT","gmtCreate":"Wed Dec 30 10:40:44 CST 2015","operatorId":"2088102130992843","status":0,"prop":"{&quot;fileId&quot;:&quot;SZxrs0I5QCubKSGqPAD9ogAAACMAAQED&quot;,&quot;imgX&quot;:&quot;500&quot;,&quot;imgY&quot;:&quot;334&quot;,&quot;suffix&quot;:&quot;jpg&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=SZxrs0I5QCubKSGqPAD9ogAAACMAAQED&amp;token=l5GeWBzG4MtjIjrbz9fn9wABUYAAAAFSd3YoegAAACMAAQED&amp;timestamp=1453788765631&amp;acl=6a43005f4f6cb0764d5fc1c090e4cad4&amp;zoom=original","backupSourceInfoMap":{},"sourceId":"SZxrs0I5QCubKSGqPAD9ogAAACMAAQED","id":113059,"groupId":89,"name":"h5_photo_imageUrlListId_2088102130992843.jpg","merchantId":"2088102130992843"},{"gmtModified":"Wed Dec 30 10:40:34 CST 2015","operatorType":"MERCHANT","gmtCreate":"Wed Dec 30 10:40:34 CST 2015","operatorId":"2088102130992843","status":0,"prop":"{&quot;fileId&quot;:&quot;EHUtrkdBQCmvUj7vnD9GKwAAACMAAQED&quot;,&quot;imgX&quot;:&quot;1136&quot;,&quot;imgY&quot;:&quot;758&quot;,&quot;suffix&quot;:&quot;jpg&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=EHUtrkdBQCmvUj7vnD9GKwAAACMAAQED&amp;token=l5GeWBzG4MtjIjrbz9fn9wABUYAAAAFSd3YoegAAACMAAQED&amp;timestamp=1453788765631&amp;acl=78761c65817303d0a44b760f03aa695c&amp;zoom=original","backupSourceInfoMap":{},"sourceId":"EHUtrkdBQCmvUj7vnD9GKwAAACMAAQED","id":113058,"groupId":89,"name":"h5_photo_shop_coverPicture_2088102130992843.jpg","merchantId":"2088102130992843"},{"gmtModified":"Wed Dec 30 10:39:19 CST 2015","operatorType":"MERCHANT","gmtCreate":"Wed Dec 30 10:39:19 CST 2015","operatorId":"2088102130992843","status":0,"prop":"{&quot;fileId&quot;:&quot;BUgng2hPTYKXv0H8_SE8CgAAACMAAQED&quot;,&quot;imgX&quot;:&quot;601&quot;,&quot;imgY&quot;:&quot;399&quot;,&quot;suffix&quot;:&quot;jpg&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=BUgng2hPTYKXv0H8_SE8CgAAACMAAQED&amp;token=l5GeWBzG4MtjIjrbz9fn9wABUYAAAAFSd3YoegAAACMAAQED&amp;timestamp=1453788765631&amp;acl=3e545285dab63b57d2d6b6a6ac155529&amp;zoom=original","backupSourceInfoMap":{},"sourceId":"BUgng2hPTYKXv0H8_SE8CgAAACMAAQED","id":113057,"groupId":89,"name":"h5_photo_shop_logoUrl_2088102130992843.jpg","merchantId":"2088102130992843"},{"gmtModified":"Tue Dec 29 20:59:37 CST 2015","operatorType":"MERCHANT","gmtCreate":"Tue Dec 29 20:59:37 CST 2015","operatorId":"2088102130992843","status":0,"prop":"{&quot;fileId&quot;:&quot;ekjnlPXCTs28N5Hgl10xawAAACMAAQED&quot;,&quot;imgX&quot;:&quot;1136&quot;,&quot;imgY&quot;:&quot;754&quot;,&quot;suffix&quot;:&quot;jpg&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=ekjnlPXCTs28N5Hgl10xawAAACMAAQED&amp;token=l5GeWBzG4MtjIjrbz9fn9wABUYAAAAFSd3YoegAAACMAAQED&amp;timestamp=1453788765632&amp;acl=2ffac00f4a70d50ec4cfc74c435003c0&amp;zoom=original","backupSourceInfoMap":{},"sourceId":"ekjnlPXCTs28N5Hgl10xawAAACMAAQED","id":113052,"groupId":89,"name":"h5_photo_shop_authorizationLetterPicture_2088102130992843.jpg","merchantId":"2088102130992843"},{"gmtModified":"Tue Dec 29 20:59:26 CST 2015","operatorType":"MERCHANT","gmtCreate":"Tue Dec 29 20:59:26 CST 2015","operatorId":"2088102130992843","status":0,"prop":"{&quot;fileId&quot;:&quot;CWcFGivkSOWToBAyzBezJwAAACMAAQED&quot;,&quot;imgX&quot;:&quot;1136&quot;,&quot;imgY&quot;:&quot;754&quot;,&quot;suffix&quot;:&quot;jpg&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=CWcFGivkSOWToBAyzBezJwAAACMAAQED&amp;token=l5GeWBzG4MtjIjrbz9fn9wABUYAAAAFSd3YoegAAACMAAQED&amp;timestamp=1453788765632&amp;acl=295abc9391880adcddbb63abf9cd49bb&amp;zoom=original","backupSourceInfoMap":{},"sourceId":"CWcFGivkSOWToBAyzBezJwAAACMAAQED","id":113051,"groupId":89,"name":"h5_photo_shop_licensePicture_2088102130992843.jpg","merchantId":"2088102130992843"},{"gmtModified":"Tue Dec 29 20:59:12 CST 2015","operatorType":"MERCHANT","gmtCreate":"Tue Dec 29 20:59:12 CST 2015","operatorId":"2088102130992843","status":0,"prop":"{&quot;fileId&quot;:&quot;itpTh27gRkiZ5yyvAkoUNwAAACMAAQED&quot;,&quot;imgX&quot;:&quot;758&quot;,&quot;imgY&quot;:&quot;1136&quot;,&quot;suffix&quot;:&quot;jpg&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=itpTh27gRkiZ5yyvAkoUNwAAACMAAQED&amp;token=l5GeWBzG4MtjIjrbz9fn9wABUYAAAAFSd3YoegAAACMAAQED&amp;timestamp=1453788765632&amp;acl=738b4a805aaa1c24c114052285fbbd64&amp;zoom=original","backupSourceInfoMap":{},"sourceId":"itpTh27gRkiZ5yyvAkoUNwAAACMAAQED","id":113050,"groupId":89,"name":"h5_photo_shop_certificatePicture_2088102130992843.jpg","merchantId":"2088102130992843"},{"gmtModified":"Tue Dec 29 20:59:00 CST 2015","operatorType":"MERCHANT","gmtCreate":"Tue Dec 29 20:59:00 CST 2015","operatorId":"2088102130992843","status":0,"prop":"{&quot;fileId&quot;:&quot;f4iVxgU8QqG1oPc_tJwtdAAAACMAAQED&quot;,&quot;imgX&quot;:&quot;500&quot;,&quot;imgY&quot;:&quot;334&quot;,&quot;suffix&quot;:&quot;jpg&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=f4iVxgU8QqG1oPc_tJwtdAAAACMAAQED&amp;token=l5GeWBzG4MtjIjrbz9fn9wABUYAAAAFSd3YoegAAACMAAQED&amp;timestamp=1453788765632&amp;acl=c8482fabf18eb1aef7e5146e4d8ea6fe&amp;zoom=original","backupSourceInfoMap":{},"sourceId":"f4iVxgU8QqG1oPc_tJwtdAAAACMAAQED","id":113049,"groupId":89,"name":"h5_photo_imageUrlListId_2088102130992843.jpg","merchantId":"2088102130992843"},{"gmtModified":"Tue Dec 29 20:58:56 CST 2015","operatorType":"MERCHANT","gmtCreate":"Tue Dec 29 20:58:56 CST 2015","operatorId":"2088102130992843","status":0,"prop":"{&quot;fileId&quot;:&quot;HPxDwwkoT0S2HOAJAO_8qAAAACMAAQED&quot;,&quot;imgX&quot;:&quot;500&quot;,&quot;imgY&quot;:&quot;332&quot;,&quot;suffix&quot;:&quot;jpg&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=HPxDwwkoT0S2HOAJAO_8qAAAACMAAQED&amp;token=l5GeWBzG4MtjIjrbz9fn9wABUYAAAAFSd3YoegAAACMAAQED&amp;timestamp=1453788765632&amp;acl=c1b156c9b9efd0553ee8e59da366764a&amp;zoom=original","backupSourceInfoMap":{},"sourceId":"HPxDwwkoT0S2HOAJAO_8qAAAACMAAQED","id":113048,"groupId":89,"name":"h5_photo_imageUrlListId_2088102130992843.jpg","merchantId":"2088102130992843"},{"gmtModified":"Tue Dec 29 20:58:52 CST 2015","operatorType":"MERCHANT","gmtCreate":"Tue Dec 29 20:58:52 CST 2015","operatorId":"2088102130992843","status":0,"prop":"{&quot;fileId&quot;:&quot;fJnDh7uuTyGYozJ0MInzxAAAACMAAQED&quot;,&quot;imgX&quot;:&quot;500&quot;,&quot;imgY&quot;:&quot;332&quot;,&quot;suffix&quot;:&quot;jpg&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=fJnDh7uuTyGYozJ0MInzxAAAACMAAQED&amp;token=l5GeWBzG4MtjIjrbz9fn9wABUYAAAAFSd3YoegAAACMAAQED&amp;timestamp=1453788765632&amp;acl=cae5e7aaf75510c7949ce8ac74766794&amp;zoom=original","backupSourceInfoMap":{},"sourceId":"fJnDh7uuTyGYozJ0MInzxAAAACMAAQED","id":113047,"groupId":89,"name":"h5_photo_imageUrlListId_2088102130992843.jpg","merchantId":"2088102130992843"},{"gmtModified":"Tue Dec 29 20:58:44 CST 2015","operatorType":"MERCHANT","gmtCreate":"Tue Dec 29 20:58:44 CST 2015","operatorId":"2088102130992843","status":0,"prop":"{&quot;fileId&quot;:&quot;DzALaglKQ_-J3LzD76k2SgAAACMAAQED&quot;,&quot;imgX&quot;:&quot;1136&quot;,&quot;imgY&quot;:&quot;758&quot;,&quot;suffix&quot;:&quot;jpg&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=DzALaglKQ_-J3LzD76k2SgAAACMAAQED&amp;token=l5GeWBzG4MtjIjrbz9fn9wABUYAAAAFSd3YoegAAACMAAQED&amp;timestamp=1453788765632&amp;acl=b7c5db68f12ceb76b34c6f620a6fb615&amp;zoom=original","backupSourceInfoMap":{},"sourceId":"DzALaglKQ_-J3LzD76k2SgAAACMAAQED","id":113046,"groupId":89,"name":"h5_photo_shop_coverPicture_2088102130992843.jpg","merchantId":"2088102130992843"},{"gmtModified":"Tue Dec 29 20:58:15 CST 2015","operatorType":"MERCHANT","gmtCreate":"Tue Dec 29 20:58:15 CST 2015","operatorId":"2088102130992843","status":0,"prop":"{&quot;fileId&quot;:&quot;Obs-eO_xQMifx_YzD3Z0gwAAACMAAQED&quot;,&quot;imgX&quot;:&quot;601&quot;,&quot;imgY&quot;:&quot;399&quot;,&quot;suffix&quot;:&quot;jpg&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=Obs-eO_xQMifx_YzD3Z0gwAAACMAAQED&amp;token=l5GeWBzG4MtjIjrbz9fn9wABUYAAAAFSd3YoegAAACMAAQED&amp;timestamp=1453788765632&amp;acl=bc4d0d8f7033788aad47fc9e477413b9&amp;zoom=original","backupSourceInfoMap":{},"sourceId":"Obs-eO_xQMifx_YzD3Z0gwAAACMAAQED","id":113045,"groupId":89,"name":"h5_photo_shop_logoUrl_2088102130992843.jpg","merchantId":"2088102130992843"},{"gmtModified":"Tue Dec 29 20:53:49 CST 2015","operatorType":"MERCHANT","gmtCreate":"Tue Dec 29 20:53:49 CST 2015","operatorId":"2088102130992843","status":0,"prop":"{&quot;fileId&quot;:&quot;MMtADdIVQym1taBP0RUaeAAAACMAAQED&quot;,&quot;imgX&quot;:&quot;1136&quot;,&quot;imgY&quot;:&quot;754&quot;,&quot;suffix&quot;:&quot;jpg&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=MMtADdIVQym1taBP0RUaeAAAACMAAQED&amp;token=l5GeWBzG4MtjIjrbz9fn9wABUYAAAAFSd3YoegAAACMAAQED&amp;timestamp=1453788765632&amp;acl=5fa3d8f44272d81ad02c2fc4c50c9021&amp;zoom=original","backupSourceInfoMap":{},"sourceId":"MMtADdIVQym1taBP0RUaeAAAACMAAQED","id":113044,"groupId":89,"name":"h5_photo_shop_authorizationLetterPicture_2088102130992843.jpg","merchantId":"2088102130992843"},{"gmtModified":"Tue Dec 29 20:53:34 CST 2015","operatorType":"MERCHANT","gmtCreate":"Tue Dec 29 20:53:34 CST 2015","operatorId":"2088102130992843","status":0,"prop":"{&quot;fileId&quot;:&quot;mGw6wEdhRyOGAdD3h3P3nQAAACMAAQED&quot;,&quot;imgX&quot;:&quot;1136&quot;,&quot;imgY&quot;:&quot;754&quot;,&quot;suffix&quot;:&quot;jpg&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=mGw6wEdhRyOGAdD3h3P3nQAAACMAAQED&amp;token=l5GeWBzG4MtjIjrbz9fn9wABUYAAAAFSd3YoegAAACMAAQED&amp;timestamp=1453788765632&amp;acl=cf4af235266c3b04647da6cd5a4158f3&amp;zoom=original","backupSourceInfoMap":{},"sourceId":"mGw6wEdhRyOGAdD3h3P3nQAAACMAAQED","id":113043,"groupId":89,"name":"h5_photo_shop_licensePicture_2088102130992843.jpg","merchantId":"2088102130992843"},{"gmtModified":"Tue Dec 29 20:53:20 CST 2015","operatorType":"MERCHANT","gmtCreate":"Tue Dec 29 20:53:20 CST 2015","operatorId":"2088102130992843","status":0,"prop":"{&quot;fileId&quot;:&quot;zfdPoSfQTXuFBi5imHaiAwAAACMAAQED&quot;,&quot;imgX&quot;:&quot;1136&quot;,&quot;imgY&quot;:&quot;754&quot;,&quot;suffix&quot;:&quot;jpg&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=zfdPoSfQTXuFBi5imHaiAwAAACMAAQED&amp;token=l5GeWBzG4MtjIjrbz9fn9wABUYAAAAFSd3YoegAAACMAAQED&amp;timestamp=1453788765632&amp;acl=d49b7e1a08a28b8912da545875553ea3&amp;zoom=original","backupSourceInfoMap":{},"sourceId":"zfdPoSfQTXuFBi5imHaiAwAAACMAAQED","id":113042,"groupId":89,"name":"h5_photo_shop_certificatePicture_2088102130992843.jpg","merchantId":"2088102130992843"}],"itemsPerPage":20,"totalPages":67},"success":true,"org.springframework.validation.BindingResult.materialRequest":{"nestedPath":"","messageCodesResolver":{"prefix":""}},"materialRequest":{"pageSize":20,"imgX":1000,"imgY":1000,"pageNum":1}});
  },

  'POST /material/editMaterial.json': function (req, res) {
    var query = req.query;
    res.json({
      data: {},
      success: true,
    });
  },

  'POST /material/delMaterial.json': function (req, res) {
    var query = req.query;
    res.json({"success":true});
  },

  'POST /material/picUpload.json': function (req, res) {
    setTimeout(function() {
      res.json({"imgModel":{"matGroup":{"id":89,"gmtModified":"Tue May 19 16:57:48 CST 2015","gmtCreate":"Tue May 19 16:57:48 CST 2015","name":"未分类","merchantId":"2088102130992843"},"materialList":[{"id":0,"operatorType":"MERCHANT","groupId":89,"operatorId":"2088102130992843","status":0,"name":"hermes_site.jpg","prop":"{&quot;imgX&quot;:&quot;800&quot;,&quot;imgY&quot;:&quot;399&quot;,&quot;fileId&quot;:&quot;D_eHTOcWSnewSl0pOdAPnQAAACMAAQED&quot;,&quot;suffix&quot;:&quot;jpg&quot;}","merchantId":"2088102130992843","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=D_eHTOcWSnewSl0pOdAPnQAAACMAAQED&amp;token=6R3X9f41n2mnfk9W4aEr-AABUYAAAAFSfJoUzAAAACMAAQED&amp;timestamp=1453808914272&amp;acl=16b7c6ddb02943795b5bf018b50fff41&amp;zoom=original","sourceId":"D_eHTOcWSnewSl0pOdAPnQAAACMAAQED"}]},"success":true});
    }, 1000);
  },

  'GET /shop/koubei/equipmentList.json': function (req, res) {
    setTimeout(()=> {
      res.json({
        data: [{
          id: "1",
          name: '机具名称1',
        }, {
          id: "2",
          name: '机具名称2',
        }],
        status: 'success',
      });
    }, 100);
  },


  'GET /shop/koubei/showMaterial.json': function (req, res) {
    setTimeout(()=> {
      res.json({"materials":[{"gmtModified":"Wed Apr 22 15:41:38 CST 2015","operatorType":"MERCHANT","gmtCreate":"Wed Apr 22 15:41:38 CST 2015","status":0,"prop":"{&quot;suffix&quot;:&quot;png&quot;,&quot;imgX&quot;:&quot;100&quot;,&quot;imgY&quot;:&quot;100&quot;,&quot;fileId&quot;:&quot;0O5BVPb0R-mUtgfNH9-vkgAAACMAAQEC&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=0O5BVPb0R-mUtgfNH9-vkgAAACMAAQEC&amp;token=NAhJvLRRpzQCv8GkS9R_IQABUYAAAAFSh32A3AAAACMAAQED&amp;timestamp=1453972095041&amp;acl=6f8ad1964e1d1597ca7773218dcb959a&amp;zoom=original","sourceId":"0O5BVPb0R-mUtgfNH9-vkgAAACMAAQEC","id":448,"groupId":37,"name":"100.png","merchantId":"2088102146885085"},{"gmtModified":"Wed Apr 22 15:41:46 CST 2015","operatorType":"MERCHANT","gmtCreate":"Wed Apr 22 15:41:46 CST 2015","status":0,"prop":"{&quot;suffix&quot;:&quot;jpg&quot;,&quot;imgX&quot;:&quot;1024&quot;,&quot;imgY&quot;:&quot;768&quot;,&quot;fileId&quot;:&quot;2dLtRjcFTHaOZrBZU2VzeQAAACMAAQEC&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=2dLtRjcFTHaOZrBZU2VzeQAAACMAAQEC&amp;token=NAhJvLRRpzQCv8GkS9R_IQABUYAAAAFSh32A3AAAACMAAQED&amp;timestamp=1453972095267&amp;acl=a388e7b1ecec272db21b2dcc91ccb487&amp;zoom=original","sourceId":"2dLtRjcFTHaOZrBZU2VzeQAAACMAAQEC","id":449,"groupId":37,"name":"Jellyfish.jpg","merchantId":"2088102146885085"},{"gmtModified":"Wed Apr 22 15:42:04 CST 2015","operatorType":"MERCHANT","gmtCreate":"Wed Apr 22 15:42:04 CST 2015","status":0,"prop":"{&quot;suffix&quot;:&quot;jpg&quot;,&quot;imgX&quot;:&quot;1024&quot;,&quot;imgY&quot;:&quot;768&quot;,&quot;fileId&quot;:&quot;9TjfMgk_QyCSY7_Wa9irNwAAACMAAQEC&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=9TjfMgk_QyCSY7_Wa9irNwAAACMAAQEC&amp;token=NAhJvLRRpzQCv8GkS9R_IQABUYAAAAFSh32A3AAAACMAAQED&amp;timestamp=1453972095268&amp;acl=2dde34f0156b5cc5fd1c65cd05a83c8b&amp;zoom=original","sourceId":"9TjfMgk_QyCSY7_Wa9irNwAAACMAAQEC","id":453,"groupId":37,"name":"Desert.jpg","merchantId":"2088102146885085"},{"gmtModified":"Wed Apr 22 15:42:04 CST 2015","operatorType":"MERCHANT","gmtCreate":"Wed Apr 22 15:42:04 CST 2015","status":0,"prop":"{&quot;suffix&quot;:&quot;jpg&quot;,&quot;imgX&quot;:&quot;1024&quot;,&quot;imgY&quot;:&quot;768&quot;,&quot;fileId&quot;:&quot;a1e8gCl0TamIz58_WX_8iAAAACMAAQEC&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=a1e8gCl0TamIz58_WX_8iAAAACMAAQEC&amp;token=NAhJvLRRpzQCv8GkS9R_IQABUYAAAAFSh32A3AAAACMAAQED&amp;timestamp=1453972095268&amp;acl=401d490dd8391903932cf55378107400&amp;zoom=original","sourceId":"a1e8gCl0TamIz58_WX_8iAAAACMAAQEC","id":451,"groupId":37,"name":"Lighthouse.jpg","merchantId":"2088102146885085"},{"gmtModified":"Wed Apr 22 15:42:04 CST 2015","operatorType":"MERCHANT","gmtCreate":"Wed Apr 22 15:42:04 CST 2015","status":0,"prop":"{&quot;suffix&quot;:&quot;jpg&quot;,&quot;imgX&quot;:&quot;1024&quot;,&quot;imgY&quot;:&quot;768&quot;,&quot;fileId&quot;:&quot;o0O0YdFgRBeI54CqMN4p8AAAACMAAQEC&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=o0O0YdFgRBeI54CqMN4p8AAAACMAAQEC&amp;token=NAhJvLRRpzQCv8GkS9R_IQABUYAAAAFSh32A3AAAACMAAQED&amp;timestamp=1453972095269&amp;acl=eca22863949211d51e944152fc6a307d&amp;zoom=original","sourceId":"o0O0YdFgRBeI54CqMN4p8AAAACMAAQEC","id":452,"groupId":37,"name":"Chrysanthemum.jpg","merchantId":"2088102146885085"},{"gmtModified":"Wed Apr 22 15:42:04 CST 2015","operatorType":"MERCHANT","gmtCreate":"Wed Apr 22 15:42:04 CST 2015","status":0,"prop":"{&quot;suffix&quot;:&quot;jpg&quot;,&quot;imgX&quot;:&quot;1024&quot;,&quot;imgY&quot;:&quot;768&quot;,&quot;fileId&quot;:&quot;vqUO6flXSzGf8cn7YQEwQAAAACMAAQEC&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=vqUO6flXSzGf8cn7YQEwQAAAACMAAQEC&amp;token=NAhJvLRRpzQCv8GkS9R_IQABUYAAAAFSh32A3AAAACMAAQED&amp;timestamp=1453972095269&amp;acl=17c559064179d3721d62282809c79667&amp;zoom=original","sourceId":"vqUO6flXSzGf8cn7YQEwQAAAACMAAQEC","id":454,"groupId":37,"name":"Penguins.jpg","merchantId":"2088102146885085"},{"gmtModified":"Wed Apr 22 15:41:52 CST 2015","operatorType":"MERCHANT","gmtCreate":"Wed Apr 22 15:41:52 CST 2015","status":0,"prop":"{&quot;suffix&quot;:&quot;jpg&quot;,&quot;imgX&quot;:&quot;1024&quot;,&quot;imgY&quot;:&quot;768&quot;,&quot;fileId&quot;:&quot;xKFwJYdiRjCcPMHNf7x9FQAAACMAAQEC&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=xKFwJYdiRjCcPMHNf7x9FQAAACMAAQEC&amp;token=NAhJvLRRpzQCv8GkS9R_IQABUYAAAAFSh32A3AAAACMAAQED&amp;timestamp=1453972095269&amp;acl=6b027b02b5f747b9892ecd30417c6e00&amp;zoom=original","sourceId":"xKFwJYdiRjCcPMHNf7x9FQAAACMAAQEC","id":450,"groupId":37,"name":"Koala.jpg","merchantId":"2088102146885085"},{"gmtModified":"Wed Apr 22 15:42:05 CST 2015","operatorType":"MERCHANT","gmtCreate":"Wed Apr 22 15:42:05 CST 2015","status":0,"prop":"{&quot;suffix&quot;:&quot;jpg&quot;,&quot;imgX&quot;:&quot;1024&quot;,&quot;imgY&quot;:&quot;768&quot;,&quot;fileId&quot;:&quot;YeZ42F0uTna3OOvKYsLRdQAAACMAAQEC&quot;}","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=YeZ42F0uTna3OOvKYsLRdQAAACMAAQEC&amp;token=NAhJvLRRpzQCv8GkS9R_IQABUYAAAAFSh32A3AAAACMAAQED&amp;timestamp=1453972095270&amp;acl=a12c2f8d7d7c85621ece4ecbbbcdebc7&amp;zoom=original","sourceId":"YeZ42F0uTna3OOvKYsLRdQAAACMAAQEC","id":455,"groupId":37,"name":"Tulips.jpg","merchantId":"2088102146885085"}],"status":"succeed"});
    }, 100);
  },

  'GET /sale/merchant/queryByName.json': function (req, res) {
    res.json({
      "data": [{
        value: 'mc d',
        label: '麦当劳',
        children: [{
          value: 2088101139334351,
          label: 'heli@qq.com<br/>2088101139334351'
        }, {
          value: 2088101139334352,
          label: 'heli2@qq.com<br/>2088101139334352'
        }]
      },
      {
        value: 'kfc',
        label: '肯德基',
        children: [{
          value: 2088101139334351,
          label: 'heli@qq.com<br/>2088101139334351'
        }, {
          value: 2088101139334353,
          label: 'heli2@qq.com<br/>2088101139334352'
        }]
      }]
    });
  },
  'GET /shop/koubei/shopDetail.json': function(req, res) {
    res.json({"date":1468985774074,"merchant":{"f2fStatus":"已签约","mid":"467835","mobileNo":["13017457303"],"name":"eejped","pid":"2088201880094873"},"shop":{"acquiringMethod":"","address":"黄浦区 1462091790171 2088201880094873","bankCardNo":"","brandId":"2015050700000000","brandName":"Tair精简测试_ruzhi_8","businessCertificateValidTime":"长期","businessLicenseValidTime":"长期","businessTime":"","category":"美食（不要打泛行业标）-中餐-川菜","categoryIds":["2015050700000000","2015050700000001","2015050700000010"],"categoryLabel":"普通堂食","certificatePicture":{"resourceId":"k5quTTGrT9WallXdZdZgLgAAACMAAQEC","resourceUrl":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=k5quTTGrT9WallXdZdZgLgAAACMAAQEC&token=w2Yj6uc-j3G3vQv_3FgPlgABUYAAAAFWBgcgYwAAACMAAQED&timestamp=1468985773924&acl=512658e2cc0849c276283f20f43a730e&zoom=original"},"cityId":"310100","cityName":"上海市","createTime":1462091790469,"ctuGreyList":"F","dataChannel":"商家自主开店","dataSource":"后台创建","display":"隐藏","displayCode":"0","districtId":"310101","districtName":"黄浦区","gmtCreate":"2016-05-01","headShopName":"原浩创","imageList":[{"resourceId":"8d0k281rR5S9gHMZ0Am0UQAAACMAAQEC","resourceUrl":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=8d0k281rR5S9gHMZ0Am0UQAAACMAAQEC&token=w2Yj6uc-j3G3vQv_3FgPlgABUYAAAAFWBgcgYwAAACMAAQED&timestamp=1468985773924&acl=7685e8f18d8c4d02f868aa7cdc20f5a8&zoom=original"},{"resourceId":"ADFV_EU7SPO0_eGLTwJUZgAAACMAAQED","resourceUrl":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=ADFV_EU7SPO0_eGLTwJUZgAAACMAAQED&token=w2Yj6uc-j3G3vQv_3FgPlgABUYAAAAFWBgcgYwAAACMAAQED&timestamp=1468985773924&acl=e497f9a68cb6beecf7d777bedf81830a&zoom=original"},{"resourceId":"cMObTQo3SmiUnBCTXDmI-QAAACMAAQEC","resourceUrl":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=cMObTQo3SmiUnBCTXDmI-QAAACMAAQEC&token=w2Yj6uc-j3G3vQv_3FgPlgABUYAAAAFWBgcgYwAAACMAAQED&timestamp=1468985773924&acl=7c4edbde333736de9b3afe3b3d1ee082&zoom=original"}],"isSupportH5":"","keyMerchant":"","labels":[],"latestModifyOpId":"","latestModifyOrderId":"","latestModifyStatus":"","latitude":31.231763,"licensePicture":{"resourceId":"k5quTTGrT9WallXdZdZgLgAAACMAAQEC","resourceUrl":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=k5quTTGrT9WallXdZdZgLgAAACMAAQEC&token=w2Yj6uc-j3G3vQv_3FgPlgABUYAAAAFWBgcgYwAAACMAAQED&timestamp=1468985773924&acl=512658e2cc0849c276283f20f43a730e&zoom=original"},"licenseSeq":"1462091790171","logo":{"resourceId":"1Aiugv_dRjaAn2lu2c7h4gAAACMAAQEC","resourceUrl":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=1Aiugv_dRjaAn2lu2c7h4gAAACMAAQEC&token=w2Yj6uc-j3G3vQv_3FgPlgABUYAAAAFWBgcgYwAAACMAAQED&timestamp=1468985773856&acl=ecb3220f07230f6757de12316629e229&zoom=original"},"longitude":121.484443,"mainImage":{"resourceId":"k5quTTGrT9WallXdZdZgLgAAACMAAQEC","resourceUrl":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=k5quTTGrT9WallXdZdZgLgAAACMAAQEC&token=w2Yj6uc-j3G3vQv_3FgPlgABUYAAAAFWBgcgYwAAACMAAQED&timestamp=1468985773924&acl=512658e2cc0849c276283f20f43a730e&zoom=original"},"mobileNo":["13822334455"],"operationInfo":[],"otherDiscount":"","outShopId":"","parkRadio":"","partnerId":"2088201880094873","perPay":"","posIds":[],"provideServs":[],"provinceId":"310000","provinceName":"上海","punishScore":"0","receiveLogonId":"","receiveQrCodeUrl":"","receiveUserId":"","relationShopsCount":0,"relationUserId":"999889385","relationUserName":"董骥(薛奕)","saleLabel":[],"shopId":"2016050100077000000003153271","shopLevel":"","shopName":"原浩创2088201880094873(1462091790171)","shopType":"COMMON","statusCode":"FREEZE","territoryName":"墨融测试-昌平","tollParkMessage":"","wifiName":"","wifiPassword":""},"status":"succeed","zeroRate":false});
  },
  '/canceltag': (req, res) => {
    if (req.query.type != 1) {
      res.json({"resultCode":"SYSTEM_ERROR","resultMsg":"系统异常","status":"failed"});
    } else {
      res.json({status: 'succeed'});
    }
  },
  'GET /sale/queryDataCorrectionList.json': function (req, res) {
    var ret = [{
      opId: '1',
      opTime: 1470128757968,
      opName: 'ji.dong',
      opType: 'PAY_TYPE',
      status: 'INIT',
      resultFileResourceId: '/cm_merchant_attachment/T1H_FXXolkXXXgzXjX?t=.xls&xsig=b3187bba463996a50324faa246c026e9',
      totalCount: 1455,
      successCount: 0,
      failCount: 0,
    }, {
      opId: '2',
      opTime: '2016-08-14 08:10:10',
      opName: '赵四',
      opType: '门店信息修改',
      status: 'FINISHED',
      resultFileResourceId: '2',
      totalCount: 1451235,
      successCount: 21233,
      failCount: 10,
    }, {
      opId: '3',
      opTime: '2016-08-18 08:10:10',
      opName: '王五',
      opType: '消费者保障标签',
      status: 'PROCESSING',
      resultFileResourceId: '3',
      totalCount: 1455,
      successCount: 0,
      failCount: 0,
    }];
    setTimeout(() => {
      res.json({
        data: ret,
      });
    }, 500);
  },
};