/* eslint-disable */
module.exports = {
  'GET /intelligentgodstodolist.json': function (req, res) {
    var total = 40;
    var query = req.query;
    var ret = [];
    var pageSize = parseInt(query.pageSize, 10);
    var current = parseInt(query.current, 10);
    var start = (current - 1) * pageSize;

    for (var i = start; i < Math.min(start + pageSize, total); i++) {
      var index = i+1;
      var data = {
        "merchantPid": index,
        "merchantName": "杭州外婆家餐饮有限公司"+index,
        "initLeadsCount": 20+index,
        "preparedLeadsCount": 1000+index,
        "rejectedLeadsCount": 100+index,
        "id": 1
      };
      ret.push(data);
    }

    setTimeout(()=> {
      res.json({
        "status": "succeed",
        "list": ret,
        "pageInfo": {
          "currentPage": current,
          "pageSize": pageSize,
          "totalSize": total
        }
      });
    }, 100);
  },

  'GET /waitingshelvelist.json': function (req, res) {
    var total = 100;
    var query = req.query;
    var ret = [];
    var pageSize = parseInt(query.pageSize, 10);
    var current = parseInt(query.pageNo, 10);
    var start = (current - 1) * pageSize;
    var status = ['INIT', 'PREPARED', 'UNDER_REVIEW', 'ON_SHELVES', 'REJECTED'];
    var statusViewName = ['待完善', '待上架', '商户确认中', '已上架', '已退回'];
    var statusIndex = query.status ? status.indexOf(query.status) : -1;
    for (var i = start; i < Math.min(start + pageSize, total); i++) {
      var index = i+1;
      var data = {
        "leadsId": index,
        "partnerId": 100+index,
        "status": statusIndex === -1 ? status[i%5] : status[statusIndex],
        "statusViewName": statusIndex === -1 ? statusViewName[i%5] : statusViewName[statusIndex],
        "gmtCreate": "2017-04-06 10:19:23",
        "subject": "音乐房子周末欢唱券5-10人套餐--"+index,
        "oriPrice": 200.01,
        "price": 100.00,
        "salesShopIds": [],
        "inventory": 1000+index,
        "validDays": 365
      };
      ret.push(data);
    }
    setTimeout(()=> {
      res.json({
        "pageInfo": {
          "currentPage": parseInt(query.pageNo, 10),
          "pageSize": parseInt(query.pageSize, 10),
          "totalSize": total
        },
        "list": ret
      });
    }, 100)
  },

  'GET /item/leads/batchApplyItemLeadsOnSale.json': function (req, res) {
    var status = 'succeed';
    if (req.query.error === 'error') {
      status = 'error';
    }
    setTimeout(()=> {
      res.json({
        "status": status,
      });
    }, 100);
  },

  'GET /queryCommodityPurchased.json': (req, res) => {
    let appList = [];
    const len = 2;
    for (var i = 0; i < len; i++) {
      appList.push({
        commodityId: i,
        appId: 10000+i,
        orderId: 20000+i,
        title: '桔牛商品--'+i,
        isvName: '北京桔牛科技有限公司--'+i,
        isWaitConfirm: true,
        startTime: '2017-02-01',
        endTime: '2018-02-01',
        logoUrl: 'http://demobase.cn-hangzhou.oss.aliyun-inc.com/private/system/ids_extracted/9e/1c/78/ef/f54f50938245d44ecf39fc81/%E4%B8%80%E9%94%AE%E6%90%AC%E5%AE%B6%EF%BC%88%E5%85%A8%E9%93%BE%E8%B7%AF%EF%BC%89/images/%E6%9C%8D%E5%8A%A1%E5%95%86%E6%B5%81%E7%A8%8B/u127.png'
      });
    }
    appList.push({
      commodityId: len,
      appId: 10000+len,
      orderId: 20000+len,
      title: '桔牛商品--'+len,
      isvName: '北京桔牛科技有限公司--'+len,
      isWaitConfirm: false,
      startTime: '2017-02-01',
      endTime: '2018-02-01',
      logoUrl: 'http://demobase.cn-hangzhou.oss.aliyun-inc.com/private/system/ids_extracted/9e/1c/78/ef/f54f50938245d44ecf39fc81/%E4%B8%80%E9%94%AE%E6%90%AC%E5%AE%B6%EF%BC%88%E5%85%A8%E9%93%BE%E8%B7%AF%EF%BC%89/images/%E6%9C%8D%E5%8A%A1%E5%95%86%E6%B5%81%E7%A8%8B/u127.png'
    });
    setTimeout(() => {
      res.json({
        data: appList,
        status: 'succeed',
      });
    }, 1000);
  }
}