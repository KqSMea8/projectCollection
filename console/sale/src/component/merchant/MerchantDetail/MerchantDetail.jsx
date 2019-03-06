import React, {PropTypes} from 'react';
import {Tabs, Button } from 'antd';
import MerchantInfo from './MerchantInfo';
import MerchantOrder from './MerchantOrder';
import MerchantLog from './MerchantLog';
import TransferAction from '../common/TransferAction';
import ajax from 'Utility/ajax';
import permission from '@alipay/kb-framework/framework/permission';

const TabPane = Tabs.TabPane;

const MerchantDetail = React.createClass({
  propTypes: {
    children: PropTypes.any,
    params: PropTypes.object,
    location: PropTypes.object,
  },

  getInitialState() {
    this.pid = this.props.params.pid;
    return {
      merchantInfo: {},
    };
  },

  componentWillMount() {
    this.fetchMerchantInfo();
  },

  gotoEditPage(e) {
    e.preventDefault();
    window.open(window.APP.salesmngUrl + '/merchant/merchantInfo.htm?infoType=merc&merchantId=' + (this.state.merchantInfo.merchantId || ''));
  },

  handleServiceConfig() {
    window.open('#/merchant/config/' + this.pid);
  },

  handleChangeTabs(key) {
    window.location.hash = '/merchant/detail/' + this.pid + '/' + key;
  },

  refresh(res) {
    // 判断商户是否在管理的下属中
    if (res.subordinateFlag === true) {
      setTimeout(() => {
        this.fetchMerchantInfo();
      }, 500);

      const children = this.props.children;
      if (children && children.type === MerchantOrder) {
        this.refs.merchantOrder.refresh();
      } else if (children && children.type === MerchantLog) {
        this.refs.merchantLog.refresh();
      } else {
        this.refs.merchantInfo.refresh();
      }
    } else {
      window.location.hash = '/merchant';
    }
  },

  fetchMerchantInfo() {
    ajax({
      url: '/sale/merchant/merchantInfoByPartnerId.json',
      method: 'get',
      data: {
        partnerId: this.pid,
      },
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          this.setState({
            merchantInfo: res.data,
          });
        }
      },
    });
  },

  render() {
    const children = this.props.children;
    const {merchantInfo} = this.state;
    const pid = this.pid;
    let activeKey = 'info';
    if (children && children.type === MerchantOrder) {
      activeKey = 'order';
    } else if (children && children.type === MerchantLog) {
      activeKey = 'log';
    }

    return (<div className="kb-detail-main">
        <h2 className="kb-page-title">商户详情</h2>
        <div style={{float: 'right', marginTop: -47}}>
          {
            merchantInfo.canTransferFlag === true ? (
            <TransferAction data={merchantInfo} onRefresh={this.refresh}>
              <Button type="primary" style={{marginRight: 8}}>转移商户</Button>
            </TransferAction>
            ) : null
          }
          {
            permission('MERCHANT_EDIT') && <Button type="primary" onClick={this.gotoEditPage} style={{marginRight: 8}}>修改信息</Button>
          }
          {
            merchantInfo.canConfigFlag === true ? (
            <Button type="primary" onClick={this.handleServiceConfig}>业务配置</Button>
            ) : null
          }
        </div>

        <Tabs activeKey={activeKey} onChange={this.handleChangeTabs} destroyInactiveTabPane>
          <TabPane tab="商户信息" key="info">
            <MerchantInfo ref="merchantInfo" pid={pid} />
          </TabPane>
          <TabPane tab="订单列表" key="order">
            <MerchantOrder ref="merchantOrder" pid={pid} />
          </TabPane>
          <TabPane tab="操作日志" key="log">
            <MerchantLog ref="merchantLog" pid={pid} />
          </TabPane>
        </Tabs>
      </div>);
  },

});

export default MerchantDetail;
