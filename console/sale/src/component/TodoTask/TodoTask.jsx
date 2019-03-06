import React, {PropTypes} from 'react';
import { Tabs } from 'antd';
import CityTaskManagement from './CityTaskManagement';
import CountryTaskManagement from './CountryTaskManagement';
import permission from '@alipay/kb-framework/framework/permission';

const TabPane = Tabs.TabPane;

const TaskDetail = React.createClass({
  propTypes: {
    form: PropTypes.object,
    row: PropTypes.object,
  },
  render() {
    const tabs = [];
    if (!!permission('BUSINESS_TASK_QUERY')) {
      tabs.push(<TabPane tab="城市任务" key="city">
        <div style={{padding: 16}}><CityTaskManagement /></div>
      </TabPane>);
    }
    if (!!permission('BUSINESS_TASK_GROUP_QUERY')) {
      tabs.push(<TabPane tab="全国任务" key="country">
        <div style={{padding: 16}}><CountryTaskManagement /></div>
      </TabPane>);
    }
    return (<div className="kb-tabs-main">
      <Tabs destroyInactiveTabPane>
        {tabs}
      </Tabs>
    </div>);
  },
});

export default TaskDetail;
