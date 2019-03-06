module.exports = {
  'GET /goods/commodityList.json': function (req, res) {
    // 没列表数据情况
    // setTimeout(() => {
    //   res.json({"result":{
    //     "appStoreServer": 'http://appstore-t8411.alipay.net',
    //   }});
    // }, 100);
    setTimeout(() => {
      res.json({"result":{
        "appStoreServer": 'http://appstore-t8411.alipay.net',
        "commodityList":[{"appId":"2016071201167039","bizTypeCode":"Game","h5vistorUrl":"https://e.alipay.com/commodity/201609290099640306/getAuthLink.json?redirectUrl=www.baidu.com&merchantType=MERCHANT&newAuth=true&inIframe=true&commodityId=201609290099640306","id":201609290099640306,"logoUrl":"http://appstoreisvpic.alipayobjects.com/dev/3c64b103-3fc9-42e2-ab69-3e967d960176.png","orderCount":"1","priceDes":"免费","returnUrl":"http://com.com","score":0,"status":"ONLINE","subTitle":"xiaozhe测试04","title":"逍哲测试04","vistorUrl":"https://e.alipay.com/commodity/201609290099640306/getAuthLink.json?redirectUrl=www.baidu.com&merchantType=MERCHANT&newAuth=true&inIframe=true&commodityId=201609290099640306"},{"appId":"2015110400844031","bizTypeCode":"CustomerService","h5vistorUrl":"http://crmhome-d3381.alipay.net/goods/kbmember/index.h5?commodityId=201605230049430648&redirect=http%3a%2f%2fmfuwu-t.4008827123.cn%2fuser%2fh5%2fas%2fuserLoginWithAuthCode.htm","id":201607270085550248,"logoUrl":"http://appstoreisvpic.alipayobjects.com/dev/801b395b-0949-481d-a841-360e65acc24c.png","orderCount":"47","priceDes":"免费","returnUrl":"http://auth-t.4008827123.cn/controller/isvappauth/authToISVWithYazuo.do","score":0,"status":"ONLINE","subTitle":"雅座测试服务－勿删！","title":"雅座测试服务－勿删！","vistorUrl":"http://crmhome-d3381.alipay.net/main.htm#/framePage/201605230049430648/http%3a%2f%2fecrm-t.4008827123.cn%2faccount%2flogin-auth"},{"appId":"2016052001117325","bizTypeCode":"bingzheTest","h5vistorUrl":"http://crmhome-d3381.alipay.net/goods/kbmember/index.h5?commodityId=201605200049430540&redirect=http%3a%2f%2ftestnormalpc.yunzongnet.com%2falipayAuth%2flogin.do%3fisApp%3dtrue","id":201607260085550140,"logoUrl":"http://appstoreisvpic.alipayobjects.com/dev/b0faaa25-bde3-43cc-9557-932894f15cdd.png","orderCount":"1340","priceDes":"免费","returnUrl":"http://mall-pc.ds.yunzongnet.com/service/callback.do","score":4,"status":"ONLINE","subTitle":"勿删！！！","title":"云纵线下联调测试服务","vistorUrl":"http://crmhome-d3381.alipay.net/main.htm#/framePage/201605200049430540/http%3a%2f%2ftestnormalpc.yunzongnet.com%2falipayAuth%2flogin.do"}],"commodityNum":3},"status":"succeed"});
    }, 100);
  },
  'GET /goods/getIsvLink.json': function (req, res) {
    setTimeout(() => {
      res.json({
          "result": {
              "inIframe": true,
              "redirectUrl": "http://www.baidu.com?app_id=2015110400844031&scope=auth_base&source=koubei&auth_type=pay_member&auth_code=7fbad8f0ea474450b78722818d8a7X39"
          },
          "status": "succeed"
      });
    }, 100);
  },
}