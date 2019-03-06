import React from 'react';
import ShopInfo from './common/ShopInfo';
import CommonPercent from './common/CommonPercent';
import ajax from 'Utility/ajax';
import Util from './common/indexUtil';
import { Row, Col, Spin, Icon, message } from 'antd';

const StoreOperationModule = React.createClass({
  getInitialState() {
    return {
      loading: true,
      timeout: false,
      realTimeData: {
        'orderCntRl': 0, // 实时订单交易笔数
        'orderCntRlDr': 0, // 实时订单交易笔数日环比
        'businessAmtPerCntRl': 0, // 实时实收笔单价
        'businessAmtPerCntRlDr': 0, // 实时实收笔单价日环比
        'orderAmtRl': 0, // 实时订单交易金额
        'orderAmtRlDr': 0, // 实时订单交易金额日环比
        'orderAmtPerCntRl': 0, // 实时订单笔单价
        'orderAmtPerCntRlDr': 0, // 实时订单笔单价日环比
      },
      data: {
        'tradeCntPerShop': 0, // 门店单产（笔）
        'tradeCntPerShopWr': 0, // 门店单产（笔）周同比
        'tradeShopCnt': 0, // 动销门店（家）
        'tradeShopCntWr': 0, // 动销门店（家）周同比
        'tradeShopRate': 0, // 动销率
        'tradeShopRateWr': 0, // 动销率周同比
        'offlineItemCnt': 0, // 折扣异常下架数
        'offlineItemCntWr': 0, // 折扣异常下架数周同比
        'itemShopCnt': 0, // 折扣门店数
        'itemShopCntWr': 0, // 折扣门店数周同比
        'itemShopRate': 0, // 折扣率
        'itemShopRateWr': 0, // 折扣率周同比
        'checkRejectShopCnt': 0, // 审核不通过门店数
        'checkingShopCnt': 0, // 审核中门店数
        'waitCheckShopCnt': 0, // 待审核门店数
        'onlineShopCnt': 0, // 总上线门店数
        'onlineShopCntWr': 0, // 总上线门店数周同比
        'newShopCnt': 0, // 新上线门店数
        'newShopCntWr': 0, // 新上线门店数周同比
        'offlineShopCnt': 0, // 下线门店数
        'offlineShopCntWr': 0, // 下线门店数周同比
        'dataDate': 0,
      },
    };
  },

  componentDidMount() {
    this.initial = true;
    this.gainStore();
  },

  gainStore() {
    const self = this;
    ajax({
      'url': '/sale/queryShopBizInfo.json',
      'success': (res) => {
        if ( res.status !== 'succeed') {
          this.setState({loading: false});
          return message.error('系统错误，请重试');
        }
        if (res.data) {
          const stateInfo = {};
          const updateInfo = {loading: false};
          Util.loop(res.data, (key, value) => {
            if (key === 'data_date') {
              stateInfo[Util.camelCase(key)] = Util.formateDate(value);
            } else {
              stateInfo[Util.camelCase(key)] = value;
            }
          });

          updateInfo.realTimeData = stateInfo;
          if (self.initial) {
            updateInfo.data = stateInfo;
            self.initial = false;
          }

          self.setState(updateInfo);
        }
      }, error: () => {
        this.setState({loading: false});
      },
    });
    setTimeout(() => {
      if (this.state.loading) {
        this.setState({timeout: true});
      }
    }, 10000);
  },

  render() {
    const {loading, timeout} = this.state;
    if (loading) {
      return <div style={{marginBottom: 19}}><Spin />{timeout ? <div className="kb-index-no-panel"><Icon type="smile"/><span className="kb-index-warn-info">由于您可见的数据范围较大,我们正在努力加载,请耐心等待哦</span></div> : null}</div>;
    }

    const analysisLink = `${window.APP.mdataprodUrl}/midoffice/index.htm#/data/midoffice_pc_shop_analysis`;
    const shopPermission = this.state.data.checkRejectShopCnt && this.state.data.checkingShopCnt;
    return (<div style={{marginBottom: 19}}>
    <h3>门店运营情况<span className="sub-title">(统计时间：{this.state.realTimeData.dataDate ? `${this.state.realTimeData.dataDate} 交易数据每分钟统计一次，需手动刷新哦～` : '暂无法统计'}）</span></h3>
      <Spin spinning={this.state.loading}>
      <Row>
        <Col span="16" style={{'paddingRight': '16px'}}>
          <div className="border-panel kb-store-panel" style={{'padding': '0 24px'}}>
             <Row className="panel-bb">
              <Col span="12" className="shop-item">
                <ShopInfo title="订单交易笔数(笔)－1分钟前" amount={this.state.realTimeData.orderCntRl} unit="笔" percentTitle="日环比:" percent={this.state.realTimeData.orderCntRlDr} link={analysisLink}/>
              </Col>
              <Col span="12" className="shop-item">
                <ShopInfo title="实收笔单价(元)－1分钟前" amount={this.state.realTimeData.businessAmtPerCntRl} isCash unit="元" percentTitle="日环比:" percent={this.state.realTimeData.businessAmtPerCntRlDr} link={analysisLink}/>
              </Col>
            </Row>
            <Row className="">
              <Col span="12" className="shop-item">
                <ShopInfo title="交易金额(元)－1分钟前" amount={this.state.realTimeData.tradeAmtRl} isCash unit="元" percentTitle="日环比:" percent={this.state.realTimeData.tradeAmtRlDr} link={analysisLink}/>
              </Col>
              <Col span="12" className="shop-item">
                <ShopInfo title="订单笔单价(元)－1分钟前" amount={this.state.realTimeData.orderAmtPerCntRl} isCash unit="元" percentTitle="日环比:" percent={this.state.realTimeData.orderAmtPerCntRlDr} link={analysisLink}/>
              </Col>
            </Row>
            </div>
          </Col>
         <Col span="8">
           <div className="border-panel kb-store-panel kb-index-detail-list" style={!shopPermission ? {padding: '78px 20px'} : null}>
              <ul>
                <li>
                  <span className="kb-index-item-title">总上线(家)</span> <span className="detail-trend trend-tail"><span className={Util.highlightClass(this.state.data.onlineShopCntWr)}>周同比:</span>{Util.formatePercent(this.state.data.onlineShopCntWr)}</span><span className="kb-index-item-detail"><a href={analysisLink}>{this.state.data.onlineShopCnt || '暂无数据'}</a></span>
                </li>
                <li>
                  <span className="kb-index-item-title">新上线(家)</span> <span className="detail-trend trend-tail"><span className={Util.highlightClass(this.state.data.newShopCntWr)}>周同比:</span>{Util.formatePercent(this.state.data.newShopCntWr)}</span><span className="kb-index-item-detail"><a href={analysisLink}>{this.state.data.newShopCnt || '暂无数据'}</a></span>
                </li>
                <li>
                  <span className="kb-index-item-title">下线(家)</span> <span className="detail-trend trend-tail"><span className={Util.highlightClass(this.state.data.offlineShopCntWr)}>周同比:</span>{Util.formatePercent(this.state.data.offlineShopCntWr)}</span><span className="kb-index-item-detail"><a href={analysisLink}>{this.state.data.offlineShopCnt || '暂无数据'}</a></span>
                </li>
                {shopPermission ? <li>
                  <span className="kb-index-item-title">开店失败(家)</span> <span className="kb-index-item-detail"><a href="#/shop/backlog">{this.state.data.checkRejectShopCnt || '暂无数据'}</a></span>
                </li> : null}
                {shopPermission ? <li>
                  <span className="kb-index-item-title">开店处理中(家)</span> <span className="kb-index-item-detail"><a href="#/shop/backlog">{this.state.data.checkingShopCnt || '暂无数据'}</a></span>
                </li> : null}
              </ul>
           </div>
         </Col>
       </Row>
        <div className="border-panel kb-store-panel innder-border-panel">
          <Row style={{padding: '0 19px'}}>
              <Col span="4" className="kb-progress-item">
                <CommonPercent title="门店单产(笔)" amount={this.state.data.tradeCntPerShop} percentTitle="周同比:" percent={this.state.data.tradeCntPerShopWr} />
              </Col>
              <Col span="4" className="kb-progress-item">
                <CommonPercent title="动销门店(家)" amount={this.state.data.tradeShopCnt} percentTitle="周同比:" percent={this.state.data.tradeShopCntWr} />
              </Col>
              <Col span="4" className="kb-progress-item">
                <CommonPercent title="动销率(%)" amount={(this.state.data.tradeShopRate * 100).toFixed(1)} percentTitle="周同比:" percent={this.state.data.tradeShopRateWr} isPercent/>
              </Col>
              <Col span="4" className="kb-progress-item">
                <CommonPercent title="折扣异常下架数(个)" amount={this.state.data.offlineItemCnt} percentTitle="周同比:" percent={this.state.data.offlineItemCntWr} />
              </Col>
              <Col span="4" className="kb-progress-item">
                <CommonPercent title="有折扣门店数(家)" amount={this.state.data.itemShopCnt} percentTitle="周同比:" percent={this.state.data.itemShopCntWr} />
              </Col>
              <Col span="4" className="kb-progress-item">
                 <CommonPercent title="折扣率(%)" amount={(this.state.data.itemShopRate * 100).toFixed(1)} percentTitle="周同比:" percent={this.state.data.itemShopRateWr} isPercent/>
              </Col>
          </Row>
        </div>
        </Spin>
      </div>
    );
  },
});

export default StoreOperationModule;
