module.exports = [{
  'shopId': /\d{10}/,
  'simpleShop|1': true,
  'shopName': /.{10,20}/,
  'activationCode': /\d{12}/,
  'address': /.{20,30}/,
  'posNum|0-100': 0,
  'shopState|1': 'open,pause,freeze,close'.split(','),
  'deviceList|0-10': [{
    'posSn': /\d{3}/,
    'posModel': /\w{2}-\w{3}\d{3}/,
    'posType|1': '手持,一体机,KDS,排队,预定'.split(','),
    'activationTime': '@datetime',
    'lastConnectTime': '@datetime',
    'mainDvFlag|1': true
  }]
}];
