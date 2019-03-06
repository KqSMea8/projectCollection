import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { page as wrapper } from '@alipay/page-wrapper';
import { setSpm, getParam } from '@alipay/kobe-util';
import VisitList from '../common/component/visit-list';
import { visitList } from './service';

import store from './store';
import spmConfig from './spm.config';
import './style.less';

@wrapper({ store, spmConfig })
class Index extends PureComponent {
  doLoadList = (pageNo) => (
    visitList({
      pageNum: pageNo,
      opId: getParam().opId,
    }).then(res => {
      // 主动更新 spm
      setTimeout(() => {
        setSpm(spmConfig);
      }, 500);
      return res;
    })
  );

  render() {
    return (<VisitList className="visit-list" loadList={this.doLoadList} />);
  }
}

kBridge.ready(() => {
  ReactDOM.render(
    <Index />,
    document.querySelector('main'),
  );
});
