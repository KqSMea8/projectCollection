import React, {PropTypes} from 'react';
import {Button, Breadcrumb, Tabs} from 'antd';
import MallListForm from './MallListForm';
import MallListTable from './MallListTable';
import ConfirmMallListForm from './ConfirmMallListForm';
import ajax from 'Utility/ajax';
import ConfirmMallListTable from './ConfirmMallListTable';
const TabPane = Tabs.TabPane;

const ButtonGroup = Button.Group;

const MallList = React.createClass({
  propTypes: {
    params: PropTypes.any,
    mallId: PropTypes.string,
  },
  getInitialState() {
    return {
      isState: true,
      data: '',
    };
  },
  componentWillMount() {
    this.refresh();
  },
  onSearch(params) {
    this.setState({
      params,
    });
  },
  refresh() {
    const params = {};
    params.mallId = this.props.params.mallId;
    ajax({
      url: window.APP.crmhomeUrl + '/shop/initMallInfo.json.kb',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        this.setState({
          data: result.data || {},
        });
      },
    });
  },
  addShop() {
    window.open('#/mall/add-shop/' + this.props.params.mallId);
  },
  changeStatus(v) {
    if (v === 'unconfirmed') {
      this.setState({
        isState: false,
      });
    } else {
      this.setState({
        isState: true,
      });
    }
  },
  render() {
    const mallId = this.props.params.mallId;
    const {data} = this.state || {};
    return (
      <div>
        <div className="app-detail-header" style={{borderBottom: 0}}>
          <Breadcrumb separator=">">
            <Breadcrumb.Item><a href="#/shop">已开门店</a></Breadcrumb.Item>
            <Breadcrumb.Item>{data && data.mall.shopName}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="kb-list-main" style={{position: 'relative'}}>
          {this.state.isState &&
          <ButtonGroup style={{position: 'absolute', right: 16, zIndex: 1}}>
            <Button type="primary" size="large" onClick={this.addShop}>添加门店</Button>
          </ButtonGroup>}
          <Tabs destroyInactiveTabPane onTabClick={this.changeStatus}>
            <TabPane tab="已关联门店" key="confirmed">
              <MallListForm onSearch={this.onSearch}/>
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
