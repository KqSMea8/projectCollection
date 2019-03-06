import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { openPage } from '@alipay/kb-m-biz-util';
import { page as wrapper } from '@alipay/page-wrapper';
import { Badge, List } from '@alipay/qingtai';
import TouchScroll from 'rmc-touchscroll';
import createRenderH5Url from '../common/create-render-h5-url';
import store from './store';
import spmConfig from './spm.config';
import './style.less';

import { isEmptyArray, formatTimeEndDD } from '../common/util';
import Alert from '../common/component/alert';
import ExpandableText from '../common/component/expandable-text/index';
import Section from './component/section';

import { VISIT_PURPOSE_TKA_MAP } from '../common/constants';

const Item = List.Item;
/* eslint-disable */
@wrapper({ store, spmConfig })
class Index extends PureComponent {
  static propTypes = {
    initData: PropTypes.object,
  };
  constructor(props) {
    super(props);
  }

  handleClickHeader = () => {
    // http://render-dev.site.alipay.net/p/h5_dev/kb-m-tkacrm-S6180473/www/detail.html?pid=2088301224074575
    const url = createRenderH5Url(
      'kb-m-tkacrm',
      `/www/detail.html?pid=${this.props.initData.customerId}`
    );
    kBridge.call('pushWindow', url);
  };

  renderContacts() {
    const { initData } = this.props;
    if (isEmptyArray(initData.contacts)) return null;
    function getPositionTest(contact) {
      return `${
        contact.position === 'OTHER' ? contact.remark : contact.positionDesc
      }`;
    }
    return (
      <div>
        {initData.contacts.map((contact, i) => (
          <div key={i}>
            {`${getPositionTest(contact)}-${contact.name}`}
            {contact.tel ? `(${contact.tel || ''})` : ''}
          </div>
        ))}
      </div>
    );
  }

  renderPurposes() {
    const { initData } = this.props;
    if (isEmptyArray(initData.visitPurposes)) return null;
    return (
      <div className="detail-purposed">
        {initData.visitPurposes.map((purpose, i) => (
          <Badge
            key={i}
            className="weak"
            text={VISIT_PURPOSE_TKA_MAP[purpose]}
          />
        ))}
      </div>
    );
  }

  renderSection(title, text) {
    return (
      <Section title={title}>
        <ExpandableText text={text} />
      </Section>
    );
  }

  DigitalFeedbackClick = e => {
    const { digitalFeedback } = this.props;
    e.stopPropagation();
    openPage({
      url: 'digital-feedback.html',
      data: { digitalFeedback: JSON.stringify(digitalFeedback) },
    });
  };
  render() {
    const { initData } = this.props;
    const props = this.props;
    return (
      <TouchScroll id="index" fullScreen>
        {initData.invalidReason && (
          <Alert title="无效原因" description={initData.invalidReason} />
        )}
        <Section className="header" onClick={this.handleClickHeader}>
          <List>
            <div className="detail-name">
              {initData.customerName}
              {initData.auditResult === '1' && (
                <Badge className="stronger valid" text="有效" />
              )}
              {initData.auditResult === '0' && (
                <Badge className="stronger invalid" text="无效" />
              )}
            </div>
            <Item arrow="horizontal" wrap>
              <div>{initData.customerId}</div>
              <div>拜访人：{initData.creatorName}</div>
              {initData.restVisitUser && (
                <div>陪访人：{initData.restVisitUser}</div>
              )}
              {this.renderPurposes()}
            </Item>
          </List>
        </Section>
        <Section className="info">
          <List>
            {initData.companyName && (
              <Item extra={initData.companyName} wrap>
                拜访分公司
              </Item>
            )}
            <Item
              extra={formatTimeEndDD(initData.visitTime).replace(/-/g, '/')}
            >
              拜访时间
            </Item>
            <Item extra={this.renderContacts()} align="top" wrap>
              拜访对象
            </Item>
            {props.digitalFeedback && (
              <Item
                extra={<span style={{ color: '#666', float: 'right' }} className="hint-choose">
                  {Object.values(props.digitalFeedback).filter(v => v).length}项
                </span>}
                onClick={this.DigitalFeedbackClick}
                wrap
                arrow="horizontal"
              >
                数字化程度反馈
              </Item>
            )}
          </List>
        </Section>
        {initData.needTalkResult &&
          this.renderSection('需求&意向沟通-沟通结果', initData.needTalkResult)}
        {initData.signTalkResult &&
          this.renderSection('签约计划沟通-沟通结果', initData.signTalkResult)}
        {initData.activityTalkResult &&
          this.renderSection('活动复盘-沟通结果', initData.activityTalkResult)}
        {initData.otherTalkResult &&
          this.renderSection('其他-沟通结果', initData.otherTalkResult)}
        {initData.followPlan &&
          this.renderSection('下一步计划', initData.followPlan)}
        {initData.visitDesc &&
          this.renderSection('其他备注', initData.visitDesc)}
      </TouchScroll>
    );
  }
}

kBridge.ready(() => {
  ReactDOM.render(<Index />, document.querySelector('main'));
});
