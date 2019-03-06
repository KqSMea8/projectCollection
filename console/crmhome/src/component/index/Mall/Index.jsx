import React from 'react';
import IntroBoard from './IntroBoard';
import ajax from '../../../common/ajax';
import {customLocation} from '../../../common/utils';
import {Button, message} from 'antd';
import SubTitle from '../../../common/SubTitle';
import MessageTable from '../common/MessageTable';
import IsvModal from '../DashBoard/IsvModal';
import DashItem from './DashItem';
import FloatMessageModal from '../DashBoard/FloatMessageModal';

const ButtonGroup = Button.Group;

const Index = React.createClass({
  getInitialState() {
    return {
      loading: true,
      promoInfo: [],
      showDataDesc: false,
      tradeUserCnt: 0,
      isOrder: null,
      commodities: [],
      isvModal: false,
      promoDataNew: null,
    };
  },

  componentDidMount() {
    // 初始化首页信息
    this.getInitialInfo();
  },

  getInitialInfo() {
    ajax({
      url: '/queryIndexDataView.json',
      type: 'json',
      success: (data) => {
        const {tradeUserCnt} = data;
        this.setState({ tradeUserCnt, loading: false, promoInfo: this.dealPromData(data), isOrder: !!window.APP.isOrderPlugin });
      }, error: (result) => {
        if (result.errorMsg) {
          message.error(result.errorMsg, 3);
        }
        this.setState({ loading: false });
      },
    });

    ajax({
      url: '/queryIndexPromoDataDegradedView.json',
      type: 'json',
      success: (data) => {
        this.setState({promoDataNew: data});
      }, error: (result) => {
        if (result.errorMsg) {
          message.error(result.errorMsg, 3);
        }
      },
    });

    if (!window.APP.isOrderPlugin) {
      // 如果是已订购则不用请求服务商接口
      ajax({
        url: '/queryUnOrderPluginList.json',
        type: 'json',
        success: (data) => {
          const {commodities} = data;
          this.setState({ commodities: [...commodities] });
        },
      });
    }
  },

  dealPromData(promoInfo) {
    return [{
      mainNum: promoInfo.todayNewUserCnt,
      mainInfo: '今日新增会员(人)',
      moreLink: `${window.APP.mdataProd}/report/crmhome_report.htm?pageUri=campaign_user_develop`,
      subArr: [{
        'info': '总会员数(人)',
        'num': promoInfo.totalUserCnt,
      }, {
        'info': '交易二次以上会员(人)',
        'num': promoInfo.tradeCntGeTwiceUserCnt,
      }],
    }, {
      mainNum: promoInfo.todayTradeAmt,
      mainInfo: '今日收益金额(元)',
      moreLink: `${window.APP.mdataProd}/report/crmhome_report.htm?pageUri=campaign_analysis_trade_data`,
      subArr: [{
        'info': '累计收益金额(元)',
        'num': promoInfo.totalTradeAmt,
      }, {
        'info': '笔单价(元)',
        'num': promoInfo.avgTradeAmt,
      }],
    }, {
      mainNum: promoInfo.todayCampaignTradeAmt,
      moreLink: `${window.APP.mdataProd}/report/crmhome_report.htm?pageUri=campaign_analysis_campaign_promo_data`,
      mainInfo: '今日活动收益金额(元)',
      subArr: [{
        'info': '今日领券量(张)',
        'num': promoInfo.todayTakenCnt,
      }, {
        'info': '当前活动数(个)',
        'num': promoInfo.activityStartedCount,
      }],
    }];
  },

  dealPromDataNew(promoDataNew) {
    return [{
      mainNum: promoDataNew.todayNewUserCnt,
      mainInfo: '今日新增会员(人)',
      subArr: [{
        'info': '昨日新增会员(人)',
        'num': promoDataNew.yesterdayNewUserCnt,
      }, {
        'info': '会员总数(人)',
        'num': promoDataNew.totalUserCnt,
      }],
    }, {
      mainNum: promoDataNew.todayTradeAmt,
      mainInfo: '今日交易额(元)',
      subArr: [{
        'info': '昨日交易额(元)',
        'num': promoDataNew.yesterdayTradeAmt,
      }, {
        'info': '总交易额(元)',
        'num': promoDataNew.totalTradeAmt,
      }],
    }, {
      mainNum: promoDataNew.todayUsedCnt,
      mainInfo: '今日核劵数(张)',
      subArr: [{
        'info': '昨日核券数(张)',
        'num': promoDataNew.yesterdayUsedCnt,
      }, {
        'info': '昨日活动收益(元)',
        'num': promoDataNew.yesterdayCampaignTradeAmt,
      }],
    }];
  },

  dealPreciseData() {
    return window.__fd_index_data.members.map(item => { item.goToOrder = this.goToOrder; return item; });
  },

  dealServiceData() {
    const promoService = window.__fd_index_data.promoService;
    const last = promoService[promoService.length - 1];
    last.btnText = '立即使用';
    last.btnCb = () => { window.location.hash = '#/framePage'; };
    return promoService;
  },

  goTo(url) {
    customLocation(url);
  },

  showModal(type) {
    this.setState({
      showDataDesc: true,
      dataInfoType: type,
    });
  },

  hideModal() {
    this.setState({ showDataDesc: false });
  },

  goToOrder() {
    const {commodities, isOrder} = this.state;
    if (isOrder) {
      window.location.hash = '#/framePage';
      return;
    }
    if (commodities) {
      if (commodities.length > 1) {
        this.setState({ isvModal: true });
      } else if (commodities.length) {
        customLocation(commodities[0].orderUrl);
      }
    }
  },

  hideOrderModal() {
    this.setState({ isvModal: false });
  },

  render() {
    const {tradeUserCnt, promoDataNew, isOrder = [], isvModal, commodities = []} = this.state;
    const {introInfo = []} = window.__fd_index_data;
    if (this.state.loading) return <div></div>;
    return (<div>
      <div className="app-detail-header">
        首页
      </div>
      <div className="app-detail-content app-detail-content-padding">
        <SubTitle name="会员运营数据"/>
        { promoDataNew ?
          <div className="index-dashboard-container">
            <DashItem items={this.dealPromDataNew(promoDataNew)} />
          </div> : <div className="index-dashboard-container" style={{padding: 20, textAlign: 'center'}}>
          暂无运营数据
        </div> }
        {!isOrder ? <IntroBoard title="订购专属服务，免费享受会员精准营销及场景营销服务" data={introInfo}
          subTitle="以下服务由云纵系统提供"
          buttonGroup={
            <ButtonGroup>
              <Button size="large" type="primary" disabled={!(this.state.commodities && this.state.commodities.length) } onClick={this.goToOrder}>立即订购第三方服务</Button>
            </ButtonGroup>
          } /> : null}
        { !~window.location.hash.indexOf('framePage') ?
          (<div>
            <SubTitle name="待办事项"/>
            {tradeUserCnt && <div><span><span style={{ fontSize: 24, color: '#ff800d' }}>{tradeUserCnt}</span>个粉丝等待你和他们联络感情，马上通过服务窗查看粉丝画像及数据分析，实时和粉丝进行互动。</span><a onClick={this.goTo.bind(this, '/merchant/bindingAd.htm') } style={{ float: 'right', fontSize: 16, lineHeight: '36px' }}>使用服务窗</a></div> }
            <MessageTable />
          </div>)
          : null }
      </div>
      {!isOrder && isvModal ? <IsvModal handleHide={this.hideOrderModal} commodity={commodities} /> : null}
      <FloatMessageModal />
    </div>);
  },
});

export default Index;
