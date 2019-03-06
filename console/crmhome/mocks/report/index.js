var Mock = require('mockjs');
var fs = require('fs');
module.exports = {
  'GET /*/getConfig.json': function(req, res) {
    var pageUri = req.query.pageUri;
    try {
      var pageDefault = JSON.parse((fs.readFileSync('./mocks/pages/' + pageUri + '/initial.json', 'utf-8')));
    } catch (e) {
      console.error('initial.json error');
    }
    res.json({
      result: {
        pageConfig: fs.readFileSync('./mocks/pages/' + pageUri + '/config.html', 'utf-8'),
        pageDefault: pageDefault
      },
      status: 'success'
    });
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
  }
};
