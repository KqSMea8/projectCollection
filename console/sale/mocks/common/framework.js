var menu = {
  nodes: [
    {
      id: 1,
      text: '首页',
      url: '#/',
    },
    {
      id: 2,
      text: '门店管理',
      subMenu: [{
        id: 21,
        text: '全部门店',
        url: '#/shop',
      }, {
        id: 22,
        text: '门店分配',
        url: '#/shop-alloc',
      }, {
        id: 23,
        text: '门店授权',
        url: '#/shop-auth',
      }, {
        id: 24,
        text: '素材中心',
        url: '#/photo',
      }, {
        id: 25,
        text: '品牌人员管理',
        url: '#/auth-manage'
      }]
    },
    {
      id: 3,
      text: 'leads管理',
      subMenu: [{
        id: 31,
        text: '私海leads',
        url: '#/private-leads',
      }, {
        id: 32,
        text: '公海leads',
        url: '#/public-leads',
      }, {
        id: 33,
        text: '团队leads查询',
        url: '#/team-leads',
      }]
    },
    {
      id: 4,
      text: '商户管理',
      subMenu: [{
        id: 41,
        text: '全部商户',
        url: '#/merchant',
      }, {
        id: 42,
        text: '商户查询',
        url: '#/merchant-search',
      }]
    },
    {
      id: 5,
      text: '门店管理',
      subMenu: [{
        id: 91,
        text: '素材中心',
        url: '#/photo',
      }, {
        id: 92,
        text: '授权记录',
        url: '#/shop-auth',
      }, {
        id: 92,
        text: '门店分配',
        url: '#/shop-alloc',
      }, {
        id: 92,
        text: '团队门店',
        url: '#/shop/team',
      }, {
        id: 92,
        text: '我的门店',
        url: '#/shop',
      }]
    },
    {
      id: 6,
      text: '系统管理',
      subMenu: [{
        id: 51,
        text: '岗位业务配置',
        url: '#/station-setting',
      }, {
        id: 52,
        text: '通知配置',
        url: '#/notify-setting',
      }]
    },
    {
      id: 7,
      text: '商品管理',
      subMenu: [{
        id: 61,
        text: '新增商品',
        url: '#/goods/create',
      }, {
        id: 62,
        text: '查询商品',
        url: '#/goods/list',
      }, {
        id: 63,
        text: '测试商品白名单',
        url: '#/goods/whitelist',
      }],
    },
    {
      id: 8,
      text: '返佣管理',
      subMenu: [{
        id: 61,
        text: '返佣查询',
        url: '#/commission',
      }],
    },
  ],
};

var loginInfo = {
  userInfo: {
    nickName: '昵称',
    operatorName: '域账号',
  }
};

var userData={"list":[{"chosenName":"xhxgly01(xhxgly01)","displayName":"xhxgly01(xhxgly01)xhxgly01","id":"xhxgly01","type":"0"},{"chosenName":"谢豪(xiehao.xh)","displayName":"杭天(谢豪)xiehao.xh","id":"xiehao.xh","type":"0"},{"chosenName":"谢建友(wb-xiejianyou)","displayName":"谢建友(谢建友)wb-xiejianyou","id":"wb-xiejianyou","type":"0"},{"chosenName":"陈晓蕾(xiaolei.cxl)","displayName":"唯夏(陈晓蕾)xiaolei.cxl","id":"xiaolei.cxl","type":"0"},{"chosenName":"佘尚俊(xuantong)","displayName":"玄通(佘尚俊)xuantong","id":"xuantong","type":"0"},{"chosenName":"邓翔(xiang.dengx)","displayName":"邓翔(邓翔)xiang.dengx","id":"xiang.dengx","type":"0"},{"chosenName":"许逸龙(wb-xuyilong)","displayName":"许逸龙(许逸龙)wb-xuyilong","id":"wb-xuyilong","type":"0"},{"chosenName":"沈旭东(xudong.sxd)","displayName":"破奴(沈旭东)xudong.sxd","id":"xudong.sxd","type":"0"},{"chosenName":"赵新静(xinjing.zhaoxj)","displayName":"赵新静(赵新静)xinjing.zhaoxj","id":"xinjing.zhaoxj","type":"0"},{"chosenName":"薛楠(xuenan.xn)","displayName":"念戎(薛楠)xuenan.xn","id":"xuenan.xn","type":"0"},{"chosenName":"蒋学文(xuewen.jxw)","displayName":"岚心(蒋学文)xuewen.jxw","id":"xuewen.jxw","type":"0"},{"chosenName":"王晓静(xiaojing.wxj)","displayName":"穆莎(王晓静)xiaojing.wxj","id":"xiaojing.wxj","type":"0"},{"chosenName":"吴晓华(xiaohua.wxh)","displayName":"萱怡(吴晓华)xiaohua.wxh","id":"xiaohua.wxh","type":"0"},{"chosenName":"xiedong.xd(xiedong.xd)","displayName":"xiedong.xd(xiedong.xd)xiedong.xd","id":"xiedong.xd","type":"0"},{"chosenName":"姜宪瑶(xianyao.jiang)","displayName":"丰年(姜宪瑶)xianyao.jiang","id":"xianyao.jiang","type":"0"},{"chosenName":"王晓坤(xiaokun.wxk)","displayName":"各序(王晓坤)xiaokun.wxk","id":"xiaokun.wxk","type":"0"},{"chosenName":"马晓航(xiaohang.maxh)","displayName":"马晓航(马晓航)xiaohang.maxh","id":"xiaohang.maxh","type":"0"},{"chosenName":"翟习文(xiwen.dxw)","displayName":"习闻(翟习文)xiwen.dxw","id":"xiwen.dxw","type":"0"},{"chosenName":"许沄萌(wb-xuyunmeng)","displayName":"许沄萌(许沄萌)wb-xuyunmeng","id":"wb-xuyunmeng","type":"0"},{"chosenName":"夏圣凯(wb-xiashengkai)","displayName":"夏圣凯(夏圣凯)wb-xiashengkai","id":"wb-xiashengkai","type":"0"}],"stat":"ok"};

module.exports = {
  'GET /pub/queryAllMenu.json': function (req, res) {
    if (req.query && req.query.callback) {
      res.jsonp(menu, 'callback');
    } else {
      res.json(menu);
    }
  },
  'GET /pub/getLoginUser.json': function (req, res) {
    if (req.query && req.query.callback) {
      res.jsonp(loginInfo, 'callback');
    } else {
      res.json(loginInfo);
    }
  },
  'GET /getUnreadMessageCount.json': function(req, res) {
    if (req.query && req.query.callback) {
      res.jsonp({
        data: 10
      }, 'callback');
    } else {
      res.json({
        data: 10
      });
    }
  },
  'GET /pub/nameSearch.json': function (req, res) {
    if (req.query && req.query.callback) {
      res.jsonp(userData, 'callback');
    } else {
      res.json(userData);
    }
  }
};