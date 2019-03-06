var district = require('./district');

module.exports = Object.assign({}, district, {

  'GET /shop/crm/payeeSelect.json': function (req, res) {
    console.log('MOCK GET /shop/crm/payeeSelect.json');
    setTimeout(() => {
      res.json({"receiveAccountNos":[{"shopBinds":0,"logonId":"crm@alipay.net","userId":"2088311359143622"}]});
    }, 100);
  },

  'GET /shop/crm/pidChoose.json': function (req, res) {
    console.log('MOCK GET /shop/crm/pidChoose.json');
    setTimeout(() => {
      res.json({
        status: 'succeed'
      });
    }, 100);
  },

  'GET /shop/crm/shopCreateConfig.json': function (req, res) {
    console.log('MOCK GET /shop/crm/shopCreateConfig.json');
    setTimeout(() => {
      res.json({
        showBankCardNo: true
      });
    }, 100);
  },

  'POST /shop/crm/createShop.json': function (req, res) {
    console.log('MOCK GET /shop/crm/createShop.json');
    setTimeout(() => {
      res.json({status: 'succeed'});
    }, 100);
  },

  'GET /shop/crm/merchantSelect.json': function (req, res) {
    console.log('MOCK GET /shop/crm/merchantSelect.json');
    setTimeout(() => {
      res.json({pids: [{
        partnerId: '2088101145411987',
        logonId: 'crm@alipay.com',
        name: '大商户'
      }]});
    }, 100);
  },

  'GET /home/crm/queryAreaCategory.json': function (req, res) {
    console.log('MOCK GET /crm/queryAreaCategory.json');
    setTimeout(() => {
      res.json({"data": [{"c":[{"c":[{"i":"2015050700000047","n":"饮品/甜点"}],"i":"2015050700000006","n":"烘培糕点"}],"i":"2015050700000000","n":"美食"},{"c":[{"c":[{"i":"2015102800489100","n":"测试18"},{"i":"2015102800489092","n":"测试10"}],"i":"2015102800489081","n":"345"}],"i":"2015050700000016","n":"云南菜"}]});
    }, 100);
  },

  'GET /shop/crm/myShops.json': function (req, res) {
    setTimeout(() => {
      res.json({"data":{"data":[{"address":"HangZhou Xihu minsheng 1199 1 27F","bdNickName":"","bdRealName":"","brokerName":"","brokerStaff":"","category":"","cityName":"","competitorDis":"","createTime":1458771863000,"districtName":"","merchantName":"红樓夢S级经典专卖1号店(反查order111)","merchantPid":"2088102146159401","mobile":"288888888888","orderId":"","provinceName":"","shopId":"2016032400077000000003051631","shopName":"shop_1458771866419","status":"OPEN"},{"address":"HangZhou Xihu minsheng 1199 1 27F","bdNickName":"","bdRealName":"","brokerName":"","brokerStaff":"","category":"","cityName":"","competitorDis":"","createTime":1458685459000,"districtName":"","merchantName":"红樓夢S级经典专卖1号店(反查order111)","merchantPid":"2088102146159401","mobile":"288888888888","orderId":"","provinceName":"","shopId":"2016032300077000000003043924","shopName":"shop_1458685461669","status":"OPEN"},{"address":"HangZhou Xihu minsheng 1199 1 27F","bdNickName":"","bdRealName":"","brokerName":"","brokerStaff":"","category":"","cityName":"","competitorDis":"","createTime":1458428856000,"districtName":"","merchantName":"红樓夢S级经典专卖1号店(反查order111)","merchantPid":"2088102146159401","mobile":"288888888888","orderId":"","provinceName":"","shopId":"2016032000077000000003029550","shopName":"shop_1458428858960","status":"OPEN"},{"address":"HangZhou Xihu minsheng 1199 1 27F","bdNickName":"","bdRealName":"","brokerName":"","brokerStaff":"","category":"","cityName":"","competitorDis":"","createTime":1458080752000,"districtName":"","merchantName":"红樓夢S级经典专卖1号店(反查order111)","merchantPid":"2088102146159401","mobile":"288888888888","orderId":"","provinceName":"","shopId":"2016031600077000000003024207","shopName":"shop_1458080755244","status":"OPEN"},{"address":"HangZhou Xihu minsheng 1199 1 27F","bdNickName":"","bdRealName":"","brokerName":"","brokerStaff":"","category":"","cityName":"","competitorDis":"","createTime":1457907909000,"districtName":"","merchantName":"红樓夢S级经典专卖1号店(反查order111)","merchantPid":"2088102146159401","mobile":"288888888888","orderId":"","provinceName":"","shopId":"2016031400077000000003009203","shopName":"shop_1457907911963","status":"OPEN"},{"address":"HangZhou Xihu minsheng 1199 1 27F","bdNickName":"","bdRealName":"","brokerName":"","brokerStaff":"","category":"","cityName":"","competitorDis":"","createTime":1457822593000,"districtName":"","merchantName":"红樓夢S级经典专卖1号店(反查order111)","merchantPid":"2088102146159401","mobile":"288888888888","orderId":"","provinceName":"","shopId":"2016031300077000000003001816","shopName":"shop_1457822596207","status":"OPEN"},{"address":"HangZhou Xihu minsheng 1199 1 27F","bdNickName":"","bdRealName":"","brokerName":"","brokerStaff":"","category":"","cityName":"","competitorDis":"","createTime":1457702305000,"districtName":"","merchantName":"红樓夢S级经典专卖1号店(反查order111)","merchantPid":"2088102146159401","mobile":"288888888888","orderId":"","provinceName":"","shopId":"2016031100077000000002980703","shopName":"shop_1457702307677","status":"OPEN"},{"address":"芷江西路","bdNickName":"","bdRealName":"","brokerName":"","brokerStaff":"","category":"","cityName":"","competitorDis":"","createTime":1457680673000,"districtName":"","merchantName":"红樓夢S级经典专卖1号店(反查order111)","merchantPid":"2088102146159401","mobile":"","orderId":"","provinceName":"","shopId":"2016031100077000000002598443","shopName":"周星星(小门店)","status":"OPEN"},{"address":"HangZhou Xihu minsheng 1199 1 27F","bdNickName":"","bdRealName":"","brokerName":"","brokerStaff":"","category":"","cityName":"","competitorDis":"","createTime":1457648693000,"districtName":"","merchantName":"红樓夢S级经典专卖1号店(反查order111)","merchantPid":"2088102146159401","mobile":"288888888888","orderId":"","provinceName":"","shopId":"2016031100077000000002971623","shopName":"shop_1457648696172","status":"OPEN"},{"address":"HangZhou Xihu minsheng 1199 1 27F","bdNickName":"","bdRealName":"","brokerName":"","brokerStaff":"","category":"","cityName":"","competitorDis":"","createTime":1457624649000,"districtName":"","merchantName":"红樓夢S级经典专卖1号店(反查order111)","merchantPid":"2088102146159401","mobile":"288888888888","orderId":"","provinceName":"","shopId":"2016031000077000000002964750","shopName":"shop_1457624651649","status":"OPEN"}],"pageNo":1,"pageSize":10,"totalItems":11943,"totalPages":1195},"date":1465233137225,"status":"succeed"});
    }, 500);
  },

  'GET /shop/crm/teamShops.json': function (req, res) {
    setTimeout(() => {
      res.json({"resultMsg":"","resultCode":"","data":[{"bdRealName":"吕飞","status":"2","bdNickName":"熏风","auditStatus":"CHECKED","category":"","address":"ZJ-HZ-XH 实例地址","competitorDis":"竞对数据","shopName":"实例名称","shopId":"shop_00001","brokerName":"服务商名称","merchantName":"商户名称","merchantPid":"2023456543","brokerStaff":"","mobile":"联系人"}],"KBShopSearchForm":{"pageSize":10,"currPage":0},"status":"succeed"});
    }, 500);
  },

  'GET /shop/crm/backlogShops.json': function (req, res) {
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

  'GET /shop/crm/flow.json': function (req, res) {
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

  'GET /shop/crm/equipmentList.json': function (req, res) {
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


  'GET /shop/crm/showMaterial.json': function (req, res) {
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

  'GET /shop/crm/shopDetail.json': function (req, res) {
    var ret = {
      "date": 1462513306718,
      "merchant": {
        "f2fStatus": "已签约",
        "mid": "119543",
        "mobileNo": [
          "13780477306"
        ],
        "name": "es_merchant_sit_01",
        "pid": "2088201880477306"
      },
      "shop": {
        "acquiringMethod": "",
        "address": "浦东新区 1462434044232 2088201880477306",
        "brandId": "2015050700000000",
        "brandName": "其它品牌",
        "businessCertificateValidTime": "长期",
        "businessLicenseValidTime": "长期",
        "businessTime": "",
        "category": "美食-中餐-川菜",
        "categoryLabel": "普通堂食",
        "certificatePicture": {
          "resourceId": "k5quTTGrT9WallXdZdZgLgAAACMAAQEC",
          "resourceUrl": "https://dl.django.t.taobao.com/rest/1.0/image?fileIds=k5quTTGrT9WallXdZdZgLgAAACMAAQEC&token=tesesk2XFAUZ6O3YSh2i-gABUYAAAAFUhCcdqwAAACMAAQED&timestamp=1462513306628&acl=ab392c94a134fa9e6be35f61c8d4ab33&zoom=original"
        },
        "cityId": "310100",
        "cityName": "上海市",
        "createTime": 1462434044436,
        "ctuGreyList": "F",
        "dataChannel": "商家自主开店",
        "dataSource": "后台创建",
        "display": "显示",
        "displayCode": "1",
        "districtId": "310115",
        "districtName": "浦东新区",
        "gmtCreate": "2016-05-05",
        "headShopName": "原浩创",
        "imageList": [
          {
            "resourceId": "8d0k281rR5S9gHMZ0Am0UQAAACMAAQEC",
            "resourceUrl": "https://dl.django.t.taobao.com/rest/1.0/image?fileIds=8d0k281rR5S9gHMZ0Am0UQAAACMAAQEC&token=tesesk2XFAUZ6O3YSh2i-gABUYAAAAFUhCcdqwAAACMAAQED&timestamp=1462513306627&acl=f1ed9f7b713c266cecf69e545ed0645e&zoom=original"
          },
          {
            "resourceId": "ADFV_EU7SPO0_eGLTwJUZgAAACMAAQED",
            "resourceUrl": "https://dl.django.t.taobao.com/rest/1.0/image?fileIds=ADFV_EU7SPO0_eGLTwJUZgAAACMAAQED&token=tesesk2XFAUZ6O3YSh2i-gABUYAAAAFUhCcdqwAAACMAAQED&timestamp=1462513306627&acl=2946031da3a8564a48ef55c788930d21&zoom=original"
          },
          {
            "resourceId": "cMObTQo3SmiUnBCTXDmI-QAAACMAAQEC",
            "resourceUrl": "https://dl.django.t.taobao.com/rest/1.0/image?fileIds=cMObTQo3SmiUnBCTXDmI-QAAACMAAQEC&token=tesesk2XFAUZ6O3YSh2i-gABUYAAAAFUhCcdqwAAACMAAQED&timestamp=1462513306628&acl=b8986116ad688e8a4a920d2d90faa78f&zoom=original"
          }
        ],
        "isSupportH5": "",
        "keyMerchant": "",
        "labels": [],
        "latitude": 31.221517,
        "licensePicture": {
          "resourceId": "k5quTTGrT9WallXdZdZgLgAAACMAAQEC",
          "resourceUrl": "https://dl.django.t.taobao.com/rest/1.0/image?fileIds=k5quTTGrT9WallXdZdZgLgAAACMAAQEC&token=tesesk2XFAUZ6O3YSh2i-gABUYAAAAFUhCcdqwAAACMAAQED&timestamp=1462513306628&acl=ab392c94a134fa9e6be35f61c8d4ab33&zoom=original"
        },
        "licenseSeq": "1462434044232",
        "logo": {
          "resourceId": "1Aiugv_dRjaAn2lu2c7h4gAAACMAAQEC",
          "resourceUrl": "https://dl.django.t.taobao.com/rest/1.0/image?fileIds=1Aiugv_dRjaAn2lu2c7h4gAAACMAAQEC&token=tesesk2XFAUZ6O3YSh2i-gABUYAAAAFUhCcdqwAAACMAAQED&timestamp=1462513306555&acl=613be44abc752490b76f4e54d7fc96b8&zoom=original"
        },
        "longitude": 121.544379,
        "mainImage": {
          "resourceId": "k5quTTGrT9WallXdZdZgLgAAACMAAQEC",
          "resourceUrl": "https://dl.django.t.taobao.com/rest/1.0/image?fileIds=k5quTTGrT9WallXdZdZgLgAAACMAAQEC&token=tesesk2XFAUZ6O3YSh2i-gABUYAAAAFUhCcdqwAAACMAAQED&timestamp=1462513306627&acl=5d7b41d5d7916126fb16ba13971bd371&zoom=original"
        },
        "mobileNo": [
          "13822334455"
        ],
        "operationInfo": [
          {
            "name": "lyzhbo",
            "role": "服务商",
            "tel": "13801823802"
          }
        ],
        "otherDiscount": "",
        "outShopId": "yuanhao004",
        "partnerId": "2088201880477306",
        "perPay": "",
        "posIds": [],
        "provideServs": [],
        "provinceId": "310000",
        "provinceName": "上海",
        "punishScore": "0",
        "receiveLogonId": "",
        "receiveQrCodeUrl": "http://tfs.test.alipay.net/files/alipaygiftprodtfs/T1alpXXjlhXXXXXXXXbd7c63ec6912fa78cbc46d006f49c720",
        "receiveUserId": "",
        "relationUserId": "999889157",
        "relationUserName": "董骥(薛奕)",
        "saleLabel": [],
        "shopId": "2016050500077000000003394971",
        "shopLevel": "",
        "shopName": "原浩创2088201880477306(1462434044232)",
        "statusCode": "OPEN"
      },
      "status": "succeed"
    };
    setTimeout(() => {
      res.json(ret);
    }, 500);
  },
  'GET /shop/crm/shopDetailConfig.json': function (req, res) {
    var ret = {
      "resultMsg": "",
      "resultCode": "",
      "data": {
        "pid": "2088201880477306",
        "showEdit": true
      },
      "date": 1462513306725,
      "status": "succeed"
    };
    setTimeout(() => {
      res.json(ret);
    }, 500);
  },
  'POST /goods/crm/itemList.json': function (req, res) {
    var ret = {
      "data": {
        "data": [
          {
            "allowManage": true,
            "allowModify": false,
            "allowModifyVisibility": false,
            "allowOffLine": false,
            "creatorId": "2088102161231799",
            "endTimeMills": 1463475271000,
            "gmtCreateMills": 1462265674000,
            "itemId": "2016050300076000000002522218",
            "partnerId": "2088101162165885",
            "partnerName": "13927960423",
            "salesQuantity": 0,
            "startTimeMills": 1462265671000,
            "statusDisplay": "INVALID",
            "subject": "OpenAPI自动化创建商品",
            "totalInventory": 100,
            "typeDisplay": "SINGLE_DISCOUNT",
            "useMode": "0",
            "visibility": "ALL"
          },
          {
            "allowManage": true,
            "allowModify": false,
            "allowModifyVisibility": false,
            "allowOffLine": false,
            "creatorId": "2088102162090113",
            "endTimeMills": 1463475267000,
            "gmtCreateMills": 1462265669000,
            "itemId": "2016050300076000000002522217",
            "partnerId": "2088101162165885",
            "partnerName": "13927960423",
            "salesQuantity": 0,
            "startTimeMills": 1462265667000,
            "statusDisplay": "INVALID",
            "subject": "OpenAPI自动化创建商品",
            "totalInventory": 100,
            "typeDisplay": "SINGLE_DISCOUNT",
            "useMode": "0",
            "visibility": "ALL"
          },
          {
            "allowManage": true,
            "allowModify": false,
            "allowModifyVisibility": false,
            "allowOffLine": true,
            "creatorId": "2088102162090113",
            "endTimeMills": 1463475225000,
            "gmtCreateMills": 1462265627000,
            "itemId": "2016050300076000000002522214",
            "partnerId": "2088101162165885",
            "partnerName": "13927960423",
            "salesQuantity": 0,
            "startTimeMills": 1462265625000,
            "statusDisplay": "ONLINE",
            "subject": "OpenAPI自动化创建商品",
            "totalInventory": 100,
            "typeDisplay": "SINGLE_DISCOUNT",
            "useMode": "0",
            "visibility": "ALL"
          },
          {
            "allowManage": true,
            "allowModify": false,
            "allowModifyVisibility": false,
            "allowOffLine": false,
            "creatorId": "2088102162090113",
            "endTimeMills": 1463475220000,
            "gmtCreateMills": 1462265622000,
            "itemId": "2016050300076000000002522213",
            "partnerId": "2088101162165885",
            "partnerName": "13927960423",
            "salesQuantity": 0,
            "startTimeMills": 1462265620000,
            "statusDisplay": "INVALID",
            "subject": "OpenAPI自动化创建商品",
            "totalInventory": 100,
            "typeDisplay": "SINGLE_DISCOUNT",
            "useMode": "0",
            "visibility": "ALL"
          },
          {
            "allowManage": true,
            "allowModify": false,
            "allowModifyVisibility": false,
            "allowOffLine": false,
            "creatorId": "2088102162090113",
            "endTimeMills": 1463475217000,
            "gmtCreateMills": 1462265620000,
            "itemId": "2016050300076000000002522212",
            "partnerId": "2088101162165885",
            "partnerName": "13927960423",
            "salesQuantity": 0,
            "startTimeMills": 1462265617000,
            "statusDisplay": "INVALID",
            "subject": "OpenAPI自动化创建商品",
            "totalInventory": 100,
            "typeDisplay": "SINGLE_DISCOUNT",
            "useMode": "0",
            "visibility": "ALL"
          },
          {
            "allowManage": true,
            "allowModify": false,
            "allowModifyVisibility": false,
            "allowOffLine": false,
            "creatorId": "2088102162090113",
            "endTimeMills": 1463475215000,
            "gmtCreateMills": 1462265617000,
            "itemId": "2016050300076000000002522211",
            "partnerId": "2088101162165885",
            "partnerName": "13927960423",
            "salesQuantity": 0,
            "startTimeMills": 1462265615000,
            "statusDisplay": "INVALID",
            "subject": "OpenAPI自动化创建商品",
            "totalInventory": 100,
            "typeDisplay": "SINGLE_DISCOUNT",
            "useMode": "0",
            "visibility": "ALL"
          },
          {
            "allowManage": true,
            "allowModify": false,
            "allowModifyVisibility": false,
            "allowOffLine": false,
            "creatorId": "2088102162090113",
            "endTimeMills": 1463473573000,
            "gmtCreateMills": 1462263975000,
            "itemId": "2016050300076000000002521311",
            "partnerId": "2088101162165885",
            "partnerName": "13927960423",
            "salesQuantity": 0,
            "startTimeMills": 1462263973000,
            "statusDisplay": "INVALID",
            "subject": "OpenAPI自动化创建商品",
            "totalInventory": 100,
            "typeDisplay": "CASH",
            "useMode": "0",
            "visibility": "ALL"
          },
          {
            "allowManage": true,
            "allowModify": false,
            "allowModifyVisibility": false,
            "allowOffLine": false,
            "creatorId": "2088102162090113",
            "endTimeMills": 1463473383000,
            "gmtCreateMills": 1462263785000,
            "itemId": "2016050300076000000002521279",
            "partnerId": "2088101162165885",
            "partnerName": "13927960423",
            "salesQuantity": 0,
            "startTimeMills": 1462263783000,
            "statusDisplay": "INVALID",
            "subject": "OpenAPI自动化创建商品",
            "totalInventory": 100,
            "typeDisplay": "SINGLE_DISCOUNT",
            "useMode": "1",
            "visibility": "ALL"
          },
          {
            "allowManage": true,
            "allowModify": true,
            "allowModifyVisibility": false,
            "allowOffLine": true,
            "creatorId": "2088001969784501",
            "endTimeMills": 1463127747000,
            "gmtCreateMills": 1462263749000,
            "itemId": "2016050300076000000002521257",
            "partnerId": "2088101162165885",
            "partnerName": "13927960423",
            "salesQuantity": 0,
            "startTimeMills": 1462263747000,
            "statusDisplay": "ONLINE",
            "subject": "商品测试APmx-1462263747633",
            "totalInventory": 10,
            "typeDisplay": "RATE",
            "useMode": "0",
            "visibility": "ALL"
          },
          {
            "allowManage": true,
            "allowModify": true,
            "allowModifyVisibility": false,
            "allowOffLine": true,
            "creatorId": "2088001969784501",
            "endTimeMills": 1463127742000,
            "gmtCreateMills": 1462263744000,
            "itemId": "2016050300076000000002521256",
            "partnerId": "2088101162165885",
            "partnerName": "13927960423",
            "salesQuantity": 0,
            "startTimeMills": 1462263742000,
            "statusDisplay": "ONLINE",
            "subject": "商品测试APmx-1462263742695",
            "totalInventory": 10,
            "typeDisplay": "RATE",
            "useMode": "0",
            "visibility": "ALL"
          }
        ],
        "pageNo": 1,
        "pageSize": 10,
        "totalItems": 5847,
        "totalPages": 585
      },
      "errorMsg": "",
      "result": true,
      "roleType": "SALES_STAFF",
      "status": "succeed"
    };
    setTimeout(() => {
      res.json(ret);
    }, 500);
  },
  'GET /sale/merchant/orderLinksList.json': function (req, res) {
    var ret = {
      "data": [
        {
          "key": "106446",
          "merFromOrderNum": "O00069-151214-1264",
          "merOrderLinkBizManager": "",
          "merOrderLinkCards": [
            "13927960455"
          ],
          "merOrderLinkGmtInvaild": "2015-12-15 11:12",
          "merOrderLinkGmtVaild": "2015-12-14 20:01",
          "merOrderLinkId": "106446",
          "merOrderLinkState": "2",
          "merOrderLinkStateMsg": "失效",
          "merSalesPlanName": "当面付签约（JV）"
        },
        {
          "key": "108828",
          "merFromOrderNum": "W00070-160315-5060",
          "merOrderLinkBizManager": "",
          "merOrderLinkCards": [
            "13927960455"
          ],
          "merOrderLinkGmtInvaild": "2115-01-01 00:00",
          "merOrderLinkGmtVaild": "2016-03-15 19:49",
          "merOrderLinkId": "108828",
          "merOrderLinkState": "1",
          "merOrderLinkStateMsg": "生效",
          "merSalesPlanName": "当面付(含CRM)V4"
        },
        {
          "key": "108306",
          "merFromOrderNum": "S20212-160312-6316",
          "merOrderLinkBizManager": "纯颜",
          "merOrderLinkCards": [
            "13927960455"
          ],
          "merOrderLinkGmtInvaild": "2024-06-12 20:54",
          "merOrderLinkGmtVaild": "2016-03-12 20:54",
          "merOrderLinkId": "108306",
          "merOrderLinkState": "1",
          "merOrderLinkStateMsg": "生效",
          "merSalesPlanName": "O2O服务商产品V2"
        },
        {
          "key": "106452",
          "merFromOrderNum": "S20190-151215-8294",
          "merOrderLinkBizManager": "",
          "merOrderLinkCards": [
            "13927960455"
          ],
          "merOrderLinkGmtInvaild": "2016-03-15 18:05",
          "merOrderLinkGmtVaild": "2015-12-15 11:18",
          "merOrderLinkId": "106452",
          "merOrderLinkState": "2",
          "merOrderLinkStateMsg": "失效",
          "merSalesPlanName": "当面付签约（JV）"
        }
      ],
      "pageNum": 1,
      "status": "succeed",
      "totalCount": 4
    };
    setTimeout(() => {
      res.json(ret);
    }, 500);
  },
  'POST /shop/crm/shoplog.json': function (req, res) {
    var ret = {
      "resultMsg": "",
      "status": "succeed",
      "org.springframework.validation.BindingResult.data": {
        "nestedPath": "",
        "messageCodesResolver": {
          "prefix": ""
        }
      },
      "resultCode": "",
      "data": {
        "pageNo": 1,
        "data": [
          {
            "createTime": 1462434045000,
            "memo": "",
            "status": "SUCCESS",
            "opId": "SYSTEM",
            "opIdType": "SYSTEM",
            "source": "system",
            "action": "CREATE_SHOP_ALLOCATION",
            "extInfo": {},
            "channel": "system",
            "orderId": "2016050500107000000000242000"
          }
        ],
        "pageSize": 10,
        "totalItems": 1,
        "totalPages": 1
      },
      "KBShopOrderSearchForm": {
        "pageSize": 10,
        "shopId": "2016050500077000000003394970",
        "pageNum": 1
      },
      "date": 1462526071600
    };
    setTimeout(() => {
      res.json(ret);
    }, 500);
  },
  'GET /shop/crm/toBeOpenedShops.json': function (req, res) {
    var ret = {"data":{"data":[{"address":"测试1","brandName":"其它品牌","cityName":"安庆市","createTime":1462768188000,"districtName":"大观区","merchantName":"lfobmg","mobile":"13262567582","openProgressCode":"FAILED","orderId":"2016050900107000000000242981","provinceName":"安徽省","shopName":"历史测试门店1"},{"address":"测试1","brandName":"其它品牌","cityName":"安庆市","createTime":1462767695000,"districtName":"大观区","merchantName":"lfobmg","mobile":"13262567582","openProgressCode":"FAILED","orderId":"2016050900107000000000242980","provinceName":"安徽省","shopName":"历史测试门店1"},{"address":"测试1","brandName":"其它品牌","cityName":"安庆市","createTime":1462767119000,"districtName":"大观区","merchantName":"lfobmg","mobile":"13262567582","openProgressCode":"FAILED","orderId":"2016050900107000000000242979","provinceName":"安徽省","shopName":"历史测试门店1"},{"address":"测试1","brandName":"其它品牌","cityName":"安庆市","createTime":1462763860000,"districtName":"大观区","merchantName":"lfobmg","mobile":"13262567582","openProgressCode":"FAILED","orderId":"2016050900107000000000242977","provinceName":"安徽省","shopName":"历史测试门店1"},{"address":"测试1","brandName":"其它品牌","cityName":"安庆市","createTime":1462635996000,"districtName":"大观区","merchantName":"lfobmg","mobile":"13262567582","openProgressCode":"FAILED","orderId":"2016050700107000000000242726","provinceName":"安徽省","shopName":"四块历史测试门店"},{"address":"测试1","brandName":"其它品牌","cityName":"安庆市","createTime":1462635951000,"districtName":"大观区","merchantName":"lfobmg","mobile":"13262567582","openProgressCode":"FAILED","orderId":"2016050700107000000000242725","provinceName":"安徽省","shopName":"四块历史测试门店"},{"address":"测试1","brandName":"其它品牌","cityName":"安庆市","createTime":1462635937000,"districtName":"大观区","merchantName":"lfobmg","mobile":"13262567582","openProgressCode":"FAILED","orderId":"2016050700107000000000242724","provinceName":"安徽省","shopName":"四块历史测试门店"},{"address":"测试1","brandName":"其它品牌","cityName":"安庆市","createTime":1462635879000,"districtName":"大观区","merchantName":"lfobmg","mobile":"13262567582","openProgressCode":"FAILED","orderId":"2016050700107000000000242723","provinceName":"安徽省","shopName":"四块历史测试门店"},{"address":"测试1","brandName":"其它品牌","cityName":"安庆市","createTime":1462635842000,"districtName":"大观区","merchantName":"lfobmg","mobile":"13262567582","openProgressCode":"FAILED","orderId":"2016050700107000000000242722","provinceName":"安徽省","shopName":"四块历史测试门店"},{"address":"测试1","brandName":"其它品牌","cityName":"安庆市","createTime":1462632607000,"districtName":"大观区","merchantName":"lfobmg","mobile":"13262567582","openProgressCode":"FAILED","orderId":"2016050700107000000000242720","provinceName":"安徽省","shopName":"历史测试门店12222(33333)"}],"pageNo":1,"pageSize":10,"totalItems":35,"totalPages":4},"date":1462776571253,"status":"succeed"};
    setTimeout(() => {
      res.json(ret);
    }, 500);
  },
  'GET /shop/crm/shopOrderDetail.json': function (req, res) {
    var ret = {
      "date": 1462779190132,
      "order": {
        "acquiringMethod": "在线买单",
        "action": "CREATE_SHOP",
        "address": "测试1",
        "addressDesc": "",
        "authorizationLetterPicture": {
          "resourceId": "ZAUlh2ICRVyzE9QjZU0I0gAAACMAAQED",
          "resourceUrl": "https://dl.django.t.taobao.com/rest/1.0/image?fileIds=ZAUlh2ICRVyzE9QjZU0I0gAAACMAAQED&token=bDDrjNjJo_xXbDtQ8ob-IQABUYAAAAFUk0PoNgAAACMAAQED&timestamp=1462779190131&acl=8ad44d04c89c890e0dcdc6422cf810e5&zoom=original"
        },
        "bankCardNo": "654312******9876",
        "brandId": "2015050700000000",
        "brandName": "其它品牌",
        "businessCertificateValidTime": "长期",
        "businessLicenseValidTime": "长期",
        "businessTime": "",
        "category": "美食-中餐-其他地方菜",
        "categoryId": "2015050700000022",
        "categoryIds": [
          "2015050700000000",
          "2015050700000001",
          "2015050700000022"
        ],
        "categoryName": "其他地方菜",
        "certificatePicture": {
          "resourceId": "ZAUlh2ICRVyzE9QjZU0I0gAAACMAAQED",
          "resourceUrl": "https://dl.django.t.taobao.com/rest/1.0/image?fileIds=ZAUlh2ICRVyzE9QjZU0I0gAAACMAAQED&token=bDDrjNjJo_xXbDtQ8ob-IQABUYAAAAFUk0PoNgAAACMAAQED&timestamp=1462779190131&acl=8ad44d04c89c890e0dcdc6422cf810e5&zoom=original"
        },
        "channel": "pc",
        "cityId": "340800",
        "cityName": "安庆市",
        "createMode": "CREATE_DIRECT",
        "createTime": 1462768188859,
        "dataChannel": "PC",
        "dataSource": "销售中台",
        "display": "",
        "districtId": "340803",
        "districtName": "大观区",
        "extInfo": {},
        "gmtCreate": 1462768188859,
        "headShopName": "历史测试门店1",
        "imageList": [
          {
            "resourceId": "4Mxi_u-kThO6NOvAQ1f5VgAAACMAAQED",
            "resourceUrl": "https://dl.django.t.taobao.com/rest/1.0/image?fileIds=4Mxi_u-kThO6NOvAQ1f5VgAAACMAAQED&token=bDDrjNjJo_xXbDtQ8ob-IQABUYAAAAFUk0PoNgAAACMAAQED&timestamp=1462779190063&acl=06987fa4c65c9ea31ed0404a55516a37&zoom=original"
          },
          {
            "resourceId": "MJZ2DsO-RwGwrVHMa_7ijwAAACMAAQED",
            "resourceUrl": "https://dl.django.t.taobao.com/rest/1.0/image?fileIds=MJZ2DsO-RwGwrVHMa_7ijwAAACMAAQED&token=bDDrjNjJo_xXbDtQ8ob-IQABUYAAAAFUk0PoNgAAACMAAQED&timestamp=1462779190063&acl=70169bcbf326c7cb5df2a751154d0ba9&zoom=original"
          },
          {
            "resourceId": "ZAUlh2ICRVyzE9QjZU0I0gAAACMAAQED",
            "resourceUrl": "https://dl.django.t.taobao.com/rest/1.0/image?fileIds=ZAUlh2ICRVyzE9QjZU0I0gAAACMAAQED&token=bDDrjNjJo_xXbDtQ8ob-IQABUYAAAAFUk0PoNgAAACMAAQED&timestamp=1462779190064&acl=c44922d36b55fbdf9abdcf59fe44704b&zoom=original"
          }
        ],
        "isSupportH5": "true",
        "latitude": "30.540045",
        "licenseName": "11114567",
        "licensePicture": {
          "resourceId": "ZAUlh2ICRVyzE9QjZU0I0gAAACMAAQED",
          "resourceUrl": "https://dl.django.t.taobao.com/rest/1.0/image?fileIds=ZAUlh2ICRVyzE9QjZU0I0gAAACMAAQED&token=bDDrjNjJo_xXbDtQ8ob-IQABUYAAAAFUk0PoNgAAACMAAQED&timestamp=1462779190131&acl=8ad44d04c89c890e0dcdc6422cf810e5&zoom=original"
        },
        "licenseSeq": "11114567",
        "logo": {
          "resourceId": "MJZ2DsO-RwGwrVHMa_7ijwAAACMAAQED",
          "resourceUrl": "https://dl.django.t.taobao.com/rest/1.0/image?fileIds=MJZ2DsO-RwGwrVHMa_7ijwAAACMAAQED&token=bDDrjNjJo_xXbDtQ8ob-IQABUYAAAAFUk0PoNgAAACMAAQED&timestamp=1462779190063&acl=70169bcbf326c7cb5df2a751154d0ba9&zoom=original"
        },
        "longitude": "117.130798",
        "mainImage": {
          "resourceId": "ZAUlh2ICRVyzE9QjZU0I0gAAACMAAQED",
          "resourceUrl": "https://dl.django.t.taobao.com/rest/1.0/image?fileIds=ZAUlh2ICRVyzE9QjZU0I0gAAACMAAQED&token=bDDrjNjJo_xXbDtQ8ob-IQABUYAAAAFUk0PoNgAAACMAAQED&timestamp=1462779190063&acl=4d765e5a316969dc743b1bc72bdfd854&zoom=original"
        },
        "mobileNo": [
          "13262567582"
        ],
        "operationVO": [
          {
            "name": "lyzhbo",
            "role": "服务商",
            "tel": "13801823802"
          }
        ],

        "opId": "999889157",
        "opIdType": "BUC",
        "opName": "董骥",
        "opNickName": "薛奕",
        "orderId": "2016050900107000000000242981",
        "otherAuthResources": [
          {
            "resourceId": "MJZ2DsO-RwGwrVHMa_7ijwAAACMAAQED",
            "resourceUrl": "https://dl.django.t.taobao.com/rest/1.0/image?fileIds=MJZ2DsO-RwGwrVHMa_7ijwAAACMAAQED&token=bDDrjNjJo_xXbDtQ8ob-IQABUYAAAAFUk0PoNgAAACMAAQED&timestamp=1462779190131&acl=89b5b6e468dd5ff4df476700850c4a69&zoom=original"
          }
        ],
        "otherService": "11111",
        "outShopId": "",
        "payType": "online_pay",
        "perPay": "1111",
        "pid": "2088201831670440",
        "posIds": [],
        "provideServs": [
          "停车位",
          "wifi",
          "包间",
          "无烟区"
        ],
        "provinceId": "340000",
        "provinceName": "安徽省",
        "receiveLogonId": "18****76494",
        "receiveUserId": "2088102119789259",
        "resultTitle": "门店已存在，请联系口碑客服人员",
        "source": "sales_mg",
        "status": "FAIL",
        "statusCode": "FAILED"
      },
      "status": "succeed"
    };
    setTimeout(() => {
      res.json(ret);
    }, 500);
  },
  'GET /shop/crm/checkMerchant.json': function (req, res) {
    setTimeout(() => {
      res.json({"resultMsg":"","resultCode":"","date":1462782771088,"status":"succeed"});
    }, 500);
  },
  'GET /shop/crm/brandSearch.json': function (req, res) {
    var ret = {"brands":[{"id":"2015050900000007","name":"麦当劳","reserved":false,"type":""}],"date":1462782990903,"otherBrand":{"id":"2015050700000000","name":"其它品牌","reserved":false},"status":"succeed"};
    setTimeout(() => {
      res.json(ret);
    }, 500);
  },
  'GET /shop/crm/initModify.json': function (req, res) {
    var ret = {"data":{"address":"民生路1199弄1号","addressDesc":"","authorizationPictureList":[],"bindingPublic":false,"brandId":"2015050700000000","brandName":"其它品牌","businessTime":"","categoryIds":["2015050700000000","2015050700000001","2015050700000022"],"certificatePictureList":[{"id":"07FOtmpwQ_-UtUEnuncW-wAAACMAAQED","url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=07FOtmpwQ_-UtUEnuncW-wAAACMAAQED&token=U8a1lYo7-NBmrbLN7h7FYgABUYAAAAFUmbLb9wAAACMAAQED&timestamp=1462868664822&acl=13def2f6d9e9dc400c9d8989a962a7ad&zoom=original"}],"certificateValidTime":"长期","cityId":"310100","cityName":"上海市","coverList":[{"id":"07FOtmpwQ_-UtUEnuncW-wAAACMAAQED","url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=07FOtmpwQ_-UtUEnuncW-wAAACMAAQED&token=U8a1lYo7-NBmrbLN7h7FYgABUYAAAAFUmbLb9wAAACMAAQED&timestamp=1462868664821&acl=3520eb731c41fa3bafc01fc3b9b5343c&zoom=original"}],"districtId":"310115","districtName":"浦东新区","headShopName":"yuanhao","latitude":"31.226769","licenseName":"发大厦法定分","licensePictureList":[{"id":"hFnitLEgRAezzregV38zLQAAACMAAQED","url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=hFnitLEgRAezzregV38zLQAAACMAAQED&token=U8a1lYo7-NBmrbLN7h7FYgABUYAAAAFUmbLb9wAAACMAAQED&timestamp=1462868664822&acl=49857eb6d5a38a9fd1330a1357a24684&zoom=original"}],"licenseSeq":"123232432","licenseValidTime":"长期","logoList":[{"id":"07FOtmpwQ_-UtUEnuncW-wAAACMAAQED","url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=07FOtmpwQ_-UtUEnuncW-wAAACMAAQED&token=U8a1lYo7-NBmrbLN7h7FYgABUYAAAAFUmbLb9wAAACMAAQED&timestamp=1462868664821&acl=3520eb731c41fa3bafc01fc3b9b5343c&zoom=original"}],"longitude":"121.549974","mobileNo":"13311223344","otherService":"","outShopId":"yuanhao111","partnerId":"2088201831682632","payType":"code_scanned_pay","pictureDetailList":[{"id":"07FOtmpwQ_-UtUEnuncW-wAAACMAAQED","url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=07FOtmpwQ_-UtUEnuncW-wAAACMAAQED&token=U8a1lYo7-NBmrbLN7h7FYgABUYAAAAFUmbLb9wAAACMAAQED&timestamp=1462868664821&acl=3520eb731c41fa3bafc01fc3b9b5343c&zoom=original"},{"id":"BwOfygWXQWK1FIGWFTJzuAAAACMAAQED","url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=BwOfygWXQWK1FIGWFTJzuAAAACMAAQED&token=U8a1lYo7-NBmrbLN7h7FYgABUYAAAAFUmbLb9wAAACMAAQED&timestamp=1462868664821&acl=7dab041e85d4dafd01661d3c53b4b148&zoom=original"},{"id":"hFnitLEgRAezzregV38zLQAAACMAAQED","url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=hFnitLEgRAezzregV38zLQAAACMAAQED&token=U8a1lYo7-NBmrbLN7h7FYgABUYAAAAFUmbLb9wAAACMAAQED&timestamp=1462868664821&acl=5b25eab6b7da5f57e170a5206b179a56&zoom=original"}],"provinceId":"310000","provinceName":"上海","services":{"box":"false","noSmoke":"false","park":"false","wifi":"false"},"shopId":"2016050900077000000003398295","shopName":"111"},"date":1462868664822,"status":"succeed"};
    setTimeout(() => {
      res.json(ret);
    }, 500);
  },
  'GET /shop/queryQualityScore.json': function (req, res) {
    var ret = {"resultMsg":"","resultCode":"","qualityScore":{"shopScoreItem":{"scoreValue":46,"shopId":"2016062400077000000003238828","fullScore":95,"scoreDt":"2016.07.04","scoreCode":"SHOP_QUALITY_SCORE"},"childCollection":[{"shopScoreItem":{"scoreValue":4,"shopId":"2016062400077000000003238828","fullScore":42,"scoreDt":"2016.07.04","scoreCode":"SHOP_CONTENT_SCORE"},"childCollection":[{"shopScoreItem":{"scoreValue":3,"shopId":"2016062400077000000003238828","fullScore":3,"scoreDt":"2016.07.04","scoreReason":"","scoreCode":"SHOP_BUSINESS_TIME_SCORE"},"childCollection":[]},{"shopScoreItem":{"scoreValue":1,"shopId":"2016062400077000000003238828","fullScore":3,"scoreDt":"2016.07.04","scoreReason":"","scoreCode":"SHOP_ENV_PIC_SCORE"},"childCollection":[]},{"shopScoreItem":{"scoreValue":11,"shopId":"2016062400077000000003238828","fullScore":15,"scoreDt":"2016.07.04","scoreReason":"menuId=050201","scoreCode":"SHOP_GOODS_NUM_SCORE"},"childCollection":[]},{"shopScoreItem":{"scoreValue":3,"shopId":"2016062400077000000003238828","fullScore":6,"scoreDt":"2016.07.04","scoreReason":"","scoreCode":"SHOP_GOODS_INFO_SCORE"},"childCollection":[]},{"shopScoreItem":{"scoreValue":0,"shopId":"2016062400077000000003238828","fullScore":0,"scoreDt":"","scoreReason":"暂无","scoreCode":"SHOP_SELLING_POINT_SCORE"},"childCollection":[]},{"shopScoreItem":{"scoreValue":5,"shopId":"2016062400077000000003238828","fullScore":9,"scoreDt":"2016.07.04","scoreReason":"","scoreCode":"SHOP_COMMENT_SCORE"},"childCollection":[]},{"shopScoreItem":{"scoreValue":0,"shopId":"2016062400077000000003238828","fullScore":3,"scoreDt":"2016.07.04","scoreReason":"","scoreCode":"SHOP_AVG_PRICE_SCORE"},"childCollection":[]},{"shopScoreItem":{"scoreValue":0,"shopId":"2016062400077000000003238828","fullScore":3,"scoreDt":"2016.07.04","scoreReason":"","scoreCode":"SHOP_EXT_SERVICE_SCORE"},"childCollection":[]}]},{"shopScoreItem":{"scoreValue":14,"shopId":"2016062400077000000003238828","fullScore":35,"scoreDt":"2016.07.04","scoreCode":"SHOP_DECORATION_SCORE"},"childCollection":[{"shopScoreItem":{"scoreValue":5,"shopId":"2016062400077000000003238828","fullScore":15,"scoreDt":"2016.07.04","scoreReason":"","scoreCode":"SHOP_BRAND_STORY_SCORE"},"childCollection":[]},{"shopScoreItem":{"scoreValue":0,"shopId":"2016062400077000000003238828","fullScore":5,"scoreDt":"2016.07.04","scoreReason":"","scoreCode":"SHOP_MARKETING_SCORE"},"childCollection":[]},{"shopScoreItem":{"scoreValue":9,"shopId":"2016062400077000000003238828","fullScore":15,"scoreDt":"2016.07.04","scoreReason":"","scoreCode":"SHOP_PIC_QUALITY_SCORE"},"childCollection":[]}]},{"shopScoreItem":{"scoreValue":9,"shopId":"2016062400077000000003238828","fullScore":18,"scoreDt":"2016.07.04","scoreCode":"SHOP_BASE_INFO_SCORE"},"childCollection":[{"shopScoreItem":{"scoreValue":0,"shopId":"2016062400077000000003238828","fullScore":3,"scoreDt":"2016.07.04","scoreReason":"","scoreCode":"SHOP_LICENSE_SCORE"},"childCollection":[]},{"shopScoreItem":{"scoreValue":0,"shopId":"2016062400077000000003238828","fullScore":3,"scoreDt":"2016.07.04","scoreReason":"电话不准确","scoreCode":"SHOP_TEL_SCORE"},"childCollection":[]},{"shopScoreItem":{"scoreValue":0,"shopId":"2016062400077000000003238828","fullScore":3,"scoreDt":"2016.07.04","scoreReason":"门店名太二","scoreCode":"SHOP_NAME_SCORE"},"childCollection":[]},{"shopScoreItem":{"scoreValue":3,"shopId":"2016062400077000000003238828","fullScore":3,"scoreDt":"2016.07.04","scoreReason":"区划不准确","scoreCode":"SHOP_DISTRICT_SCORE"},"childCollection":[]},{"shopScoreItem":{"scoreValue":6,"shopId":"2016062400077000000003238828","fullScore":6,"scoreDt":"2016.07.04","scoreReason":"","scoreCode":"SHOP_ADDRESS_SCORE"},"childCollection":[]}]}]},"date":1469009723890,"status":"succeed"}
    setTimeout(() => {
      res.json(ret);
    }, 500);
  },
  'GET /shop/showQualityScore.json': function (req, res) {
    var ret = {"resultMsg":"","resultCode":"","date":1467726810692,"status":"succeed","showQualityScore":true};
    setTimeout(() => {
      res.json(ret);
    }, 500);
  },
});
