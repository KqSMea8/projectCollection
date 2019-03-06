const CityAreaApi = {
  'GET /shop/koubei/territory/queryAreas.json': function(req, res) {
    const cities = [{
      i: '110000',
      n: '北京',
      c: [
        {
          i: '110001',
          n: '北京市',
        }
      ]
    }, {
      i: '120000',
      n: '上海',
      c: [
        {
          i: '120001',
          n: '上海市'
        }
      ]
    }, {
      i: '130000',
      n: '浙江省',
      c: [
        {
          i: '130001',
          n: '杭州市'
        }
      ]
    }];

    setTimeout(() => {
      res.json({
        status: 'succeed',
        data: cities,
      });
    }, 100);
  },

  'GET /shop/koubei/territory/queryTerritorys.json': function(req, res) {
    const territorys = [{
      territoryId: '1',
      parentId: '',
      territoryName: '黄龙',
      territoryShopCount: 2323,
      territoryChildrenCount: 0,
      memo: '备注信息显示在这里备注信息显示在这里备注信息显示在这里备注信息显示在这里备注信息显示在这里',
      gmtModified: '2016-12-12',
    }, {
      territoryId: '2',
      parentId: '',
      territoryName: '黄龙2',
      territoryShopCount: 0,
      territoryChildrenCount: 0,
      has_been_locked: 'T',
      memo: '备注信息显示在这里备注信息显示在这里备注信息显示在这里备注信息显示在这里备注信息显示在这里',
      gmtModified: '2016-12-12',
    }, {
      territoryId: '3',
      parentId: '',
      territoryName: '黄龙3',
      territoryShopCount: 0,
      territoryChildrenCount: 0,
      memo: '备注信息显示在这里备注信息显示在这里备注信息显示在这里备注信息显示在这里备注信息显示在这里',
      gmtModified: '2016-12-12',
    }, {
      territoryId: '4',
      parentId: '',
      territoryName: '黄龙4',
      territoryShopCount: 0,
      territoryChildrenCount: 0,
      memo: '备注信息显示在这里备注信息显示在这里备注信息显示在这里备注信息显示在这里备注信息显示在这里',
      gmtModified: '2016-12-12',
    }];

    setTimeout(()=> {
      res.json({
        status: 'succeed',
        data: {
          territorys: territorys,
          pageInfo: {
            items: 1,
            itemsPerPage: 20,
            page: 1,
            pages: 1,
          }
        },
        totalItems: 100,
      });
    }, 100);
  },
  'POST /shop/koubei/territory/queryUploadProgress.json': function(req, res) {
    setTimeout(()=> {
      const list = [
        {
          batchId: '232424',
          fileName: '瓜娃子的西瓜好好吃.xls',
          status: '正在处理',
          subStatus: '部分失败',
          uploadTime: 1476328001484
        },
        {
          batchId: '232425',
          fileName: '瓜娃子的西瓜好好吃2.xls',
          status: '正在处理',
          subStatus: '部分失败',
          uploadTime: 1476328001484
        }
      ];

      res.json({
        data: {
          batchTasks: list,
          pageInfo: {
            items: 1,
            itemsPerPage: 20,
            page: 1,
            pages: 1,
          }
        },
        date: 1476436392917,
        status: 'succeed'
      });
    }, 100);
  },

  // 分区坐标门店查询
  'POST /shop/koubei/territory/uploadPolygon.json': function(req, res) {
    setTimeout(()=> {
      res.json({
        data: {
          list: [
            '2016101300077010000019088117',
            '2016101300077010000019067828',
            '2016101300077010000019055710'
          ],
          pageInfo: {
            currentPage: 1,
            pageSize: 10,
            totalSize: 3
          }
        },
        date: 1476436609119,
        status: 'succeed'
      });
    }, 100);
  },

  // 城市分区Excel文件上传
  'POST /shop/koubei/territory/uploadExcel.json': function(req, res) {
    setTimeout(()=> {
      res.json({
        data: '/koubei/territory/uploadProgressList.json',
        date: 1476436638579,
        status: 'succeed'
      });
    }, 100);
  },
  // 保存地图分区
  'POST /shop/koubei/territory/submitPolygonShopInfo.json': function(req, res) {
    setTimeout(()=> {
      res.json({
        data: '/koubei/territory/uploadProgressList.json',
        date: 1476436582787,
        status: 'succeed'
      });
    }, 100);
  },
  // 保持excel分区
  'POST /shop/koubei/territory/submitExcelShopInfo.json': function(req, res) {
    setTimeout(()=> {
      res.json({
        status: 'succeed',
        data: {},
      });
    }, 100);
  },
  'GET /shop/koubei/territory/getShopNumLimit.json': function (req, res) {
    setTimeout(()=> {
      res.json({
        data: {
          shopNumLimt: 4000
        },
        date: 1477302988803,
        status: 'succeed'
      });
    }, 100);
  },
};

const manage = require('./manage');

module.exports = Object.assign({}, manage, CityAreaApi);

