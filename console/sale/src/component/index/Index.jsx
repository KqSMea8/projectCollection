import React from 'react';
import ajax from 'Utility/ajax';
import {message} from 'antd';
import TodoModule from './TodoModule';
import StoreOperationModule from './StoreOperationModule';
import RecordModule from './RecordModule';
import MyMerchantModule from './MyMerchantModule';
import IndustryAnalysisModule from './IndustryAnalysisModule';
import TradingTrendsModule from './TradingTrendsModule';
import CodeBizDataModule from './CodeBizDataModule';
import permission from '@alipay/kb-framework/framework/permission';
import './index.less';

const Index = React.createClass({
  getInitialState() {
    return {
      todoModule: false,
      storeOperationModule: false,
      myMerchantModule: false,
      industryAnalysisModule: false,
      tradingTrendsModule: false,
      showVisitRecord: false,
    };
  },

  componentDidMount() {
    const self = this;
    ajax({
      url: '/sale/queryInfo.json',
      method: 'get',
      type: 'json',
      success: (res) => {
        if ( res.status !== 'succeed') {
          return message.error('系统错误，请重试');
        }
        if (res.status === 'succeed') {
          self.setState({
            todoModule: res.data.showTask,
            storeOperationModule: res.data.showShopBiz,
            myMerchantModule: res.data.showMerchantBiz,
            industryAnalysisModule: res.data.showIndustryBiz,
            tradingTrendsModule: res.data.showTradeBiz,
            showVisitRecord: res.data.showVisitRecord,
          });
        }
      },
    });
  },

  render() {
    return (<div className="content-area kb-index-container">

      { this.state.todoModule ? <TodoModule /> : null }

      { permission('KOUBEI_CODE_BIZ_DATA_QUERY') && <CodeBizDataModule /> }

      { this.state.storeOperationModule ? <StoreOperationModule /> : null }

      { this.state.showVisitRecord ? <RecordModule /> : null }

      { this.state.myMerchantModule ? <MyMerchantModule /> : null }

      { this.state.industryAnalysisModule ? <IndustryAnalysisModule /> : null }

      { this.state.tradingTrendsModule ? <TradingTrendsModule /> : null }
    </div>);
  },
});

export default Index;
