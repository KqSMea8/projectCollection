import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { page as wrapper } from '@alipay/page-wrapper';
import { getParam } from '@alipay/kobe-util';
import { SearchBar } from '@alipay/qingtai';
import VisitList from '../common/component/visit-list';
import { searchList } from './service';

import store from './store';
import spmConfig from './spm.config';
import './style.less';

@wrapper({ store, spmConfig })
class Index extends PureComponent {
  doLoadList = (pageNo) => (
    searchList({
      pageNum: pageNo,
      opId: getParam().opId,
      customerName: this.props.searchingValue,
    })
  );

  onSearchValueChange = (value) => {
    this.props.dispatch({ type: 'onSearchValueChange', payload: value });
  };

  doSearch = (value) => {
    this.props.dispatch({ type: 'doSearch', payload: value });
  };

  render() {
    const { searchValue, searchingValue, listKey } = this.props;

    return (<div className="visit-search">
      <SearchBar value={searchValue}
        onChange={this.onSearchValueChange}
        onSubmit={this.doSearch}
        placeholder="商户名/分公司名/拜访人名" />
      {searchingValue && <VisitList key={listKey} className="list" loadList={this.doLoadList} forceShowCreator />}
            </div>);
  }
}

kBridge.ready(() => {
  ReactDOM.render(
    <Index />,
    document.querySelector('main'),
  );
});
