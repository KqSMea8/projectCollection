module.exports = {
  'GET /manage/notice/getOnGoingList.json': function response(req, res) {
    var result = {
      'status': 'succeed',
      'data': [{
        'name': '双十通知1',
        'content': '我是通知我是通知我是通知我是通知我是通知我是通知我是通知我是通知我是通知我是通知我是通知我是通知我是通知我是通知我是通知我是通知我是通知我是通知我是通知我是通知我是通知我是通知我是通知我是通知',
        'link': 'http://www.baidu.com',
      }, {
        'name': '双十通知2',
        'content': '我是通知我是通知我是通知我是通知我是通知我是通知我是通知',
        'link': '',
      }, {
        'name': '双十通知3',
        'content': '我是通知我是通知我是通知我是通知我是通知我是通知我是通知我是通知我是通知我是通知我是通知我是通知我是通知我是通知',
        'link': '',
      }]
    };
    res.json(result);
  },
  'GET /manage/notice/searchList.json': function response(req, res) {
    var query = req.query;
    var data = [];
    var s = (query.pageNum - 1) * 10 + 1;
    var e = (query.pageNum - 1) * 10 + 10;
    var t = 30;
    if (query.status) {
      s = 1;
      e = 5;
      t = 5;
    }
    for (var i = s; i <= e; i++) {
      data.push({
        'content': '口碑中台发布啦2口碑中台发布啦2口碑中台发布啦2口碑中台发布啦2口碑中台发布啦2口碑中台发布啦2口碑中台发布啦2口碑中台发布啦2口碑中台发布啦2口碑中台发布啦2口碑中台发布啦2口碑中台发布啦2口碑中台发布啦2口碑中台发布啦2口碑中台发布啦2',
        'creatorId': '2015011513133146632',
        'creatorRealName': 'alibank_admin',
        'creatorUserName': 'alibank_admin',
        'endTime': 1463710210000,
        'gmtCreate': 1463241702000,
        'gmtModified': 1463319777000,
        'id': i,
        'link': 'http://kbservcenter.test.alipay.net',
        'name': '通告测试' + i,
        'publisherId': '2015011513133146632',
        'publisherRealName': 'alibank_admin',
        'publisherUserName': 'alibank_admin',
        'startTime': 1463040292000,
        'statusCode': ['ON_GOING', 'PUBLISHED', 'UNPUBLISHED', 'FINISHED'][parseInt(Math.random() * 4, 10)],
        'target': 'ALL'
      });
    }
    var result = {
      'data': {
        'contents': data,
        'pageNum': 1,
        'pageSize': 10,
        'totalItems': t,
        'totalPages': Math.ceil(t / 10)
      },
      'noticeForm': {
        'creatorId': '2015031000154540',
        'gmtCreateEnd': 1463710210000,
        'gmtCreateStart': 1462932610000,
        'statusCode': 'ON_GOING'
      },
      'status': 'succeed'
    };
    setTimeout(() => res.json(result), 500);
  },
  'POST /manage/notice/create.json': function response(req, res) {
    var result = {
      status: 'succeed'
    };
    setTimeout(() => res.json(result), 500);
  },
  'POST /manage/notice/save.json': function response(req, res) {
    var result = {
      status: 'succeed'
    };
    setTimeout(() => res.json(result), 500);
  },
  'POST /manage/notice/publish.json': function response(req, res) {
    var result = {
      'status': 'succeed'
    };
    setTimeout(() => res.json(result), 500);
  },
  'POST /manage/notice/discard.json': function response(req, res) {
    var result = {
      'status': 'succeed'
    };
    setTimeout(() => res.json(result), 500);
  },
  'POST /manage/notice/createAndPublish.json': function response(req, res) {
    var result = {
      'status': 'succeed'
    };
    setTimeout(() => res.json(result), 500);
  },
  'POST /manage/notice/saveAndPublish.json': function response(req, res) {
    var result = {
      'status': 'succeed'
    };
    setTimeout(() => res.json(result), 500);
  }
};
