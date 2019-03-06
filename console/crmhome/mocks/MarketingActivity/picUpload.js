module.exports = {
  'POST /material/picUpload.json': function (req, res) {
    res.json({
      imgModel: {
        matGroup: {
          id: 89,
          gmtModified: "Tue May 19 16:57:48 CST 2015",
          gmtCreate: "Tue May 19 16:57:48 CST 2015",
          name: "未分类",
          merchantId: "2088102130992843"
        },
        materialList: [{
          id: 0,
          operatorType: "MERCHANT",
          groupId: 89,
          operatorId: "2088102130992843",
          name: "hermes_site.jpg",
          merchantId: "2088102130992843",
          properties: {
            fileId: "JJgjn-13Rj-y3QJ2UdzEcgAAACMAAQED",
            md5: "b00cd713029522fbca9c46f0e235b7f9",
            imgX: "800",
            imgY: "399",
            suffix: "jpg"
          },
          type: {},
          url: "http://dl.django.t.taobao.com/rest/1.0/image?fileIds=JJgjn-13Rj-y3QJ2UdzEcgAAACMAAQED&amp;token=3ttpFMqdAKRuU1qpYeaZawABUYAAAAFUmowvvwAAACMAAQED&amp;timestamp=1462881774349&amp;acl=05daca3bb031c71e628770f0794fd3ea&amp;zoom=original",
          sourceId: "JJgjn-13Rj-y3QJ2UdzEcgAAACMAAQED"
        }]
      }, success: true
    });
  }
}
