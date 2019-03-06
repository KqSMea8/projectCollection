import React, { PropTypes } from 'react';
import { Tabs, Button } from 'antd';
import BrandActivityTable from './BrandActivityTable';
import BrandActivityForm from './BrandActivityForm';
import MarketingCaseTable from './MarketingCase/MarketingCaseTable';

const TabPane = Tabs.TabPane;

const locationMap = {
  '1': '/goods/itempromo/activityList.htm',
  '2': '/goods/itempromo/recruitOrderQueryInit.htm',
  '4': '/goods/itempromo/index.htm',
};


const ManageList = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    return {
    };
  },

  onTabClick(key) {
    const arr = ['brandType', 'externalType', 'makertingPlan'];
    if (arr.indexOf(key) !== -1) {
      return;
    }
    window.location.href = locationMap[key];  // eslint-disable-line no-location-assign
  },

  onSearch(params) {
    this.setState({
      params,
    });
  },

  renderOther() {
    const { type } = this.props.params;
    if (type === 'brandType') {
      return (<div>
        <BrandActivityForm onSearch={this.onSearch}/>
        <BrandActivityTable params={this.state.params} />
      </div>);
    }
    return (<MarketingCaseTable />);
  },
  render() {
    const { name } = this.props.params;
    return (
      <div className="kb-manage">
        {name !== 'isKbservLogin' && <h2 className="kb-page-title" style={{border: 'none'}}>营销管理</h2>}
        <div style={{height: 5}}>
          <div style={{float: 'right', marginRight: 20, marginTop: -36}}>
            <a href="/main.htm#/validationsku" target="__blank"><Button type="ghost" size="large" style={{ color: '#2db7f5' }}>活动SKU验证</Button></a>
          </div>
        </div>
        {name !== 'isKbservLogin' ? <div style={{width: 997}}>
            <Tabs defaultActiveKey={this.props.params.type} onChange={this.onTabClick}>
              <TabPane tab="营销活动" key="1"/>
              <TabPane tab="口碑活动" key="2"/>
              <TabPane tab="第三方活动" key="brandType">
                <div className="app-detail-content-padding" style={{paddingTop: 0}}>
                  <BrandActivityForm onSearch={this.onSearch}/>
                  <BrandActivityTable params={this.state.params} />
                </div>
              </TabPane>
              <TabPane tab="优惠券" key="4"/>
              <TabPane tab="营销方案" key="makertingPlan">
                <div className="app-detail-content-padding" style={{paddingTop: 0}}>
                  <MarketingCaseTable />
                </div>
              </TabPane>
            </Tabs>
        </div> :
        <div className="app-detail-content-padding" style={{paddingTop: 0}}>
          {this.renderOther()}
        </div>}
      </div>
    );
  },
});

export default ManageList;
