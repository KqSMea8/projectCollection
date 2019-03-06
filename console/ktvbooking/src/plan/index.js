import React, { PureComponent } from 'react';
import { number, bool, object, func, string } from 'prop-types';
import { page } from '@alipay/page-wrapper';
import { Form, Steps } from 'antd';

import { mapProps, mapPropsToFields, onFieldsChange } from './rcform-option';
import ShopSelectFormItem from '../common/components/shop-select/form-item';
import Page from '../common/components/page';
import NoPlan from '../common/components/no-plan';

import SignModal from './components/sign-modal';
import Step1 from './components/step1';
import Step2 from './components/step2';
import Step3 from './components/step3';

import store from './store';
import spmConfig from './spm.config';
import './style.less';

const StepPages = [Step1, Step2, Step3];

@page({
  store, spmConfig,
  auth: { menu: '4104' },
})
@Form.create({ mapProps, mapPropsToFields, onFieldsChange })
export default class Plan extends PureComponent {
  static propTypes = {
    hasPlan: bool,
    currentStep: number,
    form: object,
    dispatch: func,
    shopId: string,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'queryMerchantSign', payload: { } });
  }

  onShopChange = (shopId) => {
    const { dispatch } = this.props;
    if (shopId) {
      dispatch({ type: 'setState', payload: { shopId, loading: true } });
      dispatch({ type: 'queryServiceList', payload: {} });
    }
  }

  render() {
    // window.f = this.props.form; // eslint-disable-line
    // window.props = this.props; // eslint-disable-line
    // window.getStorage = getStorage; // eslint-disable-line
    // window.setStorage = setStorage; // eslint-disable-line
    const { form, hasPlan, currentStep } = this.props;
    const StepPage = StepPages[currentStep];
    return (
      <Page id="plan" title="预订方案管理">
        <SignModal {...this.props} />
        {hasPlan === true && (
          <Steps current={currentStep}>
            <Steps.Step title="包房时段" />
            <Steps.Step title="套餐类型" />
            <Steps.Step title="价目表" />
          </Steps>
        )}
        <ShopSelectFormItem form={form} onChange={this.onShopChange} style={{ display: currentStep > 0 ? 'none' : '' }} />
        <NoPlan {...this.props} />
        {hasPlan === true && (
          <StepPage {...this.props} />
        )}
      </Page>
    );
  }
}
