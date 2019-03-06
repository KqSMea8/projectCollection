import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { List } from '@alipay/qingtai';
import { openPage } from '@alipay/kb-m-biz-util';
import { VISIT_PURPOSE_ALL_MAP } from '../constants';
import './visit-list-item.less';

export default class extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    onClick: PropTypes.func,
    forceShowCreator: PropTypes.bool, // 当拜访人是自己，是否展示
  };

  onClick = () => {
    openPage(`./tka-visit-detail.html?id=${this.props.data.id}`);
  };

  render() {
    const { data, forceShowCreator } = this.props;
    return (<List.Item className="visit-list-item" arrow="horizontal" onClick={this.onClick} wrap
      data-aspm-n={this.props['data-aspm-n']}>
        <div className="customer-name-line">
          <span>{data.customerName}</span>
          {data.auditResult === '1' && <span className="review-result valid">有效</span>}
          {data.auditResult === '0' && <span className="review-result invalid">无效</span>}
        </div>
        <div className="customer-id">{data.customerId}</div>
        <div className="customer-sub-name">{data.companyName}</div>
        {(forceShowCreator || data.showCreator === '1') && <div className="visitor-name">拜访人：{data.creatorName}</div>}
        <div className="tags">
          {data.visitPurposes && data.visitPurposes.map(p => (
          VISIT_PURPOSE_ALL_MAP[p] && <span key={p}>{VISIT_PURPOSE_ALL_MAP[p]}</span>
          ))}
        </div>
            </List.Item>
    );
  }
}
