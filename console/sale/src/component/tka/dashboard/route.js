import dashboard from './index';
import kpi from './kpi';

export default [
  {
    path: '/tka/dashboard',
    component: dashboard
  },
  {
    path: '/tka/dashboard/:xiaoer_id',
    component: dashboard
  },
  {
    path: '/tka/kpi',
    component: kpi,
  },
  {
    path: '/tka/kpi/:xiaoer_id',
    component: kpi,
  },
];
