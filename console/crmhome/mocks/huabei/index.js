module.exports = {
  'GET /shop/getShopsInfos.json': function(req, res) {
     res.json({"resultMsg":"","result":"true","shopCountGroupByCityVO":[{"shops":[{"shopName":"宋晓波门店(宋晓波波分店)","shopId":"20160226000770000000027408061","cityCode":"110100"},{"shopName":"wode(wode)","shopId":"20160218000770000000026625942","cityCode":"110100"},{"shopName":"ewwqq&amp;C","shopId":"20160218000770000000023662593","cityCode":"110100"}],"cityName":"九江市","cityCode":"360400","shopCount":18},{"shops":[{"shopName":"宋晓波门店(宋晓波波分店)","shopId":"20160226000337000000002740806","cityCode":"110100"},{"shopName":"wode(wode)","shopId":"20160218000770000000026612594","cityCode":"110100"}],"cityName":"上海市","cityCode":"310100","shopCount":15},{"shops":[],"cityName":"北京市","cityCode":"110100","shopCount":1}],"status":"succeed"});
   },
  'GET /shop/interestSave.json': function(req, res) {
    res.json({
      success: true
    });
  },
}