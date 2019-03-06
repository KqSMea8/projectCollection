import React, {PropTypes} from 'react';
import {Button, Breadcrumb} from 'antd';
import ajax from 'Utility/ajax';
import SearchRoundOne from './SearchRoundOne';
import SearchRoundTwo from './SearchRoundTwo';

const ButtonGroup = Button.Group;

const AddShop = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    return {
      isShowForm: false,
      rangeType: 'near',
      data: '',
      rangeTypeTab: {},
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
        const rangeTypeTab = {};
        rangeTypeTab.isTab = 'success';
        this.setState({
          rangeTypeTab,
          shopName: result.data.mall.shopName,
          rangeType: result.data.distance,
        });
      },
      error: () => {
        const rangeTypeTab = {};
        rangeTypeTab.isTab = 'error';
        this.setState({
          rangeTypeTab,
        });
      },
    });
  },
  seachRound() {
    this.setState({
      isShowForm: true,
    });
  },
  seachRoundOne() {
    this.setState({
      isShowForm: false,
    });
  },
  isShowForm() {
    let Dome = '';
    const {rangeType} = this.state;
    if (this.state.isShowForm) {
      Dome = <SearchRoundTwo mallId={this.props.params.mallId} rangeType={rangeType.far} />;
    } else {
      Dome = <SearchRoundOne mallId={this.props.params.mallId} rangeType={rangeType.near} />;
    }
    return Dome;
  },
  render() {
    const {shopName, rangeType, rangeTypeTab} = this.state || {};
    return (
      <div>
        <div className="app-detail-header">
          <Breadcrumb separator=">">
            <Breadcrumb.Item><a href="#/shop">已开门店</a></Breadcrumb.Item>
            <Breadcrumb.Item><a href={'#/mall/list/' + this.props.params.mallId}>{shopName}</a></Breadcrumb.Item>
            <Breadcrumb.Item>添加门店</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="kb-list-main" style={{position: 'relative'}}>
          <ButtonGroup>
            <Button onClick={this.seachRound} type={this.state.isShowForm ? 'primary' : 'ghost'}>搜搜附近</Button>
            <Button onClick={this.seachRoundOne} type={this.state.isShowForm ? 'ghost' : 'primary'}><span>附近{rangeType.near}公里</span></Button>
          </ButtonGroup>
          {this.state.isShowForm ? (<span style={{marginLeft: 8}}>搜索{shopName}附近{rangeType.far}公里的门店：</span>) : (<span style={{marginLeft: 8}}>{shopName} 附近{rangeType.near}公里的门店如下：</span>)}
             {rangeTypeTab.isTab && this.isShowForm()}
        </div>
      </div>
    );
  },
});

export default AddShop;
