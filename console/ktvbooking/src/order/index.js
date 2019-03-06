import React, { PureComponent } from 'react';
import { object, array, func, bool, number, string } from 'prop-types';
import { page } from '@alipay/page-wrapper';
import { Icon, Form, Tabs, Row, Col, Input, Button, Tooltip } from 'antd';

import Page from '../common/components/page';
import ShopSelectFormItem from '../common/components/shop-select/form-item';
import NoPlan from '../common/components/no-plan';

import WaitConfirmTable from './components/wait-confirm-table';
import WaitConsumeTable from './components/wait-consume-table';
import ConsumedTable from './components/consumed-table';
import WaitPayCloseTable from './components/wait-pay-close-table';

import { pathToTab, tabToStatus } from './constants';

import store from './store';
import spmConfig from './spm.config';
import './style.less';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const CONTENT = (
  <div>
    <div>待接单：手工接单前提下，用户已完成付款，商家可以在“待接单”列表内操作确认接单或拒绝。</div>
    <div>未消费：预订成功的订单，用户到店消费时，商家可以在“未消费”列表内手动输入券码核销。</div>
    <div>已消费：商家确认该用户已到店消费，或用户超时未到店系统确认消费。</div>
    <div>已退订：用户在规定时间内取消订单，商家无需为该用户留房。</div>
    <div>已拒绝：用户已付款，但商家拒绝接单/没有及时接单，导致订单失败，系统自动为用户退款。</div>
  </div>
);

@page({
  store, spmConfig,
  auth: { menu: '4101' },
})
@Form.create()
export default class Order extends PureComponent {
  static propTypes = {
    dispatch: func,
    history: object,
    location: object,
    loading: bool,
    hasPlan: bool,
    list: array,
    form: object,
    pages: object,
    newMessageCount: number,
    orderId: string,
  }

  onShopChange = (shopId) => {
    if (shopId) {
      const tab = this.getTab();
      this.onTabChange(tab);
    }
  }

  handleSearch = () => {
    const { form: { validateFieldsAndScroll }, dispatch } = this.props;
    validateFieldsAndScroll(['checkShop', 'orderId'], { force: true, scroll: { offsetTop: 100 } }, (err, values) => {
      // console.log(err, values);
      if (!err) {
        const { checkShop: { shopId }, orderId } = values;
        dispatch({ type: 'queryWaitConfirmOrderCount', payload: { shopId } });
        dispatch({ type: 'getList', payload: {
          shopId,
          orderId: orderId.trim(),
          orderStatus: tabToStatus[this.getTab()],
        } });
      }
    });
  }

  clearOrderId = () => {
    const { form: { setFieldsValue } } = this.props;
    setFieldsValue({ orderId: '' });
    this.refresh();
  }

  getTab = () => {
    const { location: { pathname } } = this.props;
    return pathToTab[pathname] || 'stay';
  }

  onTabChange = (tab) => {
    const { form: { validateFieldsAndScroll, getFieldValue }, dispatch, history } = this.props;
    validateFieldsAndScroll(['checkShop'], { force: true, scroll: { offsetTop: 100 } }, (err, values) => {
      // console.log(err, values);
      if (!err) {
        const orderStatus = tabToStatus[tab];
        const { checkShop: { shopId } } = values;
        const orderId = getFieldValue('orderId');
        dispatch({ type: 'queryWaitConfirmOrderCount', payload: { shopId } });
        dispatch({ type: 'getList', payload: { shopId, orderId: (orderId || '').trim(), orderStatus } });
        history.replace(`/order/${tab}`);
      }
    });
  }

  onTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    this.refresh({ currentPage: current, pageSize });
  }

  refresh = (pageInfo) => {
    const { form: { validateFieldsAndScroll, getFieldValue }, dispatch, pages } = this.props;
    validateFieldsAndScroll(['checkShop'], { force: true, scroll: { offsetTop: 100 } }, (err, values) => {
      // console.log(err, values);
      if (!err) {
        const tab = this.getTab();
        const orderStatus = tabToStatus[tab];
        if (pageInfo) {
          Object.assign(pages[orderStatus], pageInfo);
        }
        const { checkShop: { shopId } } = values;
        const orderId = getFieldValue('orderId');
        dispatch({ type: 'queryWaitConfirmOrderCount', payload: { shopId } });
        dispatch({ type: 'getList', payload: {
          shopId,
          orderId: (orderId || '').trim(),
          orderStatus,
          pages: {
            ...pages,
          },
        } });
      }
    });
  }

  render() {
    const { loading, dispatch, form, history, hasPlan, newMessageCount, list, pages } = this.props;
    const { getFieldProps, getFieldValue } = form;
    const tab = this.getTab();
    const header = (
      <Tooltip title={CONTENT}>
        <span style={{ color: '#4c4c4c' }}><Icon type="question-circle-o" style={{ color: '#7f7f7f' }} /> 订单状态说明</span>
      </Tooltip>
    );
    const noticeMess = (<Tooltip title="只展示7天内订单"><Icon type="question-circle-o" /></Tooltip>);
    return (
      <Page title="订单管理" id="order" header={header}>
        <Form horizontal>
          <Row>
            <Col>
              <ShopSelectFormItem onChange={this.onShopChange} form={form} />
            </Col>
          </Row>
          <NoPlan history={history} hasPlan={hasPlan} />
          {
            hasPlan === true &&
            <Row gutter={16}>
              <Col offset={7} span={7}>
                <FormItem className="orderid">
                  <Input onPressEnter={this.handleSearch} {...getFieldProps('orderId', {
                    initialVal: '',
                    rules: [{
                      required: true, whitespace: true, message: '请输入订单号',
                    }, {
                      pattern: /^[0-9]{32}$/, message: '订单号只能输入32位数字',
                    }],
                  })} placeholder="请输入订单号" />
                  {getFieldValue('orderId') && <Icon onClick={this.clearOrderId} className="icon-clear" type="cross-circle" />}
                </FormItem>
              </Col>
              <Col span={10}>
                <Button className="btn-search" type="primary" size="large" onClick={this.handleSearch}>搜索</Button>
                <Tooltip title="搜索结果只展示1年内订单"><Icon type="question-circle-o" /></Tooltip>
              </Col>
            </Row>
          }
        </Form>
        {
          hasPlan === true &&
          <Tabs activeKey={tab} onChange={this.onTabChange} tabBarExtraContent={<span className="text-refresh" onClick={this.refresh}>刷新</span>}>
            <TabPane tab={<span className="space">待接单<span className="stay-sub">{newMessageCount > 0 && newMessageCount}</span></span>} key="stay">
              <WaitConfirmTable dispatch={dispatch} onTableChange={this.onTableChange}
                loading={loading} list={list} page={pages.WAIT_CONFIRM} refresh={this.refresh} />
            </TabPane>
            <TabPane tab="未消费" key="unused">
              <WaitConsumeTable form={form} dispatch={dispatch} onTableChange={this.onTableChange}
                loading={loading} list={list} page={pages.WAIT_CONSUME} refresh={this.refresh} />
            </TabPane>
            <TabPane tab={<span className="space">已消费{noticeMess}</span>} key="consumed">
              <ConsumedTable onTableChange={this.onTableChange}
                loading={loading} list={list} page={pages.CONSUMED} />
            </TabPane>
            <TabPane tab={<span className="space">已退订{noticeMess}</span>} key="back">
              <WaitPayCloseTable onTableChange={this.onTableChange}
                loading={loading} list={list} page={pages.REFUND} />
            </TabPane>
          </Tabs>
        }
      </Page>
    );
  }
}
