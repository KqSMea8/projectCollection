import React, { PropTypes } from 'react';
import * as antd from 'antd';
import { Link } from 'react-router';
import RateForm from './RateForm';
import RateTable from './RateTable';

const Breadcrumb = antd.Breadcrumb;
const BItem = Breadcrumb.Item;

let sceneLink;
let sceneHome;
let sceneName;

const RateIndex = React.createClass({
  contextTypes: {
    location: PropTypes.object,
  },
  getInitialState() {
    const defaultDateRange = this.getDefaultDateRange();
    return {
      params: {
        gmtCreateStart: defaultDateRange[0],
        gmtCreateEnd: defaultDateRange[1],
      },
      defaultDateRange,
    };
  },
  componentWillMount() {
    const query = this.props.location.query.shop;
    switch (query) {
    case 'RATE_MENU_SHOP':
      sceneLink = '/shop';
      sceneHome = '已开门店';
      sceneName = '门店借记卡0费率';
      break;
    case 'RATE_MENU_TEAM':
      sceneLink = 'shop/team';
      sceneHome = '团队门店';
      sceneName = '门店借记卡0费率';
      break;
    case 'CITY_MESSAGE':
      sceneLink = '/merchant';
      sceneHome = '服务商';
      sceneName = '导入大区-城市信息';
      break;
    default:
      break;
    }
  },
  onSearch(params) {
    this.setState({
      params,
    });
  },
  getDefaultDateRange() {
    const now = Date.now();
    const gmtCreateStart = new Date(now);
    const gmtCreateEnd = new Date(now);
    gmtCreateStart.setMonth(gmtCreateStart.getMonth() - 1);
    return [gmtCreateStart, gmtCreateEnd];
  },
  render() {
    const rateShop = this.props.location.query.shop;
    const {defaultDateRange, params, forceRefresh} = this.state;
    return (
      <div className="kb-tabs-main" style={{ position: 'relative' }}>
        {/* <div style={{ borderBottom: 0, padding: '24px 16px 8px' }} className="app-detail-header">门店0费率</div>*/ }
          <div>
            <div className="app-detail-header">
              <Breadcrumb separator=">">
                <BItem><Link to={sceneLink}>{sceneHome}</Link></BItem>
                <BItem>{sceneName}</BItem>
              </Breadcrumb>
            </div>
            <div style={{margin: '15px 16px 0 16px'}}>
              <RateForm onSearch={this.onSearch} defaultDateRange={defaultDateRange} />
              <RateTable params={params} forceRefresh={forceRefresh} defaultDateRange={defaultDateRange} scene={rateShop}/>
            </div>
          </div>
      </div>
    );
  },
});

export default RateIndex;
