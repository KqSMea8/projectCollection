import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { page as wrapper } from '@alipay/page-wrapper';
import { Tabs } from '@alipay/qingtai';
import MyMerchantList from './components/my-merchant-list';
import UnderMerchantList from './components/under-merchant-list';
import store from './store';
import spmConfig from './spm.config';
import './style.less';

const tabs = [
  { title: '我的商户' },
  { title: '下属的商户' },
];

@wrapper({ store, spmConfig })
class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.tabInit = { [props.tabIndex]: true };
  }

  onTabChange = (tab, index) => {
    this.props.dispatch({ type: 'setTabIndex', payload: index });
    this.tabInit[index] = true;
  };

  isTabInit(index) {
    return this.tabInit[index];
  }

  render() {
    const { tabIndex } = this.props;
    return (<div className="visit-merchant-page">
      <Tabs page={tabIndex} tabs={tabs} animated={false} swipeable={false}
        onChange={this.onTabChange}>
        {this.isTabInit(0) ? <MyMerchantList className="merchant-list" {...this.props} /> : <div />}
        {this.isTabInit(1) ? <UnderMerchantList className="merchant-list" {...this.props} /> : <div />}
      </Tabs>
            </div>);
  }
}


kBridge.ready(() => {
  ReactDOM.render(
    <Index />,
    document.querySelector('main'),
  );
});
