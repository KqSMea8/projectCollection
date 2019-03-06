import React, {PropTypes} from 'react';
import {message, Button, Spin, Popover, Icon} from 'antd';
import MenuList from './MenuList';
import ajax from '../../../../common/ajax';
import {getMerchantId, getCategoryId} from '../../common/utils';

const Menus = React.createClass({
  propTypes: {
    setButton: PropTypes.func,
    activeKey: PropTypes.string,
  },
  getInitialState() {
    this.merchantId = getMerchantId();
    return {
      hasDishes: false,
      hasShops: true,
      hasMenus: false,
      loading: false,
    };
  },
  componentDidMount() {
    this.setButton();
    this.fetch();
    this.fetchShops();
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.activeKey !== this.activeKey) {
      this.activeKey = nextProps.activeKey;
    }
  },
  setMemus(hasMenus) {
    this.setState({
      hasMenus,
    });
    this.setButton();
  },
  setButton() {
    const {setButton} = this.props;
    const {hasDishes, hasShops, hasMenus} = this.state;
    const isInCurrentPage = this.activeKey === 'Menus';
    const popoverContent = (<div>
      <Icon style={{color: '#2db7f5', verticalAlign: 'top', margin: '4px 4px 0px 0px'}} type="info-circle" />
      <div style={{display: 'inline-block'}}>所有门店已经配置过菜单，<br />可以直接修改菜单模板哦～</div>
    </div>);
    let button = null;
    if (hasDishes && hasMenus) {
      button = <Button style={{position: 'absolute', top: 0, right: 16, zIndex: 1}} type="primary" onClick={this.createMenu}>新建菜单模板</Button>;
      if (isInCurrentPage) setButton(<Popover visible={!hasShops} placement="bottomRight" content={popoverContent}>{button}</Popover>);
    } else {
      if (isInCurrentPage) setButton(button);
    }
  },
  fetch() {
    this.setState({
      loading: true,
    });
    const params = {};
    if (this.merchantId) params.op_merchant_id = this.merchantId;
    ajax({
      url: '/shop/kbdish/statistics.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          this.setState({
            hasDishes: !!res.totalCount,
          });
          this.setButton();
        } else {
          message.error(res.resultMsg);
        }
        this.setState({
          loading: false,
        });
      },
      error: (_, msg) => {
        message.error(msg);
        this.setState({
          loading: false,
        });
      },
    });
  },
  fetchShops() {
    const params = {};
    if (this.merchantId) params.op_merchant_id = this.merchantId;
    ajax({
      url: '/shop/kbmenu/shopQuery.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          this.setState({
            hasShops: !!res.shopCountGroupByCityVO.length,
          });
          this.setButton();
        } else {
          message.error(res.resultMsg);
        }
      },
      error: (_, msg) => {
        message.error(msg);
      },
    });
  },
  createMenu() {
    window.location.hash = '/decoration/' + getCategoryId() + '/menu/menu-create';
  },
  createDish() {
    window.location.hash = '/decoration/' + getCategoryId() + '/menu/dish-create';
  },
  render() {
    const {hasDishes, loading} = this.state;
    let listContent;
    if (!loading) {
      if (hasDishes) {
        listContent = <MenuList fetchShops={this.fetchShops} setMemus={this.setMemus} />;
      } else {
        listContent = (<div className="no-menu-content">
          <div className="wrapper">
            <p>想要向顾客展示店里的菜单？麻烦按照以下步骤进行设置：</p>
            <div className="step1">
              <div className="step-title"><div className="step-icon">1</div>添加菜品</div>
              <div className="step-detail">先将菜品上传到"门店图片"，<br />便于后续统一管理</div>
              <Button style={{marginTop: 12}} type="primary" onClick={this.createDish}>添加菜品</Button>
            </div>
            <div className="step2 disable">
              <div className="step-title"><div className="step-icon">2</div>新建菜单模板</div>
              <div className="step-detail">将"门店图片"中的菜品添加到菜单中，<br />顾客就可以在客户端的"口碑推荐"<br />中看到这些菜品</div>
            </div>
          </div>
        </div>);
      }
    } else {
      listContent = (<Spin />);
    }
    return (<div>
      {listContent}
    </div>);
  },
});

export default Menus;
