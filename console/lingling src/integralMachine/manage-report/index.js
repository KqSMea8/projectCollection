import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { page } from '@alipay/page-wrapper';
import { env, EnvType } from '@alipay/kb-biz-util/lib/env';
import { ErrorPage } from '@alipay/kb-biz-components';
import spmConfig from '../add-report/spm.config';
import store from '../add-report//store';

const { func, object } = PropTypes;
const MyReportsUrl = {
  [EnvType.DEV]: 'http://mdataprod.stable.alipay.net',
  [EnvType.TEST]: 'https://mdataprod.test.alipay.net',
  [EnvType.STABLE]: 'http://mdataprod.stable.alipay.net',
  [EnvType.PROD]: 'https://luopan.alipay.com',
};
@page({ store, spmConfig })
export default class ManageReport extends PureComponent {
  static propTypes = {
    getUserInfo: func,
    dispatch: func,
    permission: object,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const stage = window.location.href.indexOf('sale') > -1;
    if (stage) {
      dispatch({ type: 'getPemission', payload: {
        code: [['POS_REPORT_ORDER_LIST', 'POS_REPORT_ORDER_REPEAL']], // 销售中台列表权限
      } });
    } else {
      dispatch({ type: 'getPemission', payload: {
        code: [['POS_REPORT_ORDER_LIST_SERVICE', 'POS_REPORT_ORDER_REPEAL']], // 服务中台列表权限
      } });
    }
  }

  render() {
    const getUserInfo = this.props.getUserInfo();
    const { id, userChannel } = getUserInfo;
    const stage = window.location.href.indexOf('sale') > -1;
    const { permission } = this.props;
    const {
      POS_REPORT_ORDER_LIST,
      POS_REPORT_ORDER_LIST_SERVICE,
      POS_REPORT_ORDER_REPEAL,
    } = permission;
    const authCodes = [];
    const listP = POS_REPORT_ORDER_LIST === 'N';
    const listServiceP = POS_REPORT_ORDER_LIST_SERVICE === 'N';

    if (listP) {
      authCodes.push('POS_REPORT_ORDER_LIST');
    }
    if (listServiceP) {
      authCodes.push('POS_REPORT_ORDER_LIST_SERVICE');
    }

    if (listP || listServiceP) { // 中台无上下级权限 || 页面无权限码时展示无权限页面
      return <ErrorPage.NoAuth authCodes={authCodes} />;
    }
    return (<iframe title="一体机销售报单管理"
      id="boh-sale-list"
      height="2000px"
      width="100%"
      style={{ border: 'none' }}
      src={`${MyReportsUrl[env]}/midoffice/v2/boh-sales-list?url=${window.APP.kbservcenterUrl}&id=${id}&userChannel=${userChannel}&host=${window.APP.kbsalesUrl}&stage=${stage}&allow=${POS_REPORT_ORDER_REPEAL}`} />);
  }
}
