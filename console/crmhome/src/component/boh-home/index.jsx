import React from 'react';
import {connect} from '@alipay/page-store';

import PageLayout from 'layout/index';

import Modal from './modal-authorization';
import ApplySteps from './apply-steps';
import BusinessSolutions from './business-solutions';
import BuyGoods from './buy-goods';

import store from './store';

import './index.less';

@connect(store, undefined, false)
export default class BOHHome extends React.Component {
  static defaultProps = {
    isAuthorized: false,
    authorizationVisible: false,
  }

  componentWillMount() {
    const {triggerFetchAuthorization, triggerFetchSolutionList, solutions = []} = this.props;
    // 获取是否授权信息，用于授权按钮点击时判断
    triggerFetchAuthorization();
    // 从凤蝶获取运营配置信息
    if (solutions.length === 0) {
      triggerFetchSolutionList();
    }
  }

  componentWillReceiveProps(nextProps) {
    const {isAuthorized} = nextProps;

    if (isAuthorized) {
      location.href = '/activity/deviceMng/deviceListLoad.htm';
    }
  }

  acceptAuthorization = () => {
    const {setDataAuthorization} = this.props;

    setDataAuthorization({
      authorizationVisible: true,
    });
  }

  render() {
    const {isAuthorized, triggerRequestAuthorization, setDataAuthorization,
      authorizationVisible, solutions, demos, purchases,
      isvAppId, mainConsumerId, operaterId} = this.props;

    return (
      <PageLayout className="boh-home" header="口碑一体机">
        <div className="mod-content boh-banner" onClick={this.acceptAuthorization}>
          <img src="https://gw.alipayobjects.com/zos/rmsportal/AAcPpHjUzCdkHvcQIwbf.jpg" />
        </div>
        <Modal
          isAuthorized={isAuthorized}
          isvAppId={isvAppId}
          mainConsumerId={mainConsumerId}
          operaterId={operaterId}
          authorizationVisible={authorizationVisible}
          setDataAuthorization={setDataAuthorization}
          triggerRequestAuthorization={triggerRequestAuthorization}
        />

        <ApplySteps />
        <BusinessSolutions solutions={solutions} demos={demos} />
        <BuyGoods purchases={purchases} />
      </PageLayout>
    );
  }
}
