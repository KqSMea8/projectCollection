import React from 'react';
import PropTypes from 'prop-types';
import { List } from '@alipay/qingtai';
import PageList from 'rmc-pagelist/Antm2PageList';
import VisitListItem from './visit-list-item';
import { formatDayFriendly } from '../../common/util';
import './visit-list.less';

export default class extends React.Component {
  static propTypes = {
    loadList: PropTypes.func,
    height: PropTypes.any,
    style: PropTypes.object,
    className: PropTypes.string,
    forceShowCreator: PropTypes.bool, // 当拜访人是自己，是否展示
  };

  state = {
    groupCollection: {}, // { '12/11 今日': [] }
  };

  doLoadList = (pageNo) => (
    this.props.loadList(pageNo).then(res => {
      const data = res.data;
      if (!data.data) throw new Error('数据异常');
      if (!data.data.length && pageNo === 1) {
        return Promise.reject(PageList.EmptyDataError);
      }
      let { groupCollection } = this.state;
      if (pageNo === 1) groupCollection = {};
      // 按日期 group
      data.data.forEach(item => {
        const groupKey = formatDayFriendly(item.visitTime);
        const list = groupCollection[groupKey] || [];
        if (!groupCollection[groupKey]) groupCollection[groupKey] = list;
        list.push(item);
      });
      this.setState({ groupCollection });
      return data.totalPages > pageNo;
    })
  );

  render() {
    const { groupCollection } = this.state;
    let spmN = 1;
    return (<PageList height={this.props.height}
      style={this.props.style}
      className={`visit-list ${this.props.className || ''}`}
      loadPage={this.doLoadList}
      pullRefreshLoad={this.doLoadList.bind(this, 1)}>
      {Object.keys(groupCollection).map(group => (
        <List renderHeader={group} key={group}>
          {groupCollection[group].map((item, index) => (
            <VisitListItem data={item} key={index} data-aspm-n={spmN++}
              forceShowCreator={this.props.forceShowCreator} />
          ))}
        </List>
      ))}
            </PageList>);
  }
}
