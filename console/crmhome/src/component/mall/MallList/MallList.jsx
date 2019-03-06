import React, {PropTypes} from 'react';
import {Button, Breadcrumb, Tabs} from 'antd';
import getMallData from '../common/getMallData';
import MallListForm from './MallListForm';
import MallListTable from './MallListTable';
import ConfirmMallListForm from './ConfirmMallListForm';
import ConfirmMallListTable from './ConfirmMallListTable';

const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;

const MallList = React.createClass({
  propTypes: {
    params: PropTypes.any,
    routes: PropTypes.array,
  },

  getInitialState() {
    return {
      mallData: {},
    };
  },

  componentWillMount() {
    getMallData(this.props.params.mallId, (mallData) => {
      this.setState({
        mallData,
      });
    });
  },

  onSearch(params) {
    this.setState({
      params,
    });
  },

  onChange(activeKey) {
    if (activeKey === 'unconfirmed') {
      window.location.href = '#/mall/list/' + this.props.params.mallId + '/unconfirmed';
    } else {
      window.location.href = '#/mall/list/' + this.props.params.mallId;
    }
  },

  addShop() {
    window.location.href = '#/mall/add-shop/' + this.props.params.mallId;
  },

  render() {
    const mallId = this.props.params.mallId;
    const activeKey = this.props.routes.length > 1 ? 'unconfirmed' : 'confirmed';
    const { mallData } = this.state;
    return (
      <div>
        <div className="app-detail-header" style={{borderBottom: 0}}>
          <Breadcrumb separator=">">
            <Breadcrumb.Item><a href="#/shop">已开门店</a></Breadcrumb.Item>
            <Breadcrumb.Item>{mallData.mall ? mallData.mall.shopName : ''}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="kb-list-main" style={{position: 'relative'}}>
          {activeKey === 'confirmed' && <ButtonGroup style={{position: 'absolute', right: 16, zIndex: 1}}>
            <Button type="primary" size="large" onClick={this.addShop}>添加门店</Button>
          </ButtonGroup>}
          <Tabs activeKey={activeKey} onChange={this.onChange} destroyInactiveTabPane>
            <TabPane tab="已关联门店" key="confirmed">
              <MallListForm onSearch={this.onSearch} cityId={mallData.mall ? mallData.mall.localization.region.cityId : ''} />
              <MallListTable mallId={mallId} shopStatus="1" params={this.state.params}/>
            </TabPane>
            <TabPane tab="待确认门店" key="unconfirmed">
              <ConfirmMallListForm onSearch={this.onSearch}/>
              <ConfirmMallListTable mallId={mallId} shopStatus="2" params={this.state.params}/>
            </TabPane>
          </Tabs>

        </div>
      </div>
    );
  },
});

export default MallList;
