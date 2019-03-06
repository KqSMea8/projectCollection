import { Popconfirm, message} from 'antd';

import React, { PropTypes } from 'react';
import MoreAction from 'layout/MoreAction';
import ajax from '../../../../../common/ajax';
import ReactMixin from 'react-mixin';

const api = {
  agreeOnOrOffline: '/goods/kbsmartplan/agreeOnOrOffline.json', // 商户确认上架（同意）
  ProviderOffline: '/goods/kbsmartplan/providerOffline.json',//  服务商下架
};
/**
 * 任务列表
 */
@ReactMixin.decorate(MoreAction)
export default class MarketingCaseAction extends React.Component {
  constructor() {
    super();
  }
  getActionMap = () => {
    const {smartPromoId} = this.props.data;
    const {allowOfflineConfirm, allowOnlineConfirm, allowModify, allowModifyConfirm} = this.props.data;
    let btn = 'none';
    if (allowOnlineConfirm) {
      btn = 'online';
    } else if (allowOfflineConfirm) {
      btn = 'offline';
    } else if (allowModify) {
      btn = 'modify';
    } else if (allowModifyConfirm) {
      btn = 'modifyConfirm';
    }
    const actionMap = {
      'mechantView': {
        text: '查看',
        onClick: () => {
          window.open(`#/marketing/brands/detail/${smartPromoId}/${btn}?system=crmhome`);
        },
      },
      'provideView': {
        text: '查看',
        render: () => (// 有iframe查看不跳转
          <a href={`#/marketing/brands/detail/${smartPromoId}/${btn}?system=sale`}>查看</a>
        ),
      },
      'modify': {
        text: '修改',
        render: () => (
          <a href={`#/marketing/brands/detailmodify/${smartPromoId}/${btn}?system=sale`}>修改</a>
        ),
      },
      'modifyCrm': { // 商家中心修改
        text: '修改',
        render: () => (
          <a href={`#/marketing/brands/detailmodify/${smartPromoId}/${btn}?system=crmhome`}>修改</a>
        ),
      },
      'agreeModify': {
        text: '确认修改',
        render: () => (
          <a href={`#/marketing/brands/detail/${smartPromoId}/${btn}?system=crmhome`}>确认修改</a>
        ),
      },
      'agreeOnline': {
        text: '确认上架',
        render: () => {
          return (<Popconfirm title="为确保体验计划效果，活动到期前将无法下架。" onConfirm={this.handleClick.bind(this, 'agreeOnOrOffline', 'PASS')}>
            <a>确认上架</a>
          </Popconfirm>);
        },
      },
      'agreeOffline': {
        text: '确认下架',
        render: () => {
          return (<Popconfirm title="确定下架？" onConfirm={this.handleClick.bind(this, 'agreeOnOrOffline', 'PASS')}>
            <a>确认下架</a>
          </Popconfirm>);
        },
      },
      'providerOffline': {
        text: '下架',
        render: () => {
          return (<Popconfirm title="下架？" onConfirm={this.handleClick.bind(this, 'ProviderOffline')}>
            <a>下架</a>
          </Popconfirm>);
        },
      },
    };
    return actionMap;
  }
  setActions = () => {
    /**
     * 商户待确认:ONLINE_WAIT_CONFIRM
        已发布:ENABLED
        商户驳回:REJECTED
        下架待确认:OFFLINE_WAIT_CONFIRM
        已下架:OFFLINE
     */
    const {allowOffline, allowOfflineConfirm, allowOnlineConfirm, allowModify, allowModifyConfirm} = this.props.data;
    const isIframe = window.top !== window;
    const actions = isIframe ? ['provideView'] : ['mechantView'];
    if (allowOffline) {// 服务商下架
      actions.push('providerOffline');
    }
    if (allowOnlineConfirm) { // 商户上架
      actions.push('agreeOnline');
    }
    if (allowOfflineConfirm) {// 商户下架
      actions.push('agreeOffline');
    }
    if (allowModify && isIframe) {// 商户修改-中台
      actions.push('modify');
    }
    if (allowModify && !isIframe) {// 商户修改-商家中心
      actions.push('modifyCrm');
    }
    if (allowModifyConfirm) {// 商户同意修改
      actions.push('agreeModify');
    }
    return actions;
  }
  handleClick =(type, auditStatus)=>{
    const smartPromoId = this.props.data.smartPromoId;
    const url = api[type];
    ajax({
      url: url,
      method: 'post',
      data: {smartPromoId: smartPromoId, auditStatus},
      success: (res) => {
        if (res.status === 'succeed') {
          message.success('操作成功');
          this.props.refresh();
        } else {
          message.error(res.resultMsg || '系统繁忙');
        }
      },
      error: (err) => {
        message.error(err.resultMsg || '系统繁忙');
      },
    });
  }
  render() {
    return this.renderActions(this.setActions(), this.getActionMap());
  }
}

MarketingCaseAction.propTypes = {
  data: PropTypes.any,
  refresh: PropTypes.func,
};
