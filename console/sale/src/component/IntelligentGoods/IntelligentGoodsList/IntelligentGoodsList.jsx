import React, { PropTypes } from 'react';
import WaitingShelveList from './WaitingShelveList';
import ShelvedList from './ShelvedList';
import { Tabs, Alert } from 'antd';
import '../intelligentgoods.less';

const TabPane = Tabs.TabPane;

const IntelligentGoodsList = React.createClass({
  propTypes: {
    children: PropTypes.any,
  },
  getInitialState() {
    return {
      currentTab: 'waitingshelve',
      tabLocations: {
        waitingshelve: {
          query: {},
          search: ''
        },
        shelved: {
          query: {},
          search: ''
        }
      }
    };
  },
  componentWillMount() {
    this.updateTabLocation(this.props);
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.updateTabLocation(nextProps);
    }
  },
  onChange(key) {
    const search = this.state.tabLocations[key].search;
    window.location.hash = `/intelligentgoods/list/${key}${search}`;
  },
  setTabLocation(location, key) {
    const { tabLocations } = this.state;
    tabLocations[key] = {
      query: location.query,
      search: location.search
    };
    // console.log(key);
    // console.log(tabLocations);
    this.setState({
      tabLocations
    });
  },
  getActivityKey(props) {
    const { children } = props;
    let activeKey = 'waitingshelve';
    if (!children || children.type.displayName === 'WaitingShelveList') {
      activeKey = 'waitingshelve';
    } else if (children.type.displayName === 'ShelvedList') {
      activeKey = 'shelved';
    }
    return activeKey;
  },
  updateTabLocation(props) {
    const activeKey = this.getActivityKey(props);
    this.setTabLocation(props.location, activeKey);
  },
  render() {
    const { tabLocations } = this.state;
    const activeKey = this.getActivityKey(this.props);
    const tabs = [<TabPane tab="搬家列表" key="waitingshelve">
      <WaitingShelveList location={tabLocations.waitingshelve} isShow={activeKey === 'waitingshelve'}/>
    </TabPane>, <TabPane tab="异动列表" key="shelved">
      <ShelvedList location={tabLocations.shelved} isShow={activeKey === 'shelved'}/>
    </TabPane>];
    return (<div className="intelligentgoods-list">
      <div className="app-detail-header">
          智能商品库
      </div>
      <div className="kb-tabs-main">
        <div style={{ padding: '10px 10px 0 10px' }}>
          <Alert
            message="商品上架后，15天内不可修改商品名称、适用门店、原价、现价、库存。"
            // message="商品上架后，15天内不可修改商品名称、适用门店、原价、现价、库存。如果leads当前信息和竞对不一致，请“反馈报错”，系统将更新leads信息"
            type="warning"
            showIcon
          />
        </div>
        <Tabs defaultActiveKey=""
          activeKey={activeKey}
          onChange={this.onChange}
        >
          {tabs}
        </Tabs>
      </div>
    </div>);
  },
});
export default IntelligentGoodsList;
