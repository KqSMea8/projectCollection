module.exports = {
  'GET /goodsList.json': function (req, res) {
    var total = 40;
    var query = req.query;
    var ret = [];
    var pageSize = parseInt(query.pageSize, 10);
    var current = parseInt(query.current, 10);
    var start = (current - 1) * pageSize;

    for (var i = start; i < Math.min(start + pageSize, total); i++) {
      var data = {
        "type": "type"+i,
        "goodsId": "goodsId"+i,
        "goodsName": "goodsName"+i,
        "merchantName": "merchantName"+i,
        "useType": "useType"+i,
        "gmtTime": "gmtTime"+i,
        "status": "status"+i,
        "stock":100+i,
        "amount": 100-i
      };
      ret.push(data);
    }

    setTimeout(()=> {
      res.json({
        "data": ret,
        "totalCount": total,
      });
    }, 100);
  },
  'GET /operationLog.json': function (req, res) {
    var total = 40;
    var query = req.query;
    var ret = [];
    var pageSize = parseInt(query.pageSize, 10);
    var current = parseInt(query.current, 10);
    var start = (current - 1) * pageSize;

    for (var i = start; i < Math.min(start + pageSize, total); i++) {
      var data = {
        "operationId": "operationId"+i,
        "userId": "userId"+i,
        "type": "type"+i,
        "result": "result"+i,
        "time": "time"+i,
        "remark": "remark"+i,
      };
      ret.push(data);
    }

    setTimeout(()=> {
      res.json({
        "data": ret,
        "totalCount": total,
      });
    }, 100);
  }
};