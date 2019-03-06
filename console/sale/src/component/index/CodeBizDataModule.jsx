import React from 'react';
import { Tabs, Spin } from 'antd';
import './CodeBizDataModule.less';
import PointChoose from '../CityArea/CityMap/components/PointChoose';
import ajax from 'Utility/ajax';

const lineWidth = 400;
const TabKeys = {
  NoCodeShop: 'NoCodeShop',
  NoTradOnCode: 'NoTradOnCode',
};

export default class extends React.Component {

  state = {
    loading: true,
    tabKey: TabKeys.NoCodeShop,
    dataDay: '',
    rightPartValue: {},
  };

  componentDidMount() {
    this.loadData();
  }

  onTabChange(tabKey) {
    this.setState({ tabKey });
  }

  loadData() {
    ajax({
      url: `${window.APP.kbsalesUrl}/shop/queryCodeService.json`,
      success: (result) => {
        if (result.data) {
          const date = new Date();
          this.setState({
            ...result.data,
            loading: false,
            dataDay: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() - 1}`,
            rightPartValue: {
              value1: result.data.sumShopNum,
              value2: result.data.bindingShopNum,
              value3: result.data.validCodeShopNum,
              value4: result.data.validTradeShopNum,
            },
          });
        }
      },
    });
  }

  gotoCityMapPage(...points) {
    location.hash = `/cityarea/tabs/map?pointChooseValue=${points.join(',')}`;
  }

  render() { // eslint-disable-line
    const state = this.state;
    const { loading, tabKey, dataDay, rightPartValue } = this.state;
    const isTab1 = tabKey === TabKeys.NoCodeShop;
    return (<div className="CodeBizDataModule">
      <h3>码业务数据<span className="sub-title">(统计时间: {dataDay}昨天 选择某个门店分层则跳转到城市网格化界面，直接盘点门店。)</span></h3>
      {loading ? <Spin /> : (<div className="main-content">
        <div className="code-data-part-left">
          <Tabs activeKey={tabKey} onChange={key => this.onTabChange(key)} type="card">
            <Tabs.TabPane tab={`未铺码门店数：${state.unbinding || ''}`} key={TabKeys.NoCodeShop} />
            <Tabs.TabPane tab={`码上无交易门店数：${state.code || ''}`} key={TabKeys.NoTradOnCode} />
          </Tabs>
          <div className="code-tab-item">
            <div className="tab-content-left">
              <div className="tab-content-left-content" onClick={() => this.gotoCityMapPage(PointChoose.ValuesKey.tradeNumShop_Month1)}>
                近30天有口碑交易<br/>
                <span className="number">{isTab1 ? state.unbindingTrade : state.codeTrade}</span>
              </div>
            </div>
            <div className="tab-content-right">
              <div className="tab-content-right-item">
                <div className="tab-content-right-item-left"
                  onClick={() => this.gotoCityMapPage(PointChoose.ValuesKey.tradeNumShop_Month1, PointChoose.ValuesKey.tradeNumDiscount_Month1)}
                >
                  近30天有商家优惠<br />
                  <span className="number">{isTab1 ? state.unbindingTradeDiscount : state.codeTradeDiscount}</span>
                </div>
                <div className="tab-content-right-item-right">
                  <span className="click"
                    onClick={() => this.gotoCityMapPage(PointChoose.ValuesKey.tradeNumShop_Month1, PointChoose.ValuesKey.tradeNumDiscount_Month1, PointChoose.ValuesKey.orderSubscribe_1)}
                  >已订购点餐：{isTab1 ? state.unbindingTradeDiscountOrder : state.codeTradeDiscountOrder}</span><br />
                  <span className="click"
                    onClick={() => this.gotoCityMapPage(PointChoose.ValuesKey.tradeNumShop_Month1, PointChoose.ValuesKey.tradeNumDiscount_Month1, PointChoose.ValuesKey.secondPaySubscribe_1)}
                  >已订购秒付：{isTab1 ? state.unbindingTradeDiscountSecond : state.codeTradeDiscountSecond}</span><br />
                  <span className="click"
                    onClick={() => this.gotoCityMapPage(PointChoose.ValuesKey.tradeNumShop_Month1, PointChoose.ValuesKey.tradeNumDiscount_Month1,
                      PointChoose.ValuesKey.orderSubscribe_0, PointChoose.ValuesKey.secondPaySubscribe_0)}
                  >未订购点餐或秒付：{isTab1 ? state.unbindingTradeDiscountNoOrder : state.codeTradeDiscountNoOrder}</span><br />
                </div>
              </div>
              <div className="tab-content-right-item">
                <div className="tab-content-right-item-left"
                  onClick={() => this.gotoCityMapPage(PointChoose.ValuesKey.tradeNumShop_Month1, PointChoose.ValuesKey.tradeNumDiscount_Month0)}
                >
                  <div>近30天无商家优惠</div>
                  <div className="number">{isTab1 ? state.unbindingTradeNoDiscount : state.codeTradeNoDiscount}</div>
                </div>
                <div className="tab-content-right-item-right">
                  <span className="click"
                    onClick={() => this.gotoCityMapPage(PointChoose.ValuesKey.tradeNumShop_Month1, PointChoose.ValuesKey.tradeNumDiscount_Month0, PointChoose.ValuesKey.orderSubscribe_1)}
                  >已订购点餐：{isTab1 ? state.unbindingTradeNoDiscountOrder : state.codeTradeNoDiscountOrder}</span><br />
                  <span className="click"
                    onClick={() => this.gotoCityMapPage(PointChoose.ValuesKey.tradeNumShop_Month1, PointChoose.ValuesKey.tradeNumDiscount_Month0, PointChoose.ValuesKey.secondPaySubscribe_1)}
                  >已订购秒付：{isTab1 ? state.unbindingTradeNoDiscountSecond : state.codeTradeNoDiscountSecond}</span><br />
                  <span className="click"
                    onClick={() => this.gotoCityMapPage(PointChoose.ValuesKey.tradeNumShop_Month1, PointChoose.ValuesKey.tradeNumDiscount_Month0,
                      PointChoose.ValuesKey.orderSubscribe_0, PointChoose.ValuesKey.secondPaySubscribe_0)}
                  >未订购点餐或秒付：{isTab1 ? state.unbindingTradeNoDiscountNoOrder : state.codeTradeNoDiscountNoOrder}</span><br />
                </div>
              </div>
            </div>
          </div>
          <div className="code-tab-item">
            <div className="tab-content-left">
              <div className="tab-content-left-content" onClick={() => this.gotoCityMapPage(PointChoose.ValuesKey.tradeNumShop_Month0)}>
                近30天门店无交易<br/>
                <span className="number">{isTab1 ? state.unbindingNoTrade : state.codeNoTrade}</span>
              </div>
            </div>
            <div className="tab-content-right">
              <div className="tab-content-right-item">
                <div className="tab-content-right-item-left"
                  onClick={() => this.gotoCityMapPage(PointChoose.ValuesKey.tradeNumShop_Month0, PointChoose.ValuesKey.tradeNumDiscount_Month1)}
                >
                  <div>近30天有商家优惠</div>
                  <div className="number">{isTab1 ? state.unbindingNoTradeDiscount : state.codeNoTradeDiscount}</div>
                </div>
                <div className="tab-content-right-item-right">
                  <span className="click"
                    onClick={() => this.gotoCityMapPage(PointChoose.ValuesKey.tradeNumShop_Month0, PointChoose.ValuesKey.tradeNumDiscount_Month1, PointChoose.ValuesKey.orderSubscribe_1)}
                  >已订购点餐：{isTab1 ? state.unbindingNoTradeDiscountOrder : state.codeNoTradeDiscountOrder}</span><br />
                  <span className="click"
                    onClick={() => this.gotoCityMapPage(PointChoose.ValuesKey.tradeNumShop_Month0, PointChoose.ValuesKey.tradeNumDiscount_Month1, PointChoose.ValuesKey.secondPaySubscribe_1)}
                  >已订购秒付：{isTab1 ? state.unbindingNoTradeDiscountSecond : state.codeNoTradeDiscountSecond}</span><br />
                  <span className="click"
                    onClick={() => this.gotoCityMapPage(PointChoose.ValuesKey.tradeNumShop_Month0, PointChoose.ValuesKey.tradeNumDiscount_Month1,
                      PointChoose.ValuesKey.orderSubscribe_0, PointChoose.ValuesKey.secondPaySubscribe_0)}
                  >未订购点餐或秒付：{isTab1 ? state.unbindingNoTradeDiscountNoOrder : state.codeNoTradeDiscountNoOrder}</span><br />
                </div>
              </div>
              <div className="tab-content-right-item">
                <div className="tab-content-right-item-left"
                  onClick={() => this.gotoCityMapPage(PointChoose.ValuesKey.tradeNumShop_Month0, PointChoose.ValuesKey.tradeNumDiscount_Month0)}
                >
                  近30天无商家优惠<br />
                  <span className="number">{isTab1 ? state.unbindingNoTradeNoDiscount : state.codeNoTradeNoDiscount}</span>
                </div>
                <div className="tab-content-right-item-right">
                  <span className="click"
                    onClick={() => this.gotoCityMapPage(PointChoose.ValuesKey.tradeNumShop_Month0, PointChoose.ValuesKey.tradeNumDiscount_Month0, PointChoose.ValuesKey.orderSubscribe_1)}
                  >已订购点餐：{isTab1 ? state.unbindingNoTradeNoDiscountOrder : state.codeNoTradeNoDiscountOrder}</span><br />
                  <span className="click"
                    onClick={() => this.gotoCityMapPage(PointChoose.ValuesKey.tradeNumShop_Month0, PointChoose.ValuesKey.tradeNumDiscount_Month0, PointChoose.ValuesKey.secondPaySubscribe_1)}
                  >已订购秒付：{isTab1 ? state.unbindingNoTradeNoDiscountSecond : state.codeNoTradeNoDiscountSecond}</span><br />
                  <span className="click"
                    onClick={() => this.gotoCityMapPage(PointChoose.ValuesKey.tradeNumShop_Month0, PointChoose.ValuesKey.tradeNumDiscount_Month0,
                      PointChoose.ValuesKey.orderSubscribe_0, PointChoose.ValuesKey.secondPaySubscribe_0)}
                  >未订购点餐或秒付：{isTab1 ? state.unbindingNoTradeNoDiscountNoOrder : state.codeNoTradeNoDiscountNoOrder}</span><br />
                </div>
              </div>
            </div>
          </div>
        </div>
        {rightPartValue.value1 > 0 ? (<div className="code-data-part-right">
          <div className="code-data-line" style={{
            borderTopColor: '#5A8FF5',
            width: lineWidth,
            borderLeftWidth: (1 - rightPartValue.value2 / rightPartValue.value1) * lineWidth / 2,
            borderRightWidth: (1 - rightPartValue.value2 / rightPartValue.value1) * lineWidth / 2,
          }}>
            <div className="code-data-line-info"
              style={{ right: -(1 - rightPartValue.value2 / rightPartValue.value1) * lineWidth / 2 }}>
              总已开门店数<br /><span className="number">{rightPartValue.value1}</span>
            </div>
          </div>
          <div className="code-data-line" style={{
            borderTopColor: '#6EB7FE',
            width: lineWidth * rightPartValue.value2 / rightPartValue.value1,
            borderLeftWidth: (rightPartValue.value2 - rightPartValue.value3) / rightPartValue.value1 * lineWidth / 2,
            borderRightWidth: (rightPartValue.value2 - rightPartValue.value3) / rightPartValue.value1 * lineWidth / 2,
          }}>
            <div className="code-data-line-info"
              style={{ right: -(rightPartValue.value2 - rightPartValue.value3) / rightPartValue.value1 * lineWidth / 2 }}>
              已铺码门店数<br /><span className="number">{rightPartValue.value2}</span>
            </div>
          </div>
          <div className="code-data-line" style={{
            borderTopColor: '#80D2FF',
            width: lineWidth * rightPartValue.value3 / rightPartValue.value1,
            borderLeftWidth: (rightPartValue.value3 - rightPartValue.value4) / rightPartValue.value1 * lineWidth / 2,
            borderRightWidth: (rightPartValue.value3 - rightPartValue.value4) / rightPartValue.value1 * lineWidth / 2,
          }}>
            <div className="code-data-line-info"
              style={{ right: -(rightPartValue.value3 - rightPartValue.value4) / rightPartValue.value1 * lineWidth / 2 }}>
              有效铺码门店数<br /><span className="number">{rightPartValue.value3}</span>
            </div>
          </div>
          <div className="code-data-line" style={{
            borderTopColor: '#A2EDFF',
            width: lineWidth * rightPartValue.value4 / rightPartValue.value1,
            borderLeftWidth: rightPartValue.value4 / rightPartValue.value1 * lineWidth / 2,
            borderRightWidth: rightPartValue.value4 / rightPartValue.value1 * lineWidth / 2,
          }}>
            <div className="code-data-line-info" style={{ right: -rightPartValue.value4 / rightPartValue.value1 * lineWidth / 2 }}>
              有交易门店数<br /><span className="number">{rightPartValue.value4}</span>
            </div>
          </div>
        </div>) : (<div className="code-data-part-right" style={{textAlign: 'center', padding: 0}}>
          <img style={{width: 200, margin: 20}} src="https://zos.alipayobjects.com/rmsportal/mmKFrrHtrFrNngS.png" />
          <span style={{fontSize: 20}}>暂无数据</span>
        </div>)}
      </div>)}
    </div>);
  }
}
