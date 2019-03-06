import React from 'react';
import {Page} from '@alipay/kb-framework-components';
import {MyReportsFrame} from '@alipay/kb-framework-components';
import getLoginUser from '@alipay/kb-framework/framework/getLoginUser';

class Kpi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: getLoginUser(),
    };
  }

  render() {
    const { params } = this.props;
    // const {userInfo} = this.state;
    // function leftPad(str) {
    //   const string = String(str || '');
    //   const pad = '000000'.substring(0, 6 - string.length);
    //   return `${pad}${string}`;
    // }
    const getMrParams = () => {
      const mrParams = {
        // xiaoerId: leftPad(userInfo.outUserNo),
        // role: window.APP.isBDManager ? 'director' : ''
      };
      if (params.xiaoer_id) {
        mrParams.sub_xiaoer_id = params.xiaoer_id;
        mrParams.role = 'director';
      }
      return mrParams;
    };
    const breadcrumb = [
      {title: '首页', link: `#/tka/dashboard`},
      {title: '本月KPI完成度'}
    ];
    return (
      <Page breadcrumb={breadcrumb}>
        <MyReportsFrame
          pageUri="pageUri1518424807512"
          params={getMrParams()}
        />
      </Page>
    );
  }
}

export default Kpi;
