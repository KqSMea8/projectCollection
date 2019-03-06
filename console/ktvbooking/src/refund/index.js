import React, { PureComponent } from 'react';
import { Form, Tooltip, Icon } from 'antd';
import { page } from '@alipay/page-wrapper';
import { object, array, func, bool } from 'prop-types';

import Page from '../common/components/page';
import SearchForm from './components/search-form';
import ShopSelectFormItem from '../common/components/shop-select/form-item';
import RefundTable from './components/refund-table';
import NoPlan from '../common/components/no-plan';

import store from './store';
import spmConfig from './spm.config';

@page({
  store, spmConfig,
  auth: { menu: '4106' },
})
@Form.create()
export default class Refund extends PureComponent {
  static propTypes = {
    dispatch: func,
    list: array,
    form: object,
    hasPlan: bool,
    loading: bool,
    history: object,
  }

  onShopChange = (shopId) => {
    const { dispatch } = this.props;
    if (shopId) { // 测试是否设置过预订方案
      dispatch({ type: 'queryMerchantOrderByOrderId', payload: { shopId, orderId: '11111111111111111111111111111111' } });
    }
  }

  render() {
    const { form, history, dispatch, list, hasPlan, loading } = this.props;

    const text = '只能处理开唱前1小时内及超时未到店的订单';
    const header = (
      <Tooltip placement="top" title={text}>
        <span style={{ color: '#4c4c4c' }}>
          <Icon type="question-circle-o" style={{ color: '#7f7f7f' }} /> 退款订单说明
        </span>
      </Tooltip>
    );
    return (
      <Page title="手工退款管理" id="refund" header={header}>
        <ShopSelectFormItem form={form} onChange={this.onShopChange} />
        <NoPlan history={history} hasPlan={hasPlan} />
        {
          hasPlan === true && <SearchForm form={form} dispatch={dispatch} />
        }
        {
          hasPlan === true && <RefundTable dispatch={dispatch} list={list} loading={loading} />
        }
      </Page>
    );
  }
}
