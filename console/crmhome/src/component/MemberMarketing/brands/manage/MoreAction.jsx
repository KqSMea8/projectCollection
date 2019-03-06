import React, {PropTypes} from 'react';
import {Menu, Dropdown, Icon} from 'antd';
import TakeOffModal from './TakeOffModal';
import MarketingModal from './MarketingModal';
// import ajax from '../../../../common/ajax';

const MoreAction = React.createClass({
  propTypes: {
    item: PropTypes.object,
    index: PropTypes.number,
    refresh: PropTypes.func,
  },

  getInitialState() {
    return {
      showOffModal: false,
      showMarketing: false,
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
    const { planId, status } = item;

    this.Menuitems = [];

    this.showMarket = false;

    this.showDownModal = false;

    this.menu = (
      <Menu>
        {this.Menuitems}
      </Menu>
    );

    const modify = (
      <Menu.Item key="modify">
        <a href={'/goods/discountpromo/detail.htm?planId=' + planId}>修改</a>
      </Menu.Item>
    );

    const comfirmDown = (
      <Menu.Item key="comfirmDown">
        <a href="#" onClick={this.showTakeOff}>下架</a>
      </Menu.Item>
    );

    if (status === 'NO_CONFIRM_YET') {
      this.Menuitems.push(modify);
    }

    if (status !== 'END' && status !== 'OFFLINE' && status !== 'ONLINE_TO_OFFLINE' && status !== 'PREPARE' && status !== 'NO_CONFIRM_EVER') {
      this.Menuitems.push(comfirmDown);

      this.showDownModal = true;
    }

    if (status === 'ONLINE' || status === 'ONLINE_TO_OFFLINE' || status === 'END') {
      const download = (
        <Menu.Item key="download">
          <a target="_blank" href={'/promo/brand/downloadBrandBill.htm?planId=' + planId}>下载对账单</a>
        </Menu.Item>
      );

      const promo = (
        <Menu.Item key="promo">
          <a target="_blank" href={window.APP.mdataProd + '/report/crmhome_report.htm?pageUri=campaign_analysis_brandowner_campaign_promo_data&funcCode=0309'}>查看活动效果</a>
        </Menu.Item>
      );

      /* const market = (
        <Menu.Item key="market">
          <a href="#" onClick={this.showMarketing}>活动推广</a>
        </Menu.Item>
      ); */

      this.Menuitems.push(download);
      this.Menuitems.push(promo);
      // this.Menuitems.push(market);

      this.showMarket = true;
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
    const { planId } = this.props.item;

    return (
      <div>
        <a href={'/goods/discountpromo/detail.htm?planId=' + planId}>查看</a>

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
