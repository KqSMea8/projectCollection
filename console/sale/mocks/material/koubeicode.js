/* eslint-disable */
'use strict';

const Mock = require('mockjs');

module.exports = {
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

  'GET /sale/material/koubeicode/hasbind/codelist.json'(req, res) {
    let ret = Mock.mock({
      ['data|10-150']: [
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
      });
    }, delay);
  },

  'GET /proxy.json'(req, res) {
    const { query } = req;
    const delay = Mock.mock('@integer(100, 1000)');
    switch (query.mappingValue) {
      case 'kbasset.queryKBCodeStuffTemplate':
      {
        if (query.bizSource === 'KOUBEI_CODE') {
          res.json({
            'data': {
              'data': [
                {
                  "stuffAttrId": "105000",//物料类型Id
                  "stuffAttrName": "桌贴",//物料类型
                  "stuffAttrNickName":"TABLE_PASTER_100_65",//物料类型别名，保证唯一
                  // 样式列表
                  "styleList": [{
                    "templateId": 123,//物料样式模板ID
                    "templateName": "口碑码-桌贴-模板1",//物料样式模板名称
                    "size": 160,//物料尺寸
                    "sizeName": "210*140mm",//物料尺寸名称
                    "resourceIds": ["/cm_merchant_attachment/T1bbFXXcJXXXagOFbX?t=jpg&xsig=cd76706abac791133293dce63aecb782"]//示例图
                  }]
                },{
                  "stuffAttrId": "105001",//物料类型Id
                  "stuffAttrName": "门贴",//物料类型
                  "stuffAttrNickName":"TABLE_PASTER_100_65",//物料类型别名，保证唯一
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
      }
        break;
      case 'kbasset.pageQueryKBCodeBatch':
      {
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
      }
      break;
      case 'kbasset.pageQueryKBCodeUnbindBatch':
      {
        const total = 73;
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
      }
      break;
      case 'kbasset.queryUnbindBatchCodeList':
      {
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
        }, delay);
      }
      break;
      default:
        setTimeout(() => {
          res.json({
            data: {},
            status: 'succeed'
          });
        }, delay);
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

  'GET /kbcode/searchAgentShops.json'(req, res) {
    const { shopName } = req.query;
    const delay = Mock.mock('@integer(100, 300)');
    const len = Mock.mock('@integer(2, 10)');
    setTimeout(() => {
      res.json(Mock.mock({
        "data": {
          ["data|" + len]: [{
            "shopId": "@string('number', 18)", //"2088201835715738",//门店ID
            "shopName": shopName + "@cword(3, 8)"//门店名称
          }],
          "resultCode": "",
          "resultMessage": "",
          "success": true
        },
        "operatorId": "999889157",
        "status": "succeed"
      }));
    }, delay);
  }
};
