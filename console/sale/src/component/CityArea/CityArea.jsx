import React from 'react';
import {Tabs} from 'antd';

import permission from '@alipay/kb-framework/framework/permission';
import CityAreaList from './CityAreaList/CityAreaList';
import UploadProgress from './UploadProgress/UploadProgress';
import CityMap from './CityMap/CityMap';

const TabPane = Tabs.TabPane;

const CityArea = React.createClass({
  getInitialState() {
    return {};
  },
  componentDidMount() {
  },
  componentWillUnmount() {
  },
  onChange(activeKey) {
    window.location.hash = `/cityarea/tabs/${activeKey}`;
  },
  render() {
    const {page} = this.props.params;
    const tabs = [];
    if (permission('TERRITORY_MAP')) {
      tabs.push(<TabPane tab="城市地图" key="map">
        <div style={{padding: 16}}>
          <CityMap queryParam={page === 'map' && this.props.location.query} />
        </div>
      </TabPane>);
    }

    if (permission('TERRITORY_QUERY')) {
      tabs.push(<TabPane tab="网格列表" key="list">
        <div style={{padding: 16}}>
          <CityAreaList/>
        </div>
      </TabPane>);
    }

    if (permission('TERRITORY_MANAGE')) {
      tabs.push(<TabPane tab="查看上传进度" key="upload">
        <div style={{padding: 16}}>
          <UploadProgress/>
        </div>
      </TabPane>);
    }
    return (
      <div className="kb-tabs-main" style={{position: 'relative'}}>
        <div className="app-detail-header" style={{borderBottom: 0, padding: '24px 16px 8px'}}>
          城市网格化
        </div>
        <Tabs
          activeKey={page}
          onChange={this.onChange}
          destroyInactiveTabPane
        >
          {tabs}
        </Tabs>
      </div>
    );
  },
});

export default CityArea;
