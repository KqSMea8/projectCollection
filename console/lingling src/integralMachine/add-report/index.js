import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { page } from '@alipay/page-wrapper';
import { ErrorPage } from '@alipay/kb-biz-components';
import { Link } from 'react-router-dom';
import { Breadcrumb, Spin } from 'antd';
import { env, EnvType } from '@alipay/kb-biz-util/lib/env';
import AddReportForm from './addReportForm';
import store from './store';
import spmConfig from './spm.config';
import '../../common/common.less';

const { object, array, func, bool } = PropTypes;
const SelfAuthUrl = {
  [EnvType.DEV]: 'http://antbuservice.stable.alipay.net/pub/framework.htm#/perm-auth-self',
  [EnvType.TEST]: 'https://antbuservice.test.alipay.net/pub/framework.htm#/perm-auth-self',
  [EnvType.STABLE]: 'http://antbuservice.stable.alipay.net/pub/framework.htm#/perm-auth-self',
  [EnvType.PROD]: 'https://antbuservice.alipay.com/pub/framework.htm#/perm-auth-self',
};

@page({ store, spmConfig })
class ShopDetail extends PureComponent {
  static propTypes = {
    match: object,
    list: object,
    owner: array,
    getUserInfo: func,
    pictures: array,
    agree: bool, // 判断是否有上下级权限
    report: object,
    modifyreport: object,
    dispatch: func,
    loading: bool,
    permission: object,
    error: object,
    formData: object,
    fileList: array,
    isErr: bool,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    if (this.props.match.params.id) {
      dispatch({ type: 'getRight', payload: {
        orderId: this.props.match.params.id,
      } });
      dispatch({ type: 'getPemission', payload: {
        code: [['POS_REPORT_ORDER_MODIFY', 'POS_REPORT_ORDER_DETAIL']],
      } });
    } else {
      dispatch({ type: 'getPemission', payload: {
        code: [['POS_REPORT_ORDER_CREATE']],
      } });
    }
  }

  render() {
    const { loading, agree, list, owner, pictures, report, error, formData, isErr,
      getUserInfo, dispatch, permission, modifyreport, fileList } = this.props;
    let shiftText = <span>无权限访问此页面，如有需要请联系您的主管。</span>;
    const isModify = !!this.props.match.params.id;
    const authCodes = [];
    const {
      POS_REPORT_ORDER_CREATE,
      POS_REPORT_ORDER_MODIFY,
      POS_REPORT_ORDER_DETAIL,
    } = permission;
    const createP = POS_REPORT_ORDER_CREATE === 'N';
    const modifyP = POS_REPORT_ORDER_MODIFY === 'N';
    const detailP = POS_REPORT_ORDER_DETAIL === 'N';
    const info = { // 上下级权限使用
      icon: 'lock',
      theme: 'orange',
      title: '暂无权限',
      shift: shiftText,
    };
    const props = {
      agree,
      loading,
      list,
      owner,
      pictures,
      report,
      getUserInfo,
      dispatch,
      modifyreport,
      error,
      formData,
      fileList,
      isErr,
    };
    if (createP) {
      authCodes.push('POS_REPORT_ORDER_CREATE');
    }
    if (modifyP) {
      authCodes.push('POS_REPORT_ORDER_MODIFY');
    }
    if (detailP) {
      authCodes.push('POS_REPORT_ORDER_DETAIL');
    }
    if (authCodes.length > 0) {
      shiftText = <span>需要以下权限，可点击<a href={SelfAuthUrl[env]} target="_blank">链接</a>进行申请：</span>;
    }
    if (createP || modifyP || detailP) {
      info.shift = shiftText;
      info.pluses = [...authCodes.map(a => <span className="auth-code">{a}</span>)];
    }
    if (isModify && isErr) {
      return (<div style={{ textAlign: 'center', height: 400, paddingTop: 190 }}><Spin /></div>);
    }
    if ((isModify && (!agree || detailP || detailP)) || (!isModify && createP)) {
      return <ErrorPage {...info} />;
    }

    return (
      <div className="integral">
        <div className="kb-detail-main" style={{ padding: '16px 0' }}>
          <div className="app-detail-header">
            <Breadcrumb separator=">">
              <Breadcrumb.Item key="1" href="#/shop/my" style={{ fontSize: '16px', fontWeight: 600 }}><Link to="/managereport">一体机销售报单管理</Link></Breadcrumb.Item>
              <Breadcrumb.Item key="2" style={{ fontSize: '18px', fontWeight: 'normal' }}>
                {isModify ? '修改销售报单' : '新增销售报单'}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <AddReportForm params={this.props.match.params.id} {...props} />
      </div>
    );
  }
}

export default ShopDetail;
