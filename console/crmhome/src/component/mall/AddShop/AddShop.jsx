import React, {PropTypes} from 'react';
import {Button, Breadcrumb} from 'antd';
import getMallData from '../common/getMallData';
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
      range: 1,
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
  searchRound() {
    this.setState({
      isShowForm: true,
    });
  },
  searchRoundOne() {
    this.setState({
      isShowForm: false,
    });
  },
  isShowForm() {
    let Dome = '';
    if (this.state.isShowForm) {
      Dome = <SearchRoundTwo mallId={this.props.params.mallId} range="2" mallDistanceData={this.state.mallData} />;
    } else {
      Dome = <SearchRoundOne mallId={this.props.params.mallId} range="1" mallDistanceData={this.state.mallData} />;
    }
    return Dome;
  },
  render() {
    const {mallData} = this.state;
    if (!mallData.distance) {
      return <div></div>;
    }
    return (
      <div>
        <div className="app-detail-header">
          <Breadcrumb separator=">">
            <Breadcrumb.Item><a href="#/shop/backlog">已开门店</a></Breadcrumb.Item>
            <Breadcrumb.Item><a href={'#/mall/list/' + this.props.params.mallId}>{mallData.mall && (mallData.mall.shopName || '')}</a></Breadcrumb.Item>
            <Breadcrumb.Item>添加门店</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="kb-list-main" style={{position: 'relative'}}>
          <ButtonGroup>
            <Button onClick={this.searchRound} type={this.state.isShowForm ? 'primary' : 'ghost'}>搜搜附近</Button>
            <Button onClick={this.searchRoundOne} type={this.state.isShowForm ? 'ghost' : 'primary'}>附近{mallData.distance.near}公里</Button>
          </ButtonGroup>
          {this.state.isShowForm ? <span style={{marginLeft: 8}}>{mallData.mall && (mallData.mall.shopName || '')} 附近{mallData.distance.far}公里的门店：</span> : <span style={{marginLeft: 8}}>{mallData.mall && (mallData.mall.shopName || '')} 附近{mallData.distance.near}公里的门店如下：</span>}
             {this.isShowForm()}
        </div>
      </div>
    );
  },
});

export default AddShop;
