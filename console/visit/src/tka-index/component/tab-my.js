import React, { PureComponent } from 'react';
import { setSpm } from '@alipay/kobe-util';
import VisitList from '../../common/component/visit-list';
import { loadMyVisit } from '../service';
import spmConfig from '../spm.config';

export default class extends PureComponent {
  doLoadList = (pageNo) => (
    loadMyVisit(pageNo).then(res => {
      // 主动更新 spm
      setTimeout(() => {
        setSpm(spmConfig);
      }, 500);
      return res;
    })
  );

  render() {
    return (<VisitList className={this.props.className} height="100%" loadList={this.doLoadList} />);
  }
}
