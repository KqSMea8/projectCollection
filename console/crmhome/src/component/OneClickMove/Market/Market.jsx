import React from 'react';
import './market.less';

class Market extends React.Component {
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
    };
  }

  componentWillMount() {

  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <div className="app-detail-header" style={{ position: 'relative' }}>
          <h3>商品服务</h3>
        </div>
        <div className="kb-detail-main">
          <div className="market_list">
            <div className="market_logo">
              <img src="https://gw.alipayobjects.com/zos/rmsportal/DOubmCdmizpgaSnpzfdt.png" />
            </div>
            <div className="market_con">
              <div className="market_title">
                <h4 className="title_color"> 【银盒子】商场-商品管理</h4>
                <p className="title_dis">银盒子商场商品管理，专为商场打造的商品营销工具，将线下服务线上化，用更高的转化带来顾客，用更多的销量增加利润。银盒子，做最专业的营销专家。</p>
              </div>
            </div>
            <div className="market_btn">
              <a href="https://e.alipay.com/goods/getAuthLink.htm?commodityId=201610200193600763&newAuth=true&redirectUrl=http%3A%2F%2Fcloud.blibao.com%2Fserver%2Faccount%2FkoubOparatorAuthLoginToShopManageV.htm" >进入服务</a>
            </div>
          </div>
          { /* <div className="market_list">
            <div className="market_logo">
              <img src="https://gw.alipayobjects.com/zos/rmsportal/vulSdBeisMdtLXMsvzcu.png" />
            </div>
            <div className="market_con">
              <div className="market_title">
                <h4 className="title_color">云纵(商品管理)</h4>
                <p className="title_dis">
                  全行业通用,独家支持预约,报名等场景并满足行业字段要求,将线下服务线上化,协助商家引流带顾客,增加销售额和利润,用桔牛,生意牛!
                </p>
              </div>
            </div>
            <div className="market_btn">
              <a href="https://openauth.alipay.com/oauth2/appToAppAuth.htm?app_id=2016102002251635&redirect_uri=https%3A%2F%2Fgateway.blibao.com%2Fajax%2FauthRedirect.htm%3Ffrom%3Dscspgl" >进入服务</a>
            </div>
          </div> */ }
        </div>
      </div>
    );
  }
}

export default Market;
