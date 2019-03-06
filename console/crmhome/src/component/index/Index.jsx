import React from 'react';
import DashBoard from './DashBoard/DashBoard';
import MemberBoard from './DashBoard/MemberBoard';
import IntroBoard from './DashBoard/IntroBoard';
import SceneBoard from './DashBoard/SceneBoard';
import IsvModal from './DashBoard/IsvModal';
import ajax from '../../common/ajax';
import {customLocation} from '../../common/utils';
import {Button, message, Modal} from 'antd';
import SubTitle from '../../common/SubTitle';
import MessageTable from './common/MessageTable';
import IndexCarousel from './common/IndexCarousel';
import FloatMessageModal from './DashBoard/FloatMessageModal';
const ButtonGroup = Button.Group;

const Index = React.createClass({
  getInitialState() {
    return {
      loading: false,
      promoInfo: [],
      frameHeight: 600,
      showDataDesc: false,
      tradeUserCnt: 0,
      isOrder: null,
      commodities: [],
      isvModal: false,
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
        this.setState({tradeUserCnt, loading: false, promoInfo: this.dealPromData(data), isOrder: !!window.APP.isOrderPlugin});
      }, error: (result) => {
        if (result.errorMsg) {
          message.error(result.errorMsg, 3);
        }
        this.setState({loading: false});
      },
    });

    if (!window.APP.isOrderPlugin) {
      // 如果是已订购则不用请求服务商接口
      ajax({
        url: '/queryUnOrderPluginList.json',
        type: 'json',
        success: (data) => {
          const {commodities} = data;
          this.setState({commodities: [...commodities]});
        },
      });
    }
  },

  dealPromData(promoInfo) {
    return [{
      mainNum: promoInfo.todayNewUserCnt,
      mainInfo: '今日新增会员(人)',
      moreLink: `${window.APP.mdataProd}/report/crmhome_report.htm?pageUri=campaign_user_develop&funcCode=0301`,
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
      moreLink: `${window.APP.mdataProd}/report/crmhome_report.htm?pageUri=campaign_analysis_trade_data&funcCode=0302`,
      subArr: [{
        'info': '累计收益金额(元)',
        'num': promoInfo.totalTradeAmt,
      }, {
        'info': '笔单价(元)',
        'num': promoInfo.avgTradeAmt,
      }],
    }, {
      mainNum: promoInfo.todayCampaignTradeAmt,
      moreLink: `${window.APP.mdataProd}/report/crmhome_report.htm?myreports=v2&pageUri=pageUri1515557326174&url=report&analysis=camp&funcCode=0303`,
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

  dealPreciseData() {
    return window.__fd_index_data.members.map(item => {item.goToOrder = this.goToOrder; return item;});
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
    this.setState({showDataDesc: false});
  },

  goToOrder() {
    const {commodities, isOrder} = this.state;
    if (isOrder) {
      window.location.hash = '#/framePage';
      return;
    }
    if (commodities) {
      if (commodities.length > 1) {
        this.setState({isvModal: true});
      } else if (commodities.length) {
        customLocation(commodities[0].orderUrl);
      }
    }
  },

  hideOrderModal() {
    this.setState({isvModal: false});
  },

  render() {
    const loanData = window.__fd_loan_data && window.__fd_loan_data.link;
    const {introInfo = []} = window.__fd_index_data;
    const {isOrderPlugin, isCommon} = window.APP;
    const isNormal = isOrderPlugin === 'true' || isCommon !== 'true';
    const {tradeUserCnt, promoInfo, showDataDesc, dataInfoType, isOrder, commodities = [], isvModal} = this.state;
    const orderInfo = isOrder ? <SceneBoard items={this.dealServiceData()} /> : <IntroBoard data={introInfo} />;
    const dataLine = window.__fd_index_data[dataInfoType] ? window.__fd_index_data[dataInfoType].map((item, i) => {
      const {name, value} = item;
      return (<tr key={i}>
        <td className="kb-detail-table-label">{name}</td>
        <td>{value}</td>
      </tr>);
    }) : null;

    return (<div>
      <div className="app-detail-header">
          首页
          <ButtonGroup style={{position: 'absolute', top: 16, right: 16, zIndex: 1}}>
            <Button size="large" type="ghost" onClick={this.goTo.bind(this, loanData)}>我要贷款</Button>
          </ButtonGroup>
      </div>
      <div className="app-detail-content-padding">
        <div style={{width: '965px', paddingBottom: '10px'}}><IndexCarousel /></div>
        {promoInfo && promoInfo.length ? <DashBoard detailCb={this.showModal} items={promoInfo} /> : null}
        {isNormal ? <MemberBoard items={this.dealPreciseData()} isOrder={isOrder} commodities={commodities} goToOrder={this.goToOrder} /> : null}
        {isNormal && typeof isOrder === 'boolean' ? orderInfo : null}
        { !~window.location.hash.indexOf('framePage') ?
        (<div>
          <SubTitle name="待办事项"/>
          {tradeUserCnt && <div><span><span style={{fontSize: 24, color: '#ff800d'}}>{tradeUserCnt}</span>个粉丝等待你和他们联络感情，马上通过服务窗查看粉丝画像及数据分析，实时和粉丝进行互动。</span><a onClick={this.goTo.bind(this, '/merchant/bindingAd.htm')} style={{float: 'right', fontSize: 16, lineHeight: '36px'}}>使用服务窗</a></div> }
          <MessageTable />
        </div>)
        : null }
        </div>
    {!isOrder && isvModal ? <IsvModal handleHide={this.hideOrderModal} commodity={commodities} /> : null}
    <Modal title="数据指标说明" visible={showDataDesc} onCancel={this.hideModal} footer={null}>
      <table className="kb-detail-table-2">
        <tbody>
          {dataLine}
        </tbody>
      </table>
    </Modal>
    <FloatMessageModal />
  </div>);
  },
});

export default Index;
