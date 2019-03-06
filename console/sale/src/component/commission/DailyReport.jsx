import React from 'react';
import {Page, MyReports} from '@alipay/kb-biz-components';
import {SubType} from './common/log';
import log from './common/log';
import BillCustomerService from './AccountBillQuery/bill/BillCustomerService';

export default class DailyReport extends React.PureComponent {
  render() {
    const header = (
      <div style={{display: 'inline-block', float: 'right', marginTop: 8}}
           onClick={()=>log(SubType.CUSTOMER_SERVICE_CLICK)}>
        <BillCustomerService visible/>
      </div>
    );
    return (
      <Page title="每日数据参考" header={header}>
        <MyReports.Frame pageUri="pageUri1525245806915"/>
      </Page>
    );
  }
}
