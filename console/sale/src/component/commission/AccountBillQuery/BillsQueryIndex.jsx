import React, {PropTypes} from 'react';
import {Tabs} from 'antd';
import BillsQueryList from './BillsQueryList';
import InvoicesQueryList from './InvoicesQueryList';
import AppealList from './appeal/AppealList';
import BillCustomerService from './bill/BillCustomerService.jsx';
import './bills.less';
const TabPane = Tabs.TabPane;

const BillsQueryIndex = React.createClass({
  propTypes: {
    children: PropTypes.any,
  },
  componentWillMount() {
    this.params = {};
  },
  onChange(activeKey) {
    window.location.hash = 'accountBill/' + activeKey;
  },
  getParams() {
    return this.params;
  },
  setParams(params) {
    this.params = params;
  },
  render() {
    const option = {};
    const {pathname} = this.props.location;
    if (this.props.params.billNo) {
      option.billNo = this.props.params.billNo;
    }
    if (this.props.params.pid) {
      option.pid = this.props.params.pid;
    }
    let activeKey = 'BillsList';
    if (this.props.children) {
      if (this.props.children.type === BillsQueryList) {
        activeKey = 'BillsList';
      } else if (this.props.children.type === InvoicesQueryList) {
        activeKey = 'InvoicesList';
      } else if (pathname.indexOf('AppealList') !== -1) {
        activeKey = 'AppealList';
      }
    }

    return (
      <div className="kb-tabs-main" style={{position: 'relative'}}>
        <div className="tabs-top-right-plugin">
            <BillCustomerService visible/>
          </div>
        <Tabs activeKey={activeKey} onChange={this.onChange} destroyInactiveTabPane>
            <TabPane tab="账单查询" key="BillsList">
                <div style={{padding: 16}}>
                  <BillsQueryList setParams={this.setParams} params={this.props.params}/>
                </div>
            </TabPane>
            <TabPane tab="发票查询" key="InvoicesList">
              <div style={{padding: 16}}>
                  <InvoicesQueryList {...option} setParams={this.setParams}/>
              </div>
            </TabPane>
            <TabPane tab="申诉记录" key="AppealList">
              <div style={{padding: 16}}>
                  <AppealList {...option} setParams={this.setParams}/>
              </div>
            </TabPane>
          </Tabs>
      </div>
      );
  },
});

export default BillsQueryIndex;
