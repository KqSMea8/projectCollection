import React, { PureComponent } from 'react';
import { func, object, array, string, bool } from 'prop-types';
import { Form } from 'antd';
import { page } from '@alipay/page-wrapper';

import Page from '../common/components/page';
import NoPlan from '../common/components/no-plan';
import ShopSelectFormItem from '../common/components/shop-select/form-item';

import TradeDate from './components/trade-date';
import TradeTotal from './components/trade-total';
import TradeParticulars from './components/trade-particulars';

import store from './store';
import spmConfig from './spm.config';

@page({
  store, spmConfig,
  auth: { menu: '4103' },
})
@Form.create()
export default class Trade extends PureComponent {
  static propTypes = {
    dispatch: func,
    history: object,
    form: object,
    hasPlan: bool,
    shopId: string,
    startDate: string,
    endDate: string,
    pageInfo: object,
    tradeTotalData: object,
    expenseAndRefundInfos: array,
  };

  onShopChange = (shopId) => {
    const { dispatch, pageInfo } = this.props;
    if (shopId) {
      dispatch({ type: 'queryExpenseAndRefundInfoDetail', payload: { shopId, pageInfo: { ...pageInfo, pageNo: 1 } } });
    }
  }

  render() {
    const { form, dispatch, history, hasPlan, shopId, startDate, endDate,
      tradeTotalData, pageInfo, expenseAndRefundInfos } = this.props;

    return (
      <Page title="消费统计" id="trade">
        <ShopSelectFormItem form={form} onChange={this.onShopChange} />
        <NoPlan history={history} hasPlan={hasPlan} />
        {
          hasPlan === true && (
            <div>
              <TradeDate form={form} dispatch={dispatch} startDate={startDate} endDate={endDate} />
              <TradeTotal tradeTotalData={tradeTotalData} />
              <TradeParticulars dispatch={dispatch}
                pageInfo={pageInfo} expenseAndRefundInfos={expenseAndRefundInfos}
                shopId={shopId} startDate={startDate} endDate={endDate} />
            </div>
          )
        }
      </Page>
    );
  }
}
