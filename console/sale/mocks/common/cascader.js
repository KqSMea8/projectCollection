module.exports = {
  'GET /cascader.json': function (req, res) {
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
};
