module.exports = {
  'GET /marketing/goodKouBei.json': function (req, res) {
    var data = [
      {
        shopId: 1,
        shopName: '外婆家（西湖店）',
        shopQualityPoints: 50,
        shopGoodCommentsPoints: 9,
        shopIsNominated: true
      },
      {
        shopId: 2,
        shopName: '外婆家（湖滨店）',
        shopQualityPoints: 34,
        shopGoodCommentsPoints: 6,
        shopIsNominated: false
      },
      {
        shopId: 3,
        shopName: '外婆家（湖滨店）',
        shopQualityPoints: 34,
        shopGoodCommentsPoints: 6,
        shopIsNominated: false
      }
    ];
    var stat = {
      nominatedCount: 3,
      needImproveCount: 1
    };
    setTimeout(function () {
      res.json({
        status: 'success',
        data: data,
        stat: stat
      });
    }, 100);
  }
}

