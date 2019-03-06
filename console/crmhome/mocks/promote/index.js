var Mock = require('mockjs');
var fs = require('fs');
module.exports = {
  'GET /market/detail.json': function(req, res) {
    res.json({
      result: {
        data: {
          logo: '@image',
          title: '@csentence',
        }
      },
      status: 'success'
    });
  },
  'GET /configDetail.json': function(req, res) {
    res.json({
      'status|1': ["success", 'fail']
    })
  },
  'GET /activityDetail.json': function(req, res) {
    res.json({
      'status|1': ["success", 'fail']
    })
  },
  'GET /promote/confirm.json': function(req, res) {
    res.json({
      'status|1': ["success", 'fail']
    })
  },
  'GET /promote/reject.json': function(req, res) {
    res.json({
      'status|1': ["success", 'fail']
    })
  }
};
