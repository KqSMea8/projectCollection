/* eslint-disable */
'use strict';

const Mock = require('mockjs');
const KoubeiCode = require('./koubeicode');

const AcceptanceStaffData = {
  'data': [{
    'key': '2088102146888635',
    'staffName': '测试服务商',
    'ResTask': '2088102146888635',
  }],
  'status': 'succeed'
};

module.exports = {
  'GET /sale/leads/searchLeads.json': { 'data': { 'currentPage': 1, 'itemsPerPage': 10, 'queryResult': { 'shopLeadses': [{ 'address': '万体馆', 'bdName': 'xxxxx xxxxx', 'branchName': '黑乎乎202', 'brandName': '其它品牌', 'categoryName': '美食-中餐-湘菜', 'cityName': '上海城区', 'companyName': '还会尽快', 'contactsName': '看看加班', 'contactsPhone': '18616681717', 'districtName': '徐汇区', 'latitude': 31.183577, 'leadsId': '2016012800026845', 'level': '否', 'longitude': 121.43922, 'name': '空空旷旷', 'operatorId': '2088102164325969', 'provinceName': '上海市', 'statusCode': 'CLAIMED', 'statusDesc': '已认领' }, { 'address': '世纪公园', 'bdName': 'xxxxx xxxxx', 'branchName': '太长了', 'brandName': '呵呵咖啡', 'categoryName': '美食-中餐-湘菜', 'cityName': '上海城区', 'companyName': '呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵呵', 'contactsName': '吞吞吐吐发展和谐社会', 'contactsPhone': '18551255253', 'districtName': '浦东新区', 'latitude': 31.221604, 'leadsId': '2016012800026847', 'level': '否', 'longitude': 121.549248, 'name': '太长了', 'operatorId': '2088102164325969', 'provinceName': '上海市', 'statusCode': 'CLAIMED', 'statusDesc': '已认领' }, { 'address': 'Ffa', 'bdName': 'xxxxx xxxxx', 'branchName': 'Dd', 'brandName': 'm+咖啡馆', 'categoryName': '美食-搜索测试二级类目-搜索测试三级级类目', 'cityName': '上海郊县', 'companyName': 'Dfs', 'contactsName': 'ygmnfl', 'contactsPhone': '13466667678', 'districtName': '崇明县', 'latitude': 31.623587, 'leadsId': '2016012800029779', 'level': '否', 'longitude': 121.397417, 'name': '娜娜法国更好发言稿法国哈哈哈法国哈哈', 'operatorId': '2088102164325969', 'provinceName': '上海市', 'statusCode': 'CLAIMED', 'statusDesc': '已认领' }, { 'address': '民生路路1199弄', 'bdName': 'xxxxx xxxxx', 'branchName': '民生路店', 'brandName': '可C可D', 'categoryName': '美食-中餐-西北菜', 'cityName': '上海城区', 'companyName': '局长', 'contactsName': '星远', 'contactsPhone': '18621342578', 'districtName': '杨浦区', 'latitude': 30.287459, 'leadsId': '2016012800029780', 'level': '否', 'longitude': 120.153576, 'name': '星远', 'operatorId': '2088102164325969', 'provinceName': '上海市', 'statusCode': 'CLAIMED', 'statusDesc': '已认领' }, { 'address': '河间路640号', 'bdName': 'xxxxx xxxxx', 'branchName': '很长的名字方法法国哈哈方法刚刚好反复更改', 'brandName': '法国CASTEL家族酒庄', 'categoryName': '美食-中餐-湘菜', 'cityName': '上海郊县', 'companyName': '刚刚', 'contactsName': '南山', 'contactsPhone': '15655555556', 'districtName': '崇明县', 'latitude': 31.479792, 'leadsId': '2016012800029783', 'level': '否', 'longitude': 121.831208, 'name': '鱼', 'operatorId': '2088102164325969', 'provinceName': '上海市', 'statusCode': 'CLAIMED', 'statusDesc': '已认领' }, { 'address': '支付宝28血站', 'bdName': ' xxxxx', 'branchName': '天下第一', 'brandName': '大口九茶饮', 'categoryName': '美食-汤/粥/煲/砂锅/炖菜-川菜', 'cityName': '上海城区', 'companyName': '阿里巴巴', 'contactsName': '特木', 'contactsPhone': '13265327861', 'districtName': '黄浦区', 'latitude': 31, 'leadsId': '2016012800029788', 'level': '否', 'longitude': 121, 'name': '肯德基abc0013', 'operatorId': '2088102164325969', 'provinceName': '上海市', 'statusCode': 'CLAIMED', 'statusDesc': '已认领' }, { 'address': '支付宝28血站', 'bdName': ' xxxxx', 'branchName': '天下第一', 'brandName': '大口九茶饮', 'categoryName': '美食-汤/粥/煲/砂锅/炖菜-川菜', 'cityName': '上海城区', 'companyName': '阿里巴巴', 'contactsName': '特木', 'contactsPhone': '13265327861', 'districtName': '黄浦区', 'latitude': 31, 'leadsId': '2016012800029787', 'level': '否', 'longitude': 121, 'name': '肯德基abc0012', 'operatorId': '2088102164325969', 'provinceName': '上海市', 'statusCode': 'CLAIMED', 'statusDesc': '已认领' }, { 'address': '支付宝28血站', 'bdName': 'xxxxx xxxxx', 'branchName': '天下第一', 'brandName': '大口九茶饮', 'categoryName': '美食-汤/粥/煲/砂锅/炖菜-川菜', 'cityName': '上海城区', 'companyName': '阿里巴巴', 'contactsName': '特木', 'contactsPhone': '13265327861', 'districtName': '黄浦区', 'latitude': 31, 'leadsId': '2016012800029786', 'level': '否', 'longitude': 121, 'name': '肯德基abc0011', 'operatorId': '2088102164325969', 'provinceName': '上海市', 'statusCode': 'CLAIMED', 'statusDesc': '已认领' }, { 'address': '支付宝28血站', 'bdName': ' xxxxx', 'branchName': '天下第一', 'brandName': '大口九茶饮', 'categoryName': '美食-汤/粥/煲/砂锅/炖菜-川菜', 'cityName': '上海城区', 'companyName': '阿里巴巴', 'contactsName': '特木', 'contactsPhone': '13265327861', 'districtName': '黄浦区', 'latitude': 31, 'leadsId': '2016012800029791', 'level': '否', 'longitude': 121, 'name': '肯德基abc0016', 'operatorId': '2088102164325969', 'provinceName': '上海市', 'statusCode': 'CLAIMED', 'statusDesc': '已认领' }, { 'address': '支付宝28血站', 'bdName': ' xxxxx', 'branchName': '天下第一', 'brandName': '大口九茶饮', 'categoryName': '美食-汤/粥/煲/砂锅/炖菜-川菜', 'cityName': '上海城区', 'companyName': '阿里巴巴', 'contactsName': '特木', 'contactsPhone': '13265327861', 'districtName': '黄浦区', 'latitude': 31, 'leadsId': '2016012800029792', 'level': '否', 'longitude': 121, 'name': '肯德基abc0017', 'operatorId': '2088102164325969', 'provinceName': '上海市', 'statusCode': 'CLAIMED', 'statusDesc': '已认领' }] }, 'success': true, 'totalCount': 30, 'totalPages': 4 }, 'leadsSearchConditionForm': { 'brandId': '', 'categoryId': '', 'cityCode': '', 'companyName': '', 'districtCode': '', 'leadsId': '', 'leadsLevel': '', 'leadsStatus': '', 'name': '', 'pageNum': 1, 'pageSize': 10, 'provinceCode': '', 'searchType': 'PRIVATE' }, 'power': ['LEADS_RELEASE', 'LEADS_QUERY', 'LEADS_ALLOCATE', 'LEADS_MODIFY'], 'status': 'succeed' },
  'GET /allocator.json'(req, res) {
    setTimeout(() => {
      res.json({
        shop: [{
          name: 'shop1'
        }, {
          name: 'shop2'
        }],
        employee: [{
          name: 'employee1'
        }, {
          name: 'employee2'
        }]
      });
    }, 100);
  },


  'GET /getBrand.json'(req, res) {
    setTimeout(() => {
      res.json({
        data: ['外婆家', '小肥羊', '肯德基']
      });
    }, 100);
  },


  'GET /sale/material/AcceptanceStaff.json'(req, res) {
    res.json(AcceptanceStaffData);
  },

  'GET /material/List.json'(req, res) {
    const total = 40;
    const query = req.query;
    const ret = [];
    const pageSize = parseInt(query.pageSize, 10);
    const current = parseInt(query.pageNum, 10);
    const start = (current - 1) * pageSize;
    for (let i = start; i < Math.min(start + pageSize, total); i++) {
      const list = {
        'id': i,
        'materType': 'KA(商户名称)' + i,
        'materAddress': '上海',
        'materId': '模版名称模版名称',
        'materName': '12345454' + i,
        'materProperty': '活动物料',
        'materialType': '海报',
        'materCode': '生效中',
        'materA': '2000',
        'materB': '2000',
        'materC': '80000',
        'materD': '59000',
        'materE': '1000',
        'materF': '100',
      };
      ret.push(list);
    }
    setTimeout(() => {
      res.json({
        data: ret,
        totalCount: total,
      });
    }, 500);
  },
  'GET /sale/leads/searchId.json'(req, res) {
    const ret = [];
    for (let i = 0; i < 3; i++) {
      const data = {
        'id': i,
        'materType': 'KA(商户名称)' + i,
        'materAddress': '上海',
        'materId': '模版名称模版名称',
        'materName': '12345454' + i,
        'materProperty': '活动物料',
        'materialType': '海报',
        'materCode': '生效中',
        'materA': '2000',
        'materB': '2000',
        'materC': '80000',
        'materD': '59000',
        'materE': '1000',
        'materF': '200',
      };
      ret.push(data);
    }
    setTimeout(() => {
      res.json({
        'ok': '3',
        'data': ret,
      });
    }, 100);
  },

  'GET /sale/material/qrcode.json'(req, res) {
    const ret = [];
    for (let i = 0; i < 3; i++) {
      const data = {
        'id': i,
        'applyTime': '2016-10-11 14:35:35',
        'applyPerson': '真名(花名)',
        'qrcodeType': '空码',
        'memo': '备注',
      };
      ret.push(data);
    }
    setTimeout(() => {
      res.json({
        'data': ret,
      });
    }, 100);
  },

  'GET /sale/material/koubeicode/apply/record.json'(req, res) {
    const { query } = req;
    const { pageSize, pageNum, applicantId, stuffAttrId } = query;
    const total = 46;
    const remain = total - pageSize * (pageNum - 1);
    const len = remain < pageSize ? remain : pageSize;
    const data = Mock.mock({
      ['data|' + len]: [{
        'applicant': '@name', // 申请人名称
        'applicantId': applicantId,// 申请人id
        'applicantType': 'BUC', // 账号类型
        'bindType': '1', // 绑定方式
        'codeDownloadURL': 'https://os.alipayobjects.com/kbasset/64441C20-5E21-5E46FE299EE7_UNBIND_QRCODE_2017022.zip\n', // 码下载的url
        'codeURLDownloadURL': 'https://os.alipayobjects.com/kbasset/64441C20-5E21-5E46FE299EE7_UNBIND_QRCODE_2017022.zip\n', // 码URL的下载url
        'gmtCreate': new Date().getTime(), // 创建时间
        'batchId': 200, // 生成批次
        'quantity': 5, // 生成数量
        'remark': '@string(10, 20)', // 备注
        'status': 'COMPLETED', // 生成状态
        'stuffAttrId': 'EMPTY', // 物料类型
      }],
      'resultCode': '',
      'resultMessage': '',
      'success': true,
      'totalSize': total
    });

    setTimeout(() => {
      res.json({
        status: 'succeed',
        operatorId: '999889157',
        data,
      });
    }, 100);
  },

  'GET /sale/material/koubeicode/hasbind.json'(req, res) {
    const total = 73;
    const { query } = req;
    const { pageNum, pageSize } = query;
    let length;
    const remain = total - (pageNum - 1) * pageSize;
    if (remain > pageSize) {
      length = pageSize;
    } else if (remain <= 0) {
      length = 0;
    } else {
      length = remain;
    }
    let ret = Mock.mock({
      ['data|' + length]: [
        {
          'id|+1': 1,
          shopName: '@csentence(5, 20)',
          shopId: '@string("number", 16)',
          merchantName: '@csentence(5, 20)',
          merchantPid: '@string("number", 16)',
          bindCodeCount: '@integer(1, 75)',
          bindShopCount: '@integer(1, 75)',
          downloadUrl: '',
        }
      ]
    });
    const delay = Mock.mock('@integer(100, 1000)');
    setTimeout(() => {
      res.json({
        status: 'succeed',
        total,
        data: ret.data,
      });
    }, delay);
  },

  'GET /sale/material/koubeicode/tobind/list.json'(req, res) {
    const total = 73;
    const { query } = req;
    const { pageNum, pageSize } = query;
    let length;
    const remain = total - (pageNum - 1) * pageSize;
    if (remain > pageSize) {
      length = pageSize;
    } else if (remain <= 0) {
      length = 0;
    } else {
      length = remain;
    }
    const ret = Mock.mock({
      ['data|' + length]: [
        {
          'applicant': '@cname',//申请人名称
          'applicantId': '@string("number", 8)',//申请人id
          'applicantType': 'BUC',//账号类型
          'bindType': '1',//绑定方式
          'codeDownloadURL': 'https://os.alipayobjects.com/kbasset/64441C20-5E21-5E46FE299EE7_UNBIND_QRCODE_2017022.zip\n',//码下载的url
          'codeURLDownloadURL': 'https://os.alipayobjects.com/kbasset/64441C20-5E21-5E46FE299EE7_UNBIND_QRCODE_2017022.zip\n',//码URL的下载url
          'gmtCreate': new Date().getTime(),//创建时间
          'batchId|+1': 200,//生成批次
          'quantity': '@integer(5, 50)',//生成数量
          'unbindNum': '@integer(5, 50)',//待绑定数量
          'remark': '@csentence(10, 20)',//备注
          'status': 'COMPLETED',//生成状态
          'stuffAttrId': 'EMPTY'//物料类型
        }
      ],
      'resultCode': '',
      'resultMessage': '',
      'success': true,
      'totalSize': total
    });
    const delay = Mock.mock('@integer(100, 1000)');
    setTimeout(() => {
      res.json({
        status: 'succeed',
        operatorId: '999889157',
        data: ret,
      });
    }, delay);
  },

  'GET /sale/material/koubeicode/shop/code/list.json'(req, res) {
    const total = 32;
    const ret = Mock.mock({
      ['data|' + total]: [
        {
          'id|+1': 1,
          codeUrl: '@url',
          materialType: '@integer(1, 3)',
          materialImage: '@image("40x40")',
          qrcodeNo: '@string("upper", 16)'
        },
      ]
    });
    const delay = Mock.mock('@integer(100, 1000)');
    setTimeout(() => {
      res.json({
        status: 'succeed',
        total,
        data: ret.data,
      });
    }, 100);
  },

  'GET /sale/material/koubeicode/hasbind.json'(req, res) {
    const { query } = req;
    let ret;
    if (query.pageNum > 10) {
      ret = {
        data: []
      };
    } else {
      ret = Mock.mock({
        'data|10': [
          {
            id: '@string("number", 16)',
            shopName: '@csentence(5, 20)',
            shopId: '@string("number", 16)',
            merchantName: '@csentence(5, 20)',
            merchantPid: '@string("number", 16)',
            bindCodeCount: '@integer(1, 75)',
            bindShopCount: '@integer(1, 75)',
            downloadUrl: '',
          }
        ]
      });
    }
    const delay = Mock.mock('@integer(100, 1000)');
    setTimeout(() => {
      res.json({
        status: 'succeed',
        total: 10,
        data: ret.data,
      })
    }, delay);
  },

  'GET /sale/material/koubeicode/hasbind/codelist.json'(req, res) {
    const total = 73;
    const { query } = req;
    const { pageNum, pageSize } = query;
    let length;
    const remain = total - (pageNum - 1) * pageSize;
    if (remain > pageSize) {
      length = pageSize;
    } else if (remain <= 0) {
      length = 0;
    } else {
      length = remain;
    }
    let ret = Mock.mock({
      ['data|' + length]: [
        {
          'id|+1': 1,
          qrCodeSn: '@string("number", 16)',
          thumbnail: '@image("100x100")',
          'style|1': [
            'table',
            'door',
            'raw'
          ],
          'styleSize|1': [
            '10cm * 6.4cm',
            '20cm * 12.8cm',
          ],
          operatorName: '@cname',
          operatorPhone: '1@string("number", 10)',
          operationTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
          bindSn: '@word(3)-@string("number", 2)',
          batchNo: '@string("number", 16)',
          codeUrl: '@image',
        }
      ]
    });
    const delay = Mock.mock('@integer(100, 1000)');
    setTimeout(() => {
      res.json({
        status: 'succeed',
        data: ret.data,
        total,
      });
    }, delay);
  },

  'GET /proxy.json'(req, res) {
    const { query } = req;
    if (query.mappingValue === 'kbasset.queryKBCodeStuffTemplate' && query.bizSource === 'KOUBEI_CODE') {
      res.json({
        'data': {
          'data': [
            {
              "stuffAttrId": "105000",//物料类型Id
              "stuffAttrName": "桌贴",//物料类型
              "stuffAttrNickName": "TABLE_PASTER_100_65",//物料类型别名，保证唯一
              // 样式列表
              "styleList": [{
                "templateId": 123,//物料样式模板ID
                "templateName": "口碑码-桌贴-模板1",//物料样式模板名称
                "size": 160,//物料尺寸
                "sizeName": "210*140mm",//物料尺寸名称
                "resourceIds": ["/cm_merchant_attachment/T1bbFXXcJXXXagOFbX?t=jpg&xsig=cd76706abac791133293dce63aecb782"]//示例图
              }]
            }, {
              "stuffAttrId": "105001",//物料类型Id
              "stuffAttrName": "门贴",//物料类型
              "stuffAttrNickName": "TABLE_PASTER_100_65",//物料类型别名，保证唯一
              //样式列表
              "styleList": [{
                "templateId": 124,//物料样式模板ID
                "templateName": "口碑码-门贴-模板1",//物料样式模板名称
                "size": 160,//物料尺寸
                "sizeName": "210*140mm",//物料尺寸名称
                "resourceIds": ["/cm_merchant_attachment/T1bbFXXcJXXXagOFbX?t=jpg&xsig=cd76706abac791133293dce63aecb782"]//示例图
              }]
            }
          ],
          'resultCode': '',
          'resultMessage': '',
          'success': true,
          'totalSize': 1
        },
        'operatorId': '999889157',
        'status': 'succeed'
      });
    }
  },

  'POST /kbcode/bindCodeExcelUpload.json'(req, res) {
    const delay = 3000;
    setTimeout(() => {
      res.json({
        data: 1001,
        status: 'succeed',
      });
    }, delay);
  },
  'GET /kbcode/queryAppImportAgentShops.json'(req, res) {
    setTimeout(() => {
      res.json({
        data: {
          "totalCount": 7,//门店总数量
          "shopList": [/*{
            id: 'sz', name: '深圳市',
            children: [{
              id: 'sz-lh', name: '罗湖区',
              children: [{
                id: 'sz-lh-01', name: '肯德基（罗湖口岸店）', tableCnt: 11,
              }, {
                id: 'sz-lh-02', name: '肯德基（上海林店）', tableCnt: 20,
              }, {
                id: 'sz-lh-03', name: '肯德基（水贝珠宝店）', tableCnt: 80,
              }],
            }, {
              id: 'sz-ft', name: '福田区',
              children: [{
                id: 'sz-ft-01', name: '肯德基（胡天店）', tableCnt: 52,
              }, {
                id: 'sz-ft-02', name: '肯德基（基佬店）', tableCnt: 23,
              }],
            }],
          }, */{
              id: 'sh', name: '上海',
              children: [{
                id: 'sh-hp', name: '黄浦区', children: []
              },
              {
                id: 'sh-j\'an', name: '静安区', children: [{
                  id: 'sh-j\'an-01', name: '肯德基（百乐门店）', tableCnt: 30,
                },
                {
                  id: 'sh-j\'an-02', name: '肯德基（吴江路店）', tableCnt: 50,
                },
                ],
              }]
            }],
        },
        "resultCode": "",
        "resultMessage": "",
        "success": true
      });
    }, 2000);
  }
};
