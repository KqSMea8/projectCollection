import React, { PureComponent } from 'react';
import PageList from 'rmc-pagelist/Antm2PageList';
import { setSpm } from '@alipay/kobe-util';
import { openPage } from '@alipay/kb-m-biz-util';
import { loadTeamVisit } from '../service';
import spmConfig from '../spm.config';
import './tab-team.less';

export default class extends PureComponent {
  state = {
    count: '-',
    list: [],
  };

  doLoadList = (pageNo) => (
    loadTeamVisit(pageNo).then(res => {
      if (pageNo === 1) {
        this.setState({ count: res.data.count });
      }
      if (!res.data.visitRecordUserList.length && pageNo === 1) {
        return Promise.reject(PageList.EmptyDataError);
      }
      const newList = (res.data && res.data.visitRecordUserList) || [];
      this.setState({ list: pageNo === 1 ? newList : this.state.list.concat(newList) });

      setTimeout(() => setSpm(spmConfig), 500);
      return newList.length > 0;
    })
  );

  clickVisitor(item) {
    openPage(`./tka-visit-list.html?opId=${item.opId}&visitorName=${encodeURIComponent(item.nickName)}`);
  }

  render() {
    const { count } = this.state;
    return (<div className={`tab-team ${this.props.className || ''}`}>
      <div className="tab-team-top">
        <div className="tip">当月名下商户受访数</div>
        <div className="value">{count}</div>
      </div>
      {this.state.list && this.state.list.length > 0 && (
        <div className="table-line title-line">
          <div className="index">名次</div>
          <div className="bd-name">BD小二</div>
          <div className="visit-count">当月名下商户受访数</div>
        </div>
      )}
      <PageList className="table" loadPage={this.doLoadList} pullRefreshLoad={this.doLoadList.bind(this, 1)}>
        {this.state.list && this.state.list.map((item, index) => (
          <div className="table-line" data-aspm-n={index + 1} key={index}
            onClick={this.clickVisitor.bind(this, item)}>
            <div className="index">
              <span data-index={index + 1}>{index + 1}</span>
            </div>
            <div className="bd-name">
              {(item.nickName && item.realName)
                ? <span>{item.nickName}({item.realName})</span>
                : <span>{item.nickName || item.realName}</span>}
            </div>
            <div className="visit-count">{item.curMonthVisitCount}</div>
          </div>
        ))}
      </PageList>
            </div>);
  }
}
