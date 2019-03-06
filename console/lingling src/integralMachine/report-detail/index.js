import React, { PureComponent } from 'react';
import { Spin } from 'antd';
import PropTypes from 'prop-types';
import { page } from '@alipay/page-wrapper';
import { ErrorPage } from '@alipay/kb-biz-components';
import { env, EnvType } from '@alipay/kb-biz-util/lib/env';
import spmConfig from '../add-report/spm.config';
import store from '../add-report/store';

const { func, string, bool, object } = PropTypes;
const MyReportsUrl = {
  [EnvType.DEV]: 'http://mdataprod.stable.alipay.net',
  [EnvType.TEST]: 'https://mdataprod.test.alipay.net',
  [EnvType.STABLE]: 'http://mdataprod.stable.alipay.net',
  [EnvType.PROD]: 'https://luopan.alipay.com',
};
const SelfAuthUrl = {
  [EnvType.DEV]: 'http://antbuservice.stable.alipay.net/pub/framework.htm#/perm-auth-self',
  [EnvType.TEST]: 'https://antbuservice.test.alipay.net/pub/framework.htm#/perm-auth-self',
  [EnvType.STABLE]: 'http://antbuservice.stable.alipay.net/pub/framework.htm#/perm-auth-self',
  [EnvType.PROD]: 'https://antbuservice.alipay.com/pub/framework.htm#/perm-auth-self',
};
@page({ store, spmConfig })
export default class ManageReport extends PureComponent {
  static propTypes = {
    getUserInfo: func,
    dispatch: func,
    id: string,
    agree: bool,
    isErr: bool,
    permission: object,
  }

  componentDidMount() {
    const { dispatch, id } = this.props;
    window.addEventListener('message', this.fixIframeHeight, false);
    const stage = window.location.href.indexOf('sale') > -1;
    if (stage) {
      dispatch({ type: 'getRight', payload: {
        orderId: id,
      } });
      dispatch({ type: 'getPemission', payload: {
        code: [['POS_REPORT_ORDER_DETAIL', 'POS_REPORT_ORDER_REPEAL']], // 销售中台详情权限
      } });
    } else {
      dispatch({ type: 'getPemission', payload: {
        code: [['POS_REPORT_ORDER_DETAIL_SERVICE', 'POS_REPORT_ORDER_REPEAL']], // 服务中台详情权限
      } });
    }
  }

  fixIframeHeight(e) {
    const data = e.data;
    if (data && data.msgType === 'MYREPORTS_HEIGHT') {
      document.getElementById('boh-sale-detail').style.height = `${data.height}px`;
    }
  }

  render() {
    const { isErr, agree, permission } = this.props;
    const getUserInfo = this.props.getUserInfo();
    const { id, userChannel } = getUserInfo;
    const hash = window.location.hash.split('/');
    const orderId = hash[hash.length - 1];
    const stage = window.location.href.indexOf('sale') > -1;
    let shiftText = <span>无权限访问此页面，如有需要请联系您的主管。</span>;
    const authCodes = [];
    const {
      POS_REPORT_ORDER_DETAIL,
      POS_REPORT_ORDER_DETAIL_SERVICE,
      POS_REPORT_ORDER_REPEAL,
    } = permission;
    const props = {
      icon: 'lock',
      theme: 'orange',
      title: '暂无权限',
      shift: shiftText,
    };
    const detailP = POS_REPORT_ORDER_DETAIL === 'N';
    const detailServiceP = POS_REPORT_ORDER_DETAIL_SERVICE === 'N';

    if (detailP) {
      authCodes.push('POS_REPORT_ORDER_DETAIL');
    }
    if (detailServiceP) {
      authCodes.push('POS_REPORT_ORDER_DETAIL_SERVICE');
    }
    if (isErr) {
      return (<div style={{ textAlign: 'center', height: 400, paddingTop: 190 }}><Spin /></div>);
    }
    if (authCodes.length > 0) {
      shiftText = <span>需要以下权限，可点击<a href={SelfAuthUrl[env]} target="_blank">链接</a>进行申请：</span>;
    }
    if (detailP || detailServiceP) {
      props.shift = shiftText;
      props.pluses = [...authCodes.map(a => <span className="auth-code">{a}</span>)];
    }
    if ((!agree && stage) || (detailP || detailServiceP)) { // 中台无上下级权限 || 页面无权限码时展示无权限页面
      return <ErrorPage {...props} />;
    }

    return (<iframe title="一体机销售订单详情"
      id="boh-sale-detail"
      width="100%"
      style={{ border: 'none' }}
      src={`${MyReportsUrl[env]}/midoffice/v2/pageUri1522806559672?url=${window.APP.kbservcenterUrl}&id=${id}&userChannel=${userChannel}&host=${window.APP.kbsalesUrl}&orderId=${orderId}&stage=${stage}&allow=${POS_REPORT_ORDER_REPEAL}`} />);
  }
}
