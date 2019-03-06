import React, {PropTypes} from 'react';
import getLoginUser from '@alipay/kb-framework/framework/getLoginUser';
import { Button } from 'antd';
import ajax from 'Utility/ajax';
import {appendOwnerUrlIfDev} from '../../../common/utils';
import OperaterApplyForm from './ApplyManagement/OperaterApplyForm';
import ApplicationRecordTable from './ApplyManagement/OperaterApplyTable';
import permission from '@alipay/kb-framework/framework/permission';
import ErrorPage from 'Library/ErrorPage/NoPermission';
import PageLayout from 'Library/PageLayout';

const KoubeiApplicationRecordList = React.createClass({
  propTypes: {
    applycationType: PropTypes.string,
  },
  getInitialState() {
    return {
      isPurchase: '',
    };
  },

  componentWillMount() {
    this.refresh();
  },

  onOk() {
    ajax({
      url: appendOwnerUrlIfDev('/sale/asset/buildPurchaseFile.json'),
      method: 'get',
      type: 'json',
      success: (result) => {
        if (result.status && result.status === 'succeed') {
          const url = appendOwnerUrlIfDev('/sale/asset/downloadPurchaseFile.resource');
          location.href = url;
        }
      },
    });
  },
  onSearch(params) {
    this.setState({
      params,
    });
  },
  refresh() {
    ajax({
      url: appendOwnerUrlIfDev('/sale/asset/isPurchaseCheck.json'),
      method: 'get',
      type: 'json',
      success: (result) => {
        if (result.status && result.status === 'succeed') {
          this.setState({
            isPurchase: result.data,
          });
        }
      },
    });
  },
  renderContent() {
    const user = getLoginUser();
    const {userChannel} = user;
    return (
      <div className="app-detail-content-padding">
        <OperaterApplyForm applycationType={this.props.applycationType} onSearch={this.onSearch} type={userChannel}/>
        <ApplicationRecordTable params={this.state.params}/>
      </div>
    );
  },
  render() {
    const user = getLoginUser();
    const {userChannel} = user;
    if (!permission('STUFF_APPLY_ORDER_QUERY')) {
      return (<ErrorPage />);
    }
    const btnShow = permission('STUFF_PRODUCE_ORDER_DISPATCH') && userChannel === 'BUC';
    const header = (
      <div style={{float: 'right'}}>
        <a href="#/material/applicationManagement/applyMaterial" target= "_blank" style={{color: 'white'}}>
          <Button type="primary" style={{marginRight: '15px'}}>申请物料</Button>
        </a>
        {
          btnShow && (<a href="#/material/applicationManagement/apply-inventory" target= "_blank" style={{color: 'white'}}>
            <Button type="primary" style={{marginRight: '15px'}}>调度预采库存</Button>
          </a>)
        }
        <a href="#/material/inventory/register" target= "_blank" style={{color: 'white'}}>
          <Button type="primary">物流单号入库</Button>
        </a>
      </div>
    );
    return (
      <PageLayout title="申请单管理" header={header}>
        {this.renderContent()}
      </PageLayout>
    );
  },
});

export default KoubeiApplicationRecordList;
