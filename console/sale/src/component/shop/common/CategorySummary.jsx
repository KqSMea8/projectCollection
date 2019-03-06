import React from 'react';

const CategorySummary = React.createClass({
  render() {
    return (
      <div>
        <table>
          <thead>
          <th>一级品类</th>
          <th>二级-三级品类</th>
          <th>证照类型</th>
          </thead>
          <tbody>
          <tr>
            <td rowSpan="3">美食</td>
            <td>餐饮</td>
            <td rowSpan="2">杭州上海：营业执照+餐饮服务许可证或食品经营许可证或食品流通许可证<br />其他城市：营业执照</td>
          </tr>
          <tr>
            <td>休闲食品</td>
          </tr>
          <tr>
            <td>酒吧</td>
            <td>营业执照+酒类销售许可证</td>
          </tr>

          <tr>
            <td rowSpan="9">休闲娱乐</td>
            <td>足疗按摩</td>
            <td>营业执照+卫生许可证</td>
          </tr>
          <tr>
            <td>洗浴/桑拿水会</td>
            <td>营业执照+卫生许可证</td>
          </tr>
          <tr>
            <td>网吧网咖</td>
            <td>营业执照+网络文化许可证</td>
          </tr>
          <tr>
            <td>游乐游艺</td>
            <td>营业执照+娱乐场所许可证</td>
          </tr>
          <tr>
            <td>密室</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>桌面游戏</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>中医养生</td>
            <td>营业执照+卫生许可证+技师证照</td>
          </tr>
          <tr>
            <td>真人CS</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>图书馆</td>
            <td></td>
          </tr>

          <tr>
            <td rowSpan="6">丽人</td>
            <td>美发</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>美容/SPA/美体</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>美容美发</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>美容美甲</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>美发美甲</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>美甲/护手</td>
            <td>营业执照</td>
          </tr>

          <tr>
            <td>K歌</td>
            <td>KTV</td>
            <td>营业执照+娱乐场所许可证</td>
          </tr>

          <tr>
            <td rowSpan="3">结婚</td>
            <td>婚庆公司</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>婚礼策划</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>婚纱礼服</td>
            <td>营业执照</td>
          </tr>

          <tr>
            <td rowSpan="2">宠物</td>
            <td>宠物店（服务类）</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>宠物医院</td>
            <td>营业执照+动物诊疗许可证</td>
          </tr>

          <tr>
            <td rowSpan="3">购物</td>
            <td>超市</td>
            <td rowSpan="2">营业执照+食品流通许可证</td>
          </tr>
          <tr>
            <td>便利店</td>
          </tr>
          <tr>
            <td>书店</td>
            <td>营业执照+（如包含音像制品需提供《音像制品经营许可证》；如包含餐饮业务需提供《餐饮服务许可证》或《食品流通许可证》）</td>
          </tr>

          <tr>
            <td rowSpan="17">运动健身</td>
            <td>健身中心</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>游泳馆</td>
            <td>营业执照+卫生许可证+高危体育项目批准文件</td>
          </tr>
          <tr>
            <td>瑜伽</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>舞蹈</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>羽毛球馆</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>桌球馆</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>体育场馆</td>
            <td>营业执照+如包含高危体育项目的需提供【高危体育项目批准文件】</td>
          </tr>
          <tr>
            <td>武术场馆</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>篮球场</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>保龄球馆</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>高尔夫球场</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>足球场</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>网球场</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>乒乓球馆</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>溜冰场</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>排球场</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>壁球馆</td>
            <td>营业执照</td>
          </tr>

          <tr>
            <td rowSpan="7">亲子</td>
            <td>亲子游乐</td>
            <td>营业执照+《娱乐场所许可证》</td>
          </tr>
          <tr>
            <td>亲子游泳</td>
            <td>营业执照+《卫生许可证》+【《婴儿游泳师证》2个】</td>
          </tr>
          <tr>
            <td>亲子DIY</td>
            <td>营业执照+《卫生许可证》或《餐饮服务许可证》或《食品流通许可证》</td>
          </tr>
          <tr>
            <td>科普场馆</td>
            <td>营业执照+《卫生许可证》</td>
          </tr>
          <tr>
            <td>早教中心</td>
            <td>营业执照+《办学许可证》</td>
          </tr>
          <tr>
            <td>幼儿外语</td>
            <td>营业执照+《办学许可证》</td>
          </tr>
          <tr>
            <td>幼儿才艺</td>
            <td>营业执照+《办学许可证》</td>
          </tr>

          <tr>
            <td rowSpan="3">洗衣</td>
            <td>洗衣家纺</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>洗鞋</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>奢侈品养护</td>
            <td>营业执照</td>
          </tr>

          <tr>
            <td rowSpan="6">摄影</td>
            <td>婚纱摄影</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>儿童摄影</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>孕妇摄影</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>艺术写真</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>证件照</td>
            <td>营业执照</td>
          </tr>
          <tr>
            <td>跟拍</td>
            <td>营业执照</td>
          </tr>

          <tr>
            <td>经营范围</td>
            <td colSpan="2">证照内的经营范围需与商户实际经营内容、口碑平台展示的门店类目/经营内容相符。</td>
          </tr>
          <tr>
            <td>证照主体</td>
            <td colSpan="2">开店提供的证照主体需与支付宝签约当面付的认证主体保持一致；</td>
          </tr>
          <tr>
            <td>执照提交要求</td>
            <td colSpan="2">证照需彩色版；真实、完整、清晰无水印、无PS（扫描或拍照均可）；复印件需加盖红色公章。</td>
          </tr>
          <tr>
            <td>门店名称</td>
            <td colSpan="2">口碑平台开放的门店名称需与商户门头照片展示的店名一致；</td>
          </tr>
          <tr>
            <td>门店地址</td>
            <td colSpan="2">需与营业执照地址保持一致</td>
          </tr>
          <tr>
            <td>类目</td>
            <td colSpan="2">需与商户实际经营内容、证照内经营范围相符</td>
          </tr>
          <tr>
            <td>门头+内景</td>
            <td colSpan="2">1、照片需真实拍摄；清晰、无水印、无反向、无PS<br />2、门头照片需含有门店名称<br />3、内景照片内容需要与店铺经营内容一致；</td>
          </tr>
          </tbody>
        </table>
      </div>
    );
  },

});

export default CategorySummary;
