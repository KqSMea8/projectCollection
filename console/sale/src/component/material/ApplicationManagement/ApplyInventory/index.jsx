import React, {PropTypes} from 'react';
import PurchaseTable from './PurchaseTable';
import SubmitTable from './SubmitTable';
import {Steps} from 'antd';
import './index.less';
import permission from '@alipay/kb-framework/framework/permission';
import ErrorPage from 'Library/ErrorPage/NoPermission';
import PageLayout from 'Library/PageLayout';
const Step = Steps.Step;

/**
 * 配置报名商品/商品报名信息浮层
 */

const ConfigModal = React.createClass({
  propTypes: {
    detailData: PropTypes.object,
  },

  getInitialState() {
    return {
      step: 1,
      step1data: {}, // 缓存在modal的第一步选择数据
      step2params: {
        ...this.props.step2params,
      },
    };
  },

  // 第一步跳转第二步
  onStepOneSubmit(data) {
    this.setState({
      step: 2,
      step1data: data,
    });
  },

  // 第二步返回第一步
  onStepTwoCancel(selectedLists) {
    this.setState({
      selectedLists,
      step: 1,
    });
  },

  render() {
    const { step } = this.state;
    if (!permission('STUFF_PRODUCE_ORDER_DISPATCH')) {
      return (<ErrorPage />);
    }
    const breadcrumb = [
      {title: '申请单管理', link: '#/material/applicationManagement/applicationRecord'},
      {title: '调度预采库存'}
    ];
    return (
      <PageLayout breadcrumb={breadcrumb}>
            <Steps current={step - 1} style={{margin: '0 auto', width: '60%'}}>
              <Step title="选择预采购库存"/>
              <Step title="选择申请单需采购项目" />
            </Steps>
          {
            step === 1 ? <PurchaseTable
              onNext={this.onStepOneSubmit} /> :
            <SubmitTable
              chosenData={this.state.step1data} />
          }
      </PageLayout>
    );
  },
});

export default ConfigModal;
