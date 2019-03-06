 // 根config只提供root配置
const mockjs = require('mockjs');
module.exports = {
  "GET /material/picUpload.json": function(req, res) {
    res.json({"imgModel":{"matGroup":{"id":658,"gmtModified":"Wed May 27 10:30:29 CST 2015","gmtCreate":"Wed May 27 10:30:29 CST 2015","name":"未分类","merchantId":"2088211521646673"},"materialList":[{"id":0,"operatorType":"MERCHANT","groupId":658,"operatorId":"2088211521646673","name":"屏幕快照 2016-11-24 下午9.32.35.png","merchantId":"2088211521646673","properties":{"fileId":"VWUGFRcGQreu6iIAXC0gmwAAACMAAQED","md5":"0fa6f5523319310d5713a876bd5b2cf9","imgX":"1950","imgY":"872","suffix":"png"},"type":{},"url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=VWUGFRcGQreu6iIAXC0gmwAAACMAAQED&amp;token=2075urapWLhqVpfyYs_zdQABUYAAAAFYtOLSkgAAACMAAQED&amp;timestamp=1480574496090&amp;acl=9432d3c0bc0eebb9166637e278fab774&amp;zoom=original","sourceId":"VWUGFRcGQreu6iIAXC0gmwAAACMAAQED"}]},"success":true});
  },
  "GET /material/pageMaterial.json": function(req, res) {
    this.request = {
      pageNum: 1,
      op_merchant_id: '',
    };
    res.json({"pageInfo":{"pageSize":20,"currentPage":1,"totalSize":4852},"materialVOList":[{"id":27913522,"groupId":658,"auditStatus":"0","name":"屏幕快照 20d16-11-24 下午9.32.35.png","merchantId":"2088211521646673","type":"img","url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=VWUGFRcGQreu6iIAXC0gmwAAACMAAQED&amp;token=2075urapWLhqVpfyYs_zdQABUYAAAAFYtOLSkgAAACMAAQED&amp;timestamp=1480574617369&amp;acl=251cc07ec736d7cfe8050a7c611854b1&amp;zoom=original","sourceId":"VWUGFRcGQreu6iIAXC0gmwAAACMAAQED","previewUrl":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=8611sBJIR-WD_9yxXMHIYQAAACMAAQED&amp;zoom=original"},{"id":27913305,"groupId":658,"auditStatus":"0","name":"cutImg.jpeg","merchantId":"2088211521646673","type":"img","url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=NDy-EQljTf2NmTCQwpWWpgAAACMAAQQD&amp;token=2075urapWLhqVpfyYs_zdQABUYAAAAFYtOLSkgAAACMAAQED&amp;timestamp=1480574617371&amp;acl=47d8d5e2b21a104ce941f0880bb98aa6&amp;zoom=original","sourceId":"NDy-EQljTf2NmTCQwpWWpgAAACMAAQQD","previewUrl":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=8611sBJIR-WD_9yxXMHIYQAAACMAAQED&amp;zoom=original"},{"id":27913296,"groupId":658,"auditStatus":"0","name":"菜.jpg","merchantId":"2088211521646673","type":"img","url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=CWe3nJA2TFud2ESVA7PbVgAAACMAAQQD&amp;token=2075urapWLhqVpfyYs_zdQABUYAAAAFYtOLSkgAAACMAAQED&amp;timestamp=1480574617372&amp;acl=b078e5fffa4bf8a665ad50bc7340e5b8&amp;zoom=original","sourceId":"CWe3nJA2TFud2ESVA7PbVgAAACMAAQQD","previewUrl":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=8611sBJIR-WD_9yxXMHIYQAAACMAAQED&amp;zoom=original"},{"id":27910360,"groupId":658,"auditStatus":"0","name":"cutImg.jpeg","merchantId":"2088211521646673","type":"img","url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=hSnd5RmzQJavaqsIfTkyYgAAACMAAQQD&amp;token=2075urapWLhqVpfyYs_zdQABUYAAAAFYtOLSkgAAACMAAQED&amp;timestamp=1480574617373&amp;acl=c0a0eefaac963b99637280fcb4088bd4&amp;zoom=original","sourceId":"hSnd5RmzQJavaqsIfTkyYgAAACMAAQQD","previewUrl":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=8611sBJIR-WD_9yxXMHIYQAAACMAAQED&amp;zoom=original"},{"id":27910356,"groupId":658,"auditStatus":"0","name":"菜.jpg","merchantId":"2088211521646673","type":"img","url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=crOXjwcoQTydQaihLcmZngAAACMAAQQD&amp;token=2075urapWLhqVpfyYs_zdQABUYAAAAFYtOLSkgAAACMAAQED&amp;timestamp=1480574617374&amp;acl=c6bee1822f5decab911404b2fd1e45f5&amp;zoom=original","sourceId":"crOXjwcoQTydQaihLcmZngAAACMAAQQD","previewUrl":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=8611sBJIR-WD_9yxXMHIYQAAACMAAQED&amp;zoom=original"},{"id":27907537,"groupId":658,"auditStatus":"0","name":"cutImg.png","merchantId":"2088211521646673","type":"img","url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=VOvnpg0ZS762kP_dUWCAfgAAACMAAQED&amp;token=2075urapWLhqVpfyYs_zdQABUYAAAAFYtOLSkgAAACMAAQED&amp;timestamp=1480574617375&amp;acl=95d67c0208b3fcee199c4459ba51daad&amp;zoom=original","sourceId":"VOvnpg0ZS762kP_dUWCAfgAAACMAAQED","previewUrl":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=8611sBJIR-WD_9yxXMHIYQAAACMAAQED&amp;zoom=original"},{"id":27907531,"groupId":658,"auditStatus":"0","name":"桶 拷贝 2.png","merchantId":"2088211521646673","type":"img","url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=o1jFQUITRsKZY-6C0KAp6wAAACMAAQED&amp;token=2075urapWLhqVpfyYs_zdQABUYAAAAFYtOLSkgAAACMAAQED&amp;timestamp=1480574617376&amp;acl=0cc9dc561e430bc7ee9f4d8d7c3757be&amp;zoom=original","sourceId":"o1jFQUITRsKZY-6C0KAp6wAAACMAAQED","previewUrl":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=8611sBJIR-WD_9yxXMHIYQAAACMAAQED&amp;zoom=original"},{"id":27893454,"groupId":658,"auditStatus":"0","name":"cutImg.jpeg","merchantId":"2088211521646673","type":"img","url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=bVDaJw-rQOSjIsFZ2RehnwAAACMAAQQD&amp;token=2075urapWLhqVpfyYs_zdQABUYAAAAFYtOLSkgAAACMAAQED&amp;timestamp=1480574617377&amp;acl=8570419c120454161c854f8ebd0ac328&amp;zoom=original","sourceId":"bVDaJw-rQOSjIsFZ2RehnwAAACMAAQQD","previewUrl":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=8611sBJIR-WD_9yxXMHIYQAAACMAAQED&amp;zoom=original"},{"id":27893446,"groupId":658,"auditStatus":"0","name":"123.jpg","merchantId":"2088211521646673","type":"img","url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=8n-pjhpPSD2E0OWsVLyK8gAAACMAAQQD&amp;token=2075urapWLhqVpfyYs_zdQABUYAAAAFYtOLSkgAAACMAAQED&amp;timestamp=1480574617378&amp;acl=77bef8e34ab5d9f3b530a993fc0bca7b&amp;zoom=original","sourceId":"8n-pjhpPSD2E0OWsVLyK8gAAACMAAQQD","previewUrl":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=8611sBJIR-WD_9yxXMHIYQAAACMAAQED&amp;zoom=original"},{"id":27893397,"groupId":658,"auditStatus":"0","name":"cutImg.jpeg","merchantId":"2088211521646673","type":"img","url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=eJbZFkY8RKmiCxgfb7_dKwAAACMAAQQD&amp;token=2075urapWLhqVpfyYs_zdQABUYAAAAFYtOLSkgAAACMAAQED&amp;timestamp=1480574617379&amp;acl=7aa65ff6360db9c46467836c2a552c38&amp;zoom=original","sourceId":"eJbZFkY8RKmiCxgfb7_dKwAAACMAAQQD","previewUrl":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=8611sBJIR-WD_9yxXMHIYQAAACMAAQED&amp;zoom=original"},{"id":27893395,"groupId":658,"auditStatus":"0","name":"123.jpg","merchantId":"2088211521646673","type":"img","url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=u41CsXGrQ7KNh-q6upUK6wAAACMAAQQD&amp;token=2075urapWLhqVpfyYs_zdQABUYAAAAFYtOLSkgAAACMAAQED&amp;timestamp=1480574617380&amp;acl=d4d555caee93647aeea6f2559e59524d&amp;zoom=original","sourceId":"u41CsXGrQ7KNh-q6upUK6wAAACMAAQQD","previewUrl":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=8611sBJIR-WD_9yxXMHIYQAAACMAAQED&amp;zoom=original"},{"id":27867798,"groupId":658,"auditStatus":"0","name":"cutImg.jpeg","merchantId":"2088211521646673","type":"img","url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=HNZF4iPfTl-LgdRNO7xRSQAAACMAAQQD&amp;token=2075urapWLhqVpfyYs_zdQABUYAAAAFYtOLSkgAAACMAAQED&amp;timestamp=1480574617381&amp;acl=12ced9707add85029cc7269dd5bec04a&amp;zoom=original","sourceId":"HNZF4iPfTl-LgdRNO7xRSQAAACMAAQQD","previewUrl":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=8611sBJIR-WD_9yxXMHIYQAAACMAAQED&amp;zoom=original"},{"id":27867797,"groupId":658,"auditStatus":"0","name":"image.jpeg","merchantId":"2088211521646673","type":"img","url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=bY2w5VlvSTigoBkmgEJjRgAAACMAAQQD&amp;token=2075urapWLhqVpfyYs_zdQABUYAAAAFYtOLSkgAAACMAAQED&amp;timestamp=1480574617383&amp;acl=ff8edd52017c0ce0d1ddf6332019c9fb&amp;zoom=original","sourceId":"bY2w5VlvSTigoBkmgEJjRgAAACMAAQQD","previewUrl":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=8611sBJIR-WD_9yxXMHIYQAAACMAAQED&amp;zoom=original"},{"id":27867092,"groupId":658,"auditStatus":"0","name":"cutImg.jpeg","merchantId":"2088211521646673","type":"img","url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=lodtXSviQlOik-imkox7xwAAACMAAQQD&amp;token=2075urapWLhqVpfyYs_zdQABUYAAAAFYtOLSkgAAACMAAQED&amp;timestamp=1480574617384&amp;acl=1a0d13ee69eb603e2f57c1202b603d50&amp;zoom=original","sourceId":"lodtXSviQlOik-imkox7xwAAACMAAQQD","previewUrl":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=8611sBJIR-WD_9yxXMHIYQAAACMAAQED&amp;zoom=original"},{"id":27867088,"groupId":658,"auditStatus":"0","name":"image.jpeg","merchantId":"2088211521646673","type":"img","url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=bDVE20YeRSK4fY_BZGd3gQAAACMAAQQD&amp;token=2075urapWLhqVpfyYs_zdQABUYAAAAFYtOLSkgAAACMAAQED&amp;timestamp=1480574617385&amp;acl=c14a63e79a9f5529f7d0fd50e5516384&amp;zoom=original","sourceId":"bDVE20YeRSK4fY_BZGd3gQAAACMAAQQD","previewUrl":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=8611sBJIR-WD_9yxXMHIYQAAACMAAQED&amp;zoom=original"},{"id":27866739,"groupId":658,"auditStatus":"0","name":"cutImg.jpeg","merchantId":"2088211521646673","type":"img","url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=AP12XbpcTTiRjXmsLBu9FwAAACMAAQQD&amp;token=2075urapWLhqVpfyYs_zdQABUYAAAAFYtOLSkgAAACMAAQED&amp;timestamp=1480574617387&amp;acl=e5e462adae68782519528911bb7a054c&amp;zoom=original","sourceId":"AP12XbpcTTiRjXmsLBu9FwAAACMAAQQD","previewUrl":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=8611sBJIR-WD_9yxXMHIYQAAACMAAQED&amp;zoom=original"},{"id":27866734,"groupId":658,"auditStatus":"0","name":"924X380-1.jpg","merchantId":"2088211521646673","type":"img","url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=51NpqSpISRezT7kSq2801QAAACMAAQQD&amp;token=2075urapWLhqVpfyYs_zdQABUYAAAAFYtOLSkgAAACMAAQED&amp;timestamp=1480574617388&amp;acl=1f544bbd1772119c784511f860bf4977&amp;zoom=original","sourceId":"51NpqSpISRezT7kSq2801QAAACMAAQQD","previewUrl":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=8611sBJIR-WD_9yxXMHIYQAAACMAAQED&amp;zoom=original"},{"id":27866714,"groupId":658,"auditStatus":"0","name":"cutImg.png","merchantId":"2088211521646673","type":"img","url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=SEAiv8OHR76soUvfa9zM2AAAACMAAQQD&amp;token=2075urapWLhqVpfyYs_zdQABUYAAAAFYtOLSkgAAACMAAQED&amp;timestamp=1480574617389&amp;acl=a019f21177da626b692b7a1c98228f42&amp;zoom=original","sourceId":"SEAiv8OHR76soUvfa9zM2AAAACMAAQQD","previewUrl":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=8611sBJIR-WD_9yxXMHIYQAAACMAAQED&amp;zoom=original"},{"id":27866717,"groupId":658,"auditStatus":"0","name":"cutImg.png","merchantId":"2088211521646673","type":"img","url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=_89Bo2P6QNOwu1Cyia_8ZAAAACMAAQQD&amp;token=2075urapWLhqVpfyYs_zdQABUYAAAAFYtOLSkgAAACMAAQED&amp;timestamp=1480574617390&amp;acl=bb33f3e64689cf493df110fa3ead1ff7&amp;zoom=original","sourceId":"_89Bo2P6QNOwu1Cyia_8ZAAAACMAAQQD","previewUrl":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=8611sBJIR-WD_9yxXMHIYQAAACMAAQED&amp;zoom=original"},{"id":27866709,"groupId":658,"auditStatus":"0","name":"1.PNG","merchantId":"2088211521646673","type":"img","url":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=UPj2_4usRMyuCJrAUGwRJwAAACMAAQQD&amp;token=2075urapWLhqVpfyYs_zdQABUYAAAAFYtOLSkgAAACMAAQED&amp;timestamp=1480574617391&amp;acl=77a4708be5b837cada8333a2b1e411f5&amp;zoom=original","sourceId":"UPj2_4usRMyuCJrAUGwRJwAAACMAAQQD","previewUrl":"https://dl.django.t.taobao.com/rest/1.0/image?fileIds=8611sBJIR-WD_9yxXMHIYQAAACMAAQED&amp;zoom=original"}],"success":true,"materialRequest":{"pageSize":20,"imgX":1000,"imgY":1000,"pageNum":1}})
  },
  "GET /material/editMaterial.json": function(req, res) {
    this.request = {
      id: '1480574617000',
      name: '屏幕快照 20d16-11-24 下午9.32.35.png',
      timestamp: Date.now(),
      op_merchant_id: '',
    }
    res.json({"materialForm":{"id":27913522,"groupId":0,"status":0,"name":"屏幕快照 20d16-11-24 下午9.32.35.png","merchantId":"2088211521646673"},"success":true})
  },
  "GET /material/delMaterial.json": function(req, res) {
    this.request = {
      timestamp:1480574719000,
      id:27893454,
      materalID:27893454,
      op_merchant_id: '',
    }
    res.json({success: true});
  },
  "GET /queryRootCategoryList.json": function (req, res) {
    this.request = {
      root: 'http://baidu.com',
      url: 'hello.word',
      method: 'post',
      data: {
        data:JSON.stringify({ ceshi: 'gogogo'}),
      }
    } // 根目录提供 root url method data 配置
    setTimeout(() => {
      res.json({
        "resultMsg": "",
        "resultCode": "",
        "status": "succeed",
        "result": [
          {
            "id": "2015050700000000",
            "name": "美食配置",
            "type": "DISH",
            "typeName": "菜品菜单"
          }, {
            "id": "2015050700000001",
            "name": "丽人",
            "type": "BEAUTI",
            "typeName": "作品"
          }
        ],
      });
    }, 500);
  },
  "POST /shop/createShopGoodsPics.json": function(req, res) {
    setTimeout(() => {
      res.json({
        "resultMsg": "",
        "resultCode": "succeed",
        "result": "true",
        "status": "succeed"
      });
    }, 500);
  },
  "GET /shop/kbmenu/shopQuery.json": function(req, res) {

  },
  'GET /shop/crm/shopDetailConfig.json': function(req, res) {
    this.request = {
      data: {
        shopId: '2016111000077000000003446524',
      }
    }
  },
  "GET /shop/queryShopGoodsPics.json": function(req, res) {
    this.request = {
      data: {
        shopId: '2016111000077000000003446524',
      }
    }
     setTimeout(() => {
      res.json({
        "currentPage": 1,
        "data": [
          {
            "id": "1",
            "dishId": "2016081003445419",
            "dishName": "sdfsd",
            "pictureFileId": "-a_3jK0LTa-82aZoFP1v_AAAACMAAQED",
            "pictureURL": "http://dl.django.t.taobao.com/rest/1.0/image?fileIds=-a_3jK0LTa-82aZoFP1v_AAAACMAAQED&token=MRr0EfDBxcCQoBli1fnwhAABUYAAAAFWc5vXAwAAACMAAQED&timestamp=1470826242142&acl=d7e37dd4256eb4bc356c7bfe035f0ef7&zoom=original"
          },
          {
            "id": "2",
            "dishId": "2016081003444261",
            "dishName": "sdfsd",
            "pictureFileId": "-a_3jK0LTa-82aZoFP1v_AAAACMAAQED",
            "pictureURL": "http://dl.django.t.taobao.com/rest/1.0/image?fileIds=-a_3jK0LTa-82aZoFP1v_AAAACMAAQED&token=MRr0EfDBxcCQoBli1fnwhAABUYAAAAFWc5vXAwAAACMAAQED&timestamp=1470826242142&acl=d7e37dd4256eb4bc356c7bfe035f0ef7&zoom=original"
          },
          {
            "id": "3",
            "dishId": "2016081003442822",
            "dishName": "sdfsd",
            "pictureFileId": "-a_3jK0LTa-82aZoFP1v_AAAACMAAQED",
            "pictureURL": "http://dl.django.t.taobao.com/rest/1.0/image?fileIds=-a_3jK0LTa-82aZoFP1v_AAAACMAAQED&token=MRr0EfDBxcCQoBli1fnwhAABUYAAAAFWc5vXAwAAACMAAQED&timestamp=1470826242143&acl=a8349243d9b894b27e02944c0a4ba958&zoom=original"
          },
          {
            "id": "4",
            "dishId": "2016081003442821",
            "dishName": "sdfsd",
            "pictureFileId": "-a_3jK0LTa-82aZoFP1v_AAAACMAAQED",
            "pictureURL": "http://dl.django.t.taobao.com/rest/1.0/image?fileIds=-a_3jK0LTa-82aZoFP1v_AAAACMAAQED&token=MRr0EfDBxcCQoBli1fnwhAABUYAAAAFWc5vXAwAAACMAAQED&timestamp=1470826242143&acl=a8349243d9b894b27e02944c0a4ba958&zoom=original"
          },
          {
            "id": "5",
            "dishId": "2016081003442820",
            "dishName": "sdfsd",
            "pictureFileId": "-a_3jK0LTa-82aZoFP1v_AAAACMAAQED",
            "pictureURL": "http://dl.django.t.taobao.com/rest/1.0/image?fileIds=-a_3jK0LTa-82aZoFP1v_AAAACMAAQED&token=MRr0EfDBxcCQoBli1fnwhAABUYAAAAFWc5vXAwAAACMAAQED&timestamp=1470826242143&acl=a8349243d9b894b27e02944c0a4ba958&zoom=original"
          }
        ],
        "pageSize": 20,
        "status": "succeed",
        "totalSize": 5
      });
    }, 500);
  },
  "GET /shop/kbdish/statistics.json": function (req, res) {
    setTimeout(() => {
      res.json({
        "resultMsg": "",
        "resultCode": "",
        "status": "succeed",
        "totalCount": 10
      });
    }, 500);
  },
  "GET /shop/kbdish/pageQuery.json": function(req, res) {
    setTimeout(() => {
      res.json({"resultMsg":"","status":"succeed","resultCode":"","data":[{"dishName":"鱼香肉丝","price":"18","dishId":"1","pictureURL":"iZM0ZORdQ76wju1TZTmM4wAAACMAAQED","dishTagList":[{"value":"微辣","type":"菜属性"},"~unique-id~1"]},{"dishName":"泡菜鱼头","price":"98.22","dishId":"2","pictureURL":"iZM0ZORdQ76wju1TZTmM4wAAACMAAQED","dishTagList":[{"value":"微辣","type":"菜属性"},"~unique-id~3"]},{"dishName":"清汤娃娃菜","price":"32.2","dishId":"3","pictureURL":"iZM0ZORdQ76wju1TZTmM4wAAACMAAQED","dishTagList":[{"value":"微辣","type":"菜属性"},"~unique-id~5"]},{"dishName":"夫妻肺片","price":"22.2","dishId":"4","pictureURL":"iZM0ZORdQ76wju1TZTmM4wAAACMAAQED","dishTagList":[{"value":"微辣","type":"菜属性"},"~unique-id~7"]},{"dishName":"红烧肉","price":"11","dishId":"5","pictureURL":"iZM0ZORdQ76wju1TZTmM4wAAACMAAQED","dishTagList":[{"value":"微辣","type":"菜属性"},"~unique-id~9"]},{"dishName":"芝士焗龙虾","price":"130","dishId":"6","pictureURL":"iZM0ZORdQ76wju1TZTmM4wAAACMAAQED","dishTagList":[{"value":"微辣","type":"菜属性"},"~unique-id~11"]}],"pageSize":10,"dishSearchForm":{"pageSize":10,"status":"AUDIT_DENY","pageNum":1},"currentPage":1,"totalSize":6});
    }, 500);
  },
  "GET /shop/kbdish/queryByIds.json": function (req, res) {
    setTimeout(() => {
      res.json({
        "resultMsg": "",
        "resultCode": "",
        "data": [
          {
            "price": "18",
            "desc": "好吃好吃",
            "dishName": "鱼香肉丝",
            "dishId": "1",
            "pictureURL": "http://dl.django.t.taobao.com/rest/1.0/image?fileIds=-uatj03jQGWp1bd_qYFJAQAAACMAAQED&token=ql-oHvT0ZfQ6a5HyeRsVygABUYAAAAFVdiZA5gAAACMAAQED&timestamp=1466576727851&acl=259c2710069e8583089f02b02cd8f4b8&zoom=original",
            "dishTagList": [
              {
                "value": "微辣",
                "type": "菜属性"
              },
              "~unique-id~1"
            ]
          },
          {
            "price": "98",
            "desc": "赞赞赞",
            "dishName": "校验皮皮虾",
            "dishId": "2",
            "pictureURL": "http://dl.django.t.taobao.com/rest/1.0/image?fileIds=029SxdU5Su-Gr9mrLjUUDgAAACMAAQED&token=ql-oHvT0ZfQ6a5HyeRsVygABUYAAAAFVdiZA5gAAACMAAQED&timestamp=1466576727851&acl=e3e0cf535791703d78a5b2d948c242bf&zoom=original",
            "dishTagList": [
              {
                "value": "微辣",
                "type": "菜属性"
              },
              "~unique-id~3"
            ]
          }
        ],
        "dishTagSet": [
          {
            "allValues": [
              "变态辣",
              "甜辣",
              "微辣",
              "清淡"
            ],
            "type": "菜属性"
          },
          {
            "allValues": [
              "推荐菜",
              "创意菜",
            ],
            "type": "菜推荐"
          }
        ],
        "status": "succeed"
      });
    }, 500);
  },
  "GET /shop/kbmenu/pageQuery.json": function(req, res) {
    var list = [];
    for (var i = 0; i < 10; i++) {
      list.push({
        "menuId": i + "",
        "title": "这里显示模板名称" + (i + 1),
        "dishCount": 10,
        "shopCount": 2,
        "status": ["EFFECT", "INIT", "PROCESS"][parseInt(Math.random() * 3, 10)]
      });
    }
    setTimeout(() => {
      res.json({
        "menuVO": list,
        "pageSize": 10,
        "currentPage": 1,
        "totalSize": 20,
        "status": "success"
      });
    }, 500);
  },
  "GET /shop/kbmenu/detailQuery.json": function(req, res) {
    setTimeout(() => {
      res.json({
        "menuDetailVO": {
          "menuId": "7",
          "status": ["EFFECT", "INIT", "PROCESS"][parseInt(Math.random() * 3, 10)],
          "title": "这里显示模板名称8",
          "coverFileId": "xxxxxxxxx",
          "coverUrl": "http://dl.django.t.taobao.com/rest/1.0/image?fileIds=-uatj03jQGWp1bd_qYFJAQAAACMAAQED&token=ql-oHvT0ZfQ6a5HyeRsVygABUYAAAAFVdiZA5gAAACMAAQED&timestamp=1466576727851&acl=259c2710069e8583089f02b02cd8f4b8&zoom=original",
          "coverName": "封面名称",
          "dishCount": 111,
          "menuDishRelation": [{
            "dishName": "鱼香肉丝",
            "dishId": "1",
          }, {
            "dishName": "北京烤鸭",
            "dishId": "3",
          },{
            "dishName": "鱼香肉丝2",
            "dishId": "2",
          }, {
            "dishName": "北京烤鸭2",
            "dishId": "4",
          },{
            "dishName": "鱼香肉丝3",
            "dishId": "5",
          }, {
            "dishName": "北京烤鸭3",
            "dishId": "6",
          },{
            "dishName": "鱼香肉丝4",
            "dishId": "7",
          }, {
            "dishName": "北京烤鸭4",
            "dishId": "8",
          },{
            "dishName": "鱼香肉丝5",
            "dishId": "9",
          }, {
            "dishName": "北京烤鸭5",
            "dishId": "10",
          },{
            "dishName": "鱼香肉丝6",
            "dishId": "11",
          }, {
            "dishName": "北京烤鸭6",
            "dishId": "12",
          },{
            "dishName": "鱼香肉丝7",
            "dishId": "13",
          }, {
            "dishName": "北京烤鸭7",
            "dishId": "14",
          }],
          "shopCount": 111,
          "menuShopIds": [
            "2016041600077000000003126249",
            "2016041600077000000003126237",
          ],
        },
        "status": "success"
      });
    }, 500);
  },
  "GET /shop/kbdish/checkRepeat.json": function(req, res) {
    setTimeout(() => {
      res.json({
        "resultMsg":"",
        "resultCode":"",
        "repeat":false,
        "status":"succeed"
      });
    }, 500);
  },
  "GET /shop/kbdish/queryAllTags.json": function (req, res) {
    setTimeout(() => {
      res.json({
        "resultMsg": "",
        "resultCode": "",
        "data": [
          {
            "allValues": [
              "变态辣",
              "甜辣",
              "清淡"
            ],
            "type": "菜属性"
          },
          {
            "allValues": [
              "推荐菜",
              "创意菜",
            ],
            "type": "菜推荐"
          }
        ],
        "status": "succeed"
      });
    }, 500);
  },
  "GET /shop/kbshopenv/pageQuery.json": function(req, res) {
    setTimeout(() => {
      res.json({
        "resultCode": "succeed",
        "list": [
          {
            "id": "20160620143300002278",
            "name": "testName2",
            "picName": "testPicName2",
            "shopCount": 1,
            "url": "EYy5nc5SROiOs6COZi_PRwAAACMAAQED"
          },
          {
            "id": "20160620142600002277",
            "name": "testName",
            "picName": "testPicName",
            "shopCount": 1,
            "url": "EYy5nc5SROiOs6COZi_PRwAAACMAAQED"
          }
        ],
        "count": 2,
        "status": "succeed"
      });
    }, 500);
  },
  "POST /shop/kbshopenv/delete.json": function(req, res) {
    setTimeout(() => {
      res.json({
        "resultCode": "succeed",
        "status": "succeed"
      });
    }, 500);
  },
  "POST /shop/kbshopenv/save.json": function(req, res) {
    setTimeout(() => {
      res.json({
        "resultCode": "succeed",
        "status": "succeed"
      });
    }, 500);
  },
  "GET /shop/kbshopenv/detailQuery.json": function(req, res) {
    setTimeout(() => {
      res.json({
        "data": {
          "id": "20160620143300002278",
          "name": "testName2",
          "picName": "testPicName2",
          "shopCount": 1,
          "shopsInfo": [
            {
              "shopId": "208888888"
            }
          ],
          "url": "EYy5nc5SROiOs6COZi_PRwAAACMAAQED"
        },
        "resultCode": "succeed",
        "status": "succeed"
      });
    }, 500);
  },
  "GET /shop/kbshopenv/checkRepeat.json": function (req, res) {
    setTimeout(() => {
      res.json({
        "resultMsg":"",
        "resultCode":"",
        "repeat":false,
        "status":"succeed"
      });
    }, 500);
  },
  "GET /getPicList.json": function(req, res) {
    setTimeout(() => {
      res.json({
        "materials": [{
          "gmtModified": "Wed Apr 22 15:41:38 CST 2015",
          "operatorType": "MERCHANT",
          "gmtCreate": "Wed Apr 22 15:41:38 CST 2015",
          "status": 0,
          "prop": "{&quot;suffix&quot;:&quot;png&quot;,&quot;imgX&quot;:&quot;100&quot;,&quot;imgY&quot;:&quot;100&quot;,&quot;fileId&quot;:&quot;0O5BVPb0R-mUtgfNH9-vkgAAACMAAQEC&quot;}",
          "url": "https://os.alipayobjects.com/rmsportal/TVyBuyOGQklXVoh.png",
          "sourceId": "0O5BVPb0R-mUtgfNH9-vkgAAACMAAQEC",
          "id": 448,
          "groupId": 37,
          "name": "100.png",
          "merchantId": "2088102146885085"
        }, {
          "gmtModified": "Wed Apr 22 15:41:46 CST 2015",
          "operatorType": "MERCHANT",
          "gmtCreate": "Wed Apr 22 15:41:46 CST 2015",
          "status": 0,
          "prop": "{&quot;suffix&quot;:&quot;jpg&quot;,&quot;imgX&quot;:&quot;1024&quot;,&quot;imgY&quot;:&quot;768&quot;,&quot;fileId&quot;:&quot;2dLtRjcFTHaOZrBZU2VzeQAAACMAAQEC&quot;}",
          "url": "https://os.alipayobjects.com/rmsportal/TVyBuyOGQklXVoh.png",
          "sourceId": "2dLtRjcFTHaOZrBZU2VzeQAAACMAAQEC",
          "id": 449,
          "groupId": 37,
          "name": "Jellyfish.jpg",
          "merchantId": "2088102146885085"
        }, {
          "gmtModified": "Wed Apr 22 15:42:04 CST 2015",
          "operatorType": "MERCHANT",
          "gmtCreate": "Wed Apr 22 15:42:04 CST 2015",
          "status": 0,
          "prop": "{&quot;suffix&quot;:&quot;jpg&quot;,&quot;imgX&quot;:&quot;1024&quot;,&quot;imgY&quot;:&quot;768&quot;,&quot;fileId&quot;:&quot;9TjfMgk_QyCSY7_Wa9irNwAAACMAAQEC&quot;}",
          "url": "https://os.alipayobjects.com/rmsportal/TVyBuyOGQklXVoh.png",
          "sourceId": "9TjfMgk_QyCSY7_Wa9irNwAAACMAAQEC",
          "id": 453,
          "groupId": 37,
          "name": "Desert.jpg",
          "merchantId": "2088102146885085"
        }, {
          "gmtModified": "Wed Apr 22 15:42:04 CST 2015",
          "operatorType": "MERCHANT",
          "gmtCreate": "Wed Apr 22 15:42:04 CST 2015",
          "status": 0,
          "prop": "{&quot;suffix&quot;:&quot;jpg&quot;,&quot;imgX&quot;:&quot;1024&quot;,&quot;imgY&quot;:&quot;768&quot;,&quot;fileId&quot;:&quot;a1e8gCl0TamIz58_WX_8iAAAACMAAQEC&quot;}",
          "url": "https://os.alipayobjects.com/rmsportal/TVyBuyOGQklXVoh.png",
          "sourceId": "a1e8gCl0TamIz58_WX_8iAAAACMAAQEC",
          "id": 451,
          "groupId": 37,
          "name": "Lighthouse.jpg",
          "merchantId": "2088102146885085"
        }, {
          "gmtModified": "Wed Apr 22 15:42:04 CST 2015",
          "operatorType": "MERCHANT",
          "gmtCreate": "Wed Apr 22 15:42:04 CST 2015",
          "status": 0,
          "prop": "{&quot;suffix&quot;:&quot;jpg&quot;,&quot;imgX&quot;:&quot;1024&quot;,&quot;imgY&quot;:&quot;768&quot;,&quot;fileId&quot;:&quot;o0O0YdFgRBeI54CqMN4p8AAAACMAAQEC&quot;}",
          "url": "https://os.alipayobjects.com/rmsportal/TVyBuyOGQklXVoh.png",
          "sourceId": "o0O0YdFgRBeI54CqMN4p8AAAACMAAQEC",
          "id": 452,
          "groupId": 37,
          "name": "Chrysanthemum.jpg",
          "merchantId": "2088102146885085"
        }],
        "status": "succeed"
      });
    }, 100);
  },
  "GET /shop/kbdish/queryAll.json": function (req, res) {
    setTimeout(() => {
      res.json({
        "resultMsg":"",
        "resultCode":"",
        "data":[
          {"dishId":"1","dishName":"鱼香肉丝"},
          {"dishId":"2","dishName":"香烤猪蹄"},
          {"dishId":"3","dishName":"北京烤鸭"}
        ],
        "status":"succeed"
      });
    }, 500);
  },
  "POST /shop/kbdish/batchCreate.json": function(req, res) {
    setTimeout(() => {
      res.json({
        "status": "succeed"
      });
    }, 500);
  },
  "POST /shop/kbdish/batchModify.json": function(req, res) {
    setTimeout(() => {
      res.json({
        "status": "succeed"
      });
    }, 500);
  },
  // 环境图部分
  "GET /shop/shopPicData.json": function(req, res) {
    res.json({"materials":[{"gmtModified":{"time":1463628446000,"minutes":27,"seconds":26,"hours":11,"month":4,"year":116,"timezoneOffset":-480,"day":4,"date":19},"operatorType":"MERCHANT","gmtCreate":{"time":1463628446000,"minutes":27,"seconds":26,"hours":11,"month":4,"year":116,"timezoneOffset":-480,"day":4,"date":19},"operatorId":"2088102147273384","properties":{"fileId":"--f4VkrFRbShBPltF5JymAAAACMAAQED","mainImgId":"","md5":"","imgX":"322","imgY":"570","suffix":"JPG","mainImgUrl":""},"type":"IMG","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=--f4VkrFRbShBPltF5JymAAAACMAAQED&token=AUdcrhslNRaKZvIxbyN1hQABUYAAAAFVZ8jeCgAAACMAAQED&timestamp=1466407121009&acl=bc998439e117712a43894321a77d2467&zoom=original","sourceId":"--f4VkrFRbShBPltF5JymAAAACMAAQED","backupSourceInfoMap":{},"id":135209,"auditStatus":"WAIT","groupId":534,"name":"13d3b0d798c8b0a0e7f39357b193658e.jpg","merchantId":"2088102147273384","deleteFlag":""},{"gmtModified":{"time":1463627720000,"minutes":15,"seconds":20,"hours":11,"month":4,"year":116,"timezoneOffset":-480,"day":4,"date":19},"operatorType":"MERCHANT","gmtCreate":{"time":1463627720000,"minutes":15,"seconds":20,"hours":11,"month":4,"year":116,"timezoneOffset":-480,"day":4,"date":19},"operatorId":"2088102147273384","properties":{"fileId":"-2fxYtofT7OWRPxLKYvcNQAAACMAAQED","mainImgId":"","md5":"","imgX":"125","imgY":"127","suffix":"png","mainImgUrl":""},"type":"IMG","url":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=-2fxYtofT7OWRPxLKYvcNQAAACMAAQED&token=AUdcrhslNRaKZvIxbyN1hQABUYAAAAFVZ8jeCgAAACMAAQED&timestamp=1466407121009&acl=2a3f2cd413f584f4dc4b584ad67548b0&zoom=original","sourceId":"-2fxYtofT7OWRPxLKYvcNQAAACMAAQED","backupSourceInfoMap":{},"id":135179,"auditStatus":"WAIT","groupId":534,"name":"85.png","merchantId":"2088102147273384","deleteFlag":""}],"status":"succeed"});
  },
  "GET /shop/getShops.json": function(req, res) {
    var list = [];
   res.json({});
  },
  "GET /shop/kbmenu/shopQuery.json": function(req, res) {
    res.json({"resultMsg":"","result":"true","shopCountGroupByCityVO":[{"shops":[],"cityName":"九江市","cityCode":"360400","shopCount":18},{"shops":[],"cityName":"上海市","cityCode":"310100","shopCount":15},{"shops":[],"cityName":"北京市","cityCode":"110100","shopCount":1}],"status":"succeed"});
  },
  "GET /shop/kbmenu/getShopsByCity.json": function(req, res) {
    res.json({"resultMsg":"","shopComps":[{"shopName":"原浩创2088102147273384(1460796744665)","shopId":"2016041600077000000003126252","cityCode":"360400"},{"shopName":"原浩创2088102147273384(1460796744577)","shopId":"2016041600077000000003126251","cityCode":"360400"},{"shopName":"原浩创2088102147273384(1460796743586)","shopId":"2016041600077000000003126250","cityCode":"360400"},{"shopName":"原浩创2088102147273384(1460796743403)","shopId":"2016041600077000000003126249","cityCode":"360400"},{"shopName":"原浩创2088102147273384(1460796742397)","shopId":"2016041600077000000003126248","cityCode":"360400"},{"shopName":"原浩创2088102147273384(1460796742246)","shopId":"2016041600077000000003126247","cityCode":"360400"},{"shopName":"原浩创2088102147273384(1460796741265)","shopId":"2016041600077000000003126246","cityCode":"360400"},{"shopName":"原浩创2088102147273384(1460796741175)","shopId":"2016041600077000000003126245","cityCode":"360400"},{"shopName":"原浩创2088102147273384(1460796740114)","shopId":"2016041600077000000003126244","cityCode":"360400"},{"shopName":"原浩创2088102147273384(1460796740002)","shopId":"2016041600077000000003126243","cityCode":"360400"},{"shopName":"原浩创2088102147273384(1460796739057)","shopId":"2016041600077000000003126242","cityCode":"360400"},{"shopName":"原浩创2088102147273384(1460796738935)","shopId":"2016041600077000000003126241","cityCode":"360400"},{"shopName":"原浩创2088102147273384(1460796737908)","shopId":"2016041600077000000003126240","cityCode":"360400"},{"shopName":"原浩创2088102147273384(1460796737833)","shopId":"2016041600077000000003126239","cityCode":"360400"},{"shopName":"原浩创2088102147273384(1460796736834)","shopId":"2016041600077000000003126238","cityCode":"360400"},{"shopName":"原浩创2088102147273384(1460796736745)","shopId":"2016041600077000000003126237","cityCode":"360400"},{"shopName":"原浩创2088102147273384(1460796735706)","shopId":"2016041600077000000003126236","cityCode":"360400"},{"shopName":"原浩创2088102147273384(1460796735627)","shopId":"2016041600077000000003126235","cityCode":"360400"}],"result":"true","status":"succeed"});
  },
  "GET /shop/kbshopenv/shopQuery.json": function(req, res) {
    res.json({"resultMsg":"","result":"true","shopCountGroupByCityVO":[{"shops":[],"cityName":"Shanghai","cityCode":"SH","shopCount":1},{"shops":[],"cityName":"重庆市","cityCode":"500100","shopCount":1},{"shops":[],"cityName":"海口市","cityCode":"460100","shopCount":100},{"shops":[],"cityName":"神农架林区","cityCode":"429021","shopCount":1},{"shops":[],"cityName":"天门市","cityCode":"429000","shopCount":9},{"shops":[],"cityName":"鄂州市","cityCode":"420700","shopCount":200},{"shops":[],"cityName":"武汉市","cityCode":"420100","shopCount":299},{"shops":[],"cityName":"九江市","cityCode":"360400","shopCount":19},{"shops":[],"cityName":"滁州市","cityCode":"341100","shopCount":1977},{"shops":[],"cityName":"安庆市","cityCode":"340800","shopCount":1001},{"shops":[],"cityName":"温州市","cityCode":"330300","shopCount":946},{"shops":[],"cityName":"宁波市","cityCode":"330200","shopCount":956},{"shops":[],"cityName":"杭州市","cityCode":"330100","shopCount":623},{"shops":[],"cityName":"上海市","cityCode":"310100","shopCount":917},{"shops":[],"cityName":"伊春市","cityCode":"230700","shopCount":790},{"shops":[{"shopName":"宋晓波门店(宋晓波波分店)","shopId":"2016022600077000000002740806","cityCode":""},{"shopName":"wode(wode)","shopId":"2016021800077000000002662594","cityCode":""},{"shopName":"ewwqq&amp;C","shopId":"2016021800077000000002662593","cityCode":""},{"shopName":"宋晓波门店(宋晓波波分店)","shopId":"2016022600077000000002740806","cityCode":"110100"},{"shopName":"wode(wode)","shopId":"2016021800077000000002662594","cityCode":"110100"},{"shopName":"ewwqq&amp;C","shopId":"2016021800077000000002662593","cityCode":"110100"}],"cityName":"北京市","cityCode":"110100","shopCount":6}],"status":"succeed","selectedCityShops":[{"shops":[{"shopName":"宋晓波门店(宋晓波波分店)","shopId":"2016022600077000000002740806","cityCode":""},{"shopName":"wode(wode)","shopId":"2016021800077000000002662594","cityCode":""},{"shopName":"ewwqq&amp;C","shopId":"2016021800077000000002662593","cityCode":""}],"cityName":"北京市","cityCode":"110100","shopCount":3}]});
  },
  "GET /shop/kbshopenv/getShopsByCity.json": function(req, res) {
    res.json({"resultMsg":"","shopComps":[{"shopName":"宋晓波门店(宋晓波波分店)","shopId":"2016022600077000000002740806","cityCode":"110100"},{"shopName":"wode(wode)","shopId":"2016021800077000000002662594","cityCode":"110100"},{"shopName":"ewwqq&amp;C","shopId":"2016021800077000000002662593","cityCode":"110100"}],"result":"true","status":"succeed"});
  },
  "GET /shop/kbmenu/detailShopQuery.json": function(req, res) {
    res.json({
        "menuShopVO": [{
          "cityCode": "230700",
          "cityName": "伊春市",
          "shopCount": 1,
          "shops": [{
            "shopId": "2015101400077000000001905112",
            "shopName": "原浩创(1444802974365)"
          }]
        }],
        "status": "success",
      });
  },
  "GET /shop/queryShopServiceList.json": function(req, res) {
    setTimeout(() => {
      res.json({
        "resultMsg": "",
        "resultCode": "succeed",
        "result": {
          shopServiceVO: [{
            "shopId": "1123123",
            "shopName": "民生路店",
            "serviceList": [{name: '有车位'}, {name: '有WIFI'}],
            "desc": "更多服务"
          }, {
            "shopId": "321",
            "shopName": "新天地店",
            "serviceList": [{name: '有包厢'}],
            "desc": "更多服务"
          }],
          "totalSize": 2
        },
        "status": "succeed"
      });
    }, 500)
  },
  "POST /shop/modifyShopService.json": function(req, res) {
    setTimeout(() => {
      res.json({
        "status": "succeed"
      });
    }, 500);
  },
  "GET /shop/queryShopServiceDetail.json": function(req, res) {
    setTimeout(() => {
      res.json({
        "resultMsg": "",
        "resultCode": "succeed",
        "result": {
          allTags: [
            {name: "有WIFI"}, 
            {name: "有包厢"},
            {name: "有车位"},
            {name: "无烟区"},
            {name: "有吸烟区"},
            {name: "有露天车位"},
          ],
          vo: {
            "shopId": "1123123",
            "shopName": "民生路店",
            "serviceList": [{name: '有车位'}, {name: '有WIFI'}],
            "desc": "更多服务"
          },
        },
        "status": "succeed"
      });
    }, 500)
  },
  "GET /shop/shopsurface/pageQuery.json": function(req, res) {
    setTimeout(() => {
      res.json({
        "resultMsg": "",
        "resultCode": "succeed",
        "result": {
          "ShopSurfaceVO": [{
            "fileGroupId": "1123123",
            "cover": {"fileId":"6ANloE2mRkGcQ7ktOLWsvQAAACMAAQQD","picUrl":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=6ANloE2mRkGcQ7ktOLWsvQAAACMAAQQD&token=5l4xXHTRUe5BIfvLxJjQbQABUYAAAAFZuoj-iwAAACMAAQED&timestamp=1484893284127&acl=0c5950ba25022444f824801cea817ea3&zoom=original"},
            "surfacePics": [
              {"fileId":"6ANloE2mRkGcQ7ktOLWsvQAAACMAAQQD","picUrl":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=6ANloE2mRkGcQ7ktOLWsvQAAACMAAQQD&token=5l4xXHTRUe5BIfvLxJjQbQABUYAAAAFZuoj-iwAAACMAAQED&timestamp=1484893284127&acl=0c5950ba25022444f824801cea817ea3&zoom=original"},{"fileId":"cwJ4rGUkTJS2_jk2iYH2EAAAACMAAQQD","picUrl":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=cwJ4rGUkTJS2_jk2iYH2EAAAACMAAQQD&token=5l4xXHTRUe5BIfvLxJjQbQABUYAAAAFZuoj-iwAAACMAAQED&timestamp=1484893284127&acl=f4a33e70d2e767058ca4c4c6407611f2&zoom=original"},
              {"fileId":"cwJ4rGUkTJS2_jk2iYH2EAAAACMAAQQD","picUrl":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=cwJ4rGUkTJS2_jk2iYH2EAAAACMAAQQD&token=5l4xXHTRUe5BIfvLxJjQbQABUYAAAAFZuoj-iwAAACMAAQED&timestamp=1484893284127&acl=f4a33e70d2e767058ca4c4c6407611f2&zoom=original"},
            ],
            "createTime": '2017-01-20 14:21:24',
            "relatedShops": '测试店铺',
            "relatedShopsCount": "11",
          }],
          "count": 1
        },
        "status": "succeed"
      });
    }, 500)
  },
  "GET /shop/shopsurface/detailQuery.json": function(req, res) {
    setTimeout(() => {
      res.json({
        "result": {
          "ShopSurfaceVO": {
            "fileGroupId": "1123123",
            "cover": {"fileId":"6ANloE2mRkGcQ7ktOLWsvQAAACMAAQQD","picUrl":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=6ANloE2mRkGcQ7ktOLWsvQAAACMAAQQD&token=5l4xXHTRUe5BIfvLxJjQbQABUYAAAAFZuoj-iwAAACMAAQED&timestamp=1484893284127&acl=0c5950ba25022444f824801cea817ea3&zoom=original"},
            "surfacePics": [
              {"fileId":"6ANloE2mRkGcQ7ktOLWsvQAAACMAAQQD","picUrl":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=6ANloE2mRkGcQ7ktOLWsvQAAACMAAQQD&token=5l4xXHTRUe5BIfvLxJjQbQABUYAAAAFZuoj-iwAAACMAAQED&timestamp=1484893284127&acl=0c5950ba25022444f824801cea817ea3&zoom=original"},{"fileId":"cwJ4rGUkTJS2_jk2iYH2EAAAACMAAQQD","picUrl":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=cwJ4rGUkTJS2_jk2iYH2EAAAACMAAQQD&token=5l4xXHTRUe5BIfvLxJjQbQABUYAAAAFZuoj-iwAAACMAAQED&timestamp=1484893284127&acl=f4a33e70d2e767058ca4c4c6407611f2&zoom=original"},
              {"fileId":"cwJ4rGUkTJS2_jk2iYH2EAAAACMAAQQD","picUrl":"http://dl.django.t.taobao.com/rest/1.0/image?fileIds=cwJ4rGUkTJS2_jk2iYH2EAAAACMAAQQD&token=5l4xXHTRUe5BIfvLxJjQbQABUYAAAAFZuoj-iwAAACMAAQED&timestamp=1484893284127&acl=f4a33e70d2e767058ca4c4c6407611f2&zoom=original"},
            ],
            "hasRelatedShopIds": ["123", "2"],
            "relatedShopId": "123",
            "relatedShops": '测试店铺',
            "relatedShopsCount": "11",
          },
        },
        "status": "succeed"
      });
    }, 500)
  },
  "POST /shop/shopsurface/modify.json": function(req, res) {
    setTimeout(() => {
      res.json({
        "status": "succeed"
      });
    }, 500);
  },
};
