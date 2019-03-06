module.exports = {
  'POST /manageAreaList.json': function(req, res) {
    const treeData = [
          { name: '杭州市', key: '0-0', n: 1},
          { name: '温州市', key: '0-1', n: 2},
          { name: '上海市', key: '0-2', n: 0, isLeaf: true},
    ];

    setTimeout(()=> {
      res.json({
        status: 'succeed',
        data: treeData,
      });
    }, 100);
  },

  'GET /manageCityList.json': function(req, res) {
    const query = req.query;
    const city = query.id === '0-1' ? [
          { name: '黄龙', key: '0-1-0', isLeaf: true },
          { name: '青芝坞', key: '0-1-1', isLeaf: true },
    ] : [{ name: '西湖', key: '0-0-0', isLeaf: true }];

    setTimeout(()=> {
      res.json({
        status: 'succeed',
        data: city,
      });
    }, 100);
  },
  'GET /manageCityDetail.json': function(req, res) {
    const query = req.query;
    var city = [];
    switch (query.id) {
    case '0-0' : city = [{ name: '杭州市', n: 1}];
      break;
    case '0-0-0' : city = [{ name: '西湖', t: '2016-10-13 18:34:36', memo: '西湖美景' }];
      break;
    case '0-1' : city = [{ name: '温州市', n: 2}];
      break;
    case '0-1-0' : city = [{ name: '黄龙', t: '2016-10-13 18:34:36', memo: '天目山路xxx号' }];
      break;
    case '0-1-1' : city = [{ name: '青芝坞', t: '2016-10-13 18:34:36', memo: '青芝坞' }];
      break;
    case '0-2' : city = [{ name: '上海市', n: 0}];
      break;
    default : city = [];
      break;
    }

    setTimeout(()=> {
      res.json({
        status: 'succeed',
        data: city,
      });
    }, 100);
  },
};
