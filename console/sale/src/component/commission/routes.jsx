import CommissionQuery from './CommissionQuery/CommissionQuery';
import SubmitInvoice from './AccountBillQuery/SubmitInvoice';
import BillsQueryIndex from './AccountBillQuery/BillsQueryIndex';
import BillsQueryList from './AccountBillQuery/BillsQueryList';
import InvoicesQueryList from './AccountBillQuery/InvoicesQueryList';
import AppealList from './AccountBillQuery/appeal/AppealList';
import BillsDetail from './AccountBillQuery/BillsDetail';
import InvoicesDetail from './AccountBillQuery/InvoicesDetail';
import SubmitComplaint from './AccountBillQuery/SubmitComplaint';
import DailyReport from './DailyReport';

export default [
  {
    path: 'commission',
    component: CommissionQuery,
  }, {
    path: 'commission/daily-report',
    component: DailyReport,
  }, { // 新建添加提交发票
    path: 'accountBill/submitInvoice/:ids',
    component: SubmitInvoice,
  }, { // 新建添加提交并关联发票
    path: 'accountBill/submitInvoice/:ids/:idNo/:idCode',
    component: SubmitInvoice,
  }, { // 编辑修改提交的发票
    path: 'accountBill/submitInvoice/:invoiceNo/:invoiceCode',
    component: SubmitInvoice,
  }, {
    path: 'accountbill',
    component: BillsQueryIndex,
    childRoutes: [{
      path: 'billsList/:billNo',
      component: BillsQueryList,
    }, {
      path: 'billsList',
      component: BillsQueryList,
    }, {
      path: 'invoicesList',
      component: InvoicesQueryList,
    }, {
      path: 'AppealList',
      component: AppealList,
    }, {
      path: 'List/:billNo/:pid',
      component: InvoicesQueryList,
    }],
  }, {
    path: 'accountbill/billsdetail/:id/:pid',
    component: BillsDetail,
  }, {
    path: 'accountbill/invoicesDetail/:invoiceNo/:invoiceCode/:invoiceId',
    component: InvoicesDetail,
  }, {
    path: 'accountbill/complaint/:billNo/:ipRoleId/:pid',
    component: SubmitComplaint,
  },
];
