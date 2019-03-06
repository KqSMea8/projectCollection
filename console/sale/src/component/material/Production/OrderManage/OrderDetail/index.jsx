import React, { Component } from 'react';

import { Tabs } from 'antd';

import AllocateRecordTab from './AllocateRecordTab';
import OrderInfoTab from './OrderInfoTab';
import PageLayout from 'Library/PageLayout';

import { getOrderDetail } from '../../../common/api';

const TabPane = Tabs.TabPane;

class OrderDetail extends Component {
  constructor(props) {
    super(props);
    const params = props.params;
    this.state = {
      data: null,
      loading: false,
      tab: params.tab,
      id: params.id
    };
  }
  componentDidMount() {
    // load data
    this.loadOrderDetail(this.state.id);
  }
  componentWillReceiveProps(nextProps) {
    const { params } = nextProps;
    const { tab, id } = this.state;
    if (params.id === id && params.tab === tab) return;
    this.setState({
      tab: params.tab,
      id: params.id
    });
    if (params.id !== id) {
      // load data
      this.loadOrderDetail(params.id);
    }
  }
  loadOrderDetail = (id) => {
    this.setState({loading: true});
    getOrderDetail(id)
      .then(res => {
        this.setState({
          loading: false,
          data: res.data
        });
      })
      .catch(() => {});
  };
  handleTabChange = (active) => {
    location.hash = `/material/production/order-manage/${this.state.id}/${active}`;
  };
  render() {
    const { tab, data, loading, id } = this.state;
    const breadcrumb = [
      {title: '预采购单管理', link: '#/material/production/order-manage'},
      {title: '详情'}
    ];
    return (
      <PageLayout
        breadcrumb={breadcrumb}
        spinning={loading}
        id="material-production-detail"
      >
        <Tabs defaultActiveKey="orderinfo" activeKey={tab} onChange={this.handleTabChange}>
          <TabPane key="orderinfo" tab="基本信息"><OrderInfoTab data={data}/></TabPane>
          <TabPane key="allocaterecord" tab="分配记录"><AllocateRecordTab id={id}/></TabPane>
        </Tabs>
      </PageLayout>
    );
  }
}

export default OrderDetail;
