import React, {PropTypes} from 'react';
import {Breadcrumb, Tabs, Button, message} from 'antd';
import ajax from '../../../common/ajax';
import getMallData from '../common/getMallData';
import MallDetailBase from './MallDetailBase';
import MallDetailHistory from './MallDetailHistory';

const TabPane = Tabs.TabPane;

const MallDetail = React.createClass({
  propTypes: {
    params: PropTypes.object,
    children: PropTypes.any,
  },

  getInitialState() {
    return {
      data: {},
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

  componentDidMount() {
    this.fetch();
  },

  onChange(key) {
    const mallId = this.props.params.mallId;
    window.location.hash = '/mall/detail/' + mallId + '/' + key;
  },

  gotoAdmin() {
    const mallId = this.props.params.mallId;
    window.open('#/mall/list/' + mallId);
  },

  fetch() {
    const params = {
      shopId: this.props.params.mallId,
    };
    ajax({
      url: '/shop/crm/shopDetailConfig.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result && result.status === 'succeed') {
          this.setState({
            data: result.data,
          });
        } else {
          message.error(result.errorMsg, 3);
        }
      },
    });
  },

  render() {
    let activeKey = 'base';
    if (this.props.children) {
      const type = this.props.children.type;
      switch (type) {
      case MallDetailBase:
        activeKey = 'base';
        break;
      case MallDetailHistory:
        activeKey = 'history';
        break;
      default:
        activeKey = 'base';
        break;
      }
    }
    const mallId = this.props.params.mallId;
    const {data, mallData} = this.state;

    return (
      <div className="kb-detail-main __fix-ant-tabs">
        <div className="app-detail-header" style={{borderBottom: 0}}>
          <Breadcrumb separator=">">
            <Breadcrumb.Item><a href="#/shop">已开门店</a></Breadcrumb.Item>
            <Breadcrumb.Item>{mallData.mall && (mallData.mall.shopName || '')}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div style={{float: 'right', marginTop: -55}}>
          {data.showEdit && <Button type="primary" onClick={this.gotoAdmin}>管理</Button>}
        </div>
        <Tabs activeKey={activeKey} onChange={this.onChange} destroyInactiveTabPane>
          <TabPane tab="基础信息" key="base"><MallDetailBase id={mallId}/></TabPane>
          <TabPane tab="操作日志" key="history"><MallDetailHistory id={mallId}/></TabPane>
        </Tabs>
      </div>
    );
  },
});

export default MallDetail;
