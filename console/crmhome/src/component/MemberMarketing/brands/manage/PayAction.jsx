import React, {PropTypes} from 'react';
import {Menu, Dropdown, Icon} from 'antd';
import TakeOffModal from './TakeOffModal';
import MarketingModal from './MarketingModal';
/*eslint-disable */
const MoreAction = React.createClass({
  propTypes: {
    item: PropTypes.object,
    index: PropTypes.number,
    refresh: PropTypes.func,
    onlineModify: PropTypes.bool,
  },

  getInitialState() {
    return {
      showOffModal: false,
      showMarketing: false,
      windowHref: window.location.href,
    };
  },

  componentWillMount() {
    this.buildMenu(this.props.item);
  },

  componentWillReceiveProps(nextProps) {
    this.buildMenu(nextProps.item);
  },

  onCancel() {
    this.setState({
      showOffModal: false,
      showMarketing: false,
    });
  },

  buildMenu(item) {
    const { activityStatus, activityId, activityType } = item;

    this.Menuitems = [];

    this.showMarket = false;

    this.showDownModal = false;

    this.menu = (
      <Menu>
        {this.Menuitems}
      </Menu>
    );
    // 招商过程中修改+上架后修改
    if (activityStatus === 'PLAN_GOING' || (activityStatus === 'STARTED' && this.props.onlineModify)) {
      let url;

      if (activityType === 'CONSUME_SEND') {
        url = '#/marketing/brands/gift/edit/';
      } else if (activityType === 'BUY_ONE_SEND_ONE') {
        url = '#/marketing/brands/bargain/edit/';
      } else if (activityType === 'RANDOM_REDUCE') {
        url = window.APP.kbretailprod + '/main.htm#/marketing/brands/reduction/edit/';
      } else {
        url = '#/marketing/brands/activity-edit/';
      }

      const modify = (
        <Menu.Item key="modify">
          { (this.state.windowHref).indexOf('op_merchant_id') >= 0 ? <a href={url + activityId} >修改</a> : <a href={url + activityId} target="_blank">修改</a>}
        </Menu.Item>
      );

      // 非口碑福利才有修改
      if (!item.enterpriseBenefit) {
        this.Menuitems.push(modify);
      }
    }

    let copyType;

    if (activityType === 'CONSUME_SEND') {
      copyType = '#/marketing/brands/gift/copy/';
    } else if (activityType === 'BUY_ONE_SEND_ONE') {
      copyType = '#/marketing/brands/bargain/copy/';
    } else if (activityType === 'RANDOM_REDUCE') {
      copyType = window.APP.kbretailprod + '/main.htm#/marketing/brands/reduction/copy/';
    } else {
      copyType = '#/marketing/brands/activity-copy/';
    }

    const copy = (
      <Menu.Item key="copy">
        { (this.state.windowHref).indexOf('op_merchant_id') >= 0 ? <a href={copyType + activityId} >拷贝活动</a> : <a href={copyType + activityId} target="_blank" >拷贝活动</a>}
      </Menu.Item>
    );

    // 非口碑福利才有copy
    if (!item.enterpriseBenefit) {
      this.Menuitems.push(copy);
    }

    // 口碑福利新增 STARTED_AVAILABLE 可以下载对账单
    if (activityStatus === 'STARTED' || activityStatus === 'CLOSED' || activityStatus === 'STARTED_AVAILABLE' || activityStatus === 'DISABLED') {
      const download = (
        <Menu.Item key="download">
          {
            item.enterpriseBenefit ? <a target="_blank" href={'/promo/ebProvider/downloadBrandBill.htm?activityId=' + activityId}>下载对账单</a>
                :
              <a target="_blank" href={'/promo/brand/downloadBrandBill.htm?activityId=' + activityId}>下载对账单</a>
          }
        </Menu.Item>
      );

      const promo = (
        <Menu.Item key="promo">
          <a target="_blank"
             href={window.APP.mdataProd + '/report/crmhome_report.htm?pageUri=campaign_analysis_brandowner_campaign_promo_data&funcCode=0309'}>查看活动效果</a>
        </Menu.Item>
      );

      this.Menuitems.push(download);

      // 口福项目暂且屏蔽活动效果查看
      if (!item.enterpriseBenefit) {
        this.Menuitems.push(promo);
      }
    }
    // 口碑福利新增 STARTED_UNAVAILABLE  STARTED_AVAILABLE 可以下架
    if (activityStatus === 'STARTED' || activityStatus === 'PLAN_GOING' || activityStatus === 'PLAN_ENDING' || activityStatus === 'STARTED_UNAVAILABLE' || activityStatus === 'STARTED_AVAILABLE') {
      const comfirmDown = (
        <Menu.Item key="comfirmDown">
          <a href="#" onClick={this.showTakeOff}>下架</a>
        </Menu.Item>
      );
      this.Menuitems.push(comfirmDown);
      this.showDownModal = true;
    }
    if (item.activityType !== 'REAL_TIME_SEND' && item.activityType !== 'CONSUME_SEND' && !item.bigBrandBuy && activityType !== 'BUY_ONE_SEND_ONE' && activityType !== 'RANDOM_REDUCE') {
      if (activityStatus === 'STARTED' || activityStatus === 'CLOSED' || activityStatus === 'PLAN_ENDING' || activityStatus === 'PLAN_GOING' ) {
        const market = (
          <Menu.Item key="market">
            <a href="#" onClick={this.showMarketing}>活动推广</a>
          </Menu.Item>
        );

        // 非口碑福利才有活动推广
        if (!item.enterpriseBenefit) {
          this.Menuitems.push(market);
          this.showMarket = true;
        }
      }
    }
  },

  showTakeOff(event) {
    event.preventDefault();

    this.setState({
      showOffModal: true,
    });
  },

  showMarketing(event) {
    event.preventDefault();

    this.setState({
      showMarketing: true,
    });
  },

  render() {
    const { activityId, enterpriseBenefit, activityType} = this.props.item;

    let detailLink = (this.state.windowHref).indexOf('op_merchant_id') >= 0 ? <a href={'#/marketing/brands/activity-view/' + activityId} >查看</a> : <a href={'#/marketing/brands/activity-view/' + activityId} target="_blank" >查看</a>;
    if (activityType === 'RANDOM_REDUCE') {
      detailLink = <a href={window.APP.kbretailprod + '/main.htm#/marketing/brands/activity-view/' + activityId} target="_blank" >查看</a>
    }
    // 如果是口碑福利活动，则跳口碑福利活动详情页
    if (enterpriseBenefit) {
      detailLink = <a href={'#/marketing/servers/welfare/' + activityId}>查看</a>;
    }

    return (
      <div>
        {
          detailLink
        }
        {
          this.Menuitems && this.Menuitems.length > 0 ? (
            <Dropdown overlay={ this.menu }>
              <span style={{color: '#2db7f5'}} className="ant-dropdown-link"> | 操作<Icon type="down" /></span>
            </Dropdown>
          ) : null
        }

        { this.showDownModal ? (<TakeOffModal item={this.props.item} onCancel={this.onCancel} show={this.state.showOffModal} refresh={this.props.refresh}/>) : null}

        { this.showMarket ? (<MarketingModal item={this.props.item} onCancel={this.onCancel} show={this.state.showMarketing}/>) : null}
      </div>
    );
  },
});

export default MoreAction;
